import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
// import { oneDark } from '@codemirror/theme-one-dark';
import { Marktion } from './marktion';

const DEFAULT_KEYMAP = [...defaultKeymap, indentWithTab];

export class CodemirrorRenderer {
  public view: EditorView;
  public state: EditorState;

  constructor(
    public editor: Marktion,
    public root: HTMLElement
  ) {
    this.state = EditorState.create({
      doc: editor.options.content,
      extensions: [
        keymap.of(DEFAULT_KEYMAP),
        markdown(),
        basicSetup,
        syntaxHighlighting(defaultHighlightStyle)
      ]
    });

    this.view = new EditorView({
      state: this.state,
      parent: root
    });
  }
}
