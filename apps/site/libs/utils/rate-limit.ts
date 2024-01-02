import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { ProjectPlanItem } from '@prisma/client';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

const limiterCache = new Map<string, Ratelimit>();

export const getAIChatRatelimit = (prefix: ProjectPlanItem | 'IP', limit: number = 20) => {
  const key = prefix + limit;

  if (!limiterCache.has(key)) {
    const limiter = new Ratelimit({
      redis,
      analytics: true,
      prefix: `marktion_ratelimit_ai_chat_${prefix}`,
      limiter: Ratelimit.slidingWindow(limit, '1 d')
    });

    limiterCache.set(key, limiter);
  }

  return limiterCache.get(key)!;
};
