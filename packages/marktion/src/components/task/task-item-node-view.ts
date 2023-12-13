/**
 * Forked from https://github.com/remirror/remirror/blob/main/packages/remirror__extension-list/src/list-item-node-view.ts
 * Modified by youking-lib
 */

import { Node as ProsemirrorNode } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';

export function createCustomMarkListItemNodeView({
  node,
  mark
}: {
  node: ProsemirrorNode;
  mark: HTMLElement;
}): NodeView {
  const dom = document.createElement('li');
  const contentDOM = document.createElement('div');
  const markContainer = document.createElement('label');

  markContainer.contentEditable = 'false';
  markContainer.setAttribute('role', 'task-item-label');
  markContainer.append(mark);

  dom.setAttribute('role', 'task-item');
  dom.append(markContainer);
  dom.append(contentDOM);

  const update = (newNode: ProsemirrorNode): boolean => {
    if (newNode.type !== node.type) {
      return false;
    }

    node = newNode;
    updateDOM(node, dom);
    updateMark(node, mark);
    return true;
  };

  update(node);

  return { dom, contentDOM, update };
}

function updateDOM(node: ProsemirrorNode, dom: HTMLElement) {
  if (node.attrs.checked) {
    dom.setAttribute('data-checked', 'true');
  } else {
    dom.removeAttribute('data-checked');
  }

  node.attrs.closed
    ? dom.classList.add('COLLAPSIBLE_LIST_ITEM_CLOSED')
    : dom.classList.remove('COLLAPSIBLE_LIST_ITEM_CLOSED');
}

function updateMark(node: ProsemirrorNode, mark: HTMLElement) {
  node.childCount <= 1 ? mark.classList.add('disabled') : mark.classList.remove('disabled');
}
