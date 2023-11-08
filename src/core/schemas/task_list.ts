import { NodeSpec } from 'prosemirror-model';

export const task_list: NodeSpec = {
  content: 'task_item+',
  group: 'block',
  parseDOM: [{ tag: 'ul[data-task-list]' }],
  // toDOM: node => ['ul', { 'data-task-list': '' }, 0],
  toDOM(node) {
    return ['ul', { 'data-task-list': '' }, 0];
  }
};
