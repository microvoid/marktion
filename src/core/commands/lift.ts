import { lift as originalLift } from 'prosemirror-commands';
import { NodeType } from 'prosemirror-model';

import { isNodeActive, getNodeType } from '../helpers';
import { RawCommands } from '../types';

declare global {
  interface Commands<ReturnType> {
    lift: {
      /**
       * Removes an existing wrap.
       */
      lift: (typeOrName: string | NodeType, attributes?: Record<string, any>) => ReturnType;
    };
  }
}

export const lift: RawCommands['lift'] =
  (typeOrName, attributes = {}) =>
  ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive = isNodeActive(state, type, attributes);

    if (!isActive) {
      return false;
    }

    return originalLift(state, dispatch);
  };
