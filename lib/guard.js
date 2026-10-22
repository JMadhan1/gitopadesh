// Abuse protection for a public, cost-bearing endpoint.
// Rate limits use Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (shared across all
// serverless instances). Without it they fall back to per-instance memory (best effort only).
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const env = (k, d) => process.env[k] ?? d;
export const LIMITS = {
  perMinute: +env('RL_PER_MINUTE', 5),
  perDay: +env('RL_PER_DAY', 40),
  globalPerDay: +env('RL_GLOBAL_PER_DAY', 1500), // hard budget ceiling for the whole site
  maxText: 1500,
  maxHistory: 10,
  maxHistoryText: 2500,
  maxTotal: 9000,
};

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
// Separate budgets per endpoint: speech is cheap per call but called once per sentence.
const BUDGETS = {
  ask: { m: LIMITS.perMinute, d: LIMITS.perDay, g: LIMITS.globalPerDay },
  tts: { m: +env('TTS_PER_MINUTE', 40), d: +env('TTS_PER_DAY', 400), g: +env('TTS_GLOBAL_PER_DAY', 12000) },
  stt: { m: +env('STT_PER_MINUTE', 8), d: +env('STT_PER_DAY', 80), g: +env('STT_GLOBAL_PER_DAY', 3000) },
};
const rls = {};
if (hasRedis) {
  const redis = Redis.fromEnv();
  for (const [k, b] of Object.entries(BUDGETS)) {
    rls[k] = {
      minute: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(b.m, '1 m'), prefix: `gp:${k}:m` }),
      day: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(b.d, '1 d'), prefix: `gp:${k}:d` }),
      global: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(b.g, '1 d'), prefix: `gp:${k}:g` }),
    };
  }
}

const mem = new Map();
function memHit(key, limit, windowMs) {
  const now = Date.now();
  const arr = (mem.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) { mem.set(key, arr); return false; }
  arr.push(now); mem.set(key, arr);
  if (mem.size > 5000) for (const k of mem.keys()) { mem.delete(k); if (mem.size < 2500) break; }
  return true;
}

export function clientIp(req) {
  const h = req.headers;
  return (h.get('x-vercel-forwarded-for') || h.get('x-real-ip') || (h.get('x-forwarded-for') || '').split(',')[0] || 'unknown').trim();
}

/** @returns {Promise<null | {status:number, retryAfter?:number, code:string}>} */
export async function rateLimit(ip, kind = 'ask') {
  const B = BUDGETS[kind];
  if (hasRedis) {
    try {
      const r = rls[kind];
      const g = await r.global.limit('all');
      if (!g.success) return { status: 503, code: 'busy' };
      const [m, d] = await Promise.all([r.minute.limit(ip), r.day.limit(ip)]);
      if (!m.success) return { status: 429, code: 'slow_down', retryAfter: Math.ceil((m.reset - Date.now()) / 1000) };
      if (!d.success) return { status: 429, code: 'daily_limit', retryAfter: Math.ceil((d.reset - Date.now()) / 1000) };
      return null;
    } catch (e) {
      console.error('ratelimit_backend_error', e.name); // fail closed: never run unmetered on a Redis outage
      return { status: 503, code: 'busy' };
    }
  }
  if (!memHit(kind + ':g', B.g, 864e5)) return { status: 503, code: 'busy' };
  if (!memHit(kind + ':m:' + ip, B.m, 6e4)) return { status: 429, code: 'slow_down', retryAfter: 30 };
  if (!memHit(kind + ':d:' + ip, B.d, 864e5)) return { status: 429, code: 'daily_limit', retryAfter: 3600 };
  return null;
}

/** Only our own pages may call the API (blocks other sites and casual scripts from using our budget). */
export function sameOrigin(req) {
  const host = req.headers.get('host');
  const origin = req.headers.get('origin');
  const site = req.headers.get('sec-fetch-site');
  if (site && !['same-origin', 'none'].includes(site)) return false;
  if (origin) {
    try {
      const o = new URL(origin);
      const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
      return o.host === host || extra.includes(o.origin);
    } catch { return false; }
  }
  return false; // browsers always send Origin on POST fetch
}

const LANGS = new Set(['en', 'hi', 'te']);
const MOODS = new Set(['grief', 'fear', 'anger', 'work', 'confusion', 'desire', 'mind', 'peace', 'general']);
const ID = /^(?:[1-9]|1[0-8])\.\d{1,2}$/;

/** Strict validation; returns {error} or a clean object. Never trusts client candidate text. */
export function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'bad_request' };
  const text = typeof body.text === 'string' ? body.text.replace(/\u0000/g, '').trim() : '';
  if (!text || text.length > LIMITS.maxText) return { error: 'bad_text' };
  const lang = LANGS.has(body.lang) ? body.lang : 'en';
  const history = [];
  let total = text.length;
  if (body.history !== undefined && !Array.isArray(body.history)) return { error: 'bad_request' };
  for (const h of (body.history || []).slice(-LIMITS.maxHistory)) {
    if (!h || typeof h.text !== 'string') return { error: 'bad_request' };
    const role = h.role === 'assistant' ? 'assistant' : 'user';
    const t = h.text.replace(/\u0000/g, '').slice(0, LIMITS.maxHistoryText);
    total += t.length;
    if (t) history.push({ role, text: t });
  }
  if (total > LIMITS.maxTotal) return { error: 'too_long' };
  const ids = Array.isArray(body.candidates)
    ? [...new Set(body.candidates.map((c) => (c && typeof c.id === 'string' ? c.id : '')).filter((i) => ID.test(i)))].slice(0, 5)
    : [];
  const mood = MOODS.has(body.mood) ? body.mood : '';
  return { text, lang, history, ids, mood };
}

export const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};
