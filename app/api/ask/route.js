/* The AI assistant. Uses Google Gemini when GEMINI_API_KEY is set in Vercel (free tier from aistudio.google.com),
   otherwise Anthropic when ANTHROPIC_API_KEY is set. Optional GEMINI_MODEL / ANTHROPIC_MODEL override the model.
   POST { messages: [{ role: 'user' | 'assistant', content: string }] } -> { text } */

const MODELS = [process.env.ANTHROPIC_MODEL, 'claude-haiku-5-5', 'claude-haiku-4-5'].filter(Boolean);
const GEMINI_MODELS = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite'].filter(Boolean);
export const maxDuration = 60;
const hits = new Map(); // simple per-IP limit: 30 questions an hour per server instance

function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 3600e3);
  list.push(now);
  hits.set(ip, list);
  return list.length > 30;
}

function system() {
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  return `You are the assistant inside Fault Lines, a globe that explains world conflicts, politics and economics. Today is ${today}.
The reader is a curious, smart non-specialist in Canada. Explain plainly and concretely.
Format: 2 to 4 short paragraphs or a few "- " bullet lines, under 220 words total. Use **bold** sparingly for key terms. No headings.
When asked to explain something, cover: what it is, why it matters, and the knock-on effects on other countries, markets or people, and what to watch next.
Be neutral and factual. Attribute contested claims. If you're not sure something is still current, say so briefly. Quote prices in Canadian dollars where it helps, with US dollars alongside.`;
}

async function call(model, messages, withSearch) {
  const body = { model, max_tokens: 900, system: system(), messages };
  if (withSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }];
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(40000)
  });
}

/* Gemini: tries Google Search grounding first (for current events), then without it, across models.
   Every call has a time limit so a slow or stuck request can't hang the assistant. */
async function askGemini(messages, attempts = []) {
  const until = Date.now() + 50000;
  let last = { error: 'The assistant couldn’t answer right now. Try again in a moment.', status: 502 };
  for (const model of GEMINI_MODELS) {
    for (const search of [true, false]) {
      const left = until - Date.now();
      if (left < 4000) return last;
      const a = { model, search };
      attempts.push(a);
      try {
        const body = {
          systemInstruction: { parts: [{ text: system() }] },
          contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          generationConfig: { maxOutputTokens: 2048, temperature: 0.4 }
        };
        if (search) body.tools = [{ google_search: {} }];
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(Math.min(search ? 22000 : 28000, left))
        });
        a.status = r.status;
        if (!r.ok) {
          const msg = JSON.stringify(await r.json().catch(() => ({})));
          a.msg = msg.slice(0, 200);
          if (/api[ _]?key/i.test(msg) && (r.status === 400 || r.status === 403)) return { error: 'The Gemini API key isn’t valid. Check GEMINI_API_KEY in Vercel.', status: 502 };
          if (r.status === 429) last = { error: 'The free AI quota is used up for now. Try again in a minute.', status: 429 };
          if (search) continue; // try the same model without search
          continue; // next model
        }
        const d = await r.json();
        const text = (d?.candidates?.[0]?.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join('').trim();
        a.ok = !!text;
        if (text) return { text };
      } catch (e) { a.err = e.name; }
    }
  }
  return last;
}

/* GET /api/ask?diag=1 : checks the setup without exposing any key. */
export async function GET(req) {
  if (new URL(req.url).searchParams.get('diag') !== '1') return Response.json({ ok: true });
  const out = { gemini: !!process.env.GEMINI_API_KEY, anthropic: !!process.env.ANTHROPIC_API_KEY, models: GEMINI_MODELS };
  if (out.gemini) {
    try {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }, signal: AbortSignal.timeout(10000) });
      const j = await r.json();
      out.listStatus = r.status;
      out.available = (j.models || []).map(m => m.name.replace('models/', '')).filter(n => /flash/.test(n));
    } catch (e) { out.listErr = e.name; }
    const t0 = Date.now(), attempts = [];
    const g = await askGemini([{ role: 'user', content: 'Reply with just OK.' }], attempts);
    out.test = { ms: Date.now() - t0, ok: !!g.text, error: g.error, attempts };
  }
  return Response.json(out);
}

export async function POST(req) {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'not configured' }, { status: 501 });
  const ip = (req.headers.get('x-forwarded-for') || 'anon').split(',')[0].trim();
  if (limited(ip)) return Response.json({ error: 'That’s a lot of questions. Take a short break and try again later.' }, { status: 429 });
  let messages;
  try {
    const j = await req.json();
    messages = (j.messages || []).slice(-10)
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  } catch (e) { return Response.json({ error: 'Bad request.' }, { status: 400 }); }
  if (!messages.length || messages[messages.length - 1].role !== 'user') return Response.json({ error: 'Ask a question first.' }, { status: 400 });

  if (process.env.GEMINI_API_KEY) {
    const g = await askGemini(messages);
    return g.text ? Response.json({ text: g.text }) : Response.json({ error: g.error }, { status: g.status || 502 });
  }

  for (const model of MODELS) {
    for (const search of [true, false]) {
      try {
        const r = await call(model, messages, search);
        if (r.status === 404 || (r.status === 400 && !search)) break; // unknown model: try the next one
        if (r.status === 400 && search) continue; // web search not enabled: retry without it
        if (!r.ok) return Response.json({ error: r.status === 429 ? 'The assistant is busy. Try again in a minute.' : 'The assistant hit an error. Try again shortly.' }, { status: 502 });
        const d = await r.json();
        const text = (d.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
        if (text) return Response.json({ text });
      } catch (e) { /* try next option */ }
    }
  }
  return Response.json({ error: 'The assistant couldn’t answer right now.' }, { status: 502 });
}
