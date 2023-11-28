import { unified } from 'unified';
import type { Root } from 'mdast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Parent, Node as ASTNode } from 'unist';
import type { Node as PMNode } from 'prosemirror-model';
import { Formatter, FormatMdNode, ParseContext } from './formatter';
import { schema } from '../schemas';
import { unwrapImage } from './remark-plugin/image';

export function parse(source: string) {
  const u = unifiedParse(source) as Root;

  return toProseMirrorDoc(u)[0];
}

function unifiedParse(source: string) {
  const process = unified().use(remarkParse).use(remarkGfm);
  const parsed = process.parse(source);

  return process.runSync(parsed);
}

function toProseMirrorDoc(node: FormatMdNode, context: ParseContext = { paths: [] }): PMNode[] {
  const impl = Formatter.get(node.type);

  if (!impl) {
    console.warn(
      'Couldn\'t find any way to convert unist node of type "' +
        node.type +
        '" to a ProseMirror node.'
    );
    return [];
  }

  context.paths.push(node);

  let children: PMNode[] = [];

  if (unistNodeIsParent(node)) {
    children = children.concat(...node.children.map(item => toProseMirrorDoc(item, context)));
  }

  context.paths.pop();

  return impl.parse(node, schema, children, context);
}

function unistNodeIsParent(node: ASTNode): node is Parent {
  return 'children' in node;
}
