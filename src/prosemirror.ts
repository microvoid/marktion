import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState, EditorStateConfig } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { baseKeymap } from 'prosemirror-commands';

import { Marktion } from './marktion';
import { parse, schema } from './core';
import { InputRulesPlugin } from './core/input-rules';
import { KeymapPlugin } from './core/keymap';
import { codeblock } from './components/codeblock';
import { taskItem } from './components/task';
import { createSlash } from './plugin-slash';
import { suggest } from './plugin-suggest';
import { createPortalSet } from './plugin-portal';

const defaultNodeViews: EditorProps['nodeViews'] = {
  code_block: codeblock,
  task_item: taskItem
};

export class ProseMirrorRenderer {
  public view!: EditorView;
  public state: EditorState;

  constructor(
    public options: {
      editor: Marktion;
      plugin?: EditorStateConfig['plugins'];
    }
  ) {
    this.state = EditorState.create({
      doc: parse(options.editor.options.content)!,
      plugins: [
        InputRulesPlugin(schema),
        KeymapPlugin(schema),
        keymap(baseKeymap),
        history(),
        dropCursor(),
        gapCursor(),
        suggest(),
        createPortalSet(),
        ...(options.plugin || [])
      ]
    });
  }

  mount(root: HTMLElement) {
    this.view = new EditorView(root, {
      state: this.state,
      nodeViews: defaultNodeViews
    });
  }

  getContent() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }

  getState() {
    return this.state;
  }
}
