/* World Bank history for one country: population, growth, fertility, aging, GDP, inflation, jobs.
   GET /api/country?iso=CHN  (cached for a day) */
const IND = {
  pop: 'SP.POP.TOTL', popg: 'SP.POP.GROW', fert: 'SP.DYN.TFRT.IN', old: 'SP.POP.65UP.TO.ZS',
  gdp: 'NY.GDP.MKTP.CD', gdpg: 'NY.GDP.MKTP.KD.ZG', gdppc: 'NY.GDP.PCAP.CD', infl: 'FP.CPI.TOTL.ZG', unemp: 'SL.UEM.TOTL.ZS'
};
const ALIAS = { KOS: 'XKX' };
export async function GET(req) {
  const iso = (new URL(req.url).searchParams.get('iso') || '').toUpperCase();
  if (!/^[A-Z]{3}$/.test(iso)) return Response.json({ error: 'Bad iso' }, { status: 400 });
  const code = ALIAS[iso] || iso;
  const year = new Date().getFullYear();
  const series = {};
  await Promise.all(Object.entries(IND).map(async ([k, id]) => {
    try {
      const r = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${id}?format=json&date=1995:${year}&per_page=100`, { next: { revalidate: 86400 } });
      const j = await r.json();
      const rows = Array.isArray(j) && Array.isArray(j[1]) ? j[1] : [];
      series[k] = rows.map(d => [Number(d.date), d.value == null ? null : Number(d.value)]).filter(d => isFinite(d[0])).sort((a, b) => a[0] - b[0]);
    } catch (e) { series[k] = []; }
  }));
  const any = Object.values(series).some(s => s.some(d => d[1] != null));
  return Response.json({ iso, series: any ? series : null }, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' } });
}
