import { CodemirrorRenderer } from './codemirror';
import { ProseMirrorRenderer } from './prosemirror';
import { MarktionTheme } from './theme';

export type MarktionOptions = {
  root?: HTMLElement;
  renderer: 'WYSIWYG' | 'SOURCE' | 'SSR';
  content: string;
};

const defaultOptions: MarktionOptions = {
  content: '# Hello\nWorld.',
  renderer: 'WYSIWYG'
};

export class Marktion {
  private declare wysiwyg: ProseMirrorRenderer;
  private declare source: CodemirrorRenderer;

  constructor(public options: MarktionOptions = defaultOptions) {
    this.render();
  }

  render() {
    const root = this.options.root!;
    const doc = root.ownerDocument;

    root.classList.add(MarktionTheme);

    if (!this.wysiwyg) {
      const div = doc.createElement('div');
      root.appendChild(div);

      this.wysiwyg = new ProseMirrorRenderer(this, div);
    }

    if (!this.source) {
      const div = doc.createElement('div');
      root.appendChild(div);

      div.classList.add('CodeMirror');
      div.style.marginTop = '20px';

      this.source = new CodemirrorRenderer(this, div);
    }
  }
}
