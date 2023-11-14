import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { PortalSetOptions, PortalSetPluginKey, PortalSetState } from './state';

export function createPortalSet(options?: PortalSetOptions) {
  const portalSetState = PortalSetState.create(options);

  const plugin = new Plugin({
    key: PortalSetPluginKey,
    state: {
      // Initialize the state
      init: () => portalSetState,
      apply(tr, value) {
        return value;
      }
    },
    view(view) {
      portalSetState.init(view);
      return {};
    }
  });

  return plugin;
}

export function getPortalSet(state: EditorState) {
  const portalSet = PortalSetPluginKey.getState(state);

  if (!portalSet) {
    throw new Error('No PortalSet exists.');
  }

  return portalSet;
}

export function createPortal(state: EditorState, key: string | Plugin | PluginKey) {
  return getPortalSet(state).createPortal(key);
}

export function getPortal(state: EditorState, key: string | Plugin | PluginKey) {
  return getPortalSet(state).getPortal(key);
}

export function getPortalMap(state: EditorState) {
  return getPortalSet(state).getPortalMap();
}
