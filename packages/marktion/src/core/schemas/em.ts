import { MarkSpec } from 'prosemirror-model';

export const em: MarkSpec = {
  excludes: 'code',
  inclusive: false,
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
    { style: 'font-style=normal', clearMark: m => m.type.name == 'em' }
  ],
  toDOM() {
    return ['em'];
  }
};
