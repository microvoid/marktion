import { NodeSpec } from 'prosemirror-model';

export const bullet_list: NodeSpec = {
  content: 'list_item+',
  group: 'block',
  attrs: { tight: { default: false } },
  parseDOM: [
    { tag: 'ul', getAttrs: dom => ({ tight: (dom as HTMLElement).hasAttribute('data-tight') }) }
  ],
  toDOM(node) {
    return ['ul', { 'data-tight': node.attrs.tight ? 'true' : null }, 0];
  }
};
