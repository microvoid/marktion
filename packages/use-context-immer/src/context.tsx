import {
  useState,
  useCallback,
  createContext as reactCreateContext,
  ProviderProps,
  Provider
} from 'react';
import { produce, Draft, nothing, freeze } from 'immer';

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];
export type Context<S = any> = {
  state: S;
  dispath: Updater<S>;
};

const isFunction = (val: any): val is () => void => typeof val === 'function';

export function useImmer<S = any>(initialValue: S | (() => S)): ImmerHook<S> {
  const [val, updateValue] = useState(() =>
    freeze(isFunction(initialValue) ? initialValue() : initialValue, true)
  );

  return [
    val,
    useCallback(updater => {
      if (isFunction(updater)) {
        updateValue(produce(updater));
      } else {
        updateValue(freeze(updater as S));
      }
    }, [])
  ];
}

export function createProvider<S = any>(Provider: Provider<ImmerHook<S>>): Provider<ImmerHook<S>> {
  const ImmerContextProvider = (props: ProviderProps<S>) => {
    const ctx = useImmer({});
    return <Provider value={props.value}>{props.children}</Provider>;
  };

  return ImmerContextProvider;
}

export function createContext<S = any>(initialValue: S | (() => S)) {
  const context = reactCreateContext(initialValue);
}
