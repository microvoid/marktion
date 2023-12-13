import { NodeSpec } from 'prosemirror-model';

export const ordered_list: NodeSpec = {
  content: 'list_item+',
  group: 'block',
  attrs: { start: { default: 1 }, tight: { default: false } },
  parseDOM: [
    {
      tag: 'ol',
      getAttrs(dom) {
        return {
          order: (dom as HTMLElement).hasAttribute('start')
            ? +(dom as HTMLElement).getAttribute('start')!
            : 1,
          tight: (dom as HTMLElement).hasAttribute('data-tight')
        };
      }
    }
  ],
  toDOM(node) {
    return [
      'ol',
      {
        start: node.attrs.start == 1 ? null : node.attrs.start,
        'data-tight': node.attrs.tight ? 'true' : null
      },
      0
    ];
  }
};
