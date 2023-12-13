import { NodeType } from 'prosemirror-model';
import { liftListItem as originalLiftListItem } from 'prosemirror-schema-list';

import { getNodeType } from '../helpers/getNodeType.js';
import { RawCommands } from '../types.js';

declare global {
  interface Commands<ReturnType> {
    liftListItem: {
      /**
       * Lift the list item into a wrapping list.
       */
      liftListItem: (typeOrName: string | NodeType) => ReturnType;
    };
  }
}

export const liftListItem: RawCommands['liftListItem'] =
  typeOrName =>
  ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);

    return originalLiftListItem(type)(state, dispatch);
  };
