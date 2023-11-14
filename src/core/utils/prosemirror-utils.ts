import { EditorState, Selection } from 'prosemirror-state';
import type { Transaction, PluginKey, Plugin } from 'prosemirror-state';
import { Fragment, Node as ProsemirrorNode, NodeType, ResolvedPos } from 'prosemirror-model';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import get from 'lodash/get';

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
 *  Iterates over parent nodes, returning closest node of a given `nodeType`.
 *  `start` points to the start position of the node, `pos` points directly
 *  before the node.
 *
 *  ```ts
 *  const parent = findParentNodeOfType({types: schema.nodes.paragraph, selection});
 *  ```
 */
export function findParentNodeOfType(
  props: FindParentNodeOfTypeProps
): FindProsemirrorNodeResult | undefined {
  const { types, selection } = props;

  return findParentNode({ predicate: node => isNodeOfType({ types, node }), selection });
}

export interface FindParentNodeProps extends StateSelectionPosProps {
  predicate: (node: ProsemirrorNode, pos: number) => boolean;
}

/**
 * Iterates over parent nodes, returning the closest node and its start position
 * that the `predicate` returns truthy for. `start` points to the start position
 * of the node, `pos` points directly before the node.
 *
 * ```ts
 * const predicate = node => node.type === schema.nodes.blockquote;
 * const parent = findParentNode({ predicate, selection });
 * ```
 */
export function findParentNode(props: FindParentNodeProps): FindProsemirrorNodeResult | undefined {
  const { predicate, selection } = props;
  const $pos = isEditorState(selection)
    ? selection.selection.$from
    : isSelection(selection)
    ? selection.$from
    : selection;

  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);
    const pos = depth > 0 ? $pos.before(depth) : 0;
    const start = $pos.start(depth);
    const end = pos + node.nodeSize;

    if (predicate(node, pos)) {
      return { pos, depth, node, start, end };
    }
  }

  return;
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
