// POST /api/transcribe?lang=en|hi|te — body: 16 kHz mono PCM WAV (max ~45 s). Used only by browsers
// without built-in speech recognition (Firefox, some in-app browsers). Needs AZURE_SPEECH_KEY.
import { SECURITY_HEADERS, clientIp, rateLimit, sameOrigin } from '../lib/guard.js';

export const config = { maxDuration: 30 };

const LOC = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
const MAX_BYTES = 1_700_000;

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS, ...extra } });

export async function POST(req) {
  if (process.env.ASK_DISABLED === '1') return json(503, { error: 'paused' });
  if (!sameOrigin(req)) return json(403, { error: 'forbidden' });
  if (!process.env.AZURE_SPEECH_KEY) return json(501, { error: 'no_stt' });
  if (!(req.headers.get('content-type') || '').startsWith('audio/wav')) return json(415, { error: 'bad_type' });
  if (+(req.headers.get('content-length') || 0) > MAX_BYTES) return json(413, { error: 'too_large' });

  const limited = await rateLimit(clientIp(req), 'stt');
  if (limited) return json(limited.status, { error: limited.code }, limited.retryAfter ? { 'Retry-After': String(limited.retryAfter) } : {});

  const lang = LOC[new URL(req.url).searchParams.get('lang')] || 'en-IN';
  const audio = new Uint8Array(await req.arrayBuffer());
  if (audio.length < 2000 || audio.length > MAX_BYTES) return json(400, { error: 'bad_audio' });
  if (String.fromCharCode(...audio.slice(0, 4)) !== 'RIFF') return json(400, { error: 'bad_audio' });

  const region = process.env.AZURE_SPEECH_REGION || 'centralindia';
  try {
    const r = await fetch(`https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${lang}&format=simple&profanity=raw`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000', Accept: 'application/json' },
      body: audio,
    });
    if (!r.ok) throw new Error('azure ' + r.status);
    const j = await r.json();
    return json(200, { text: j.RecognitionStatus === 'Success' ? String(j.DisplayText || '').slice(0, 1500) : '' });
  } catch (e) {
    console.error('stt_error', e.name, String(e.message).slice(0, 60)); // audio and transcript are never logged
    return json(502, { error: 'stt_failed' });
  }
}

export const GET = () => json(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
