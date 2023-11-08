import { MarkSpec } from 'prosemirror-model';

export const strong = {
  parseDOM: [
    { tag: 'strong' },
    { tag: 'b', getAttrs: (node: HTMLElement) => node.style.fontWeight != 'normal' && null },
    { style: 'font-weight=400', clearMark: m => m.type.name == 'strong' },
    {
      style: 'font-weight',
      getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
    }
  ],
  toDOM() {
    return ['strong'];
  }
} as MarkSpec;
