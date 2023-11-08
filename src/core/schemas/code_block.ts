import { NodeSpec } from 'prosemirror-model';

export const code_block: NodeSpec = {
  content: 'text*',
  group: 'block',
  code: true,
  defining: true,
  marks: '',
  attrs: { language: { default: '' } },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: node => ({ params: (node as HTMLElement).getAttribute('data-params') || '' })
    }
  ],
  toDOM(node) {
    return [
      'pre',
      node.attrs.language ? { 'data-language': node.attrs.language } : {},
      ['code', 0]
    ];
  }
};
