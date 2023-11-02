import { describe, test, expect } from 'vitest';
import { parse } from './parser';
import { schema } from '../schemas';

describe('marktion - encoding', () => {
  const result = parse(
    '> Inside a blockquote\n\n' +
      'Paragraph with a  \n' +
      'hard break\n' +
      '```\nCode\n```\n' +
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
      '[link2]: https://link2.test'
  );

  console.log(result);

  test('parser', () => {});
});
