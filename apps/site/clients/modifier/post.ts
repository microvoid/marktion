import fetch from 'axios';
import { Post } from '@prisma/client';
import dayjs from 'dayjs';

import { ModelContextType } from '../context/model-context';
import { ProjectStorage, storageService } from '../services';

export async function downloadPost(ctx: ModelContextType, post: Post) {
  const filename = `${post.title || 'untitled'}.md`;
  const content = post.markdown;

  const FileSaver = (await import('file-saver')).default;
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });

  return FileSaver.saveAs(blob, filename);
}

export async function delPost(ctx: ModelContextType, id: string) {
  return await fetch({
    url: `/api/post/${id}`,
    method: 'delete'
  });
}

export async function publishPost(ctx: ModelContextType, id: string) {
  return await fetch({
    url: '/api/post',
    method: 'post',
    data: {
      id,
      publicStats: 'public'
    }
  });
}

export async function upsertPost(ctx: ModelContextType, post: Partial<Post>) {
  const res = await fetch({
    url: '/api/post',
    method: 'post',
    data: post
  });

  const result: Post = res.data.data;

  if (!ctx.model.user) {
    return insertPostByStorage(ctx, result);
  }

  return result;
}

export async function refreshPosts({ dispatch, model }: ModelContextType) {
  if (!model.user) {
    return getPostsByStorage({ dispatch, model });
  }

  dispatch(draft => {
    draft.postsFetchLoading = true;
  });

  try {
    const res = await fetch<{ data: { posts: Post[]; count: number } }>({
      url: '/api/post',
      params: model.postsSearchParams,
      method: 'get'
    });

    const posts = res.data.data.posts || [];
    const count = res.data.data.count || posts.length;

    dispatch(draft => {
      draft.posts = posts;
      draft.postCount = count;
      draft.postsFetchLoading = false;
    });
  } catch (err) {
    console.error(err);
    dispatch(draft => {
      draft.postsFetchLoading = false;
    });
  }
}

export async function importLocalPosts(ctx: ModelContextType, projectId: string) {
  const posts = await storageService.getPosts();
  const projectStorage = ProjectStorage.create(projectId);
  const localIgnoreBefore = await projectStorage.getLocalIgnoreBefore();

  function getHasLocalPostsToImport() {
    if (!localIgnoreBefore) {
      return posts;
    }

    return posts.filter(post => {
      if (!post || !post.id) {
        return false;
      }

      return dayjs(post.createdAt).isAfter(localIgnoreBefore);
    });
  }

  function clearLocalPosts() {
    const posts = getHasLocalPostsToImport();

    posts.forEach(item => {
      deletePostByStorage(ctx, item.id);
    });
  }

  return {
    getHasLocalPostsToImport,
    markIgnore() {
      projectStorage.markLocalIgnoreBefore(Date.now());
    },

    async execImport() {
      const posts = getHasLocalPostsToImport();

      if (posts.length > 0) {
        await fetch({
          url: '/api/post/import',
          method: 'post',
          data: {
            projectId,
            ids: posts.map(post => post.id)
          }
        });

        clearLocalPosts();
      }
    }
  };
}

async function getPostsByStorage({ dispatch, model }: ModelContextType) {
  const posts = await storageService.getPosts();

  dispatch(draft => {
    draft.posts = posts;
    draft.postCount = posts.length;
  });
}

async function insertPostByStorage(ctx: ModelContextType, post: Post) {
  return storageService.insertPost(post);
}

async function deletePostByStorage(ctx: ModelContextType, id: string) {
  return storageService.deletePost(id);
}
