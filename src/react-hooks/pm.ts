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
