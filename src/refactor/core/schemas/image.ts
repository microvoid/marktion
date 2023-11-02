import { NodeSpec } from 'prosemirror-model';

export const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom) {
        return {
          src: (dom as HTMLElement).getAttribute('src'),
          title: (dom as HTMLElement).getAttribute('title'),
          alt: (dom as HTMLElement).getAttribute('alt')
        };
      }
    }
  ],
  toDOM(node) {
    return ['img', node.attrs];
  }
};
