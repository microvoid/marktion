import { NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import isEqual from 'lodash/isEqual';

import { ProsemirrorAttributes } from '../../core/utils/types';
import { findParentNode } from '../../core';

interface CodeblockAttributes extends ProsemirrorAttributes {
  language?: string;
}

export function updateCodeblock(type: NodeType, attrs: CodeblockAttributes): Command {
  return (state, dispatch) => {
    const tr = state.tr;
    const parent = findParentNode(node => node.type === type)(tr.selection.$from);

    if (!parent || isEqual(attrs, parent.node.attrs)) {
      // Do nothing since the attrs are the same
      return false;
    }

    tr.setNodeMarkup(parent.pos, type, { ...parent.node.attrs, ...attrs });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
