// Resilient streaming from Amazon Bedrock: if the primary model is throttled, errors, or stays silent,
// the same request goes to a fallback model before a single word has been sent to the visitor.
import { ConverseStreamCommand } from '@aws-sdk/client-bedrock-runtime';

export function modelChain() {
  const primary = process.env.BEDROCK_MODEL_ID || 'global.anthropic.claude-opus-4-6-v1';
  const fallback = process.env.FALLBACK_MODEL_ID || 'global.anthropic.claude-sonnet-4-5-20250929-v1:0';
  return primary === fallback ? [primary] : [primary, fallback];
}

/** Yields text chunks. Throws only if every model failed before output, or if a reply breaks part-way. */
export async function* streamText(client, base, reqSignal) {
  const models = modelChain();
  let lastErr;
  for (let i = 0; i < models.length; i++) {
    const ac = new AbortController();
    const forward = () => ac.abort(reqSignal.reason);
    reqSignal?.addEventListener('abort', forward);
    let got = false;
    const timer = setTimeout(() => { if (!got) ac.abort(new Error('ttfb_timeout')); }, +(process.env.TTFB_MS || (i === 0 ? 15000 : 25000)));
    try {
      // test hooks (never set in production)
      if (process.env.TEST_FAIL_PRIMARY === '1' && i === 0) throw Object.assign(new Error('simulated'), { name: 'ThrottlingException' });
      if (process.env.TEST_SLOW_PRIMARY === '1' && i === 0) {
        await new Promise((res, rej) => { ac.signal.addEventListener('abort', () => rej(Object.assign(new Error('slow'), { name: 'AbortError' }))); setTimeout(res, 120000); });
      }
      const resp = await client.send(new ConverseStreamCommand({ ...base, modelId: models[i] }), { abortSignal: ac.signal });
      for await (const ev of resp.stream) {
        const t = ev.contentBlockDelta?.delta?.text;
        if (t) {
          if (!got) { got = true; clearTimeout(timer); }
          yield t;
        }
      }
      clearTimeout(timer);
      if (!got) throw Object.assign(new Error('empty'), { name: 'EmptyReply' });
      return;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (reqSignal?.aborted) throw e;   // the visitor left
      if (got) throw e;                  // cannot switch models mid-reply
      console.error('bedrock_fallback', models[i], e.name);
    } finally {
      reqSignal?.removeEventListener('abort', forward);
    }
  }
  throw lastErr;
}
