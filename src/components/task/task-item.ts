import { NodeType, Node as ProsemirrorNode, ResolvedPos } from 'prosemirror-model';
import { NodeViewConstructor } from 'prosemirror-view';
import { createCustomMarkListItemNodeView } from './task-item-node-view';
import { Command } from 'prosemirror-state';
import { findParentNode } from '../../core/helpers';
// import { findParentNodeOfType } from '../../core/utils';

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
    toggleCheckboxChecked(node.type, { $pos });
  });

  // Use the node as the source of truth of the checkbox state.
  mark.checked = node.attrs.checked;

  return createCustomMarkListItemNodeView({
    node,
    mark,
    updateDOM: updateNodeViewDOM,
    updateMark: updateNodeViewMark
  });
};

function updateNodeViewDOM(node: ProsemirrorNode, dom: HTMLElement) {
  node.attrs.closed
    ? dom.classList.add('COLLAPSIBLE_LIST_ITEM_CLOSED')
    : dom.classList.remove('COLLAPSIBLE_LIST_ITEM_CLOSED');
}

function updateNodeViewMark(node: ProsemirrorNode, mark: HTMLElement) {
  node.childCount <= 1 ? mark.classList.add('disabled') : mark.classList.remove('disabled');
}

function toggleCheckboxChecked(
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
    const found = findParentNode(node => node.type === type)(tr.selection);

    if (!found) {
      return false;
    }

    const { node, pos } = found;
    const attrs = { ...node.attrs, checked: checked ?? !node.attrs.checked };
    dispatch?.(tr.setNodeMarkup(pos, undefined, attrs));

    return true;
  };
}
