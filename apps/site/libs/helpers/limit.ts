import { PLANS_AI_LIMIT } from '@/common';
import { rateLimit } from '@/libs/utils/rate-limit';

const limitFree = rateLimit({
  interval: 1000 * 60 * 60 * 24,
  limit: PLANS_AI_LIMIT.Free
});

class LimitHelper {
  checkAIChatLimit(projectId: string) {}

  checkAIChatLimitByIp(ip: string) {
    return limitFree.check(ip);
  }
}

export const limitHelper = new LimitHelper();
