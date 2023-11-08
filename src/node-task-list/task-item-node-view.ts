/**
 * Forked from https://github.com/remirror/remirror/blob/main/packages/remirror__extension-list/src/list-item-node-view.ts
 * Modified by youking-lib
 */

import { NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';

type UpdateElement = (node: ProsemirrorNode, dom: HTMLElement) => void;

export function createCustomMarkListItemNodeView({
  node,
  mark,
  updateDOM,
  updateMark
}: {
  node: ProsemirrorNode;
  mark: HTMLElement;
  updateDOM: UpdateElement;
  updateMark: UpdateElement;
}): NodeView {
  const markContainer = document.createElement('label');
  markContainer.contentEditable = 'false';
  markContainer.classList.add('LIST_ITEM_MARKER_CONTAINER');
  markContainer.append(mark);

  const contentDOM = document.createElement('div');

  const dom = document.createElement('li');
  dom.classList.add('LIST_ITEM_WITH_CUSTOM_MARKER');
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
