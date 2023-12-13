import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import type { Node as ASTNode } from 'unist';
import type { Node as PMNode } from 'prosemirror-model';

import { Formatter, SerializeContext } from './formatter';
import { RootContent } from 'mdast';

export const PM_TO_AST_NAME_MAP: Record<string, string> = {
  // node
  doc: 'root',
  paragraph: 'paragraph',
  blockquote: 'blockquote',
  hard_break: 'break',
  code_block: 'code',
  heading: 'heading',
  horizontal_rule: 'thematicBreak',
  image: 'image',

  task_list: 'list',
  task_item: 'listItem',
  ordered_list: 'list',
  bullet_list: 'list',
  list_item: 'listItem',

  table: 'table',
  table_row: 'tableRow',
  table_cell: 'tableCell',
  table_header: 'tableCell',

  // mark
  text: 'text',
  strong: 'strong',
  code: 'inlineCode',
  em: 'emphasis',
  strike: 'delete',
  link: 'link'
};

export function serialize(node: PMNode) {
  const ast = toASTNode(node);

  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkStringify, {
    fences: true,
    bullet: '-',
    listItemIndent: 'one'
  });

  return processor.stringify(ast[0] as any) as string;
}

function toASTNode(
  node: PMNode,
  context: SerializeContext = { paths: [], getMarkSerialize: getSerializer }
): ASTNode[] {
  const serializer = getSerializer(node.type.name);
  const children: ASTNode[] = [];

  context.paths.push(node);

  for (let i = 0, len = node.childCount; i < len; i++) {
    children.push(...toASTNode(node.child(i), context));
  }

  context.paths.pop();

  const nodes: ASTNode[] = serializer.serialize(node, children as RootContent[], context);

  return nodes;
}

function getSerializer(name: string) {
  const impl = Formatter.get(PM_TO_AST_NAME_MAP[name]);

  if (!impl) {
    console.warn(
      'Couldn\'t find any way to convert ProseMirror node of type "' + name + '" to a unist node.'
    );
  }

  return impl;
}
