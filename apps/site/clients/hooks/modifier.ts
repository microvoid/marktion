import fetch from 'axios';
import { ModelContextType } from './useModel';
import { Post } from '@prisma/client';
import { UserStatistics } from '..';

export const ModelModifier = {
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
  },

  async getUserStatistics({ dispatch, model }: ModelContextType) {
    dispatch(draft => {
      draft.userStatisticsLoading = true;
    });

    try {
      const res = await fetch<{ data: UserStatistics }>({
        url: `/api/statistics/user/${model.user.id}`
      });

      dispatch(draft => {
        draft.userStatisticsLoading = false;
        draft.userStatistics.postCount = res.data.data.postCount;
      });
    } catch (err) {
      console.error(err);
      dispatch(draft => {
        draft.userStatisticsLoading = false;
      });
    }
  }
};
