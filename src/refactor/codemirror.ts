import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { Marktion } from './marktion';

export class CodemirrorRenderer {
  public view: EditorView;
  public state: EditorState;

  constructor(
    public editor: Marktion,
    public root: HTMLElement
  ) {
    this.state = EditorState.create({
      doc: editor.options.content,
      extensions: [keymap.of(defaultKeymap), syntaxHighlighting(defaultHighlightStyle), markdown()]
    });

    this.view = new EditorView({
      state: this.state,
      parent: root
    });
  }
}
