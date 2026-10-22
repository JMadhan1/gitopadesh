// POST /api/teach — {id:"2.47", lang:"en"|"hi"|"te"} streams a layered lesson on one shloka.
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { streamText } from '../lib/bedrock.js';
import { redis } from '../lib/redis.js';
import { readFileSync } from 'node:fs';
import { LANG } from '../lib/prompt.js';
import { TEACH_SYSTEM } from '../lib/teachprompt.js';
import { SECURITY_HEADERS, clientIp, rateLimit, sameOrigin } from '../lib/guard.js';

export const config = { maxDuration: 60 };

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'ap-south-1', maxAttempts: 2 });
let inflight = 0;
const MAX_INFLIGHT = +(process.env.MAX_INFLIGHT || 120);
const memCache = new Map();           // per-instance lesson cache; Redis (when connected) shares it across all instances
const TTL = 60 * 86400;
const complete = (t) => typeof t === 'string' && t.includes('##REMEMBER') && t.length > 400;
const ID = /^(?:[1-9]|1[0-8])\.\d{1,2}$/;

let INDEX;
const verseIndex = () => (INDEX ??= JSON.parse(readFileSync(new URL('../lib/verse-index.json', import.meta.url), 'utf8')));

const json = (status, code, extra = {}) =>
  new Response(JSON.stringify({ error: code }), { status, headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS, ...extra } });

export async function POST(req) {
  if (process.env.ASK_DISABLED === '1') return json(503, 'paused');
  if (!sameOrigin(req)) return json(403, 'forbidden');
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json(415, 'bad_type');
  if (+(req.headers.get('content-length') || 0) > 2_000) return json(413, 'too_large');

  let body;
  try { body = await req.json(); } catch { return json(400, 'bad_request'); }
  const id = typeof body?.id === 'string' ? body.id : '';
  const lang = ['en', 'hi', 'te'].includes(body?.lang) ? body.lang : 'en';
  const v = ID.test(id) ? verseIndex()[id] : null; // the verse text always comes from our own data, never from the client
  if (!v) return json(400, 'bad_verse');

  // a lesson for a verse is the same for everyone: serve it from cache instantly and without metering
  const key = `gp:lesson:v1:${id}:${lang}`;
  let hit = memCache.get(key);
  if (!hit && redis) { try { hit = await redis.get(key); } catch {} }
  if (complete(hit)) {
    memCache.set(key, hit);
    return new Response(hit, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'hit', ...SECURITY_HEADERS } });
  }

  if (inflight >= MAX_INFLIGHT) return json(503, 'busy', { 'Retry-After': '5' });
  const limited = await rateLimit(clientIp(req), 'ask');
  if (limited) return json(limited.status, limited.code, limited.retryAfter ? { 'Retry-After': String(limited.retryAfter) } : {});

  const user = `Chapter ${id.split('.')[0]}, Verse ${id.split('.')[1]} of the Bhagavad Gita.\n\nSHLOKA (Sanskrit):\n${v.s}\n\nTRANSLITERATION:\n${v.t}\n\nTRANSLATION:\n${v.m}\n\nWORD MEANINGS:\n${String(v.w || '').slice(0, 1500)}`;

  const base = {
    system: [{ text: TEACH_SYSTEM.replace('{lang}', LANG[lang]) }],
    messages: [{ role: 'user', content: [{ text: user }] }],
    inferenceConfig: { maxTokens: +(process.env.TEACH_MAX_TOKENS || 1500), temperature: 0.7 },
  };
  const enc = new TextEncoder();
  inflight++;
  const stream = new ReadableStream({
    async start(ctrl) {
      let full = '';
      try {
        for await (const t of streamText(client, base, req.signal)) { full += t; ctrl.enqueue(enc.encode(t)); }
        if (complete(full)) {
          memCache.set(key, full);
          if (memCache.size > 300) memCache.delete(memCache.keys().next().value);
          if (redis) { try { await redis.set(key, full, { ex: TTL }); } catch {} }
        }
      } catch (e) {
        console.error('teach_error', e.name);
        ctrl.enqueue(enc.encode('\n\u0000ERR'));
      } finally {
        inflight--;
        try { ctrl.close(); } catch {}
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Accel-Buffering': 'no', ...SECURITY_HEADERS } });
}

export const GET = () => json(405, 'method_not_allowed', { Allow: 'POST' });
