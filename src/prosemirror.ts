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
        ...(options.plugin || [])
      ]
    });
  }

  chain() {
    return this.cmdManager.chain();
  }

  getContent() {
    const content = serialize(this.view.state.doc);

    console.log(content);

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
