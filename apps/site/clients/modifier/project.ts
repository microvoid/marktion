import fetch from 'axios';
import type { Prisma, Project } from '@prisma/client';

import { ModelContextType } from '../context/model-context';
import { message } from 'antd';

export const ProjectModifier = {
  async updateProjectPayStatus(
    { dispatch, model }: ModelContextType,
    data: Prisma.ProjectPlanCreateArgs['data']
  ) {
    const result = await fetch<{ data: { project: Project }; status: number; message: string }>({
      url: `/api/callback/pay-status`,
      method: 'post',
      data
    });

    if (result.data.status !== 0) {
      message.error(result.data.message);

      return false;
    }

    message.success('success');

    dispatch(draft => {
      const project = draft.projects.find(item => item.project.id === result.data.data.project.id)!;
      Object.assign(project.project, result.data.data.project);
    });

    return true;
  }
};
