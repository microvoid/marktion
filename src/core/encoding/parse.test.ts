import { describe, test, expect } from 'vitest';
import {
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
  code
} from 'prosemirror-test-builder';
import { parse } from './parse';

describe('marktion - encoding', () => {
  const md =
    '> Inside a blockquote\n\n' +
    'Paragraph with a  \n' +
    'hard break\n' +
    '```javascript\nCode\n```\n' +
    '# Hello\n' +
    '***\n' +
    '![Awesome image](https://example.test)\n' +
    '\n' +
    '![Image 2][img2]\n' +
    '\n' +
    '[img2]: https://img2.test\n' +
    '1. Ordered list\n' +
    '- Unordered list\n\n' +
    'A text with a **bold part**, some `inline code`, a bit *that is italic*, one [link](https://example.test) and another [type of link][link2].\n' +
    '\n' +
    '[link2]: https://link2.test';

  const expectDoc = doc(
    blockquote(p('Inside a blockquote')),
    p('Paragraph with a', br(), 'hard break'),
    code_block('Code'),
    h1('Hello'),
    hr(),
    p(img()),
    p(img()),
    ol(li(p('Ordered list'))),
    ul(li(p('Unordered list'))),
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
  ).toString();

  test('parse', () => {
    const result = parse(md);

    expect(result.toString()).toBe(expectDoc);
  });
});
