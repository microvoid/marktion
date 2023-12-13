import { ParseOptions } from 'prosemirror-model';

import { createDocument } from '../helpers/';
import { Content, RawCommands } from '../types.js';

declare global {
  interface Commands<ReturnType> {
    setContent: {
      /**
       * Replace the whole document with new content.
       */
      setContent: (
        content: Content,
        emitUpdate?: boolean,
        parseOptions?: ParseOptions
      ) => ReturnType;
    };
  }
}

export const setContent: RawCommands['setContent'] =
  (content, emitUpdate = false, parseOptions = {}) =>
  ({ tr, dispatch, view }) => {
    const { doc } = tr;
    const document = createDocument(content, view.state.schema, parseOptions);

    if (dispatch) {
      tr.replaceWith(0, doc.content.size, document).setMeta('preventUpdate', !emitUpdate);
    }

    return true;
  };
