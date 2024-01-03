import fetch from 'axios';
import type { Prisma, Project } from '@prisma/client';

import { ModelContextType } from '../context/model-context';

export const ProjectModifier = {
  async updateProjectPayStatus(
    { dispatch, model }: ModelContextType,
    data: Prisma.ProjectPlanCreateArgs['data']
  ) {
    const result = await fetch<{ project: Project }>({
      url: `/api/callback/pay-status`,
      method: 'post',
      data
    });

    dispatch(draft => {
      const project = draft.projects.find(item => item.project.id === result.data.project.id)!;
      Object.assign(project, result.data.project);
    });
  }
};
