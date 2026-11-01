/* Live country data, cached for a day:
   - World Bank history: population, fertility, aging, GDP, growth, inflation, jobs, reserves
   - IMF World Economic Outlook forecasts: growth, inflation, government debt, current account, unemployment, GDP
   - Wikidata profile: head of state and government (with start dates), party, system, capital, currency, memberships
   GET /api/country?iso=CHN */

const WB_IND = {
  pop: 'SP.POP.TOTL', popg: 'SP.POP.GROW', fert: 'SP.DYN.TFRT.IN', old: 'SP.POP.65UP.TO.ZS',
  gdp: 'NY.GDP.MKTP.CD', gdpg: 'NY.GDP.MKTP.KD.ZG', gdppc: 'NY.GDP.PCAP.CD', infl: 'FP.CPI.TOTL.ZG', unemp: 'SL.UEM.TOTL.ZS',
  res: 'FI.RES.TOTL.CD'
};
const IMF_IND = { growth: 'NGDP_RPCH', infl: 'PCPIPCH', debt: 'GGXWDG_NGDP', ca: 'BCA_NGDPD', unemp: 'LUR', gdp: 'NGDPD' };
const WB_ALIAS = { KOS: 'XKX' };
const IMF_ALIAS = { KOS: 'UVK', PSE: 'WBG' };
const UA = 'FaultLines/1.0 (https://vercel.com; educational globe)';
const DAY = { next: { revalidate: 86400 } };

async function worldBank(code) {
  const year = new Date().getFullYear();
  const series = {};
  await Promise.all(Object.entries(WB_IND).map(async ([k, id]) => {
    try {
      const r = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${id}?format=json&date=1995:${year}&per_page=100`, DAY);
      const j = await r.json();
      const rows = Array.isArray(j) && Array.isArray(j[1]) ? j[1] : [];
      series[k] = rows.map(d => [Number(d.date), d.value == null ? null : Number(d.value)]).filter(d => isFinite(d[0])).sort((a, b) => a[0] - b[0]);
    } catch (e) { series[k] = []; }
  }));
  return Object.values(series).some(s => s.some(d => d[1] != null)) ? series : null;
}

async function imf(code) {
  const out = {};
  await Promise.all(Object.entries(IMF_IND).map(async ([k, id]) => {
    try {
      const r = await fetch(`https://www.imf.org/external/datamapper/api/v1/${id}/${code}`, { ...DAY, headers: { 'User-Agent': UA, Accept: 'application/json' } });
      const j = await r.json();
      const v = j && j.values && j.values[id] && j.values[id][code];
      if (v) out[k] = v;
    } catch (e) { /* skip */ }
  }));
  return Object.keys(out).length ? out : null;
}

function latest(packed) {
  // packed: "Name~2019-05-20T00:00:00Z~Party|Name2~..." -> pick the entry with the newest start date
  if (!packed) return null;
  const rows = packed.split('|').filter(Boolean).map(s => { const [n, d, p] = s.split('~'); return { n, d: d || '', p: p || '' }; });
  rows.sort((a, b) => (b.d || '').localeCompare(a.d || ''));
  return rows[0] || null;
}

async function wikidata(iso) {
  const q = `SELECT
  (GROUP_CONCAT(DISTINCT CONCAT(?hosL, "~", COALESCE(STR(?hosS), "")); separator="|") AS ?hos)
  (GROUP_CONCAT(DISTINCT CONCAT(?hogL, "~", COALESCE(STR(?hogS), ""), "~", COALESCE(?partyL, "")); separator="|") AS ?hog)
  (GROUP_CONCAT(DISTINCT ?govL; separator="|") AS ?gov)
  (SAMPLE(?capL) AS ?capital) (SAMPLE(?curL) AS ?currency)
  (GROUP_CONCAT(DISTINCT ?orgL; separator="|") AS ?orgs)
WHERE {
  ?c wdt:P298 "${iso}" . FILTER NOT EXISTS { ?c wdt:P576 ?dissolved }
  OPTIONAL { ?c p:P35 ?s1 . ?s1 ps:P35 ?hosI . FILTER NOT EXISTS { ?s1 pq:P582 ?e1 } OPTIONAL { ?s1 pq:P580 ?hosS }
    ?hosI rdfs:label ?hosL . FILTER(LANG(?hosL) = "en") }
  OPTIONAL { ?c p:P6 ?s2 . ?s2 ps:P6 ?hogI . FILTER NOT EXISTS { ?s2 pq:P582 ?e2 } OPTIONAL { ?s2 pq:P580 ?hogS }
    ?hogI rdfs:label ?hogL . FILTER(LANG(?hogL) = "en")
    OPTIONAL { ?hogI p:P102 ?ps . ?ps ps:P102 ?pI . FILTER NOT EXISTS { ?ps pq:P582 ?e3 } ?pI rdfs:label ?partyL . FILTER(LANG(?partyL) = "en") } }
  OPTIONAL { ?c wdt:P122 ?gI . ?gI rdfs:label ?govL . FILTER(LANG(?govL) = "en") }
  OPTIONAL { ?c wdt:P36 ?capI . ?capI rdfs:label ?capL . FILTER(LANG(?capL) = "en") }
  OPTIONAL { ?c wdt:P38 ?curI . ?curI rdfs:label ?curL . FILTER(LANG(?curL) = "en") }
  OPTIONAL { ?c wdt:P463 ?oI . ?oI rdfs:label ?orgL . FILTER(LANG(?orgL) = "en") }
}`;
  try {
    const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), {
      ...DAY, headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }
    });
    const j = await r.json();
    const b = j.results && j.results.bindings && j.results.bindings[0];
    if (!b) return null;
    const v = k => (b[k] && b[k].value) || '';
    const hos = latest(v('hos')), hog = latest(v('hog'));
    const out = {
      hos: hos && hos.n, hosSince: hos && hos.d,
      hog: hog && hog.n, hogSince: hog && hog.d, party: hog && hog.p,
      gov: v('gov'), capital: v('capital'), currency: v('currency'),
      orgs: v('orgs') ? v('orgs').split('|') : []
    };
    return out.hos || out.hog || out.capital ? out : null;
  } catch (e) { return null; }
}

export async function GET(req) {
  const iso = (new URL(req.url).searchParams.get('iso') || '').toUpperCase();
  if (!/^[A-Z]{3}$/.test(iso)) return Response.json({ error: 'Bad iso' }, { status: 400 });
  const [series, imfData, wd] = await Promise.all([
    worldBank(WB_ALIAS[iso] || iso), imf(IMF_ALIAS[iso] || iso), wikidata(iso === 'KOS' ? 'XKX' : iso)
  ]);
  return Response.json({ iso, series, imf: imfData, wd }, { headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' } });
}
