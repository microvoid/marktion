import { Post } from '@prisma/client';
import fetch from 'axios';

export type HandlerKey = 'download' | 'delete' | 'commit' | 'public';

export async function handle(key: HandlerKey, post: Post) {
  switch (key) {
    case 'download':
      return downloadFile(`${post.title || 'untitled'}.md`, post.markdown);
    case 'delete':
      return delPost(post.id);
    case 'public':
      return setPublic(post.id);
  }
}

export async function downloadFile(filename: string, content: string) {
  const FileSaver = (await import('file-saver')).default;
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });

  return FileSaver.saveAs(blob, filename);
}

export async function delPost(id: string) {
  return await fetch({
    url: `/api/post/${id}`,
    method: 'delete'
  });
}

export async function setPublic(id: string) {
  await fetch({
    url: '/api/post',
    method: 'post',
    data: {
      id,
      publicStats: 'public'
    }
  });
}
