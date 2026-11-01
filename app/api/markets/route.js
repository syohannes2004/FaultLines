/* Live market snapshot: currency reference rates (ECB via Frankfurter), gold and bitcoin.
   GET /api/markets, add ?fresh=1 to skip the 15-minute cache. Each source fails on its own. */

const UA = 'Mozilla/5.0 (compatible; FaultLines/1.0)';

async function getJson(url, fresh) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, ...(fresh ? { cache: 'no-store' } : { next: { revalidate: 900 } }) });
  if (!r.ok) throw new Error(url + ' ' + r.status);
  return r.json();
}
function isoDay(d) { return d.toISOString().slice(0, 10); }

export async function GET(req) {
  const fresh = new URL(req.url).searchParams.get('fresh') === '1';
  const out = { fx: [], gold: null, btc: null, asOf: null, fetchedAt: Date.now() };
  let usdcad = null;

  try {
    const start = isoDay(new Date(Date.now() - 12 * 864e5));
    const fx = await getJson(`https://api.frankfurter.dev/v1/${start}..?base=USD&symbols=CAD,EUR,CNY,JPY,GBP`, fresh);
    const days = Object.keys(fx.rates || {}).sort();
    if (days.length) {
      const last = fx.rates[days[days.length - 1]], prev = days.length > 1 ? fx.rates[days[days.length - 2]] : null;
      const pct = (a, b) => (a != null && b != null && b !== 0 ? ((a - b) / b) * 100 : null);
      const inv = v => (v ? 1 / v : null);
      usdcad = last.CAD;
      out.asOf = days[days.length - 1];
      out.fx = [
        { pair: 'USD/CAD', value: last.CAD, dp: 4, chg: pct(last.CAD, prev && prev.CAD), note: 'Canadian dollars per US dollar' },
        { pair: 'EUR/USD', value: inv(last.EUR), dp: 4, chg: pct(inv(last.EUR), prev && inv(prev.EUR)), note: 'US dollars per euro' },
        { pair: 'GBP/USD', value: inv(last.GBP), dp: 4, chg: pct(inv(last.GBP), prev && inv(prev.GBP)), note: 'US dollars per pound' },
        { pair: 'USD/CNY', value: last.CNY, dp: 4, chg: pct(last.CNY, prev && prev.CNY), note: 'Chinese yuan per US dollar' },
        { pair: 'USD/JPY', value: last.JPY, dp: 2, chg: pct(last.JPY, prev && prev.JPY), note: 'Japanese yen per US dollar' }
      ].filter(r => r.value != null);
    }
  } catch (e) { /* currency rates unavailable */ }

  try {
    const g = await getJson('https://api.gold-api.com/price/XAU', fresh);
    const usd = Number(g.price);
    if (isFinite(usd) && usd > 0) out.gold = { usd, cad: usdcad ? usd * usdcad : null };
  } catch (e) { /* gold unavailable */ }

  try {
    const b = await getJson('https://api.coinbase.com/v2/prices/BTC-USD/spot', fresh);
    const usd = Number(b && b.data && b.data.amount);
    if (isFinite(usd) && usd > 0) out.btc = { usd, cad: usdcad ? usd * usdcad : null };
  } catch (e) { /* bitcoin unavailable */ }

  return Response.json(out, { headers: { 'Cache-Control': fresh ? 'no-store' : 's-maxage=900, stale-while-revalidate=1800' } });
}
