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

  attach(nodeView: CodeMirrorNodeView) {
    this.settings.set(nodeView, this.options.createToolbar(nodeView));
  }

  destory(nodeView: CodeMirrorNodeView) {
    const toolbar = this.getToolbar(nodeView);

    if (toolbar) {
      toolbar.destory();
      this.settings.delete(nodeView);
    }
  }

  update(nodeView: CodeMirrorNodeView) {
    const toolbar = this.getToolbar(nodeView);
    toolbar?.update(nodeView);
  }

  getToolbar(nodeView: CodeMirrorNodeView) {
    return this.settings.get(nodeView);
  }
}
