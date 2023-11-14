import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { PickPartial } from '../core/utils/types';
import { getPluginKey } from '../core';

export const PortalSetPluginKey = new PluginKey<PortalSetState>('plugin-portal-set');

export type PortalSetOptions = {
  classname?: string;
};

export const defaultPortalSetOptions = {
  classname: 'marktion-portal-set'
};

export class PortalSetState {
  #portalMap = new Map<string, HTMLElement>();
  #view!: EditorView;
  #rootEl!: HTMLDivElement;

  constructor(public options: PickPartial<PortalSetOptions>) {}

  static create(options?: PortalSetOptions) {
    return new PortalSetState({
      ...defaultPortalSetOptions,
      ...options
    });
  }

  init(view: EditorView) {
    this.#view = view;
    this.#rootEl = this.#view.dom.ownerDocument.createElement('div');
    this.#rootEl.classList.add(this.options.classname);

    this.#view.dom.parentNode?.appendChild(this.#rootEl);
  }

  createPortal(keyOrPlugin: string | Plugin | PluginKey) {
    const key = getPluginKey(keyOrPlugin);

    if (this.#portalMap.has(key)) {
      return this.#portalMap.get(key)!;
    }

    const el = this.#view.dom.ownerDocument.createElement('div');

    el.classList.add(`portal-${key.slice(0, -1)}`);

    this.#rootEl.appendChild(el);
    this.#portalMap.set(key, el);

    return el;
  }

  getPortal(keyOrPlugin: string | Plugin | PluginKey) {
    const key = getPluginKey(keyOrPlugin);

    return this.#portalMap.get(key);
  }

  getPortalMap() {
    return this.#portalMap;
  }
}
