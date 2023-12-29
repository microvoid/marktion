import { unified, Parser } from 'unified';
import rehypeStringify from 'rehype-stringify';
import { createLowlight, all } from 'lowlight';

export const lowlight = createLowlight(all);

export function highlight(language: string, value: string, parser = lowlight) {
  const tree = parser.highlight(language, value);

  const u = unified()
    .use(function () {
      const parser: Parser = () => {
        return tree;
      };

      Object.assign(this, {
        Parser: parser
      });
    })
    .use(rehypeStringify);

  const result = u.processSync();

  return String(result);
}

type Root = ReturnType<(typeof lowlight)['highlight']>;

export function toString(tree: Root) {}
