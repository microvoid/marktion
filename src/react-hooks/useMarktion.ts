import React from 'react';
import { Marktion } from '../marktion';

export const MarktionContext = React.createContext<null | Marktion>(null);

export function useMarktion() {
  return React.useContext(MarktionContext)!;
}
