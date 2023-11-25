import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState, EditorStateConfig } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';

import { parse, serialize, schema } from './core';
import { InputRulesPlugin } from './core/input-rules';
import { KeymapPlugin } from './core/keymap';
import { codeblock } from './components/codeblock';
import { taskItem } from './components/task';
import { createPortalSet } from './plugin-portal';
import { CommandManager } from './core/CommandManager';
import * as commands from './core/commands';
import { placeholder } from './plugin-placeholder';
import { UploadOptions, upload } from './plugin-upload';
import { Attrs, MarkType, NodeType } from 'prosemirror-model';
import { getAttributes } from './core/helpers/getAttributes';
import { getEditable, setEditable } from './core/meta';

const defaultNodeViews: EditorProps['nodeViews'] = {
  code_block: codeblock,
  task_item: taskItem
};

export class ProseMirrorRenderer {
  public view!: EditorView;
  public state: EditorState;
  public cmdManager!: CommandManager;

  constructor(
    public options: {
      content: string;
      uploadOptions?: UploadOptions;
      plugin?: EditorStateConfig['plugins'];
      onChange?: () => void;
    }
  ) {
    this.state = EditorState.create({
      doc: parse(options.content)!,
      plugins: [
        InputRulesPlugin(schema),
        KeymapPlugin(schema),
        keymap(baseKeymap),
        history(),
        dropCursor(),
        gapCursor(),
        createPortalSet(),
        upload(options.uploadOptions),
        placeholder({
          includeChildren: true,
          placeholder: "Press '/' for commands, 'Space' for AI ..."
        }),
        ...(options.plugin || [])
      ]
    });
  }

  chain() {
    return this.cmdManager.chain();
  }

  focus() {
    requestAnimationFrame(() => {
      this.view.focus();
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
      return this.options.content;
    }

    const content = serialize(this.view.state.doc);

    return content;
  }

  getState() {
    return this.view.state || this.state;
  }

  attachTo(root: HTMLElement) {
    this.view = new EditorView(root, {
      state: this.state,
      nodeViews: defaultNodeViews,
      dispatchTransaction: tr => {
        this.view.updateState(this.view.state.apply(tr));

        if (tr.docChanged) {
          this.options.onChange?.();
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
}
