import { EditorState, Selection } from 'prosemirror-state';
import type { Transaction, PluginKey, Plugin } from 'prosemirror-state';
import { Fragment, Node as ProsemirrorNode, NodeType, ResolvedPos } from 'prosemirror-model';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import { EditorView } from 'prosemirror-view';
import { minMax } from './utilities';

export interface ProsemirrorNodeProps {
  /**
   * The prosemirror node
   */
  node: ProsemirrorNode;
}

export interface NodeTypesProps {
  /**
   * The prosemirror node types to use.
   */
  types: NodeType | string | Array<NodeType | string>;
}

export interface OptionalProsemirrorNodeProps {
  /**
   * The nullable prosemirror node which may or may not exist. Please note that
   * the `find` will fail if this does not exists.
   *
   * To prevent cryptic errors this should always be the `doc` node.
   */
  node: ProsemirrorNode | null | undefined;
}

interface NodeEqualsTypeProps extends NodeTypesProps, OptionalProsemirrorNodeProps {}

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

interface StateSelectionPosProps {
  /**
   * Provide an editor state, or the editor selection or a resolved position.
   */
  selection: EditorState | Selection | ResolvedPos;
}

interface FindParentNodeOfTypeProps extends NodeTypesProps, StateSelectionPosProps {}

export interface FindProsemirrorNodeResult extends ProsemirrorNodeProps {
  /**
   * The start position of the node.
   */
  start: number;

  /**
   * The end position of the node.
   */
  end: number;

  /**
   * Points to position directly before the node.
   */
  pos: number;

  /**
   * The depth the node. Equal to 0 if node is the root.
   */
  depth: number;
}

/**
 * Checks if the type a given `node` has a given `nodeType`.
 */
export function isNodeOfType(props: NodeEqualsTypeProps): boolean {
  const { types, node } = props;

  if (!node) {
    return false;
  }

  const matches = (type: NodeType | string) => type === node.type || type === node.type.name;

  if (isArray(types)) {
    return types.some(matches);
  }

  return matches(types);
}

/**
 * Checks to see if the passed value is a Prosemirror Editor State
 *
 * @param value - the value to check
 */
export function isEditorState(value: unknown): value is EditorState | Readonly<EditorState> {
  return isObject(value) && value instanceof EditorState;
}

/**
 * Predicate checking whether the value is a Selection
 *
 * @param value - the value to check
 */
export function isSelection(value: unknown): value is Selection {
  return isObject(value) && value instanceof Selection;
}

export function getPluginKey(key: string | Plugin | PluginKey) {
  return typeof key == 'string' ? key : get(key, 'key')!;
}

export function posToDOMRect(view: EditorView, from: number, to: number): DOMRect {
  const minPos = 0;
  const maxPos = view.state.doc.content.size;
  const resolvedFrom = minMax(from, minPos, maxPos);
  const resolvedEnd = minMax(to, minPos, maxPos);
  const start = view.coordsAtPos(resolvedFrom);
  const end = view.coordsAtPos(resolvedEnd, -1);
  const top = Math.min(start.top, end.top);
  const bottom = Math.max(start.bottom, end.bottom);
  const left = Math.min(start.left, end.left);
  const right = Math.max(start.right, end.right);
  const width = right - left;
  const height = bottom - top;
  const x = left;
  const y = top;
  const data = {
    top,
    bottom,
    left,
    right,
    width,
    height,
    x,
    y
  };

  return {
    ...data,
    toJSON: () => data
  };
}

export function posToOffsetRect(view: EditorView, from: number, to: number): DOMRect {
  const rect = posToDOMRect(view, from, to);
  const parent = view.dom;
  const parentRect = parent.getBoundingClientRect();

  const x = rect.left - parentRect.left + parent.scrollLeft;
  const y = rect.top - parentRect.top + parent.scrollTop;

  return new DOMRect(x, y, rect.width, rect.height);
}
