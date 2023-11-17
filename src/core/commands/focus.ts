import { isTextSelection } from '../helpers/isTextSelection';
import { resolveFocusPosition } from '../helpers/resolveFocusPosition';
import { FocusPosition, RawCommands } from '../types';
import { isiOS } from '../utils';

declare global {
  interface Commands<ReturnType> {
    focus: {
      /**
       * Focus the editor at the given position.
       */
      focus: (
        position?: FocusPosition,
        options?: {
          scrollIntoView?: boolean;
        }
      ) => ReturnType;
    };
  }
}

export const focus: RawCommands['focus'] =
  (position = null, options = {}) =>
  ({ view, tr, dispatch, commands }) => {
    options = {
      scrollIntoView: true,
      ...options
    };

    const delayedFocus = () => {
      // focus within `requestAnimationFrame` breaks focus on iOS
      // so we have to call this
      if (isiOS()) {
        (view.dom as HTMLElement).focus();
      }

      // For React we have to focus asynchronously. Otherwise wild things happen.
      // see: https://github.com/ueberdosis/tiptap/issues/1520
      requestAnimationFrame(() => {
        view.focus();

        if (options?.scrollIntoView) {
          commands.scrollIntoView();
        }
      });
    };

    if ((view.hasFocus() && position === null) || position === false) {
      return true;
    }

    // we don’t try to resolve a NodeSelection or CellSelection
    if (dispatch && position === null && !isTextSelection(view.state.selection)) {
      delayedFocus();
      return true;
    }

    // pass through tr.doc instead of editor.state.doc
    // since transactions could change the editors state before this command has been run
    const selection = resolveFocusPosition(tr.doc, position) || view.state.selection;
    const isSameSelection = view.state.selection.eq(selection);

    if (dispatch) {
      if (!isSameSelection) {
        tr.setSelection(selection);
      }

      // `tr.setSelection` resets the stored marks
      // so we’ll restore them if the selection is the same as before
      if (isSameSelection && tr.storedMarks) {
        tr.setStoredMarks(tr.storedMarks);
      }

      delayedFocus();
    }

    return true;
  };
