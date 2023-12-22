import type { NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { PLANS_AI_LIMIT } from '@/common';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
  limit: number;
};

export const limitFree = rateLimit({
  interval: 1000 * 60 * 60 * 24,
  limit: PLANS_AI_LIMIT.Free
});

export const limitPro = rateLimit({
  interval: 1000 * 60 * 60 * 24,
  limit: PLANS_AI_LIMIT.Pro
});

export function rateLimit({ uniqueTokenPerInterval, interval, limit }: Options) {
  const store = new LRUCache({
    max: uniqueTokenPerInterval || 500,
    ttl: interval || 60000
  });

  const increase = (token: string) => {
    const current = (store.get(token) as number[]) || [0];

    if (current[0] === 0) {
      store.set(token, current);
    }

    current[0] += 1;

    return current[0];
  };

  return {
    async check(token: string) {
      const usage = increase(token);
      const isRateLimited = usage >= limit;

      return {
        limit,
        success: !isRateLimited,
        remaining: isRateLimited ? 0 : limit - usage
      };
    },

    setHeader(res: NextApiResponse) {}
  };
}
