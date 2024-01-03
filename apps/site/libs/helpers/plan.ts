import dayjs from 'dayjs';
import { Prisma, ProjectPlan, ProjectPlanPayMethod, ProjectPlanPeriod } from '@prisma/client';
import { ErrorUtils, projectService } from '..';

const PayMethod: ProjectPlanPayMethod[] = [
  ProjectPlanPayMethod.Alipay,
  ProjectPlanPayMethod.Weixin
];

class PlanHelper {
  async upgradeToProByPay(projectId: string, planInput: Prisma.ProjectPlanCreateArgs['data']) {
    if (!PayMethod.includes(planInput.payMethod!)) {
      throw ErrorUtils.unexpect();
    }

    const plan = await projectService.createProjectPlan(planInput);
    const project = await projectService.upgradeProjectToPro(projectId);

    return {
      plan,
      project
    };
  }

  async upgradeToProByCDKey(projectId: string, cdkey: string) {
    const plan = await projectService.getProjectPlanByCDKey(cdkey);

    if (!plan) {
      throw ErrorUtils.notFound();
    }

    if (plan.projectId) {
      throw ErrorUtils.error('Occupied');
    }

    if (this.isPlanExpired(plan)) {
      throw ErrorUtils.error('Expired');
    }

    const project = await projectService.upgradeProjectToPro(projectId);

    return {
      plan,
      project
    };
  }

  isPlanExpired(plan: ProjectPlan) {
    const periodToUnit: Record<ProjectPlanPeriod, dayjs.ManipulateType> = {
      [ProjectPlanPeriod.monthly]: 'month',
      [ProjectPlanPeriod.yearly]: 'year'
    };

    const expired = dayjs(plan.createdAt).add(plan.periodCount, periodToUnit[plan.period]);
    return expired.isBefore(dayjs());
  }
}

export const planHelper = new PlanHelper();
