import { RawCommands } from '../types.js';
import { schema } from '../schemas';

declare global {
  interface Commands<ReturnType> {
    toggleOrderedList: {
      /**
       * Wrap a node in a list.
       */
      toggleOrderedList: () => ReturnType;
    };
  }
}

export const toggleOrderedList: RawCommands['toggleOrderedList'] =
  (keepMarks = false) =>
  ({ commands }) => {
    return commands.toggleList(schema.nodes.ordered_list, schema.nodes.list_item, keepMarks);
  };
