import { MarkSpec } from 'prosemirror-model';

export const link: MarkSpec = {
  attrs: {
    href: {},
    target: {
      default: '__blank'
    },
    title: { default: null }
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom) {
        return {
          href: (dom as HTMLElement).getAttribute('href'),
          title: (dom as HTMLElement).getAttribute('title')
        };
      }
    }
  ],
  toDOM(node) {
    return ['a', node.attrs];
  }
};
