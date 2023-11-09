import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';

import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { baseKeymap } from 'prosemirror-commands';
import { Marktion } from './marktion';
import { parse, schema } from './core';
import { InputRulesPlugin } from './plugin-input-rules';
import { KeymapPlugin } from './plugin-keymap';
import { HistoryPlugin } from './plugin-history';
import { codeblock } from './node-codeblock';
import { taskItem } from './node-task-list/task-item';

const defaultNodeViews: EditorProps['nodeViews'] = {
  code_block: codeblock,
  task_item: taskItem
};

export class ProseMirrorRenderer {
  public view: EditorView;

  constructor(
    public editor: Marktion,
    public root: HTMLElement
  ) {
    this.view = new EditorView(root, {
      state: EditorState.create({
        doc: parse(editor.options.content)!,
        plugins: [
          InputRulesPlugin(schema),
          KeymapPlugin(schema),
          keymap(baseKeymap),
          HistoryPlugin(),
          dropCursor(),
          gapCursor()
        ]
      }),
      nodeViews: defaultNodeViews
    });
  }

  getContent() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }
}
