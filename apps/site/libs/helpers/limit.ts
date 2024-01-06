import { getAIChatRatelimit } from '@/libs/utils/rate-limit';
import { projectService } from '../services';
import { statsHelper } from './stats';

class LimitHelper {
  async checkAIChatLimit(projectId: string) {
    const project = await projectService.getProject(projectId);
    const limiter = getAIChatRatelimit(project?.plan!, project?.aiChatLimit);

    return limiter.limit(projectId);
  }

  async checkAIChatLimitByIp(ip: string) {
    const limiter = getAIChatRatelimit('IP', 10);

    return limiter.limit(ip);
  }

  async checkProjectSizeLimit(projectId: string) {
    const stats = await statsHelper.getProjectStatistics(projectId);

    return {
      success: stats.projectFileSize.total > stats.projectFileSize.used,
      limit: stats.projectFileSize.total,
      remaining: Math.max(stats.projectFileSize.total - stats.projectFileSize.used, 0)
    };
  }
}

export const limitHelper = new LimitHelper();
