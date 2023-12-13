import type { Attrs, Node as ProseMirrorNode, Schema } from 'prosemirror-model';

export function createProseMirrorNode(
  nodeName: string | null,
  schema: Schema<string, string>,
  children: Array<ProseMirrorNode>,
  attrs: Attrs = {}
): Array<ProseMirrorNode> {
  if (nodeName === null) {
    return [];
  }
  const proseMirrorNode = schema.nodes[nodeName].createAndFill(attrs, children);
  if (proseMirrorNode === null) {
    return [];
  }
  return [proseMirrorNode];
}
