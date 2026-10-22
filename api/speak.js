// POST /api/speak — turns one sentence of Krishna's counsel into a neural, male Indian voice.
// Provider order (first one configured wins):
//   1. ElevenLabs   ELEVENLABS_API_KEY (+ ELEVENLABS_VOICE_ID)   most lifelike; supports a custom-designed voice
//   2. Azure Speech AZURE_SPEECH_KEY + AZURE_SPEECH_REGION        en-IN-PrabhatNeural / hi-IN-MadhurNeural / te-IN-MohanNeural
//   3. Amazon Polly (the AWS keys already in use)                  English only (no Indian male voice exists for hi/te)
// With none available the page falls back to the browser's own speech.
import { SECURITY_HEADERS, clientIp, rateLimit, sameOrigin } from '../lib/guard.js';

export const config = { maxDuration: 30 };

const env = (k, d) => process.env[k] || d;
const LANGS = new Set(['en', 'hi', 'te']);
const MAX = 520;

const json = (status, code, extra = {}) =>
  new Response(JSON.stringify({ error: code }), { status, headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS, ...extra } });

export const provider = () =>
  process.env.ELEVENLABS_API_KEY ? 'elevenlabs'
  : process.env.AZURE_SPEECH_KEY ? 'azure'
  : process.env.AWS_ACCESS_KEY_ID && process.env.POLLY_ENABLED !== '0' ? 'polly'
  : null;

const xml = (t) => t.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
const audio = (body, type = 'audio/mpeg') =>
  new Response(body, { headers: { 'Content-Type': type, 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });

async function elevenlabs(text, lang) {
  const voice = env('ELEVENLABS_VOICE_ID', 'pNInz6obpgDQGcFmaJgB'); // set your own designed Krishna voice id
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream?output_format=mp3_44100_96`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: env('ELEVENLABS_MODEL', 'eleven_multilingual_v2'),
      language_code: lang === 'en' ? undefined : lang,
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 0.9 },
    }),
  });
  if (!r.ok) throw new Error('elevenlabs ' + r.status);
  return audio(r.body);
}

const AZ_VOICE = { en: 'en-IN-PrabhatNeural', hi: 'hi-IN-MadhurNeural', te: 'te-IN-MohanNeural' };
async function azure(text, lang) {
  const region = env('AZURE_SPEECH_REGION', 'centralindia');
  const voice = env('AZURE_VOICE_' + lang.toUpperCase(), AZ_VOICE[lang]);
  const loc = voice.split('-').slice(0, 2).join('-');
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${loc}"><voice name="${voice}"><prosody rate="-14%" pitch="-7%">${xml(text)}</prosody></voice></speak>`;
  const r = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3', 'User-Agent': 'gitopadesh' },
    body: ssml,
  });
  if (!r.ok) throw new Error('azure ' + r.status);
  return audio(r.body);
}

let polly;
async function pollyTts(text, lang) {
  if (lang !== 'en') return null; // Polly has no male Indian voice for Hindi or Telugu
  const { PollyClient, SynthesizeSpeechCommand } = await import('@aws-sdk/client-polly');
  polly ??= new PollyClient({ region: env('POLLY_REGION', env('AWS_REGION', 'ap-south-1')) });
  const r = await polly.send(new SynthesizeSpeechCommand({
    Engine: 'neural', VoiceId: env('POLLY_VOICE', 'Matthew'), OutputFormat: 'mp3', TextType: 'ssml',
    Text: `<speak><prosody rate="82%">${xml(text)}</prosody></speak>`,
  }));
  const bytes = await r.AudioStream.transformToByteArray();
  return audio(bytes);
}

export async function POST(req) {
  if (process.env.ASK_DISABLED === '1') return json(503, 'paused');
  if (!sameOrigin(req)) return json(403, 'forbidden');
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json(415, 'bad_type');
  if (+(req.headers.get('content-length') || 0) > 4000) return json(413, 'too_large');
  const which = provider();
  if (!which) return json(501, 'no_voice');

  const limited = await rateLimit(clientIp(req), 'tts');
  if (limited) return json(limited.status, limited.code, limited.retryAfter ? { 'Retry-After': String(limited.retryAfter) } : {});

  let body;
  try { body = await req.json(); } catch { return json(400, 'bad_request'); }
  const text = typeof body?.text === 'string' ? body.text.replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const lang = LANGS.has(body?.lang) ? body.lang : 'en';
  if (!text || text.length > MAX) return json(400, 'bad_text');

  try {
    const res = which === 'elevenlabs' ? await elevenlabs(text, lang) : which === 'azure' ? await azure(text, lang) : await pollyTts(text, lang);
    return res || json(501, 'no_voice');
  } catch (e) {
    console.error('tts_error', which, e.name, e.message?.slice(0, 80)); // never logs the user's text
    return json(502, 'voice_failed');
  }
}

export const GET = () => json(405, 'method_not_allowed', { Allow: 'POST' });
