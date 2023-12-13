import { NodeType, ResolvedPos } from 'prosemirror-model';
import { NodeViewConstructor } from 'prosemirror-view';
import { Command } from 'prosemirror-state';

import { findParentNode } from '../../core/helpers';
import { createCustomMarkListItemNodeView } from './task-item-node-view';

export const taskItem: NodeViewConstructor = (node, view, getPos) => {
  const mark = document.createElement('input');
  mark.type = 'checkbox';
  mark.setAttribute('role', 'task-item-checkbox');
  mark.contentEditable = 'false';
  mark.addEventListener('click', (e: MouseEvent) => {
    if (!view.editable) {
      e.preventDefault();
    }
  });

  mark.addEventListener('change', () => {
    const pos = (getPos as () => number)();
    const $pos = view.state.doc.resolve(pos + 1);

    toggleCheckboxChecked(node.type, { $pos })(view.state, view.dispatch);
  });

  // Use the node as the source of truth of the checkbox state.
  mark.checked = node.attrs.checked;

  return createCustomMarkListItemNodeView({
    node,
    mark
  });
};

export function toggleCheckboxChecked(
  type: NodeType,
  props?: { checked?: boolean; $pos?: ResolvedPos } | boolean
): Command {
  let checked: boolean | undefined;
  let $pos: ResolvedPos | undefined;

  if (typeof props === 'boolean') {
    checked = props;
  } else if (props) {
    checked = props.checked;
    $pos = props.$pos;
  }

  return ({ tr }, dispatch) => {
    const found = findParentNode(node => node.type === type)($pos ?? tr.selection.$from);

    if (!found) {
      return false;
    }

    const { node, pos } = found;
    const attrs = { ...node.attrs, checked: checked ?? !node.attrs.checked };

    dispatch?.(tr.setNodeMarkup(pos, undefined, attrs));

    return true;
  };
}
