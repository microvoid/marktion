import { MarkSpec } from 'prosemirror-model';

export const code: MarkSpec = {
  inclusive: false,
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code'];
  }
};
