import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

export type HtmlSerializeOptions = {
  codeHighlight: boolean;
};

const defaultOptions: HtmlSerializeOptions = {
  codeHighlight: true
};

export function html(markdown: string, options: HtmlSerializeOptions = defaultOptions) {
  const u = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);

  if (options.codeHighlight) {
    u.use(rehypeHighlight);
  }

  return u.processSync(markdown).toString();
}
