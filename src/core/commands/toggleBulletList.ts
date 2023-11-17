import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    toggleBulletList: {
      /**
       * Wrap a node in a list.
       */
      toggleBulletList: () => ReturnType;
    };
  }
}

export const toggleBulletList: RawCommands['toggleBulletList'] =
  (keepMarks = false) =>
  ({ commands }) => {
    return commands.toggleList(schema.nodes.bullet_list, schema.nodes.list_item, keepMarks);
  };
