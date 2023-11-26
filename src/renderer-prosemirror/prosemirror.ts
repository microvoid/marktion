import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import isUndefined from 'lodash/isUndefined';

import { parse, serialize, schema } from '../core';
import { InputRulesPlugin } from '../core/input-rules';
import { KeymapPlugin } from '../core/keymap';
import { codeblock } from '../components/codeblock';
import { taskItem } from '../components/task';
import { createPortalSet } from '../plugin-portal';
import { CommandManager } from '../core/CommandManager';
import * as commands from '../core/commands';
import { placeholder } from '../plugin-placeholder';
import { upload } from '../plugin-upload';
import { Attrs, MarkType, NodeType } from 'prosemirror-model';
import { getAttributes } from '../core/helpers/getAttributes';
import { getEditable, setEditable } from '../core/meta';
import { WysiwygProps, WysiwygRenderer } from '../renderer';
import { RendererEnum, Theme } from '../types';

const defaultNodeViews: EditorProps['nodeViews'] = {
  code_block: codeblock,
  task_item: taskItem
};

export class ProseMirrorRenderer implements WysiwygRenderer {
  public view!: EditorView;
  public state: EditorState;
  public cmdManager!: CommandManager;
  public type = RendererEnum.WYSIWYG;

  constructor(public props: WysiwygProps) {
    this.state = EditorState.create({
      doc: parse(props.content),
      plugins: [
        InputRulesPlugin(schema),
        KeymapPlugin(schema),
        keymap(baseKeymap),
        history(),
        dropCursor(),
        gapCursor(),
        createPortalSet(),
        upload(props.uploadOptions),
        placeholder({
          includeChildren: true,
          placeholder: "Press '/' for commands, 'Space' for AI ..."
        }),
        ...(props.plugin || [])
      ]
    });
  }

  getProps() {
    return this.props;
  }

  setProps(props: Partial<WysiwygProps>) {
    if (!isUndefined(props.content)) {
      this.setContent(props.content);
    }

    this.props = {
      ...this.props,
      ...props
    };

    return this.props;
  }

  getTheme() {
    return this.props.theme;
  }

  setTheme(theme: Theme) {
    this.setProps({
      theme
    });
  }

  setContent(content: string) {
    const fragments = parse(content)!;
    this.cmdManager.commands.setDocument(fragments);
  }

  setEditable(editable: boolean) {
    this.view.dispatch(setEditable(this.state.tr, editable));
  }

  getEditable() {
    return getEditable(this.state.tr);
  }

  getAttributes(nameOrType: string | NodeType | MarkType): Attrs {
    return getAttributes(this.view.state, nameOrType);
  }

  getContent() {
    if (!this.view) {
      return this.props.content;
    }

    return serialize(this.view.state.doc);
  }

  getState() {
    return this.view.state || this.state;
  }

  chain() {
    return this.cmdManager.chain();
  }

  focus() {
    requestAnimationFrame(() => {
      this.view.focus();
    });
  }

  attach(root: HTMLElement, props: Partial<WysiwygProps>) {
    if (!this.view) {
      const document = root.ownerDocument;
      const div = document.createElement('div');
      root.appendChild(div);

      div.classList.add('wrapper-wysiwyg');

      this.view = new EditorView(div, {
        state: this.state,
        nodeViews: defaultNodeViews,
        dispatchTransaction: tr => {
          this.view.updateState(this.view.state.apply(tr));

          if (tr.docChanged) {
            this.props.onChange?.();
          }
        },
        editable(state) {
          return getEditable(state.tr);
        }
      });

      this.view.dom.classList.add('wysiwyg-editor');

      this.cmdManager = new CommandManager({
        view: this.view,
        commands
      });

      this.setEditable(true);
    }

    return this.setProps(props);
  }

  destroy() {
    this.view.destroy();
  }
}
