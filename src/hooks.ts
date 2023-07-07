import React from 'react';

export const RootElContext = React.createContext<HTMLDivElement | null>(null);

export function useRootEl() {
  return React.useContext(RootElContext)!;
}
