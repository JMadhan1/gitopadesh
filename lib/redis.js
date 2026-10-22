// One shared Upstash Redis handle. Vercel's integration names the variables <PREFIX>_REST_API_URL / _TOKEN
// (the prefix is chosen at install time: KV, STORAGE, UPSTASH_REDIS...), so any such pair is accepted.
import { Redis } from '@upstash/redis';

const env = process.env;
const pick = (re) => {
  const k = Object.keys(env).find((n) => re.test(n) && !/READ_ONLY/.test(n) && env[n]);
  return k ? env[k] : undefined;
};
export const REDIS_URL = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || pick(/(^|_)REST_API_URL$|REDIS_REST_URL$/);
export const REDIS_TOKEN = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || pick(/(^|_)REST_API_TOKEN$|REDIS_REST_TOKEN$/);
export const redis = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;
