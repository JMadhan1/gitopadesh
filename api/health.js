// GET /api/health — tells the page which capabilities are configured. Reveals nothing else.
import { provider } from './speak.js';

export function GET() {
  const live = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) && process.env.ASK_DISABLED !== '1';
  const p = process.env.ASK_DISABLED === '1' ? null : provider();
  // "hi"/"te" availability depends on the provider: Polly speaks English only.
  const tts = p ? { en: true, hi: p !== 'polly', te: p !== 'polly', deep: p === 'polly' } : false;
  return new Response(JSON.stringify({ llm: live, tts, stt: !!process.env.AZURE_SPEECH_KEY && process.env.ASK_DISABLED !== '1' }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', 'X-Content-Type-Options': 'nosniff' },
  });
}
