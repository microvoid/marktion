import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    codeBlock: {
      /**
       * Set a code block
       */
      setCodeBlock: (attributes?: { language: string }) => ReturnType;
      /**
       * Toggle a code block
       */
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType;
    };
  }
}

export const toggleCodeBlock: RawCommands['toggleCodeBlock'] =
  attributes =>
  ({ commands }) => {
    return commands.toggleNode(schema.nodes.code_block, 'paragraph', attributes);
  };

export const setCodeBlock: RawCommands['setCodeBlock'] =
  attributes =>
  ({ commands }) => {
    return commands.setNode(schema.nodes.code_block, attributes);
  };
