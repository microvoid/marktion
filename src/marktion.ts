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
  public renderer: MarktionOptions['renderer'];
  public content: string;

  pmRenderer: ProseMirrorRenderer;
  cmRenderer: CodemirrorRenderer;

  constructor(public options: MarktionOptions = defaultOptions) {
    this.renderer = options.renderer;
    this.content = options.content;

    this.pmRenderer = new ProseMirrorRenderer({
      content: options.content,
      plugin: this.options.plugins
    });

    this.cmRenderer = new CodemirrorRenderer({
      content: options.content
    });
  }

  getContent() {
    const content =
      this.renderer === 'SOURCE' ? this.cmRenderer.getContent() : this.pmRenderer.getContent();

    return content;
  }

  setRenderer(renderer: MarktionOptions['renderer'], force = false) {
    const rootEl = this.rootEl;

    if (!rootEl) {
      throw new Error('This is no root element founded, did editor mounted?');
    }

    if (!force && this.renderer === renderer) {
      return;
    }

    const document = rootEl.ownerDocument;
    const content = this.getContent();

    if (renderer === 'WYSIWYG') {
      if (!this.pmRenderer.view) {
        const div = document.createElement('div');
        rootEl.appendChild(div);

        div.classList.add('wrapper-wysiwyg');
        this.pmRenderer.attachTo(div);
      } else {
        this.pmRenderer.setContent(content);
      }

      this.pmRenderer.view.focus();
    } else if (renderer === 'SOURCE') {
      if (!this.cmRenderer.view) {
        const div = document.createElement('div');
        rootEl.appendChild(div);

        div.classList.add('wrapper-source');

        this.cmRenderer.attachTo(div);
        this.cmRenderer.setContent(content);
      } else {
        this.cmRenderer.setContent(content);
      }

      this.cmRenderer.view.focus();
    }

    this.renderer = renderer;
    rootEl.setAttribute('data-renderer', renderer);
  }

  mount(root: HTMLElement) {
    root.classList.add(MarktionTheme);
    this.rootEl = root;

    this.setRenderer(this.options.renderer, true);
  }
}
