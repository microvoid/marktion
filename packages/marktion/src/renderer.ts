import { EditorProps } from 'prosemirror-view';
import { EditorStateConfig } from 'prosemirror-state';
import { RendererEnum, Theme } from './types';
import { UploadOptions } from './plugin-upload';

export interface RendererProps {
  theme: Theme;
  content: string;
  onChange: () => void;
}

export interface Renderer<Options extends RendererProps> {
  type: RendererEnum;

  getProps(): Options;
  setProps(props: Partial<Options>): Options;

  focus(): void;

  getContent(): string;
  setContent(content: string): void;

  getTheme(): Theme;
  setTheme(theme: Theme): void;

  attach(el: HTMLElement, props: RendererProps): void;
  destroy(): void;
}

export interface SourceProps extends RendererProps {}
export interface SourceRenderer extends Renderer<SourceProps> {}

export interface WysiwygProps extends RendererProps {
  nodeViews?: EditorProps['nodeViews'];
  plugin?: EditorStateConfig['plugins'];
  uploadOptions?: UploadOptions;
}
export interface WysiwygRenderer extends Renderer<WysiwygProps> {}
