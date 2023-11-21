import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function unwrapImage(ast: Node) {
  return visit(
    ast,
    'paragraph',
    (node: Node & { children?: Node[] }, index: number, parent: Node & { children: Node[] }) => {
      if (node.children?.length !== 1) return;

      const firstChild = node.children?.[0];

      if (!firstChild || firstChild.type !== 'image') return;

      const { url, alt, title } = firstChild as Node & { url: string; alt: string; title: string };

      const newNode = {
        type: 'image',
        url,
        alt,
        title
      };

      parent.children.splice(index, 1, newNode);
    }
  );
}
