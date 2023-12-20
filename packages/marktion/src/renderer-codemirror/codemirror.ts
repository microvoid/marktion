import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import type { SourceRenderer, RendererProps } from '../renderer';
import { RendererEnum, Theme } from '../types';
import { createState } from './createState';

export class CodemirrorRenderer implements SourceRenderer {
  public view!: EditorView;
  public state: EditorState;

  type = RendererEnum.SOURCE;

  constructor(public props: RendererProps) {
    this.state = createState(this);
  }

  getProps() {
    return this.props;
  }

  setProps(props: Partial<RendererProps>): RendererProps {
    this.props = {
      ...this.props,
      ...props
    };

    this.state = createState(this);
    this.view.setState(this.state);

    return this.props;
  }

  getTheme(): Theme {
    return this.props.theme;
  }

  setTheme(theme: Theme) {
    return this.setProps({
      theme
    });
  }

  setContent(content: string) {
    this.setProps({
      content
    });
  }

  getContent() {
    if (!this.view) {
      return this.props.content;
    }

    return this.view.state.doc.toString();
  }

  focus() {
    requestAnimationFrame(() => {
      this.view.focus();
    });
  }

  attach(root: HTMLElement, props: Partial<RendererProps>) {
    if (!this.view) {
      const div = document.createElement('div');
      root.appendChild(div);

      div.classList.add('wrapper-source');

      this.view = new EditorView({
        state: this.state,
        parent: div
      });
    }

    return this.setProps(props);
  }

  destroy() {
    this.view.destroy();
  }
}
