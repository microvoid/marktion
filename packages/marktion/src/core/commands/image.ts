import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const setImage: RawCommands['setImage'] =
  options =>
  ({ commands }) => {
    return commands.insertContent({
      type: schema.nodes.image.name,
      attrs: options
    });
  };
