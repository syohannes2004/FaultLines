/* Fault Lines live updater. Runs in GitHub Actions every hour (see .github/workflows/update.yml).
   1. Pulls fresh headlines per country from Google News RSS, keeping only trusted outlets (lib/sources.js).
   2. Groups headlines about the same event; an event needs at least 2 different outlets.
   3. A free GitHub Models AI writes one neutral, dated bullet per event (or skips minor ones).
      If the AI is unavailable, the event's headline is used as the bullet instead.
   4. Every 6 hours, GDELT conflict/unrest coverage is compared with each country's normal level.
      A big spike that major outlets confirm raises the country's map colour by one step for 72 hours.
   Results go to public/updates.json, which the site reads. Nothing here rewrites the main briefings;
   the weekly Claude refresh folds updates into data/content.js. */

import fs from 'node:fs/promises';
import { isTrusted } from '../lib/sources.js';
import { B, BRIEF } from '../data/content.js';

const OUT = new URL('../public/updates.json', import.meta.url);
const GEO = new URL('../data/countries.json', import.meta.url);
const NOW = Date.now();
const H = 3600e3;
// Optional AI summaries: any OpenAI-compatible API, set as repo secrets AI_URL, AI_KEY, AI_MODEL.
// (GitHub Models, the original free option, was retired in July 2026.) Without them, headlines are used.
const AI_URL = process.env.AI_URL, TOKEN = process.env.AI_KEY, MODEL = process.env.AI_MODEL;
// wire services first: their headlines are the most neutral
const PREFER = ['reuters', 'apnews', 'bbc', 'afp', 'aljazeera', 'cbc', 'theguardian', 'ft.com', 'bloomberg', 'npr'];
const rank = it => { const k = PREFER.findIndex(p => (it.host || '').includes(p)); return k < 0 ? 99 : k; };
const UA = 'Mozilla/5.0 (compatible; FaultLinesUpdater/1.0; +https://github.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T0 = Date.now(), mins = () => (Date.now() - T0) / 60000;
const NEWS_BUDGET = 9, TOTAL_BUDGET = 17; // minutes; the job is killed at 30
const log = (...a) => console.log(`[${mins().toFixed(1)}m]`, ...a);
const rss = { ok: 0, empty: 0, http: {}, err: 0 };
let gdeltWait = 8000;

const NAMES = {
  USA: 'United States', COD: 'Democratic Republic of Congo', COG: 'Republic of Congo', TZA: 'Tanzania', CAF: 'Central African Republic',
  SRB: 'Serbia', BIH: 'Bosnia', DOM: 'Dominican Republic', ARE: 'United Arab Emirates', SWZ: 'Eswatini', MKD: 'North Macedonia',
  TLS: 'Timor-Leste', BHS: 'Bahamas', GNQ: 'Equatorial Guinea', CIV: 'Ivory Coast', FLK: 'Falkland Islands', TTO: 'Trinidad and Tobago',
  SLB: 'Solomon Islands', ESH: 'Western Sahara', PNG: 'Papua New Guinea', PSE: 'Gaza OR Palestinian', GBR: 'United Kingdom OR Britain',
  KOR: 'South Korea', PRK: 'North Korea', CZE: 'Czech', SOL: 'Somaliland', CYN: 'Northern Cyprus', NCL: 'New Caledonia', GRL: 'Greenland'
};
const SKIP = new Set(['ATA', 'ATF', 'FLK', 'CYN']);
const MAJOR = new Set(['USA', 'CHN', 'RUS', 'JPN', 'DEU', 'IND', 'GBR', 'FRA', 'ITA', 'CAN', 'BRA', 'KOR', 'AUS', 'MEX', 'IDN', 'SAU', 'TUR', 'ARG', 'ZAF', 'IRN', 'NGA', 'EGY', 'ESP', 'POL', 'UKR', 'ISR', 'ARE', 'TWN', 'PAK', 'VEN']);
const NOISE = /\b(football|soccer|cricket|nba|nfl|nhl|tennis|golf|olympic|world cup qualifier|match|goal|striker|coach|celebrity|actor|actress|singer|album|movie|film|box office|recipe|horoscope|lottery|weather forecast)\b/i;
const STOP = new Set('the a an and or of to in on for with at by from as is are was were be been has have had it its this that after over into amid about new says said say will would could may might more than not but who what when where why how up out off his her their our your us they he she we you'.split(' '));

const staticLevel = iso => (B[iso] ? B[iso].lv : (BRIEF[iso] && BRIEF[iso].lv) || 0);

/* ---------- RSS ---------- */
function decode(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).trim();
}
function pick(block, tag) { const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)); return m ? decode(m[1]) : ''; }
function parseRss(xml) {
  const out = [];
  for (const raw of xml.split(/<item[\s>]/).slice(1)) {
    const block = raw.split('</item>')[0];
    let title = pick(block, 'title');
    const link = pick(block, 'link'), ts = Date.parse(pick(block, 'pubDate'));
    const m = block.match(/<source[^>]*url="([^"]+)"[^>]*>([\s\S]*?)<\/source>/);
    const source = m ? decode(m[2]) : '';
    let host = ''; try { host = m ? new URL(m[1]).hostname : ''; } catch (e) { /* none */ }
    if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
    if (title && link && isFinite(ts)) out.push({ title, url: link, source, host, ts });
  }
  return out;
}
async function headlines(iso, name) {
  const q = name.includes(' OR ') ? `(${name}) when:1d` : `"${name}" when:1d`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
      if (!r.ok) { rss.http[r.status] = (rss.http[r.status] || 0) + 1; if (r.status === 429 || r.status >= 500) { await sleep(3000); continue; } return []; }
      const all = parseRss(await r.text());
      all.length ? rss.ok++ : rss.empty++;
      return all.filter(it => isTrusted(it.host) && NOW - it.ts < 36 * H && !NOISE.test(it.title));
    } catch (e) { rss.err++; await sleep(1000); }
  }
  return [];
}

/* ---------- grouping headlines into events ---------- */
function tokens(title, name) {
  const skip = new Set(name.toLowerCase().split(/\W+/));
  return new Set(title.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w) && !skip.has(w)));
}
function overlap(a, b) { let n = 0; a.forEach(w => { if (b.has(w)) n++; }); return n / Math.max(1, Math.min(a.size, b.size)); }
function clusters(items, name) {
  const groups = [];
  items.forEach(it => {
    it.tok = tokens(it.title, name);
    const g = groups.find(g => overlap(g.tok, it.tok) >= 0.5 || [...it.tok].filter(w => g.tok.has(w)).length >= 3);
    if (g) { g.items.push(it); it.tok.forEach(w => g.tok.add(w)); } else groups.push({ items: [it], tok: new Set(it.tok) });
  });
  return groups.map(g => {
    const outlets = [...new Map(g.items.map(i => [i.source, i])).values()];
    return { items: g.items, outlets, key: [...g.tok].sort().slice(0, 8).join(' ') };
  }).filter(g => g.outlets.length >= 2).sort((a, b) => b.outlets.length - a.outlets.length);
}

/* ---------- free AI (GitHub Models) ---------- */
async function writeBullets(events) {
  if (!AI_URL || !TOKEN || !MODEL || !events.length) return null;
  const list = events.map((e, k) => ({ id: k, country: e.name, headlines: e.outlets.slice(0, 6).map(i => `${i.title} (${i.source})`) }));
  const sys = 'You write updates for a geopolitics and world-economy website. For each event you get headlines from several news outlets about one country. ' +
    'Return JSON: {"items":[{"id":number,"keep":boolean,"text":string}]}. keep=true only for events that matter for politics, conflict, security, diplomacy, ' +
    'elections, the economy, markets, trade, energy or major disasters. Skip sport, entertainment, crime stories of local interest and duplicates. ' +
    'text: one neutral, factual sentence under 35 words, plain English, past tense, stating only what the headlines agree on. No speculation, no opinions, ' +
    'no numbers that are not in the headlines, and attribute claims ("Israel said", "the UN reported").';
  try {
    const r = await fetch(AI_URL, {
      method: 'POST', signal: AbortSignal.timeout(90000),
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, temperature: 0.2, response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: sys }, { role: 'user', content: JSON.stringify(list) }] })
    });
    const raw = await r.text();
    if (!r.ok) { status.model = `AI unavailable (${r.status})`; log('AI', r.status, raw.slice(0, 300)); return null; }
    let j;
    try { j = JSON.parse(raw); } catch (e) { log('AI odd reply', r.status, JSON.stringify(raw.slice(0, 200))); throw e; }
    let txt = j.choices[0].message.content.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
    const parsed = JSON.parse(txt);
    status.model = MODEL;
    return parsed.items || [];
  } catch (e) { status.model = 'AI error: ' + e.message; return null; }
}

/* ---------- GDELT spike detection ---------- */
async function gdelt(name) {
  const q = `${name.includes(' OR ') ? '(' + name + ')' : '"' + name + '"'} (theme:ARMEDCONFLICT OR theme:TERROR OR theme:PROTEST OR theme:KILL)`;
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=timelinevolraw&timespan=8d&format=json`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) { log('GDELT', name, 'HTTP', r.status); if (r.status === 429) gdeltWait = Math.min(gdeltWait * 2, 30000); return null; }
    const j = await r.json();
    const data = (j.timeline && j.timeline[0] && j.timeline[0].data) || [];
    const byDay = {};
    data.forEach(d => { const day = String(d.date).slice(0, 8); byDay[day] = (byDay[day] || 0) + Number(d.value || 0); });
    const days = Object.keys(byDay).sort();
    if (days.length < 4) return null;
    const last = byDay[days[days.length - 1]] + byDay[days[days.length - 2]];
    const prev = days.slice(0, -2).map(d => byDay[d]);
    const base = prev.reduce((a, b) => a + b, 0) / prev.length * 2;
    return { last, base, ratio: base > 0 ? last / base : 0 };
  } catch (e) { log('GDELT', name, e.name); return null; }
}

/* ---------- main ---------- */
const status = { at: new Date(NOW).toISOString(), countries: 0, events: 0, added: 0, model: 'headlines (no AI set)', gdelt: 'skipped' };

async function main() {
  let state = { news: {}, auto: {}, feed: [], seen: {}, gdeltAt: 0, gdelt: {} };
  try { state = { ...state, ...JSON.parse(await fs.readFile(OUT, 'utf8')) }; } catch (e) { /* first run */ }
  const core = s => JSON.stringify([s.news, s.auto, s.feed, s.seen, s.gdeltAt]);
  const before = core(state);
  const geo = JSON.parse(await fs.readFile(GEO, 'utf8'));
  const all = geo.features.map(f => f.properties).filter(p => !SKIP.has(p.iso)).map(p => ({ iso: p.iso, name: NAMES[p.iso] || p.n }));

  // hot countries every run; the rest in 3 rotating groups
  const slot = Math.floor(NOW / H) % 3;
  const hot = all.filter(c => MAJOR.has(c.iso) || staticLevel(c.iso) >= 1 || (state.auto[c.iso]));
  const rest = all.filter(c => !hot.includes(c)).filter((c, k) => k % 3 === slot);
  const batch = hot.concat(rest);
  status.countries = batch.length;

  const events = [];
  log(`Checking news for ${batch.length} countries`);
  for (let k = 0; k < batch.length; k += 3) {
    if (mins() > NEWS_BUDGET) { log('News time budget reached at', k); break; }
    if (k === 15 && rss.ok + rss.empty === 0) { log('Google News is not answering, skipping news this run', JSON.stringify(rss)); break; }
    const part = batch.slice(k, k + 3);
    const res = await Promise.all(part.map(c => headlines(c.iso, c.name)));
    part.forEach((c, n) => {
      const seen = new Set(state.seen[c.iso] || []);
      clusters(res[n], c.name).slice(0, 3).forEach(g => {
        if (seen.has(g.key) || g.items.some(i => seen.has(i.url))) return;
        events.push({ ...g, iso: c.iso, name: c.name.split(' OR ')[0] });
      });
    });
    await sleep(400);
  }
  status.events = events.length;
  status.rss = rss;
  log('News done', JSON.stringify(rss), 'events', events.length);

  // the AI handles up to 30 events per run (free-tier friendly); the rest wait for the next run
  const todo = events.slice(0, 30);
  const ai = await writeBullets(todo);
  log('AI', status.model);
  todo.forEach((e, k) => {
    const v = ai ? ai.find(x => x.id === k) : null;
    let text = null, isAi = false;
    if (ai && v) { if (v.keep && v.text) { text = v.text.trim(); isAi = true; } }
    else if (!ai && e.outlets.length >= 3) text = [...e.outlets].sort((a, b) => rank(a) - rank(b))[0].title;
    if (!text && !ai) return; // without AI, a 2-outlet story waits until a third outlet confirms it
    const seen = state.seen[e.iso] || (state.seen[e.iso] = []);
    seen.push(e.key, ...e.items.map(i => i.url));
    state.seen[e.iso] = seen.slice(-120);
    if (!text) return;
    const id = (NOW.toString(36) + k).slice(-9);
    const item = { id, at: Math.max(...e.items.map(i => i.ts)), text, ai: isAi, src: [...e.outlets].sort((a, b) => rank(a) - rank(b)).slice(0, 4).map(i => [i.source, i.url]) };
    (state.news[e.iso] || (state.news[e.iso] = [])).unshift(item);
    state.feed.unshift({ iso: e.iso, id });
    status.added++;
  });

  // keep 14 days, max 10 per country, 60 in the global feed
  Object.keys(state.news).forEach(iso => {
    state.news[iso] = state.news[iso].filter(n => NOW - n.at < 14 * 24 * H).slice(0, 10);
    if (!state.news[iso].length) delete state.news[iso];
  });
  state.feed = state.feed.filter(f => state.news[f.iso] && state.news[f.iso].some(n => n.id === f.id)).slice(0, 60);

  // GDELT is slow and rate-limits shared GitHub IPs, so each run checks 12 watched countries in rotation
  {
    const n0 = Math.ceil(hot.length / 12), part = hot.filter((c, k) => k % n0 === Math.floor(NOW / H) % n0);
    let n = 0, fails = 0;
    for (const c of part) {
      if (mins() > TOTAL_BUDGET || fails >= 3) break;
      const g = await gdelt(c.name);
      if (g) { state.gdelt[c.iso] = { r: Math.round(g.ratio * 100) / 100, n: g.last, at: NOW }; n++; fails = 0; } else fails++;
      await sleep(gdeltWait);
    }
    if (n) state.gdeltAt = NOW;
    status.gdelt = `checked ${n} of ${part.length} countries${fails >= 3 ? ' (GDELT busy, retry next run)' : ''}`;
    log('GDELT', status.gdelt);
  }
  // raise a level only when coverage spikes AND major outlets confirmed news in the last 48 h
  all.forEach(c => {
    const g = state.gdelt[c.iso], base = staticLevel(c.iso);
    if (g && g.at && NOW - g.at > 12 * H) return;
    const confirmed = (state.news[c.iso] || []).some(n => NOW - n.at < 48 * H);
    if (g && g.r >= 2.5 && g.n >= 60 && confirmed && base < 3) {
      state.auto[c.iso] = { lv: base + 1, from: base, at: NOW, until: NOW + 72 * H,
        reason: `Coverage of conflict and unrest is ${g.r.toFixed(1)}× its usual level, and major outlets are reporting new developments.` };
    }
  });
  Object.keys(state.auto).forEach(iso => { if (state.auto[iso].until < NOW) delete state.auto[iso]; });

  if (core(state) === before && state.at) { console.log('No changes', JSON.stringify(status)); return; }
  state.at = NOW;
  state.status = status;
  await fs.mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(state));
  console.log(JSON.stringify(status));
}

main().catch(e => { console.error(e); process.exit(1); });
