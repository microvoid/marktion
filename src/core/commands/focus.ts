import { Command } from 'prosemirror-state';

import { isTextSelection } from '../helpers';
import { resolveFocusPosition } from '../helpers/resolveFocusPosition';
import { isiOS } from '../utils';
import { scrollIntoView } from './scrollIntoView';

export type FocusPosition = 'start' | 'end' | 'all' | number | boolean | null;

export const focus =
  (
    position: FocusPosition = null,
    options: {
      scrollIntoView?: boolean;
    } = {}
  ): Command =>
  (state, dispatch, view) => {
    options = {
      scrollIntoView: true,
      ...options
    };

    const delayedFocus = () => {
      // focus within `requestAnimationFrame` breaks focus on iOS
      // so we have to call this
      if (isiOS()) {
        (view?.dom as HTMLElement).focus();
      }

      // For React we have to focus asynchronously. Otherwise wild things happen.
      // see: https://github.com/ueberdosis/tiptap/issues/1520
      requestAnimationFrame(() => {
        view?.focus();

        if (options?.scrollIntoView) {
          scrollIntoView()(state, dispatch, view);
        }
      });
    };

    if ((view?.hasFocus() && position === null) || position === false) {
      return true;
    }

    // we don’t try to resolve a NodeSelection or CellSelection
    if (dispatch && position === null && !isTextSelection(view?.state.selection)) {
      delayedFocus();
      return true;
    }

    // pass through tr.doc instead of editor.state.doc
    // since transactions could change the editors state before this command has been run
    const selection = resolveFocusPosition(state.tr.doc, position) || view?.state.selection!;
    const isSameSelection = view?.state.selection.eq(selection);

    if (dispatch) {
      if (!isSameSelection) {
        state.tr.setSelection(selection);
      }

      // `tr.setSelection` resets the stored marks
      // so we’ll restore them if the selection is the same as before
      if (isSameSelection && state.tr.storedMarks) {
        state.tr.setStoredMarks(state.tr.storedMarks);
      }

      delayedFocus();
    }

    return true;
  };
