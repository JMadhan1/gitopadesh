// GET /api/health — tells the page which capabilities are configured. Reveals nothing else.
import { provider } from './speak.js';

export function GET() {
  const live = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) && process.env.ASK_DISABLED !== '1';
  const p = process.env.ASK_DISABLED === '1' ? null : provider();
  // Polly covers English and Hindi (no Telugu: the page uses the device voice for it); every other provider covers all three.
  const tts = p ? { en: true, hi: true, te: p !== 'polly', deep: false } : false;
  return new Response(JSON.stringify({ llm: live, tts, stt: !!process.env.AZURE_SPEECH_KEY && process.env.ASK_DISABLED !== '1' }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', 'X-Content-Type-Options': 'nosniff' },
  });
}
