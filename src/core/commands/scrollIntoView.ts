import { Command } from 'prosemirror-state';

export const scrollIntoView =
  (): Command =>
  ({ tr }, dispatch) => {
    if (dispatch) {
      tr.scrollIntoView();
    }

    return true;
  };
