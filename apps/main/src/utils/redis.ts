import { Redis } from '@upstash/redis'

import { env } from 'env/server.mjs';

export default function initRedis() {
  return new Redis({
    url: env.REDIS_REST_URL,
    token: env.REDIS_REST_TOKEN,
  });
}

export enum REDIS_KEYS {
  WIDGET_INFO = 'widget_info',
}
