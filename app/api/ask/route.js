/* The AI assistant. Needs ANTHROPIC_API_KEY set in Vercel. Optional ANTHROPIC_MODEL overrides the model.
   POST { messages: [{ role: 'user' | 'assistant', content: string }] } -> { text } */

const MODELS = [process.env.ANTHROPIC_MODEL, 'claude-haiku-5-5', 'claude-haiku-4-5'].filter(Boolean);
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
    body: JSON.stringify(body)
  });
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'not configured' }, { status: 501 });
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
