import type { Attrs, Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { Paragraph, Link, Text, Root, PhrasingContent, Node as MdastNode } from 'mdast';
import { schema, nodes, marks } from '../schemas';

export type UnistNode = Paragraph | Link | Text | Root;
export type UnistNodeType = UnistNode['type'];

type ProseMirrorNodeType = keyof typeof nodes;
type ProseMirrorMark = keyof typeof marks;

type FormatterImpl<T extends UnistNodeType, Node = Extract<UnistNode, { type: T }>> = {
  parse: (node: Node, schema: Schema, children: ProseMirrorNode[]) => ProseMirrorNode[];
  serialize: (node: ProseMirrorNode, children: PhrasingContent[]) => Node[];
};

const FormatterMap = new Map<UnistNode['type'], FormatterImpl<'paragraph'>>();

export const Formatter = {
  impl<T extends UnistNodeType>(type: T, impl: FormatterImpl<T>) {
    FormatterMap.set(type, impl as any);
  },
  get<T extends UnistNodeType>(type: T) {
    return FormatterMap.get(type) as unknown as FormatterImpl<T>;
  }
};

// root
Formatter.impl('root', {
  parse(node, schema, children) {
    return createProseMirrorNode('doc', schema, children);
  },
  serialize(node, children) {
    return [{ type: 'root', children }];
  }
});

// text
Formatter.impl('text', {
  parse: (node, schema) => {
    return [schema.text(node.value)];
  },
  serialize(node) {
    return [{ type: 'text', value: node.text ?? '' }];
  }
});

// paragraph
Formatter.impl('paragraph', {
  parse(_, schema, children) {
    return createProseMirrorNode('paragraph', schema, children);
  },
  serialize(_, children) {
    return [{ type: 'paragraph', children: children }];
  }
});
// UnistConverter.impl('paragraph', (node, schema, children) => {
//   return createProseMirrorNode('paragraph', schema, children);
// });
// ProseMirrorConverter.impl('paragraph', (node, children) => {
//   return [{ type: 'paragraph', children: children }];
// });

/**
 * @public
 */
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
