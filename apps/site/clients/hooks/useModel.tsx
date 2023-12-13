import React from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

export type ModelContextType = {};

export const ModelContext = createContext({} as ModelContextType);

export function useModelSelector<S>(selector: (ctx: ModelContextType) => S): S {
  return useContextSelector(ModelContext, selector);
}

export function ModelContextProvider(props: React.PropsWithChildren) {
  return <ModelContext.Provider value={{}}>{props.children}</ModelContext.Provider>;
}
