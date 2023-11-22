import { RawCommands } from '../types.js';
import { schema } from '../schemas/index.js';

declare global {
  interface Commands<ReturnType> {
    link: {
      /**
       * Set a link mark
       */
      setLink: (attributes: {
        href: string;
        target?: string | null;
        rel?: string | null;
        class?: string | null;
      }) => ReturnType;
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: {
        href: string;
        target?: string | null;
        rel?: string | null;
        class?: string | null;
      }) => ReturnType;
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType;
    };
  }
}

export const setLink: RawCommands['setLink'] =
  attributes =>
  ({ chain }) => {
    return chain().setMark(schema.marks.link, attributes).setMeta('preventAutolink', true).run();
  };

export const toggleLink: RawCommands['toggleLink'] =
  attributes =>
  ({ chain }) => {
    return chain()
      .toggleMark(schema.marks.link, attributes, { extendEmptyMarkRange: true })
      .setMeta('preventAutolink', true)
      .run();
  };

export const unsetLink: RawCommands['unsetLink'] =
  () =>
  ({ chain }) => {
    return chain()
      .unsetMark(schema.marks.link, { extendEmptyMarkRange: true })
      .setMeta('preventAutolink', true)
      .run();
  };
