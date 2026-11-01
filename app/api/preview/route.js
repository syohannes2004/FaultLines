import { isTrusted } from '../../../lib/sources';

/* Returns the publisher's own summary (og:description) for an article on a trusted outlet.
   GET /api/preview?url=https://www.reuters.com/... */
function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).trim();
}
function meta(html, key) {
  const a = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'));
  if (a) return decode(a[1]);
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`, 'i'));
  return b ? decode(b[1]) : '';
}
export async function GET(req) {
  const raw = new URL(req.url).searchParams.get('url') || '';
  let u;
  try { u = new URL(raw); } catch (e) { return Response.json({ desc: '' }, { status: 400 }); }
  if (u.protocol !== 'https:' || !isTrusted(u.hostname)) return Response.json({ desc: '' }, { status: 400 });
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(u.toString(), {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', Accept: 'text/html' },
      next: { revalidate: 86400 }
    });
    clearTimeout(timer);
    const html = (await r.text()).slice(0, 400000);
    const desc = meta(html, 'og:description') || meta(html, 'twitter:description') || meta(html, 'description');
    return Response.json({ desc: desc.slice(0, 600) }, { headers: { 'Cache-Control': 's-maxage=86400' } });
  } catch (e) {
    return Response.json({ desc: '' });
  }
}
