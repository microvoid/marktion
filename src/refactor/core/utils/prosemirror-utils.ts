import { Transaction } from 'prosemirror-state';
import { Fragment, Node as ProsemirrorNode } from 'prosemirror-model';

export interface TransactionProps {
  /**
   * The prosemirror transaction
   */
  tr: Transaction;
}

export interface PosProps {
  /**
   * The position of the referenced prosemirror item.
   */
  pos: number;
}

interface RemoveNodeAtPositionProps extends TransactionProps, PosProps {}

interface ReplaceNodeAtPositionProps extends RemoveNodeAtPositionProps {
  content: Fragment | ProsemirrorNode | ProsemirrorNode[];
}

export function replaceNodeAtPosition({
  pos,
  tr,
  content
}: ReplaceNodeAtPositionProps): Transaction {
  const node = tr.doc.nodeAt(pos);

  if (node) {
    tr.replaceWith(pos, pos + node.nodeSize, content);
  }

  return tr;
}
