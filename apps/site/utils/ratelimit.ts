import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

const ratelimit = {
  free: new Ratelimit({
    redis,
    analytics: true,
    prefix: 'ratelimit:ai:free',
    limiter: Ratelimit.slidingWindow(20, '1 d')
  }),
  paid: new Ratelimit({
    redis,
    analytics: true,
    prefix: 'ratelimit:ai:paid',
    limiter: Ratelimit.slidingWindow(1000, '1 d')
  })
};

export function limitPaid(userId: string) {
  return ratelimit.paid.limit(userId);
}

export function limitFree(ip: string) {
  return ratelimit.free.limit(ip);
}
