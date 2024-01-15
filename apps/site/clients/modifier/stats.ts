import fetch from 'axios';
import { ModelContextType } from '../context/model-context';
import { UserStatistics, ProjectStatistics, Selector } from '..';

export const StatsModifier = {
  async getUserStatistics(ctx: ModelContextType, projectId: string) {
    const { dispatch } = ctx;
    const loginUser = Selector.getLoginUser(ctx);

    if (!loginUser) return;

    dispatch(draft => {
      draft.userStatisticsLoading = true;
    });

    try {
      const [userStats, projectStatistics] = await Promise.all([
        fetch<{ data: UserStatistics }>({
          url: `/api/statistics/user/${loginUser.id}`
        }),
        fetch<{ data: ProjectStatistics }>({
          url: `/api/statistics/project/${projectId}`
        })
      ]);

      dispatch(draft => {
        draft.userStatisticsLoading = false;
        draft.userStatistics.postCount = userStats.data.data.postCount;
        draft.projectStatistics = projectStatistics.data.data;
      });
    } catch (err) {
      console.error(err);
      dispatch(draft => {
        draft.userStatisticsLoading = false;
      });
    }
  }
};
