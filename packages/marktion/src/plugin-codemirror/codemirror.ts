import { Plugin, PluginKey } from 'prosemirror-state';
import type { CodeMirrorNodeView } from './node-view/CodeMirrorNodeView';
import { createToolbar, Toolbar } from './toolbar/createToolbar';

export const CodemirrorPluginKey = new PluginKey<CodemirrorState>('plugin-codemirror');

export const codemirror = () => {
  return new Plugin<CodemirrorState>({
    key: CodemirrorPluginKey,
    state: {
      init(state, editor) {
        return new CodemirrorState();
      },
      apply(tr, value) {
        return value;
      }
    }
  });
};

export class CodemirrorState {
  private settings = new WeakMap<CodeMirrorNodeView, Toolbar>();

  attach(node: CodeMirrorNodeView) {
    this.settings.set(node, createToolbar(node));
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
