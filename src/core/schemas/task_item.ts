import { NodeSpec } from 'prosemirror-model';

export const task_item: NodeSpec = {
  content: 'paragraph block*',
  defining: true,
  attrs: {
    checked: { default: false }
  },
  parseDOM: [
    {
      tag: 'li[data-task-list-item]',
      getAttrs: node => {
        let checked = false;

        console.log(node);

        return {
          checked
        };
      }
    }
  ],
  toDOM(node) {
    return [
      'li',
      {
        'data-task-list-item': '',
        'data-checked': node.attrs.checked ? '' : undefined
      },
      0
    ];
  }
};
