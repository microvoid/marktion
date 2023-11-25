import { minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, EditorViewConfig, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
// import { oneDark } from '@codemirror/theme-one-dark';

const DEFAULT_KEYMAP = [...defaultKeymap, indentWithTab];

function createState(content: string, onChange?: () => void) {
  return EditorState.create({
    doc: content,
    extensions: [
      keymap.of(DEFAULT_KEYMAP),
      placeholder('please enter the markdown source'),
      markdown(),
      minimalSetup,
      syntaxHighlighting(defaultHighlightStyle),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          onChange?.();
        }
      })
    ]
  });
}

export type CodemirrorRendererOptions = {
  content: string;
  onChange?: () => void;
};

export class CodemirrorRenderer {
  public view!: EditorView;
  public state: EditorState;

  constructor(public options: CodemirrorRendererOptions) {
    this.state = createState(options.content, options.onChange);
  }

  focus() {
    requestAnimationFrame(() => {
      this.view.focus();
    });
  }

  setContent(content: string) {
    this.view.setState(createState(content, this.options.onChange));
  }

  getContent() {
    if (!this.view) {
      return this.options.content;
    }

    return this.view.state.doc.toString();
  }

  attachTo(root: HTMLElement) {
    this.view = new EditorView({
      state: this.state,
      parent: root
    });
  }
}
