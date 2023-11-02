import { NodeSpec } from 'prosemirror-model';

export const code_block: NodeSpec = {
  content: 'text*',
  group: 'block',
  code: true,
  defining: true,
  marks: '',
  attrs: { params: { default: '' } },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: node => ({ params: (node as HTMLElement).getAttribute('data-params') || '' })
    }
  ],
  toDOM(node) {
    return ['pre', node.attrs.params ? { 'data-params': node.attrs.params } : {}, ['code', 0]];
  }
};
