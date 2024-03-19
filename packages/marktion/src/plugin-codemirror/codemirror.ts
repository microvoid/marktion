import { Plugin, PluginKey } from 'prosemirror-state';
import type { CodeMirrorNodeView } from './node-view/CodeMirrorNodeView';
import { createToolbar, Toolbar } from './toolbar/createToolbar';

export type CodemirrorOptions = {
  createToolbar: typeof createToolbar;
};

export const CodemirrorPluginKey = new PluginKey<CodemirrorState>('plugin-codemirror');
export const deafultCodemirrorOptions = {
  createToolbar
};

export const codemirror = (options: CodemirrorOptions = deafultCodemirrorOptions) => {
  return new Plugin<CodemirrorState>({
    key: CodemirrorPluginKey,
    state: {
      init() {
        return new CodemirrorState(options);
      },
      apply(tr, value) {
        return value;
      }
    }
  });
};

export class CodemirrorState {
  constructor(public options: CodemirrorOptions) {}

  private settings = new WeakMap<CodeMirrorNodeView, Toolbar>();

  attach(node: CodeMirrorNodeView) {
    this.settings.set(node, this.options.createToolbar(node));
  }

  destory(node: CodeMirrorNodeView) {
    const toolbar = this.getToolbar(node);

    if (toolbar) {
      toolbar.destory();
      this.settings.delete(node);
    }
  }

  getToolbar(node: CodeMirrorNodeView) {
    return this.settings.get(node);
  }
}
