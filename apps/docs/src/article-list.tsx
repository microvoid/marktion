import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Divider, List } from 'antd';
import { PencilLineIcon, Trash2Icon } from 'lucide-react';

import type { Article } from './api';
import { useMainContextSelector } from './hooks';

dayjs.extend(relativeTime);

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
  const deleteArticle = useMainContextSelector(ctx => ctx.deleteArticle);

  return (
    <List.Item
      actions={[
        <div style={{ display: 'flex', alignItems: 'center', userSelect: 'none' }}>
          <PencilLineIcon
            style={{ cursor: 'pointer' }}
            onClick={() => onEdit(article)}
            width={16}
            height={16}
          />

          <Divider type="vertical" />

          <Trash2Icon
            style={{
              cursor: 'pointer',
              color: 'red'
            }}
            onClick={() => deleteArticle(article.id)}
            width={16}
            height={16}
          />
        </div>
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
            {`${timeFormat(article.createAt)}. ${getMarktionTitle(article.content)}`}
          </div>
        }
      />
    </List.Item>
  );
}

function timeFormat(input: number) {
  const time = dayjs(input);

  if (dayjs().diff(time, 'day') < 1) {
    return time.fromNow();
  }

  return `${time.format('YYYY-MM-DD HH:mm')}`;
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '') || 'untitled';
}
