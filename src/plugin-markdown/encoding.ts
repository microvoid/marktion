import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm, { Root } from 'remark-gfm';
import rehypeRemark from 'rehype-remark';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

export function parse(markdown: string) {
  const html = markdownToHtml(markdown);

  console.log(html);

  return html;
}

export function serialize(html: string) {
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
    .use(rehypeParse, { fragment: true })
    .use(() => (mdast: Root) => {
      visit(mdast, 'element', function (node, index, parent) {
        if (parent['tagName'] === 'li' && parent['properties']?.['dataType'] === 'taskItem') {
          if (node['tagName'] === 'label') {
            // @ts-ignore
            node['tagName'] = 'p';
          }
        }
      });
    })
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: '-',
      listItemIndent: 'one'
    })
    .processSync(html);

  return String(file);
}
