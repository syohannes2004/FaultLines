import { isTrusted } from '../../../lib/sources';

/* Live headlines from major outlets, gathered from Google News and Bing News RSS (Bing adds summaries).
   GET /api/news?q="Ethiopia"   -> country or keyword search (last 2 days, widened to 7 if thin)
   GET /api/news?topic=WORLD    -> WORLD | BUSINESS | TECHNOLOGY | NATION
   Add &fresh=1 to skip the 10-minute cache (the Refresh button). */

const TOPICS = new Set(['WORLD', 'BUSINESS', 'TECHNOLOGY', 'NATION', 'SCIENCE']);
const UA = 'Mozilla/5.0 (compatible; FaultLines/1.0; +https://vercel.com)';

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}
function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : '';
}

export function parseRss(xml) {
  const out = [];
  const parts = xml.split(/<item[\s>]/).slice(1);
  for (const raw of parts) {
    const block = raw.split('</item>')[0];
    let title = pick(block, 'title');
    const link = pick(block, 'link');
    const date = Date.parse(pick(block, 'pubDate'));
    const srcM = block.match(/<source[^>]*url="([^"]+)"[^>]*>([\s\S]*?)<\/source>/);
    const sourceName = srcM ? decode(srcM[2]) : '';
    let host = '';
    try { host = srcM ? new URL(srcM[1]).hostname : ''; } catch (e) { host = ''; }
    if (sourceName && title.endsWith(' - ' + sourceName)) title = title.slice(0, -(sourceName.length + 3));
    if (!title || !link || !isFinite(date)) continue;
    out.push({ title, url: link, source: sourceName || host, host, ts: date });
  }
  return out;
}

export function clean(items, limit) {
  const seen = new Set();
  return items
    .filter(it => isTrusted(it.host))
    .sort((a, b) => b.ts - a.ts)
    .filter(it => {
      const key = it.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 70);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(it => ({ ...it, sum: it.sum || '', direct: !!it.direct }))
    .slice(0, limit)
    .map(({ host, ...rest }) => rest);
}

async function getText(url, fresh) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
    ...(fresh ? { cache: 'no-store' } : { next: { revalidate: 600 } })
  });
  if (!r.ok) throw new Error('feed ' + r.status);
  return r.text();
}
async function getFeed(url, fresh) { return parseRss(await getText(url, fresh)); }

/* Bing News RSS gives direct article links and a short summary for each story. */
export function parseBing(xml) {
  const out = [];
  for (const raw of xml.split(/<item[\s>]/).slice(1)) {
    const block = raw.split('</item>')[0];
    const title = pick(block, 'title');
    let link = pick(block, 'link');
    const date = Date.parse(pick(block, 'pubDate'));
    const sum = pick(block, 'description').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const source = pick(block, 'News:Source');
    try { const u = new URL(link); const real = u.searchParams.get('url'); if (real) link = real; } catch (e) { /* keep link */ }
    let host = '';
    try { host = new URL(link).hostname; } catch (e) { continue; }
    if (!title || !isFinite(date)) continue;
    out.push({ title, url: link, source: source || host.replace(/^www\./, ''), host, ts: date, sum, direct: true });
  }
  return out;
}
async function getBing(q, fresh) {
  try {
    return parseBing(await getText(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&mkt=en-US&qft=sortbydate%3d%221%22`, fresh));
  } catch (e) { return []; }
}
const BING_TOPIC = { WORLD: 'world news', BUSINESS: 'economy markets', TECHNOLOGY: 'technology artificial intelligence', NATION: 'US politics', SCIENCE: 'science' };
async function merged(googleUrl, bingQ, fresh, limit) {
  const [g, b] = await Promise.all([getFeed(googleUrl, fresh).catch(() => []), getBing(bingQ, fresh)]);
  if (!g.length && !b.length) throw new Error('no feeds');
  return clean(b.concat(g), limit);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fresh = searchParams.get('fresh') === '1';
  const topic = (searchParams.get('topic') || '').toUpperCase();
  const q = (searchParams.get('q') || '').slice(0, 120).trim();
  try {
    let items;
    if (TOPICS.has(topic)) {
      items = await merged(`${base}/headlines/section/topic/${topic}?${loc}`, BING_TOPIC[topic], fresh, 15);
    } else if (q) {
      items = await merged(`${base}/search?q=${encodeURIComponent(q + ' when:2d')}&${loc}`, q, fresh, 12);
      if (items.length < 4) {
        const wider = clean(await getFeed(`${base}/search?q=${encodeURIComponent(q + ' when:7d')}&${loc}`, fresh).catch(() => []), 12);
        if (wider.length > items.length) items = clean(items.concat(wider), 12);
      }
    } else {
      return Response.json({ error: 'Pass q or topic.' }, { status: 400 });
    }
    return Response.json({ items, fetchedAt: Date.now() }, {
      headers: { 'Cache-Control': fresh ? 'no-store' : 's-maxage=600, stale-while-revalidate=1800' }
    });
  } catch (e) {
    return Response.json({ items: [], error: 'News source unavailable.' }, { status: 502 });
  }
}
