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
  public view: EditorView;

  constructor(
    public options: {
      editor: Marktion;
      root: HTMLElement;
      plugin?: EditorStateConfig['plugins'];
    }
  ) {
    this.view = new EditorView(options.root, {
      state: EditorState.create({
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
      }),
      nodeViews: defaultNodeViews
    });
  }

  getContent() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }

  getState() {
    return this.view.state;
  }
}
