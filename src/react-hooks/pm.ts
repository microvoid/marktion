import { useCallback, useEffect, useState } from 'react';
import { PluginKey } from 'prosemirror-state';

import { useMarktion } from './useMarktion';
import { getPortal } from '../plugin-portal';
import { EventMap, Handler, getEventEmitter } from '../plugin-event';

export function usePMRenderer() {
  return useMarktion().pmRenderer;
}

export function useEmitter<T extends keyof EventMap>(event: T, callback: Handler<EventMap[T]>) {
  const state = usePMRenderer().getState();
  const emitter = getEventEmitter(state)!;

  useEffect(() => {
    emitter.on(event, callback);

    return () => {
      emitter.off(event, callback);
    };
  }, [event, callback, emitter]);
}

export function useEditorState(watch: boolean = false) {
  const forceUpdate = useForceUpdate();

  useEmitter(
    'transaction',
    useCallback(() => {
      if (watch) {
        forceUpdate();
      }
    }, [watch])
  );

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

// Fork from https://github.com/CharlesStover/use-force-update
export function useForceUpdate(): () => void {
  const [, dispatch] = useState<{}>(Object.create(null));

  // Turn dispatch(required_parameter) into dispatch().
  const memoizedDispatch = useCallback((): void => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return memoizedDispatch;
}
