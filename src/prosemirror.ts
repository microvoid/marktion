import { EditorView, EditorProps } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
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
          history(),
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
