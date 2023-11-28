import { EditorStateConfig } from 'prosemirror-state';
import { CodemirrorRenderer } from './renderer-codemirror';
import { ProseMirrorRenderer } from './renderer-prosemirror';
import { UploadOptions } from './plugin-upload';

export type MarktionOptions = {
  content: string;
  theme?: 'dark' | 'light';
  renderer: 'WYSIWYG' | 'SOURCE';
  uploadOptions?: UploadOptions;
  plugins?: EditorStateConfig['plugins'];
  onChange?: (editor: Marktion) => void;
};

const defaultOptions: MarktionOptions = {
  content: '# Hello\nWorld.',
  renderer: 'WYSIWYG',
  theme: 'dark'
};

export class Marktion {
  public rootEl?: HTMLElement;
  public renderer: MarktionOptions['renderer'];
  public content: string;
  public theme: NonNullable<MarktionOptions['theme']>;

  pmRenderer: ProseMirrorRenderer;
  cmRenderer: CodemirrorRenderer;

  constructor(public options: MarktionOptions = defaultOptions) {
    this.renderer = options.renderer;
    this.content = options.content;
    this.theme = options.theme || 'light';

    this.pmRenderer = new ProseMirrorRenderer({
      theme: this.theme,
      content: options.content,
      plugin: options.plugins,
      uploadOptions: options.uploadOptions,
      onChange: () => {
        options.onChange?.(this);
      }
    });

    this.cmRenderer = new CodemirrorRenderer({
      theme: this.theme,
      content: options.content,
      onChange: () => {
        options.onChange?.(this);
      }
    });
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme: Marktion['theme']) {
    this.theme = theme;
    this.getRenderer().setTheme(theme);
  }

  getContent() {
    return this.getRenderer().getContent();
  }

  setContent(content: string) {
    this.getRenderer().setContent(content);
  }

  getRenderer() {
    if (this.renderer === 'SOURCE') {
      return this.cmRenderer;
    }

    return this.pmRenderer;
  }

  setRenderer(renderer: MarktionOptions['renderer']) {
    const rootEl = this.rootEl;

    if (!rootEl) {
      throw new Error('This is no root element founded, did editor mounted?');
    }

    const content = this.getContent();
    const theme = this.getTheme();

    this.renderer = renderer;
    this.getRenderer().attach(rootEl, {
      content,
      theme
    });
    this.getRenderer().focus();

    rootEl.setAttribute('data-renderer', renderer);
  }

  mount(root: HTMLElement) {
    this.rootEl = root;

    this.setRenderer(this.options.renderer);
  }
}
