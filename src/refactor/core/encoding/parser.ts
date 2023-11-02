import { unified } from 'unified';
import type { Root } from 'mdast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import type { Parent, Node as MdastNode } from 'unist';
import type { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { Formatter, UnistNode } from './formatter';
import { schema } from '../schemas';

export function parse(source: string) {
  const u = unifiedParse(source) as Root;

  return toProseMirrorDoc(u);
}

function unifiedParse(source: string) {
  const process = unified().use(remarkParse).use(remarkGfm).use(remarkStringify);
  return process.runSync(process.parse(source));
}

function toProseMirrorDoc(node: UnistNode): ProseMirrorNode[] {
  const impl = Formatter.get(node.type);

  if (!impl) {
    console.warn(
      'Couldn\'t find any way to convert unist node of type "' +
        node.type +
        '" to a ProseMirror node.'
    );
    return [];
  }

  let children: ProseMirrorNode[] = [];

  if (unistNodeIsParent(node)) {
    children = children.concat(...node.children.map(item => toProseMirrorDoc(node)));
  }

  return impl.parse(node, schema, children);
}

function unistNodeIsParent(node: MdastNode): node is Parent {
  return 'children' in node;
}
