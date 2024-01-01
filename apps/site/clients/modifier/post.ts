import fetch from 'axios';
import { ModelContextType } from '../context/model-context';
import { Post } from '@prisma/client';

export const PostModifier = {
  async downloadPost(ctx: ModelContextType, post: Post) {
    const filename = `${post.title || 'untitled'}.md`;
    const content = post.markdown;

    const FileSaver = (await import('file-saver')).default;
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });

    return FileSaver.saveAs(blob, filename);
  },

  async delPost(ctx: ModelContextType, id: string) {
    return await fetch({
      url: `/api/post/${id}`,
      method: 'delete'
    });
  },

  async publishPost(ctx: ModelContextType, id: string) {
    return await fetch({
      url: '/api/post',
      method: 'post',
      data: {
        id,
        publicStats: 'public'
      }
    });
  },

  async upsertPost(ctx: ModelContextType, post: Partial<Post>) {
    const res = await fetch({
      url: '/api/post',
      method: 'post',
      data: post
    });

    const result: Post = res.data.data;

    return result;
  },

  async refreshPosts({ dispatch, model }: ModelContextType) {
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
};
