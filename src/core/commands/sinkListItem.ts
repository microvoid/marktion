import { NodeType } from 'prosemirror-model';
import { sinkListItem as originalSinkListItem } from 'prosemirror-schema-list';

import { getNodeType } from '../helpers/getNodeType.js';
import { RawCommands } from '../types.js';

declare global {
  interface Commands<ReturnType> {
    sinkListItem: {
      /**
       * Sink the list item down into an inner list.
       */
      sinkListItem: (typeOrName: string | NodeType) => ReturnType;
    };
  }
}

export const sinkListItem: RawCommands['sinkListItem'] =
  typeOrName =>
  ({ state, dispatch }) => {
    const type = getNodeType(typeOrName, state.schema);

    return originalSinkListItem(type)(state, dispatch);
  };
