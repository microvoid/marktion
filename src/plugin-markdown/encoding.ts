import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRemark from 'rehype-remark';
import rehypeParse from 'rehype-parse';
import remarkStringify from 'remark-stringify';
import rehypeStringify from 'rehype-stringify';

export function parse(markdown: string, options?: {}) {
  const html = markdownToHtml(markdown);

  return html;
}

export function serialize(html: string, options?: {}) {
  const markdown = htmlToMarkdown(html);

  return markdown;
}

export function markdownToHtml(markdown: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdown);

  return String(file);
}

export function htmlToMarkdown(html: string) {
  const file = unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(html);

  return String(file);
}
