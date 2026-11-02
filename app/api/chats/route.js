/* Cross-device chat sync. Chats are stored in Upstash Redis (shared with the owner's capstone project's free database,
   so every key starts with 'faultlines:'), under a key
   derived from the person's sync code. No accounts: whoever has the code can read and write those chats.
   GET  ?code=XXXX            -> { chats, deleted, at }
   PUT  { code, chats, deleted } -> merges with what's stored, returns the merged copy */
import { createHash } from 'node:crypto';

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const MAX_BYTES = 900 * 1024;
const hits = new Map();

function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 600e3);
  list.push(now); hits.set(ip, list);
  return list.length > 120;
}
const keyOf = code => 'faultlines:chats:' + createHash('sha256').update('fault-lines:' + code.toUpperCase().replace(/[^A-Z0-9]/g, '')).digest('hex');
const validCode = c => typeof c === 'string' && c.replace(/[^A-Za-z0-9]/g, '').length >= 10 && c.length <= 40;

async function redis(cmd) {
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd), signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).result;
}
async function load(code) {
  const raw = await redis(['GET', keyOf(code)]);
  try { const j = JSON.parse(raw || '{}'); return { chats: j.chats || [], deleted: j.deleted || {}, at: j.at || 0 }; } catch (e) { return { chats: [], deleted: {}, at: 0 }; }
}
function clean(chats) {
  return (Array.isArray(chats) ? chats : []).filter(c => c && typeof c.id === 'string' && Array.isArray(c.msgs)).slice(0, 200).map(c => ({
    id: c.id.slice(0, 20), title: String(c.title || '').slice(0, 120), at: Number(c.at) || 0,
    msgs: c.msgs.slice(-40).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 8000), ...(m.shown ? { shown: String(m.shown).slice(0, 300) } : {}) }))
  }));
}
/* union by id (newest wins); a deletion beats any copy that isn't newer than it */
function merge(a, b) {
  const deleted = { ...a.deleted };
  Object.entries(b.deleted || {}).forEach(([id, t]) => { deleted[id] = Math.max(deleted[id] || 0, Number(t) || 0); });
  const byId = new Map();
  [...a.chats, ...b.chats].forEach(c => { const o = byId.get(c.id); if (!o || c.at > o.at || (c.at === o.at && c.msgs.length > o.msgs.length)) byId.set(c.id, c); });
  const chats = [...byId.values()].filter(c => !(deleted[c.id] >= c.at)).sort((x, y) => y.at - x.at).slice(0, 200);
  Object.keys(deleted).forEach(id => { if (Date.now() - deleted[id] > 90 * 864e5) delete deleted[id]; });
  return { chats, deleted };
}

const off = () => Response.json({ error: 'Sync isn’t set up yet. Add Upstash Redis in Vercel → Storage.' }, { status: 501 });

export async function GET(req) {
  if (!URL_ || !TOKEN) return off();
  const code = new URL(req.url).searchParams.get('code');
  if (!validCode(code)) return Response.json({ error: 'That sync code doesn’t look right.' }, { status: 400 });
  if (limited((req.headers.get('x-forwarded-for') || 'anon').split(',')[0])) return Response.json({ error: 'Too many requests.' }, { status: 429 });
  try { return Response.json(await load(code)); } catch (e) { return Response.json({ error: 'Sync is unavailable right now.' }, { status: 502 }); }
}

export async function PUT(req) {
  if (!URL_ || !TOKEN) return off();
  if (limited((req.headers.get('x-forwarded-for') || 'anon').split(',')[0])) return Response.json({ error: 'Too many requests.' }, { status: 429 });
  let j;
  try { j = await req.json(); } catch (e) { return Response.json({ error: 'Bad request.' }, { status: 400 }); }
  if (!validCode(j.code)) return Response.json({ error: 'That sync code doesn’t look right.' }, { status: 400 });
  try {
    const stored = await load(j.code);
    const m = merge(stored, { chats: clean(j.chats), deleted: j.deleted && typeof j.deleted === 'object' ? j.deleted : {} });
    let out = { ...m, at: Date.now() }, s = JSON.stringify(out);
    while (s.length > MAX_BYTES && out.chats.length > 1) { out.chats = out.chats.slice(0, -5); s = JSON.stringify(out); }
    await redis(['SET', keyOf(j.code), s]);
    return Response.json(out);
  } catch (e) { return Response.json({ error: 'Sync is unavailable right now.' }, { status: 502 }); }
}
