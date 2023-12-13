import { describe, test, expect } from 'vitest';
import { builders } from 'prosemirror-test-builder';
import { serialize } from './serialize';
import { schema } from '../schemas';

const {
  doc,
  blockquote,
  p,
  code_block,
  h1,
  br,
  hr,
  img,
  ul,
  ol,
  li,
  strong,
  em,
  a,
  code,
  table,
  tr,
  td,
  th,
  task,
  taskItem
} = builders(schema, {
  p: { nodeType: 'paragraph' },
  pre: { nodeType: 'code_block' },
  h1: { nodeType: 'heading', level: 1 },
  h2: { nodeType: 'heading', level: 2 },
  h3: { nodeType: 'heading', level: 3 },
  li: { nodeType: 'list_item' },
  ul: { nodeType: 'bullet_list' },
  ol: { nodeType: 'ordered_list' },
  br: { nodeType: 'hard_break' },
  img: { nodeType: 'image', src: 'img.png' },

  table: { nodeType: 'table' },
  tr: { nodeType: 'table_row' },
  th: { nodeType: 'table_header' },
  td: { nodeType: 'table_cell' },

  task: { nodeType: 'task_list' },
  taskItem: { nodeType: 'task_item' },

  hr: { nodeType: 'horizontal_rule' },
  a: { markType: 'link', href: 'foo' }
});

describe('marktion - encoding', () => {
  const PMDoc = doc(
    blockquote(p('Inside a blockquote')),
    p('Paragraph with a', br(), 'hard break'),
    code_block('Code'),
    h1('Hello'),
    hr(),
    p(img()),
    p(img()),
    ol(li(p('Ordered list'))),
    ul(li(p('Unordered list'))),
    task(taskItem(p('TaskList'))),
    p(
      'A text with a ',
      strong('bold part'),
      ', some ',
      code('inline code'),
      ', a bit ',
      em('that is italic'),
      ', one ',
      a('link'),
      ' and another ',
      a('type of link'),
      '.'
    )
  );

  test('serialize', () => {
    const result = serialize(PMDoc);

    console.log(result);
  });
});
