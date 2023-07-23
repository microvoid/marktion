import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm, { Root } from 'remark-gfm';
import rehypeRemark from 'rehype-remark';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';

export function parse(markdown: string, options: MarkdownToHtmlOptions = {}) {
  const html = markdownToHtml(markdown, options);

  return html;
}

export function serialize(html: string) {
  const markdown = htmlToMarkdown(html);

  return markdown;
}

type MarkdownToHtmlOptions = {
  codeHighlight?: boolean;
};

export function markdownToHtml(
  markdown: string,
  { codeHighlight = false }: MarkdownToHtmlOptions = {}
) {
  const u = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (mdast: Root) => {
      visit(mdast, 'element', function (node, _) {
        if (node['tagName'] === 'li') {
          const classes = node['properties']['className'] as string[];

          if (classes && classes.includes('task-list-item')) {
            // @ts-ignore
            const input = node.children[0];
            const label = {
              children: [input],
              properties: {},
              tagName: 'label',
              type: 'element'
            };

            // @ts-ignore
            node.children[0] = label;
          }
        }
      });
    });

  if (codeHighlight) {
    u.use(rehypeHighlight);
  }

  const file = u.use(rehypeStringify).processSync(markdown);

  return String(file);
}

export function htmlToMarkdown(html: string) {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(() => (mdast: Root) => {
      visit(mdast, 'element', function (node, _, parent) {
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
