import fetch from 'axios';
import { ModelContextType } from '../context/model-context';
import { UserStatistics } from '..';

export const StatsModifier = {
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
