import { getAIChatRatelimit } from '@/libs/utils/rate-limit';
import { projectService } from '../services';

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
}

export const limitHelper = new LimitHelper();
