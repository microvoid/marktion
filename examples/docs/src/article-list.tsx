import dayjs from 'dayjs';
import { List } from 'antd';
import type { Article } from './api';
import { useMainContextSelector } from './hooks';

export type ArticlesProps = {};

export function Articles({}: ArticlesProps) {
  const articles = useMainContextSelector(ctx => ctx.articles);
  const setDraft = useMainContextSelector(ctx => ctx.setDraft);

  if (articles.length === 0) {
    return null;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={articles}
      renderItem={item => <ArticleItem key={item.id} article={item} onEdit={setDraft} />}
    />
  );
}

function ArticleItem({
  article,
  onEdit
}: {
  article: Article;
  onEdit: (article: Article) => void;
}) {
  return (
    <List.Item
      actions={[
        <a key="list-loadmore-edit" onClick={() => onEdit(article)}>
          edit
        </a>
      ]}
    >
      <List.Item.Meta
        description={
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {`${dayjs(article.createAt).format('YYYY-MM-DD HH:mm')}. ${getMarktionTitle(
              article.content
            )}`}
          </div>
        }
      />
    </List.Item>
  );
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '') || 'untitled';
}

const data = [
  {
    title: 'Ant Design Title 1'
  },
  {
    title: 'Ant Design Title 2'
  },
  {
    title: 'Ant Design Title 3'
  },
  {
    title: 'Ant Design Title 4'
  }
];
