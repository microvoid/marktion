import { Prisma } from '@prisma/client';
import { projectService } from '..';

class PlanHelper {
  async upgradeToPro(projectId: string, planInput: Prisma.ProjectPlanCreateArgs['data']) {
    const plan = await projectService.createProjectPlan(planInput);
    const project = await projectService.upgradeProjectToPro(projectId);

    return {
      plan,
      project
    };
  }
}

export const planHelper = new PlanHelper();
