// POST /api/visit — anonymous visitor counters: {id} -> {total, live}.
// total = unique browsers ever (HyperLogLog, ~1% error); live = browsers that pinged in the last 150 seconds.
// Only a random id generated in the visitor's browser is stored. No IP address, cookie, account or personal detail.
import { redis } from '../lib/redis.js';
import { SECURITY_HEADERS, clientIp, rateLimit, sameOrigin } from '../lib/guard.js';

export const config = { maxDuration: 10 };

const MEMORY = process.env.VISIT_MEMORY === '1'; // local testing only
const mem = { uv: new Set(), live: new Map() };
const ID = /^[A-Za-z0-9_-]{16,32}$/;
const WINDOW = 150_000;

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS, ...extra } });

export async function POST(req) {
  if (process.env.ASK_DISABLED === '1' || (!redis && !MEMORY)) return json(200, { off: true });
  if (!sameOrigin(req)) return json(403, { error: 'forbidden' });
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json(415, { error: 'bad_type' });
  if (+(req.headers.get('content-length') || 0) > 400) return json(413, { error: 'too_large' });

  const limited = await rateLimit(clientIp(req), 'vis');
  if (limited) return json(limited.status, { error: limited.code }, limited.retryAfter ? { 'Retry-After': String(limited.retryAfter) } : {});

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'bad_request' }); }
  const id = typeof body?.id === 'string' && ID.test(body.id) ? body.id : null;
  if (!id) return json(400, { error: 'bad_id' });
  const now = Date.now();

  try {
    if (redis) {
      const p = redis.pipeline();
      p.pfadd('gp:uv:v2', id);                 // idempotent: every browser that is online is also in the total
      p.zadd('gp:live:v2', { score: now, member: id });
      p.zremrangebyscore('gp:live:v2', 0, now - WINDOW);
      p.zcard('gp:live:v2');
      p.pfcount('gp:uv:v2');
      const r = await p.exec();
      return json(200, { live: Number(r[r.length - 2]) || 1, total: Number(r[r.length - 1]) || 0 });
    }
    mem.uv.add(id);
    mem.live.set(id, now);
    for (const [k, t] of mem.live) if (now - t > WINDOW) mem.live.delete(k);
    return json(200, { live: mem.live.size, total: mem.uv.size });
  } catch (e) {
    console.error('visit_error', e.name);
    return json(200, { off: true });
  }
}

export const GET = () => json(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
