import { minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
// import { oneDark } from '@codemirror/theme-one-dark';

const DEFAULT_KEYMAP = [...defaultKeymap, indentWithTab];

function createState(content: string) {
  return EditorState.create({
    doc: content,
    extensions: [
      keymap.of(DEFAULT_KEYMAP),
      markdown(),
      minimalSetup,
      syntaxHighlighting(defaultHighlightStyle)
    ]
  });
}

export type CodemirrorRendererOptions = {
  content: string;
};

export class CodemirrorRenderer {
  public view!: EditorView;
  public state: EditorState;

  constructor(public options: CodemirrorRendererOptions) {
    this.state = createState(options.content);
  }

  setContent(content: string) {
    this.view.setState(createState(content));
  }

  getContent() {
    return this.view.state.doc.toString();
  }

  attachTo(root: HTMLElement) {
    this.view = new EditorView({
      state: this.state,
      parent: root
    });
  }
}
