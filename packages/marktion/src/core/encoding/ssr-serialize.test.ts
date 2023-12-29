import { describe, test, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { schema } from '../schemas';
import { HtmlSerializer } from './ssr-serialize';

const markdown = fs.readFileSync(path.resolve('./README.md'), {
  encoding: 'utf-8'
});

describe('marktion - encoding', () => {
  test('html', () => {
    const html = new HtmlSerializer(schema);
    const result = html.serialize(`
2. Usage

\`\`\`tsx
import { ReactEditor } from 'marktion';
import 'marktion/dist/style.css';

function Editor() {
  return <ReactEditor content={\`# Hello World\`} />;
}
\`\`\`
    `);

    console.log(result);
  });
});
