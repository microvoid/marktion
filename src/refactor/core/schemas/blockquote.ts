import { NodeSpec } from 'prosemirror-model';

export const blockquote: NodeSpec = {
  content: 'block+',
  group: 'block',
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  }
};
