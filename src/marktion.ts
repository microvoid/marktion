import { EditorStateConfig } from 'prosemirror-state';
import { CodemirrorRenderer } from './codemirror';
import { ProseMirrorRenderer } from './prosemirror';
import { MarktionTheme } from './theme';

export type MarktionOptions = {
  plugins?: EditorStateConfig['plugins'];
  renderer: 'WYSIWYG' | 'SOURCE' | 'SSR';
  content: string;
};

const defaultOptions: MarktionOptions = {
  content: '# Hello\nWorld.',
  renderer: 'WYSIWYG'
};

export class Marktion {
  public rootEl?: HTMLElement;

  declare pmRenderer: ProseMirrorRenderer;
  declare cmRenderer: CodemirrorRenderer;

  constructor(public options: MarktionOptions = defaultOptions) {}

  mount(root: HTMLElement) {
    this.rootEl = root;

    const doc = root.ownerDocument;

    root.classList.add(MarktionTheme);

    if (!this.pmRenderer) {
      const div = doc.createElement('div');
      root.appendChild(div);

      this.pmRenderer = new ProseMirrorRenderer({
        editor: this,
        root: div,
        plugin: this.options.plugins
      });
    }

    if (!this.cmRenderer) {
      const div = doc.createElement('div');
      root.appendChild(div);

      div.classList.add('CodeMirror');
      div.style.marginTop = '20px';

      this.cmRenderer = new CodemirrorRenderer(this, div);
    }
  }
}
