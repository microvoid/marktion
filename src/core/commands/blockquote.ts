import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    blockQuote: {
      /**
       * Set a blockquote node
       */
      setBlockquote: () => ReturnType;
      /**
       * Toggle a blockquote node
       */
      toggleBlockquote: () => ReturnType;
      /**
       * Unset a blockquote node
       */
      unsetBlockquote: () => ReturnType;
    };
  }
}

export const setBlockquote: RawCommands['setBlockquote'] =
  () =>
  ({ commands }) => {
    return commands.wrapIn(schema.nodes.blockquote);
  };

export const toggleBlockquote: RawCommands['toggleBlockquote'] =
  () =>
  ({ commands }) => {
    return commands.toggleWrap(schema.nodes.blockquote);
  };

export const unsetBlockquote: RawCommands['unsetBlockquote'] =
  () =>
  ({ commands }) => {
    return commands.lift(schema.nodes.blockquote);
  };
