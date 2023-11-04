import { NodeSpec } from 'prosemirror-model';

export const list_item: NodeSpec = {
  content: 'block+',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  }
};