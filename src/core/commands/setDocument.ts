import { Node } from 'prosemirror-model';

import { RawCommands } from '../types.js';

declare global {
  interface Commands<ReturnType> {
    setDocument: {
      /**
       * Replace the whole document with new content.
       */
      setDocument: (document: Node, emitUpdate?: boolean) => ReturnType;
    };
  }
}

export const setDocument: RawCommands['setDocument'] =
  (document, emitUpdate = false) =>
  ({ tr, dispatch, view }) => {
    const { doc } = tr;
    if (dispatch) {
      tr.replaceWith(0, doc.content.size, document).setMeta('preventUpdate', !emitUpdate);
    }

    return true;
  };
