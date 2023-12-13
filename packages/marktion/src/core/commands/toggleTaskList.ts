import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    toggleTaskList: {
      /**
       * Wrap a node in a list.
       */
      toggleTaskList: () => ReturnType;
    };
  }
}

export const toggleTaskList: RawCommands['toggleTaskList'] =
  (keepMarks = false) =>
  ({ commands }) => {
    return commands.toggleList(schema.nodes.task_list, schema.nodes.task_item, keepMarks);
  };
