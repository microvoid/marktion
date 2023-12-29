import { describe, test, expect } from 'vitest';
import { highlight } from './highlight';

describe('marktion - encoding', () => {
  test('highlight', () => {
    const result = highlight(
      'typescript',
      `
    import { ReactEditor } from 'marktion';
    import 'marktion/dist/style.css';
    
    function Editor() {
      return <ReactEditor content={\`# Hello World\`} />;
    }
    `
    );

    console.log('result', result);
  });
});
