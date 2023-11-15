import { PluginKey } from 'prosemirror-state';
import { getPortal } from '../plugin-portal';
import { useMarktion } from './useMarktion';

export function usePMRenderer() {
  return useMarktion().pmRenderer;
}

export function useEditorState() {
  return usePMRenderer().getState();
}

export function usePortal(key: Parameters<typeof getPortal>[1]) {
  const state = useEditorState();

  return getPortal(state, key);
}

export function usePlugin<T extends PluginKey>(pluginKey: T) {
  const state = useEditorState();
  return pluginKey.getState(state) as NonNullable<ReturnType<T['getState']>>;
}
