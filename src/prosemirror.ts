import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState, EditorStateConfig, Plugin } from 'prosemirror-state';
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
import { upload } from './plugin-upload';
import { Attrs, MarkType, NodeType } from 'prosemirror-model';
import { getAttributes } from './core/helpers/getAttributes';

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
      plugin?: EditorStateConfig['plugins'];
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
        upload(),
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

  setContent(content: string) {
    const fragments = parse(content)!;
    this.cmdManager.commands.setDocument(fragments);
  }

  getState() {
    return this.view.state || this.state;
  }

  attachTo(root: HTMLElement) {
    this.view = new EditorView(root, {
      editable(state) {
        return true;
      },
      state: this.state,
      nodeViews: defaultNodeViews
    });

    this.cmdManager = new CommandManager({
      view: this.view,
      commands
    });
  }
}
