import { MarkSpec } from 'prosemirror-model';

export const strike = {
  inclusive: false,
  parseDOM: [
    {
      tag: 's'
    },
    {
      tag: 'del'
    },
    {
      tag: 'strike'
    },
    {
      style: 'text-decoration',
      getAttrs: node => (node === 'line-through' ? {} : false)
    }
  ],
  toDOM: () => ['s', 0]
} as MarkSpec;
