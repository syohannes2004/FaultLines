import Globe from 'globe.gl';
import { UPDATED, LEVELS, LINK_TYPES, DETAIL, B, LINKS, HOTS, PLACES, WATERS, PULSE_THEMES, PULSE, LEADERS, PULSE_LINKS, ECON_TYPES, BRIEF } from '../data/content';

/* Mounts the whole interactive globe. Called once from components/GlobeApp.jsx after the markup exists. */
export function start(geo) {
/* ================= HELPERS ================= */
const FEAT = geo.features;
const byIso = {};
FEAT.forEach(f => { byIso[f.properties.iso] = f; });
const SHORT = {
  USA: 'United States', COD: 'DR Congo', COG: 'Congo', TZA: 'Tanzania', CAF: 'Central African Rep.',
  SRB: 'Serbia', BIH: 'Bosnia & Herz.', DOM: 'Dominican Rep.', ARE: 'UAE', SWZ: 'Eswatini',
  MKD: 'North Macedonia', TLS: 'Timor-Leste', BHS: 'Bahamas', GNQ: 'Eq. Guinea', CIV: 'Côte d’Ivoire',
  FLK: 'Falklands', TTO: 'Trinidad & Tobago', SLB: 'Solomon Is.', ESH: 'W. Sahara', PNG: 'Papua New Guinea'
};
const nameOf = iso => (B[iso] && B[iso].name) || SHORT[iso] || (byIso[iso] ? byIso[iso].properties.n : iso);
/* SVG flags from the flag-icons package (works on every OS, unlike emoji flags). */
function flagOf(iso) {
  const a2 = byIso[iso] && byIso[iso].properties.a2;
  if (!a2 || a2.length !== 2) return '';
  return `<span class="fi fi-${a2.toLowerCase()}"></span>`;
}
const fname = iso => { const f = flagOf(iso); return (f ? f + ' ' : '') + nameOf(iso); };

function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgba(h, a) { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; }
function mix(h1, h2, t) { const a = hexRgb(h1), b = hexRgb(h2); return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
function mixRgba(h1, h2, t, al) { const [r, g, b] = mix(h1, h2, t); return `rgba(${r},${g},${b},${al})`; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function fmtPop(p) {
  if (!p) return 'n/a';
  if (p >= 1e9) return (p / 1e9).toFixed(2) + ' B';
  if (p >= 1e6) return (p / 1e6).toFixed(1) + ' M';
  return Math.round(p / 1e3) + ' K';
}
function fmtGdp(m) {
  if (!m) return 'n/a';
  if (m >= 1e6) return 'US$' + (m / 1e6).toFixed(2) + ' T';
  if (m >= 1e3) return 'US$' + Math.round(m / 1e3) + ' B';
  return 'US$' + Math.round(m) + ' M';
}
const metricT = {
  gdp: p => clamp((Math.log10(p.gdp || 1) - Math.log10(800)) / (Math.log10(2e7) - Math.log10(800)), 0, 1),
  pop: p => clamp((Math.log10(p.pop || 1) - 5) / (Math.log10(1.45e9) - 5), 0, 1)
};
const baseLevel = iso => (B[iso] ? B[iso].lv : (BRIEF[iso] && BRIEF[iso].lv) || 0);
/* live updates from the hourly GitHub job (public/updates.json) */
let LIVE = null;
const autoOf = iso => { const a = LIVE && LIVE.auto && LIVE.auto[iso]; return a && a.until > Date.now() ? a : null; };
const levelOf = iso => { const a = autoOf(iso); return a ? Math.max(a.lv, baseLevel(iso)) : baseLevel(iso); };
function placeByName(iso, n) { const P = PLACES[iso]; return P ? P.list.find(p => p.n === n) : null; }

/* A stable per-country shade (0..1) so neighbours with the same status still look different. */
const shadeOf = {};
FEAT.forEach(f => {
  let h = 0;
  for (const c of f.properties.iso) h = (h * 31 + c.charCodeAt(0)) % 997;
  shadeOf[f.properties.iso] = (h % 100) / 99;
});

const isTouch = window.matchMedia('(hover: none)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => window.innerWidth <= 760;

/* ================= STATE ================= */
const state = { product: location.hash === '#pulse' ? 'pulse' : 'faultlines', pmode: 'stories', ptheme: 'all', mode: 'explore', metric: 'tension', detail: 1, link: null, hovLink: null, sel: null, hov: null, hot: null, place: null, alt: 2.25, focus: null, snap: 'half' };

/* ================= STATIC UI ================= */
const watchEl = document.getElementById('watch');
const dl = document.getElementById('names');
FEAT.filter(f => f.properties.iso !== 'ATA').map(f => nameOf(f.properties.iso)).sort().forEach(n => {
  const o = document.createElement('option'); o.value = n; dl.appendChild(o);
});
const searchEl = document.getElementById('search');
searchEl.addEventListener('change', () => {
  const q = searchEl.value.trim().toLowerCase();
  if (!q) return;
  const f = FEAT.find(f => nameOf(f.properties.iso).toLowerCase() === q)
    || FEAT.find(f => nameOf(f.properties.iso).toLowerCase().startsWith(q))
    || FEAT.find(f => f.properties.n.toLowerCase().includes(q));
  if (f) { select(f.properties.iso); searchEl.value = ''; searchEl.blur(); }
});

function legendHTML() {
  if (state.mode === 'connections') {
    return `<h4>Connections</h4><ul>${Object.values(LINK_TYPES).map(t =>
      `<li><span class="sw-line" style="background:${t.color}"></span>${t.label}</li>`).join('')}</ul>
      <div class="detail hint">Showing ${state.detail === 5 ? 'all ' : ''}${visibleLinks().length} connections. ${isTouch ? 'Tap' : 'Click'} a line to open it.</div>`;
  }
  if (state.mode === 'hotspots') {
    return `<h4>Hotspots</h4><ul>
      <li><span class="sw" style="background:${LEVELS[3].color};border-radius:50%"></span>Active fighting</li>
      <li><span class="sw" style="background:${LEVELS[2].color};border-radius:50%"></span>Flashpoint</li></ul>
      <div class="detail hint">${isTouch ? 'Tap' : 'Click'} a pulsing marker for the briefing.</div>`;
  }
  if (state.metric === 'tension') {
    return `<h4>Tension level</h4><ul>
      <li><span class="sw" style="background:${LEVELS[3].color}"></span>${LEVELS[3].label}</li>
      <li><span class="sw" style="background:${LEVELS[2].color}"></span>${LEVELS[2].label}</li>
      <li><span class="sw" style="background:${LEVELS[1].color}"></span>${LEVELS[1].label}</li>
      <li><span class="sw" style="background:#1d2e43;border:1px solid var(--line-strong)"></span>Not flagged</li></ul>
      <div class="detail foot">Every country has an overview. ${Object.keys(B).length} have full conflict briefings. Zoom in or raise Detail for more names.</div>`;
  }
  const isG = state.metric === 'gdp';
  return `<h4>${isG ? 'GDP' : 'Population'}</h4><div class="ramp"></div>
    <div class="ramp-labels"><span>${isG ? '< $1 B' : '< 100 K'}</span><span>${isG ? '$20 T' : '1.4 B'}</span></div>
    <div class="detail foot">Natural Earth estimates (${isG ? '2016' : '2017'}), log scale. Live figures come next.</div>`;
}
const legendEl = document.getElementById('legend');
function renderLegend() { legendEl.innerHTML = state.product === 'pulse' ? pulseLegendHTML() : legendHTML(); }

/* ================= GLOBE ================= */

/* ---------- country name labels, revealed by zoom ---------- */
const MAJOR = new Set(['ATA','RUS','CHN','BRA','CAN','USA','AUS','IND','ARG','KAZ','COD','DZA','GRL','MEX','SAU','SDN','LBY','IRN','MNG','PER','ZAF','IDN','EGY','NGA','TUR','PAK','UKR','ETH','COL','JPN']);
const SKIP = new Set(['ATF', 'CYN']);
function tierOf(p) {
  if (MAJOR.has(p.iso)) return 1;
  if (p.ar >= 18 || p.pop >= 4e7) return 2;
  if (p.ar >= 4.5 || p.pop >= 1e7) return 3;
  return 4;
}
const LABELS = FEAT.filter(f => !SKIP.has(f.properties.iso)).map(f => {
  const p = f.properties;
  const el = document.createElement('div');
  el.className = 'clabel t' + tierOf(p);
  const fl = p.iso === 'ATA' ? '' : flagOf(p.iso);
  el.innerHTML = (fl ? fl + ' ' : '') + nameOf(p.iso);
  return { kind: 'label', iso: p.iso, lat: p.ly, lng: p.lx, tier: tierOf(p), el };
});
/* Altitude at which each tier appears (lower altitude = more zoomed in). */
/* The Detail setting stretches these limits so more names appear at the same zoom; level 5 shows everything. */
const DETAIL_MULT = [0, 1, 1.3, 1.7, 2.4, 99];
function tierLimit(t) {
  const k = (isPhone() ? 0.78 : 1) * DETAIL_MULT[state.detail];
  return [0, 99, 1.95 * k, 1.3 * k, 0.8 * k][t];
}
function waterLimit(t) {
  const k = (isPhone() ? 0.78 : 1) * DETAIL_MULT[state.detail];
  return [0, 99, 2.5 * k, 1.6 * k, 1.0 * k][t];
}
const WATER_ITEMS = WATERS.map(w => {
  const el = document.createElement('div');
  el.className = 'wlabel w' + w.t + (w.key ? ' key' : '');
  el.textContent = w.n;
  return { kind: 'water', lat: w.lat, lng: w.lng, t: w.t, n: w.n, el };
});

/* ---------- conflict places for the selected country ---------- */
function placeEl(pl, idx) {
  const el = document.createElement('div');
  el.className = 'place';
  el.style.setProperty('--pc', LEVELS[pl.lv] ? LEVELS[pl.lv].color : '#8fd0ff');
  el.innerHTML = `<button type="button" class="pin" aria-label="${pl.n}"></button><div class="ptxt"><span class="pname">${pl.n}</span><span class="pnote">${pl.d}</span></div>`;
  el.addEventListener('click', e => {
    e.stopPropagation();
    const open = !el.classList.contains('open');
    document.querySelectorAll('.place.open').forEach(x => x.classList.remove('open'));
    if (open) el.classList.add('open');
  });
  return { kind: 'place', idx, lat: pl.lat, lng: pl.lng, el };
}
let PLACE_ITEMS = [];
let CUR_PLACES = [];
function buildPlaces(list) {
  CUR_PLACES = list || [];
  PLACE_ITEMS = CUR_PLACES.map((pl, i) => placeEl(pl, i));
}
const HOT_ITEMS = HOTS.map(h => {
  const el = document.createElement('div');
  el.className = 'hlabel';
  el.style.setProperty('--pc', LEVELS[h.lv].color);
  el.textContent = h.name;
  return { kind: 'hot', lat: h.lat, lng: h.lng, el, iso: h.iso };
});

let lastKey = '';
function updateHtml(force) {
  const alt = state.alt;
  const fl = state.product === 'faultlines';
  const showHot = fl && state.mode === 'hotspots';
  const focusIsos = new Set(state.link ? [state.link.a, state.link.b] : (state.sel ? [state.sel] : []));
  const labels = LABELS.filter(l => focusIsos.has(l.iso) || alt < tierLimit(l.tier));
  const hots = showHot ? HOT_ITEMS.filter(h => !(PLACE_ITEMS.length && focusIsos.has(h.iso))) : [];
  const taken = new Set(CUR_PLACES.map(p => p.n).concat(hots.map(h => h.el.textContent)));
  const waters = WATER_ITEMS.filter(w => alt < waterLimit(w.t) && !taken.has(w.n));
  const stories = fl ? [] : STORY_ITEMS.filter(it => themeOn(it.s));
  stories.forEach(it => it.el.classList.toggle('compact', alt > 1.7));
  const items = waters.concat(labels, hots, PLACE_ITEMS, stories);
  LABELS.forEach(l => l.el.classList.toggle('is-sel', focusIsos.has(l.iso)));
  // place names only show once zoomed in (or when opened), so nearby pins don't pile up
  PLACE_ITEMS.forEach(it => it.el.classList.toggle('compact', alt > 1.15));
  const key = items.map(i => i.kind + (i.iso || i.n || '') + (i.idx != null ? i.idx : '')).join('|') + state.sel + (state.link ? state.link.label : '');
  if (!force && key === lastKey) return;
  lastKey = key;
  world.htmlElementsData(items);
}

const el = document.getElementById('globe');
function setCursor() { el.style.cursor = (state.hovLink || state.hov) ? 'pointer' : 'grab'; }
const world = new Globe(el, { animateIn: !reduceMotion })
  .width(window.innerWidth).height(window.innerHeight)
  .backgroundColor('#060b13')
  .showAtmosphere(true).atmosphereColor('#3f78b8').atmosphereAltitude(0.17)
  .showGraticules(true)
  .polygonsData(FEAT)
  .polygonSideColor(() => 'rgba(2,6,11,0.96)')
  .polygonsTransitionDuration(220)
  .onPolygonHover(f => {
    state.hov = f || null;
    setCursor();
    paintPolys();
  })
  .onPolygonClick(f => select(f.properties.iso))
  .arcStartLat('sLat').arcStartLng('sLng').arcEndLat('eLat').arcEndLng('eLng')
  .arcAltitudeAutoScale(0.42)
  .arcAltitude(a => a.branch ? Math.min(0.06, 0.012 + a.len * 0.006) : null)
  /* Each line has an invisible, much wider twin (hit: true) so it is easy to hover and tap.
     Its dash starts past the end of the line, so the shader draws nothing but clicks still register. */
  .arcDashLength(a => a.hit ? 1 : 0.62).arcDashGap(a => a.hit ? 0 : 0.06)
  .arcDashInitialGap(a => a.hit ? 2 : 0)
  .arcDashAnimateTime(a => (a.hit || reduceMotion) ? 0 : 2600)
  .onArcHover(a => {
    const L = a ? a.L : null;
    if (L === state.hovLink) return;
    state.hovLink = L;
    setCursor();
    paintArcs();
  })
  .arcsTransitionDuration(0)
  .onArcClick(a => selectLink(a.L))
  .ringLat('lat').ringLng('lng')
  .ringMaxRadius(3.6).ringPropagationSpeed(2.2).ringRepeatPeriod(1150)
  .ringColor(h => t => rgba(LEVELS[h.lv] ? LEVELS[h.lv].color : '#8fd0ff', Math.max(0, 1 - t) * 0.9))
  .pointLat('lat').pointLng('lng')
  .pointAltitude(0.012).pointRadius(0.42)
  .pointColor(h => LEVELS[h.lv].color)
  .pointsMerge(false)
  .onPointClick(h => select(h.iso, h))
  .htmlLat('lat').htmlLng('lng')
  .htmlAltitude(d => d.kind === 'water' ? 0.004 : (d.kind === 'place' || d.kind === 'story') ? 0.085 : (d.kind === 'label' && (d.iso === state.sel || (state.link && (d.iso === state.link.a || d.iso === state.link.b))) ? 0.08 : 0.02))
  .htmlElement(d => d.el)
  .htmlTransitionDuration(0)
  .onZoom(pov => {
    state.alt = pov.altitude;
    updateHtml(false);
  });

if (!isTouch) {
  world.polygonLabel(f => tooltipFor(f.properties))
    .arcLabel(a => `<div class="tt"><span class="lvl"><span class="sw-line" style="background:${LINK_TYPES[a.L.type].color}"></span>${LINK_TYPES[a.L.type].label}</span><b>${a.L.label}</b><span class="row">${fname(a.L.a)} ↔ ${fname(a.L.b)}</span><span class="go">Click to open this connection</span></div>`)
    .pointLabel(h => `<div class="tt"><b>${h.name}</b><span>${h.note}</span><span class="go">Click for the ${nameOf(h.iso)} briefing</span></div>`);
}

try { world.globeMaterial().color.set('#0c1826'); } catch (e) { /* default material */ }

/* Build arc segments: a main arc to the hub, then short branches to each named place. */
function angDist(lat1, lng1, lat2, lng2) {
  const r = Math.PI / 180;
  const c = Math.sin(lat1 * r) * Math.sin(lat2 * r) + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.cos((lng2 - lng1) * r);
  return Math.acos(clamp(c, -1, 1)) / r;
}
const ARCS = [];
LINKS.forEach(L => {
  if (!byIso[L.a] || !byIso[L.b]) return;
  const A = byIso[L.a].properties, Bp = byIso[L.b].properties;
  L.places = (L.br || []).map(([iso, n]) => placeByName(iso, n)).filter(Boolean);
  const hub = L.hub || [Bp.ly, Bp.lx];
  L.hubPt = hub;
  ARCS.push({ L, sLat: A.ly, sLng: A.lx, eLat: hub[0], eLng: hub[1] });
  if (L.both) ARCS.push({ L, sLat: Bp.ly, sLng: Bp.lx, eLat: hub[0], eLng: hub[1] });
  L.places.forEach(p => {
    const len = angDist(hub[0], hub[1], p.lat, p.lng);
    if (len < 0.6) return;
    ARCS.push({ L, branch: true, len, sLat: hub[0], sLng: hub[1], eLat: p.lat, eLng: p.lng });
  });
});
ARCS.slice().forEach(a => ARCS.push(Object.assign({}, a, { hit: true })));
function visibleLinks() { return LINKS.filter(L => L.tier <= state.detail && byIso[L.a] && byIso[L.b]); }
function visibleArcs() { return ARCS.filter(a => a.L.tier <= state.detail); }
function linkTouches(L, iso) { return L.a === iso || L.b === iso; }

function tooltipFor(p) {
  const lv = levelOf(p.iso);
  const pill = lv ? `<span class="lvl"><span class="sw" style="width:8px;height:8px;border-radius:50%;background:${LEVELS[lv].color}"></span>${LEVELS[lv].label}</span>` : '';
  return `<div class="tt">${pill}<b>${fname(p.iso)}</b>
    <span class="row"><span>Pop ${fmtPop(p.pop)}</span><span>GDP ${fmtGdp(p.gdp)}</span></span>
    <span class="go">${state.product === 'pulse' ? (storiesFor(p.iso).length ? `${storiesFor(p.iso).length} ${storiesFor(p.iso).length === 1 ? 'story' : 'stories'} \u00b7 click for headlines` : 'Click for live headlines') : B[p.iso] ? 'Click for the full briefing' : 'Click for stats and headlines'}</span></div>`;
}

/* ---------- painting ---------- */
function shaded(hex, s, hi) {
  // darken by up to 30% based on the country's shade so same-status neighbours separate
  if (hi) return mix(hex, '#ffffff', 0.12);
  return mix(hex, '#060b13', 0.04 + s * 0.3);
}
function capColor(f) {
  if (state.product === 'pulse') return pulseColor(f);
  const p = f.properties, iso = p.iso, lv = levelOf(iso), s = shadeOf[iso];
  const hov = state.hov === f, sel = state.sel === iso, hi = hov || sel;
  const dimOthers = state.sel && !sel && isPhone() ? 0.75 : 1;
  if (state.mode === 'explore') {
    if (state.metric === 'tension') {
      if (lv) { const [r, g, b] = shaded(LEVELS[lv].color, s, hi); return `rgba(${r},${g},${b},${0.92 * dimOthers})`; }
      return hi ? '#33506f' : mixRgba('#16253a', '#26394f', s, 1);
    }
    const t = metricT[state.metric](p);
    const [r, g, b] = mix(hi ? '#2a4260' : '#1a2a3c', hi ? '#c2e6ff' : '#8fd0ff', t);
    const [r2, g2, b2] = mix(`#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`, '#060b13', hi ? 0 : s * 0.18);
    return `rgba(${r2},${g2},${b2},0.95)`;
  }
  if (state.mode === 'connections') {
    if (state.link || state.sel) {
      const touches = state.link ? linkTouches(state.link, iso)
        : (iso === state.sel || visibleLinks().some(L => linkTouches(L, state.sel) && linkTouches(L, iso)));
      if (touches) { if (lv) { const [r, g, b] = shaded(LEVELS[lv].color, s, sel); return `rgba(${r},${g},${b},0.9)`; } return 'rgba(143,208,255,0.6)'; }
      return hov ? '#2a405a' : mixRgba('#101a26', '#1a283a', s, 1);
    }
    if (visibleLinks().some(L => linkTouches(L, iso))) { if (lv) { const [r, g, b] = shaded(LEVELS[lv].color, s, hi); return `rgba(${r},${g},${b},${hi ? 0.9 : 0.6})`; } return hi ? 'rgba(143,208,255,0.6)' : 'rgba(143,208,255,0.3)'; }
    return hov ? '#2a405a' : mixRgba('#111c29', '#1c2b3d', s, 1);
  }
  if (lv) { const [r, g, b] = shaded(LEVELS[lv].color, s, hi); return `rgba(${r},${g},${b},${hi ? 0.65 : 0.38})`; }
  return hi ? '#2a405a' : mixRgba('#122031', '#1d2c3f', s, 1);
}
function capAlt(f) {
  const iso = f.properties.iso;
  if (state.sel === iso || (state.link && linkTouches(state.link, iso))) return 0.075;
  if (state.hov === f) return 0.045;
  // small per-country height steps make dark side walls show along shared borders
  if (state.product === 'pulse') return 0.006 + shadeOf[iso] * 0.012 + (pulseTheme(iso) ? 0.008 : 0);
  return 0.006 + shadeOf[iso] * 0.012 + (state.mode === 'explore' && state.metric === 'tension' ? 0.004 * levelOf(iso) : 0);
}
function strokeColor(f) {
  const iso = f.properties.iso;
  if (state.sel === iso || (state.link && linkTouches(state.link, iso))) return '#ffffff';
  if (state.hov === f) return 'rgba(255,255,255,0.9)';
  if (state.product === 'pulse') return pulseTheme(iso) ? 'rgba(255,245,235,0.72)' : 'rgba(200,222,245,0.5)';
  return levelOf(iso) && state.mode !== 'connections' ? 'rgba(255,240,230,0.75)' : 'rgba(200,222,245,0.5)';
}
function arcOn(a) {
  if (state.link) return a.L === state.link;
  if (state.sel) return linkTouches(a.L, state.sel);
  return true;
}
function paintPolys() {
  world
    .polygonCapColor(f => capColor(f))
    .polygonAltitude(f => capAlt(f))
    .polygonStrokeColor(f => strokeColor(f));
}
function paintArcs() {
  const hitW = isTouch ? 1.6 : 1;
  world
    .arcColor(a => {
      if (a.hit) return 'rgba(0,0,0,0)';
      const c = LINK_TYPES[a.L.type].color;
      const hov = state.hovLink === a.L;
      const al = hov ? 1 : arcOn(a) ? 0.95 : 0.08;
      return hov ? [mixRgba(c, '#ffffff', 0.35, 1), mixRgba(c, '#ffffff', 0.35, 1)] : [rgba(c, al), rgba(c, al)];
    })
    .arcStroke(a => {
      if (a.hit) return (a.branch ? 2.6 : 4.4) * hitW;
      const focused = ((state.link || state.sel) && arcOn(a)) || state.hovLink === a.L;
      return a.branch ? (focused ? 0.75 : 0.42) : (focused ? 1.35 : 0.72);
    });
}
function paint() {
  paintPolys();
  paintArcs();
}

function applyMode() {
  const fl = state.product === 'faultlines';
  modesEl.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === curMode())));
  document.getElementById('metric-field').classList.toggle('is-off', !(fl && state.mode === 'explore'));
  const pLinksOn = !fl && (state.pmode === 'links' || (state.link && ECON_TYPES.includes(state.link.type)));
  world.arcsData(fl && (state.mode === 'connections' || state.link)
    ? visibleArcs().filter(a => state.mode === 'connections' || a.L === state.link)
    : pLinksOn ? PARCS.filter(a => (state.pmode === 'links' && a.L.tier <= Math.min(state.detail, 3)) || a.L === state.link) : []);
  world.pointsData(fl && state.mode === 'hotspots' ? HOTS : []);
  updateRings();
  renderLegend();
  renderDetail();
  paint();
  updateHtml(true);
}
function updateRings() {
  if (reduceMotion || state.product === 'pulse') { world.ringsData([]); return; }
  const rings = state.mode === 'hotspots' ? HOTS.slice() : [];
  CUR_PLACES.filter(p => p.lv === 3).forEach(p => rings.push(p));
  world.ringsData(rings);
}

document.getElementById('metric').addEventListener('change', e => { state.metric = e.target.value; renderLegend(); paint(); });

/* ---------- camera ---------- */
const controls = world.controls();
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.32;
controls.enableDamping = true;
controls.minDistance = 112;
controls.maxDistance = 650;
controls.addEventListener('start', () => { controls.autoRotate = false; });
state.alt = isPhone() ? 3.1 : 2.25;
world.pointOfView({ lat: 26, lng: 34, altitude: state.alt }, 0);

/* Point the camera so the focus sits in the part of the screen the panel doesn't cover. */
function recenter(ms) {
  const f = state.focus;
  if (!f) return;
  let lat = f.lat, lng = f.lng;
  if (isPhone() && !panel.hidden) {
    const frac = sheetHeight() / window.innerHeight;
    lat = f.lat - Math.min(22, frac * 21 * f.alt);
  } else if (!isPhone() && !panel.hidden) {
    const frac = (panel.offsetWidth + 16) / window.innerWidth;
    lng = f.lng + frac * 26 * f.alt / Math.max(Math.cos(f.lat * Math.PI / 180), 0.45);
  }
  world.pointOfView({ lat, lng, altitude: f.alt }, reduceMotion ? 0 : (ms == null ? 1000 : ms));
}
function focusOn(lat, lng, alt, ms) {
  state.focus = { lat, lng, alt };
  recenter(ms);
}

/* ---------- panel & bottom sheet ---------- */
const panel = document.getElementById('panel');
const head = document.getElementById('sheet-head');
const headBody = document.getElementById('head-body');
const body = document.getElementById('panel-body');

function statusStyle(s) {
  const k = s.toLowerCase();
  if (/active|clashes|ties cut/.test(k)) return `background:${rgba('#ef5350', 0.16)};color:#ff8f8c`;
  if (/tension|fragile|truce|disputed|frozen|contested|stalled|pending|paused|negotiat|rsf control|tense/.test(k)) return `background:${rgba('#f0913f', 0.16)};color:#f6b47a`;
  return '';
}

function snapHeights() {
  const vh = window.innerHeight;
  return { peek: head.offsetHeight + 6, half: Math.round(vh * 0.48), full: Math.round(vh * 0.88) };
}
function sheetHeight() {
  if (!isPhone()) return 0;
  return snapHeights()[state.snap];
}
function setSnap(s, animate) {
  state.snap = s;
  if (!isPhone()) { panel.style.height = ''; return; }
  panel.classList.toggle('no-anim', animate === false);
  panel.style.height = snapHeights()[s] + 'px';
  panel.dataset.snap = s;
  head.setAttribute('aria-expanded', String(s !== 'peek'));
}

function select(iso, hot) {
  const f = byIso[iso];
  if (!f) return;
  const changed = state.sel !== iso || state.link;
  state.link = null;
  state.sel = iso;
  state.hot = hot || null;
  state.place = null;
  controls.autoRotate = false;
  if (state.product === 'pulse') { buildPlaces([]); renderPulse(iso); }
  else { if (changed) buildPlaces(PLACES[iso] ? PLACES[iso].list : []); render(iso); }
  applyMode();
  const p = f.properties;
  const alt = clamp(0.55 + Math.sqrt(p.ar || 1) / 14, 0.85, 2.0) * (isPhone() ? 1.25 : 1);
  if (isPhone() && panel.dataset.snap === 'peek') setSnap('half');
  if (hot) focusOn(hot.lat, hot.lng, Math.min(alt, 1.2));
  else focusOn(p.ly, p.lx, alt);
}

function showPlace(i) {
  const pl = CUR_PLACES[i];
  if (!pl) return;
  state.place = i;
  PLACE_ITEMS.forEach(it => { it.el.classList.toggle('is-active', it.idx === i); it.el.classList.toggle('open', it.idx === i); });
  body.querySelectorAll('.maplink').forEach(b => b.classList.toggle('is-on', Number(b.dataset.p) === i));
  if (isPhone()) setSnap('peek');
  focusOn(pl.lat, pl.lng, isPhone() ? 0.95 : 0.75);
}

function render(iso) {
  const p = byIso[iso].properties, b = B[iso];
  const lv = levelOf(iso);
  const P = PLACES[iso];
  let hh = `<div class="eyebrow">${p.cont || ''}${p.inc ? ' · ' + p.inc.replace(/^\d\.\s*/, '') : ''}</div>
    <h2>${fname(iso)}</h2>`;
  if (lv) hh += `<span class="pill" style="background:${rgba(LEVELS[lv].color, 0.16)};color:${LEVELS[lv].color}"><span class="dot" style="background:${LEVELS[lv].color}"></span>${LEVELS[lv].label}</span>`;
  headBody.innerHTML = hh;

  let h = '';
  if (state.hot && state.hot.iso === iso) h += `<div class="hot-note"><strong>${state.hot.name}.</strong> ${state.hot.note}</div>`;
  h += wnHTML(iso);
  h += factsHTML(iso);

  if (b) {
    h += `<p class="summary">${b.summary}</p>`;
    h += `<section class="sec"><h3>Conflicts &amp; tensions</h3>${b.issues.map((i, k) => {
      const pi = P && P.ip[k] != null ? P.ip[k] : null;
      const btn = pi != null ? `<button type="button" class="maplink" data-p="${pi}"><span class="mpin" aria-hidden="true"></span>Show ${P.list[pi].n} on map</button>` : '';
      return `<div class="issue"><div class="issue-head"><strong>${i.t}</strong><span class="status" style="${statusStyle(i.s)}">${i.s}</span></div><p>${i.d}</p><div class="iacts">${btn}${xbtn(nameOf(iso) + ': ' + i.t, i.d)}</div></div>`;
    }).join('')}</section>`;
    if (P) {
      h += `<section class="sec"><h3>On the map</h3><div class="links">${P.list.map((pl, k) =>
        `<button type="button" class="chip maplink" data-p="${k}"><span class="dot" style="background:${LEVELS[pl.lv] ? LEVELS[pl.lv].color : '#8fd0ff'}"></span>${pl.n}</button>`).join('')}</div></section>`;
    }
    h += `<section class="sec"><h3>Recent timeline</h3><ol class="timeline">${b.timeline.map(([d, t]) => `<li><time>${d}</time>${t}</li>`).join('')}</ol></section>`;
    h += briefHTML(iso, { overview: false });
  } else {
    h += briefHTML(iso, { overview: true });
  }

  const rel = LINKS.filter(L => linkTouches(L, iso) && byIso[L.a] && byIso[L.b]);
  if (rel.length) {
    h += `<section class="sec"><h3>Connections</h3><div class="links">${rel.map(L => {
      const other = L.a === iso ? L.b : L.a;
      return `<button type="button" class="chip" data-link="${LINKS.indexOf(L)}"><span class="dot" style="background:${LINK_TYPES[L.type].color}"></span>${fname(other)} <small>${L.label}</small></button>`;
    }).join('')}</div></section>`;
  }
  h += glanceHTML(iso);
  h += newsSection('Latest news', countryNewsParams(iso), 'news-' + iso);
  if (b) {
    h += `<section class="sec"><h3>Sources</h3><ul class="sources">${b.sources.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></section>
      <p class="stamp">Briefing written ${UPDATED}. Population and GDP are Natural Earth estimates.</p>`;
  }
  body.innerHTML = h;
  body.scrollTop = 0;
  wirePanel();
  wireNews();
  wireFacts(iso);
  openPanel();
}
function wirePanel() {
  headBody.querySelectorAll('[data-flip]').forEach(c => c.addEventListener('click', e => {
    e.stopPropagation();
    const iso = c.dataset.flip;
    switchProduct('faultlines');
    select(iso);
  }));
  body.querySelectorAll('.chip[data-iso], .btn[data-iso], .cl[data-iso]').forEach(c => c.addEventListener('click', () => select(c.dataset.iso)));
  body.querySelectorAll('.chip[data-plink]').forEach(c => c.addEventListener('click', () => selectLink(PULSE_LINKS[Number(c.dataset.plink)])));
  body.querySelectorAll('.morebtn').forEach(m => m.addEventListener('click', () => { m.previousElementSibling.hidden = false; m.remove(); }));
  body.querySelectorAll('.chip[data-link]').forEach(c => c.addEventListener('click', () => selectLink(LINKS[Number(c.dataset.link)])));
  body.querySelectorAll('.maplink').forEach(c => c.addEventListener('click', () => showPlace(Number(c.dataset.p))));
}
function openPanel() {
  const wasHidden = panel.hidden;
  panel.hidden = false;
  document.body.classList.add('sheet-open');
  if (wasHidden) setSnap('half', false);
  else if (isPhone() && state.snap === 'peek') setSnap('half');
}
function selectLink(L) {
  if (!L) return;
  state.link = L; state.sel = null; state.hot = null; state.place = null;
  controls.autoRotate = false;
  buildPlaces(L.places);
  renderLink(L);
  applyMode();
  const A = byIso[L.a].properties, hub = L.hubPt;
  const r = Math.PI / 180;
  const v = [[A.ly, A.lx], hub].map(([la, lo]) => [Math.cos(la * r) * Math.cos(lo * r), Math.cos(la * r) * Math.sin(lo * r), Math.sin(la * r)]);
  const m = [0, 1, 2].map(k => v[0][k] + v[1][k]);
  const mlat = Math.atan2(m[2], Math.hypot(m[0], m[1])) / r, mlng = Math.atan2(m[1], m[0]) / r;
  const d = angDist(A.ly, A.lx, hub[0], hub[1]);
  focusOn(mlat, mlng, clamp(0.7 + d / 38, 1.0, 3.0) * (isPhone() ? 1.3 : 1));
}
function renderLink(L) {
  const T = LINK_TYPES[L.type];
  headBody.innerHTML = `<div class="eyebrow">Connection \u00b7 ${DETAIL[L.tier]}</div>
    <h2 class="pair">${fname(L.a)} <span class="x">\u2194</span> ${fname(L.b)}</h2>
    <span class="pill" style="background:${rgba(T.color, 0.16)};color:${T.color}"><span class="dot" style="background:${T.color}"></span>${T.label}</span>`;
  let h = `<p class="summary"><strong>${L.label}.</strong> ${L.d}</p><div class="iacts">${xbtn(nameOf(L.a) + ' \u2194 ' + nameOf(L.b) + ': ' + L.label, L.d)}</div>`;
  if (L.places.length) {
    h += `<section class="sec"><h3>Where it plays out</h3><div class="links">${L.places.map((p, k) =>
      `<button type="button" class="chip maplink" data-p="${k}"><span class="dot" style="background:${LEVELS[p.lv] ? LEVELS[p.lv].color : '#8fd0ff'}"></span>${p.n}</button>`).join('')}</div></section>`;
  }
  h += `<section class="sec"><h3>${state.product === 'pulse' ? 'Countries' : 'Country briefings'}</h3><div class="pairbtns">
    <button type="button" class="btn" data-iso="${L.a}">${fname(L.a)}</button>
    <button type="button" class="btn" data-iso="${L.b}">${fname(L.b)}</button></div></section>`;
  if (L.src && L.src.length) {
    h += `<section class="sec"><h3>Sources</h3><ul class="sources">${L.src.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></section>`;
  }
  h += `<p class="stamp">Written ${UPDATED}.</p>`;
  body.innerHTML = h;
  body.scrollTop = 0;
  wirePanel();
  openPanel();
}
function closePanel() {
  panel.hidden = true;
  document.body.classList.remove('sheet-open');
  state.sel = null; state.hot = null; state.place = null; state.focus = null; state.link = null;
  buildPlaces([]);
  applyMode();
}
document.getElementById('close').addEventListener('click', closePanel);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!chatEl.hidden) { closeChat(); return; }
  if (!panel.hidden) { closePanel(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }
});

/* Swipe the sheet: down to shrink or dismiss, up to expand. */
(function sheetGestures() {
  let drag = null;
  let suppressClick = false;
  const order = ['peek', 'half', 'full'];
  panel.addEventListener('touchstart', e => {
    if (!isPhone() || e.touches.length !== 1) return;
    const t = e.touches[0];
    drag = {
      y0: t.clientY, t0: performance.now(), h0: panel.offsetHeight,
      inHead: head.contains(e.target) || e.target.classList.contains('grab'),
      active: false, lastY: t.clientY, lastT: performance.now(), v: 0
    };
  }, { passive: true });
  panel.addEventListener('touchmove', e => {
    if (!drag) return;
    const y = e.touches[0].clientY, dy = y - drag.y0;
    if (!drag.active) {
      if (Math.abs(dy) < 6) return;
      const atTop = body.scrollTop <= 0;
      if (drag.inHead || (dy > 0 && atTop) || (dy < 0 && state.snap !== 'full')) {
        drag.active = true;
        panel.classList.add('dragging');
      } else { drag = null; return; }
    }
    e.preventDefault();
    const now = performance.now();
    drag.v = (y - drag.lastY) / Math.max(1, now - drag.lastT);
    drag.lastY = y; drag.lastT = now;
    panel.style.height = clamp(drag.h0 - dy, 40, snapHeights().full) + 'px';
  }, { passive: false });
  panel.addEventListener('touchend', () => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.active) return;
    panel.classList.remove('dragging');
    suppressClick = true; setTimeout(() => { suppressClick = false; }, 350);
    const H = snapHeights(), h = panel.offsetHeight;
    if (h < H.peek * 0.7 || (state.snap === 'peek' && d.v > 0.6)) { closePanel(); return; }
    let target;
    if (d.v > 0.5) target = order[Math.max(0, order.indexOf(state.snap) - 1)];
    else if (d.v < -0.5) target = order[Math.min(2, order.indexOf(state.snap) + 1)];
    else target = order.reduce((best, s) => Math.abs(H[s] - h) < Math.abs(H[best] - h) ? s : best, 'peek');
    setSnap(target);
    recenter(600);
  });
  head.addEventListener('click', () => {
    if (!isPhone() || suppressClick) return;
    setSnap(state.snap === 'peek' ? 'half' : 'peek');
    recenter(600);
  });
})();

window.addEventListener('resize', () => {
  world.width(window.innerWidth).height(window.innerHeight);
  if (!panel.hidden) setSnap(state.snap, false);
  updateHtml(true);
});


/* ================= PRODUCT SWITCH, PULSE & LIVE NEWS ================= */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const PRODUCTS = {
  faultlines: { name: 'Fault Lines', sub: 'Conflicts & political tension · briefings updated Nov 1, 2026',
    modes: [['explore', 'Explore'], ['connections', 'Connections'], ['hotspots', 'Hotspots']] },
  pulse: { name: 'Pulse', sub: 'Elections, economy, unrest & tech · live headlines',
    modes: [['stories', 'Stories'], ['links', 'Links'], ['markets', 'Markets'], ['headlines', 'News']] }
};
const modesEl = document.querySelector('.modes');
function renderBrand() {
  const P = PRODUCTS[state.product], other = PRODUCTS[state.product === 'pulse' ? 'faultlines' : 'pulse'];
  document.getElementById('bname').textContent = P.name;
  document.getElementById('bsub').textContent = P.sub;
  document.getElementById('bswap').textContent = '⇄ ' + other.name;
  document.body.dataset.product = state.product;
  modesEl.innerHTML = P.modes.map(([k, label]) =>
    `<button role="tab" type="button" id="mode-${k}" data-mode="${k}" aria-selected="false"><span class="ico"></span>${label}</button>`).join('');
}
function curMode() { return state.product === 'pulse' ? state.pmode : state.mode; }

/* the chip row under the header */
function storiesFor(iso) { return PULSE.filter(s => s.iso.includes(iso)); }
function themeOn(s) { return state.ptheme === 'all' || s.theme === state.ptheme; }
function renderWatch() {
  if (state.product === 'faultlines') {
    watchEl.innerHTML = '<span class="watch-h">Active conflicts</span>' + Object.keys(B).filter(k => B[k].lv === 3).concat(Object.keys(BRIEF).filter(k => !B[k] && BRIEF[k].lv === 3 && byIso[k])).map(iso =>
      `<button type="button" class="chip" data-iso="${iso}"><span class="dot" style="background:${LEVELS[3].color}"></span>${fname(iso)}</button>`).join('');
  } else if (state.pmode === 'markets') {
    watchEl.innerHTML = '<span class="watch-h">Live markets</span>' + tickerChips();
  } else {
    const n = t => PULSE.filter(s => t === 'all' || s.theme === t).length;
    watchEl.innerHTML = '<span class="watch-h">Themes</span>' +
      `<button type="button" class="chip${state.ptheme === 'all' ? ' is-on' : ''}" data-theme="all">All <small>${n('all')}</small></button>` +
      Object.entries(PULSE_THEMES).map(([k, T]) =>
        `<button type="button" class="chip${state.ptheme === k ? ' is-on' : ''}" data-theme="${k}"><span class="dot" style="background:${T.color}"></span>${T.label} <small>${n(k)}</small></button>`).join('');
  }
}
watchEl.addEventListener('click', e => {
  const c = e.target.closest('button');
  if (!c) return;
  if (c.dataset.iso) select(c.dataset.iso);
  else if (c.dataset.theme) { state.ptheme = c.dataset.theme; renderWatch(); applyMode(); }
  else if (c.dataset.tick) openMarkets();
});

function switchProduct(p) {
  if (p === state.product) return;
  if (!panel.hidden) closePanel();
  state.product = p;
  state.link = null;
  renderBrand();
  renderWatch();
  applyMode();
  try { history.replaceState(null, '', p === 'pulse' ? '#pulse' : location.pathname + location.search); } catch (e) { /* ignore */ }
}
document.getElementById('product').addEventListener('click', () => switchProduct(state.product === 'pulse' ? 'faultlines' : 'pulse'));
window.addEventListener('hashchange', () => switchProduct(location.hash === '#pulse' ? 'pulse' : 'faultlines'));

modesEl.addEventListener('click', e => {
  const b = e.target.closest('[data-mode]');
  if (!b) return;
  if (state.product === 'faultlines') {
    state.mode = b.dataset.mode;
    applyMode();
    if (state.mode === 'connections' && !state.sel) world.pointOfView({ lat: 28, lng: 40, altitude: isPhone() ? 3.0 : 2.3 }, 900);
    return;
  }
  state.pmode = b.dataset.mode;
  renderWatch();
  if (state.pmode === 'markets') openMarkets();
  else if (state.pmode === 'headlines') openHeadlines();
  else if (!panel.hidden && !state.sel && !state.link) closePanel();
  if (state.pmode === 'links' && !state.sel) world.pointOfView({ lat: 35, lng: 20, altitude: isPhone() ? 3.0 : 2.4 }, 900);
  applyMode();
});

/* ---------- story pins ---------- */
const STORY_ITEMS = PULSE.filter(s => s.pin).map(s => {
  const T = PULSE_THEMES[s.theme];
  const el = document.createElement('div');
  el.className = 'place story';
  el.style.setProperty('--pc', T.color);
  el.innerHTML = `<button type="button" class="pin" aria-label="${esc(s.t)}"></button><div class="ptxt"><span class="pname">${esc(s.pin[2])}</span></div>`;
  el.addEventListener('click', e => { e.stopPropagation(); select(s.iso[0]); });
  return { kind: 'story', s, lat: s.pin[0], lng: s.pin[1], n: s.pin[2], el };
});

/* ---------- Pulse colouring ---------- */
function pulseTheme(iso) {
  const s = PULSE.find(x => x.iso.includes(iso) && themeOn(x));
  return s ? s.theme : null;
}
function pulseColor(f) {
  const iso = f.properties.iso, s = shadeOf[iso];
  const hi = state.hov === f || state.sel === iso;
  const th = pulseTheme(iso);
  if (th) { const [r, g, b] = shaded(PULSE_THEMES[th].color, s * 0.8, hi); return `rgba(${r},${g},${b},${hi ? 0.95 : 0.8})`; }
  return hi ? '#33506f' : mixRgba('#142233', '#22344a', s, 1);
}
function pulseLegendHTML() {
  if (state.pmode === 'links') {
    return `<h4>Economic links</h4><ul>${ECON_TYPES.map(k => `<li><span class="sw-line" style="background:${LINK_TYPES[k].color}"></span>${LINK_TYPES[k].label}</li>`).join('')}</ul>
      <div class="detail hint">Showing ${visiblePLinks().length} of ${PULSE_LINKS.length}. Raise Detail for more. ${isTouch ? 'Tap' : 'Click'} a line to open it.</div>`;
  }
  if (state.pmode === 'markets') {
    return `<h4>Markets</h4><div class="detail hint">Live currency rates, gold and bitcoin. Prices in CAD with USD alongside. ${isTouch ? 'Tap' : 'Click'} a country for its stories and headlines.</div>`;
  }
  const items = Object.entries(PULSE_THEMES).filter(([k]) => state.ptheme === 'all' || state.ptheme === k);
  return `<h4>${state.ptheme === 'all' ? 'This week’s stories' : PULSE_THEMES[state.ptheme].label}</h4><ul>${items.map(([, T]) =>
    `<li><span class="sw" style="background:${T.color}"></span>${T.label}</li>`).join('')}</ul>
    <div class="detail foot">${PULSE.length} stories so far. Every country has live headlines when you ${isTouch ? 'tap' : 'click'} it.</div>`;
}

/* ---------- live news ---------- */
const NEWS_EVERY = 10 * 60 * 1000;
function newsSection(title, params, id) {
  return `<section class="sec news" id="${id}" data-params="${esc(params)}"><h3>${title}</h3>
    <div class="newsbar"><span class="nstamp">Loading headlines…</span><button type="button" class="nref" aria-label="Refresh ${title}">↻ Refresh</button></div>
    <ol class="newslist"></ol></section>`;
}
function ago(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60);
  if (h < 24) return h + ' h ago';
  return Math.round(h / 24) + ' d ago';
}
async function loadNews(sec, fresh) {
  const list = sec.querySelector('.newslist'), stamp = sec.querySelector('.nstamp');
  sec.classList.add('loading');
  try {
    const r = await fetch('/api/news?' + sec.dataset.params + (fresh ? '&fresh=1' : ''));
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    if (!sec.isConnected) return;
    sec.dataset.fetched = data.fetchedAt || Date.now();
    if (!data.items || !data.items.length) {
      list.innerHTML = '<li class="nempty">No recent stories from major outlets in the last few days.</li>';
    } else {
      sec._items = data.items;
      list.innerHTML = data.items.map((it, k) => `<li class="ni"><button type="button" class="nhead" data-k="${k}" aria-expanded="false">
        <span class="nt">${esc(it.title)}</span><span class="nm">${esc(it.source)} · ${ago(it.ts)}<span class="chev" aria-hidden="true">▾</span></span></button>
        <div class="nbody" hidden><p class="nsum">${it.sum ? esc(it.sum) : ''}</p>
        <div class="nacts"><a href="${esc(it.url)}" target="_blank" rel="noopener">Read on ${esc(it.source)} ↗</a>${xbtn(it.title, (it.sum || '') + ' (' + it.source + ')')}</div></div></li>`).join('');
      list.querySelectorAll('.nhead').forEach(h => h.addEventListener('click', () => toggleNews(sec, h)));
    }
    stamp.textContent = 'Updated ' + ago(Number(sec.dataset.fetched));
  } catch (e) {
    if (!sec.isConnected) return;
    stamp.textContent = 'Couldn’t load headlines.';
    if (!list.children.length) list.innerHTML = '<li class="nempty">Live news isn’t reachable right now. Try Refresh in a moment.</li>';
  } finally {
    sec.classList.remove('loading');
  }
}
async function toggleNews(sec, h) {
  const open = h.getAttribute('aria-expanded') !== 'true';
  h.setAttribute('aria-expanded', String(open));
  const nb = h.nextElementSibling, sum = nb.querySelector('.nsum');
  nb.hidden = !open;
  const it = sec._items && sec._items[Number(h.dataset.k)];
  if (!open || !it || sum.dataset.done) return;
  sum.dataset.done = '1';
  if (it.sum && it.sum.length > 160) return;
  if (!it.direct) { if (!it.sum) sum.textContent = 'The publisher didn’t provide a summary. Open the article, or tap Explain for context.'; return; }
  if (!it.sum) sum.textContent = 'Loading summary…';
  try {
    const r = await fetch('/api/preview?url=' + encodeURIComponent(it.url));
    const d = r.ok ? await r.json() : {};
    if (d.desc && d.desc.length > (it.sum || '').length) { it.sum = d.desc; sum.textContent = d.desc; }
    else if (!it.sum) sum.textContent = 'The publisher didn’t provide a summary. Open the article, or tap Explain for context.';
  } catch (e) { if (!it.sum) sum.textContent = 'Summary unavailable right now.'; }
}
function wireNews() {
  body.querySelectorAll('.news').forEach(sec => {
    sec.querySelector('.nref').addEventListener('click', () => loadNews(sec, true));
    loadNews(sec, false);
  });
}
setInterval(() => { if (!panel.hidden) body.querySelectorAll('.news').forEach(sec => loadNews(sec, false)); }, NEWS_EVERY);
setInterval(() => {
  body.querySelectorAll('.news[data-fetched]').forEach(sec => { sec.querySelector('.nstamp').textContent = 'Updated ' + ago(Number(sec.dataset.fetched)); });
}, 60000);
function countryNewsParams(iso) { return 'q=' + encodeURIComponent('"' + nameOf(iso) + '"'); }

/* ---------- Pulse panels ---------- */
function storyCard(s, showPlaces) {
  const T = PULSE_THEMES[s.theme];
  const cl = i => `<button type="button" class="cl" data-iso="${i}">${fname(i)}</button>`;
  const where = showPlaces ? `<span class="swhere">${s.iso.slice(0, 4).map(cl).join('')}${s.iso.length > 4
    ? `<span class="more" hidden>${s.iso.slice(4).map(cl).join('')}</span><button type="button" class="morebtn">+${s.iso.length - 4} more</button>` : ''}</span>` : '';
  return `<article class="story-card" style="--tc:${T.color}">
    <div class="stag"><span class="dot"></span>${T.label}<span class="sdate">${esc(s.date)}</span></div>
    <h4>${s.t}</h4>${where}<p>${s.d}</p>
    <div class="ssrc">${s.src.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join('')}${xbtn(s.t, s.d)}</div>
  </article>`;
}
function renderPulse(iso) {
  const p = byIso[iso].properties, b = B[iso], lv = levelOf(iso);
  headBody.innerHTML = `<div class="eyebrow">${p.cont || ''} · Pulse</div><h2>${fname(iso)}</h2>` +
    (lv ? `<button type="button" class="pill pill-btn" data-flip="${iso}" style="background:${rgba(LEVELS[lv].color, 0.16)};color:${LEVELS[lv].color}"><span class="dot" style="background:${LEVELS[lv].color}"></span>${LEVELS[lv].label} · open in Fault Lines</button>` : '');
  const st = storiesFor(iso);
  let h = wnHTML(iso) + factsHTML(iso);
  const pl = PULSE_LINKS.filter(L => linkTouches(L, iso) && byIso[L.a] && byIso[L.b]);
  const ov = (BRIEF[iso] && BRIEF[iso].s) || (b && b.summary);
  if (ov) h += `<p class="summary">${ov}</p>`;
  if (st.length) h += `<section class="sec"><h3>Stories to know</h3>${st.map(s => storyCard(s, s.iso.length > 1)).join('')}</section>`;
  h += briefHTML(iso, { overview: false });
  if (pl.length) h += `<section class="sec"><h3>Economic links</h3><div class="links">${pl.map(L => {
    const other = L.a === iso ? L.b : L.a;
    return `<button type="button" class="chip" data-plink="${PULSE_LINKS.indexOf(L)}"><span class="dot" style="background:${LINK_TYPES[L.type].color}"></span>${fname(other)} <small>${L.label}</small></button>`;
  }).join('')}</div></section>`;
  h += glanceHTML(iso);
  h += newsSection('Latest headlines', countryNewsParams(iso), 'news-' + iso);
  h += `<p class="stamp">Stories written ${UPDATED}. Headlines come from major outlets through Google News and Bing News, and refresh every 10 minutes. Tap a headline for its summary.</p>`;
  body.innerHTML = h;
  body.scrollTop = 0;
  wirePanel();
  wireNews();
  wireFacts(iso);
  openPanel();
}
function openHeadlines() {
  state.sel = null; state.link = null;
  headBody.innerHTML = `<div class="eyebrow">Pulse · live</div><h2>Headlines</h2><span class="pill" style="background:rgba(143,208,255,0.14);color:var(--accent)"><span class="dot live-dot" style="background:var(--accent)"></span>Refreshes every 10 minutes</span>`;
  body.innerHTML = `<div data-feed>${feedHTML()}</div>` + newsSection('World', 'topic=WORLD', 'news-world') + newsSection('Business & economy', 'topic=BUSINESS', 'news-biz') +
    newsSection('Technology & AI', 'topic=TECHNOLOGY', 'news-tech') +
    `<p class="stamp">From Reuters, AP, BBC, Al Jazeera, the Guardian, CBC, Bloomberg and other major outlets, gathered through Google News and Bing News. Only established outlets are shown. Tap a headline for its summary.</p>`;
  body.scrollTop = 0;
  wireNews();
  wireLive();
  openPanel();
}

/* ---------- markets ---------- */
let MARKETS = null, marketsAt = 0;
function fmtNum(v, d) { return v == null ? '—' : Number(v).toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function chgHTML(c) {
  if (c == null || !isFinite(c)) return '';
  const cls = c > 0.005 ? 'up' : c < -0.005 ? 'down' : 'flat';
  return `<span class="chg ${cls}">${c > 0 ? '▲' : c < 0 ? '▼' : '•'} ${Math.abs(c).toFixed(2)}%</span>`;
}
function tickerRows() {
  if (!MARKETS) return [];
  const rows = (MARKETS.fx || []).map(f => ({ k: f.pair, v: fmtNum(f.value, f.dp), c: f.chg, note: f.note }));
  if (MARKETS.gold) rows.push({ k: 'Gold', v: 'C$' + fmtNum(MARKETS.gold.cad, 0), c: null, note: 'per ounce · US$' + fmtNum(MARKETS.gold.usd, 0) });
  if (MARKETS.btc) rows.push({ k: 'Bitcoin', v: 'C$' + fmtNum(MARKETS.btc.cad, 0), c: null, note: 'US$' + fmtNum(MARKETS.btc.usd, 0) });
  return rows;
}
function tickerChips() {
  if (!MARKETS) { loadMarkets(); return '<span class="chip tick">Loading…</span>'; }
  const rows = tickerRows();
  if (!rows.length) return '<span class="chip tick">Markets unavailable</span>';
  return rows.map(r => `<button type="button" class="chip tick" data-tick="1"><b>${r.k}</b> ${r.v} ${chgHTML(r.c)}</button>`).join('');
}
async function loadMarkets(fresh) {
  if (!fresh && MARKETS && Date.now() - marketsAt < 5 * 60000) return MARKETS;
  try {
    const r = await fetch('/api/markets' + (fresh ? '?fresh=1' : ''));
    if (!r.ok) throw new Error(r.status);
    MARKETS = await r.json();
  } catch (e) { MARKETS = MARKETS || { fx: [], error: true }; }
  marketsAt = Date.now();
  if (state.product === 'pulse' && state.pmode === 'markets') {
    renderWatch();
    if (!panel.hidden && body.querySelector('#mkt')) fillMarkets();
  }
  return MARKETS;
}
function fillMarkets() {
  const box = body.querySelector('#mkt');
  if (!box) return;
  const rows = tickerRows();
  box.innerHTML = rows.length ? rows.map(r => `<div class="mcard"><span class="mk">${r.k}</span><span class="mv">${r.v}</span>${chgHTML(r.c)}${r.note ? `<span class="mn">${r.note}</span>` : ''}</div>`).join('')
    : '<p class="empty">Market data isn’t reachable right now. Try Refresh in a moment.</p>';
  const st = body.querySelector('#mkt-stamp');
  if (st && MARKETS && MARKETS.asOf) st.textContent = 'Currency rates as of ' + MARKETS.asOf + ' (European Central Bank reference rates, weekdays). Gold and bitcoin are near real time.';
}
function openMarkets() {
  state.sel = null; state.link = null;
  if (state.pmode !== 'markets') { state.pmode = 'markets'; renderWatch(); applyMode(); }
  headBody.innerHTML = `<div class="eyebrow">Pulse · live</div><h2>Markets</h2><span class="pill" style="background:rgba(242,193,78,0.14);color:#f2c14e"><span class="dot" style="background:#f2c14e"></span>Currencies, gold &amp; bitcoin</span>`;
  const st = PULSE.filter(s => s.theme === 'economy' || s.theme === 'trade' || s.theme === 'energy');
  body.innerHTML = `<div class="newsbar"><span class="nstamp" id="mkt-upd">Live prices</span><button type="button" class="nref" id="mkt-ref">↻ Refresh</button></div>
    <div class="mgrid" id="mkt"><p class="empty">Loading prices…</p></div><p class="stamp" id="mkt-stamp"></p>
    <section class="sec"><h3>What’s moving markets</h3>${st.map(s => storyCard(s, true)).join('')}</section>` +
    newsSection('Markets headlines', 'topic=BUSINESS', 'news-mkt');
  body.scrollTop = 0;
  body.querySelector('#mkt-ref').addEventListener('click', async () => { await loadMarkets(true); fillMarkets(); });
  wireNews();
  wirePanel();
  openPanel();
  if (MARKETS) fillMarkets();
  loadMarkets().then(fillMarkets);
}

/* ---------- detail control (bottom right) ---------- */
const detailEl = document.getElementById('detailctl');
function renderDetail() {
  detailEl.innerHTML = `<span class="dt">Detail</span>
    <div class="vsteps" role="radiogroup" aria-label="Detail level">${[5, 4, 3, 2, 1].map(k =>
      `<button type="button" role="radio" id="detail-${k}" data-detail="${k}" aria-checked="${k === state.detail}" aria-label="${DETAIL[k]}" class="${k <= state.detail ? 'on' : ''}${k === state.detail ? ' cur' : ''}"><span></span></button>`).join('')}</div>
    <span class="dn">${DETAIL[state.detail]}</span>`;
}
detailEl.addEventListener('click', e => {
  const b = e.target.closest('[data-detail]');
  if (!b) return;
  state.detail = Number(b.dataset.detail);
  if (state.link && state.link.tier > state.detail) closePanel();
  applyMode();
});


/* ================= INTERACTIVE FACT CARDS ================= */
const WB = new Map(), WBD = new Map();
function wbLast(arr) { if (!arr) return null; for (let i = arr.length - 1; i >= 0; i--) if (arr[i][1] != null) return arr[i]; return null; }
async function loadCountry(iso) {
  if (WB.has(iso)) return WB.get(iso);
  const pr = fetch('/api/country?iso=' + iso).then(r => r.ok ? r.json() : null).catch(() => null);
  WB.set(iso, pr);
  const d = await pr;
  if (!d) WB.delete(iso); else WBD.set(iso, d);
  return d;
}
function factBtn(key, label, value, sub, wide) {
  return `<button type="button" class="fact fbtn${wide ? ' wide' : ''}" data-fact="${key}" aria-expanded="false">
    <span class="dt">${label}<span class="chev" aria-hidden="true">▾</span></span><span class="dd"><span class="dv">${value}</span><small class="ds">${sub || ''}</small></span></button>`;
}
const fxBox = key => `<div class="fx" data-fx="${key}" hidden></div>`;
function factsHTML(iso) {
  const p = byIso[iso].properties, b = B[iso], L = LEADERS[iso];
  let h = '<div class="facts">';
  if (b || L) h += factBtn('leader', 'Leader', L ? L.name : b.leader, b ? b.role : (L.since ? 'Since ' + L.since : ''), true) + fxBox('leader');
  else if (iso !== 'ATA' && iso !== 'ATF') h += factBtn('leader', 'Leader', '\u2014', 'Loading\u2026', true) + fxBox('leader');
  if (b && b.second) h += `<div class="fact wide"><span class="dt">${b.second[0]}</span><span class="dd">${b.second[1]}</span></div>`;
  if (b) h += `<div class="fact wide"><span class="dt">Government</span><span class="dd">${b.gov}</span></div>`;
  h += factBtn('pop', 'Population', fmtPop(p.pop), 'est. ' + (p.popY || '')) + factBtn('gdp', 'GDP', fmtGdp(p.gdp), 'est. ' + (p.gdpY || '')) + fxBox('pop') + fxBox('gdp');
  return h + '</div>';
}
function spark(series, opts) {
  const pts = (series || []).filter(d => d[1] != null);
  if (pts.length < 3) return '';
  const W = 300, H = 64, P = 4;
  const xs = pts.map(d => d[0]), ys = pts.map(d => d[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const X = x => P + (x - x0) / ((x1 - x0) || 1) * (W - 2 * P);
  const Y = y => H - P - (y - y0) / ((y1 - y0) || 1) * (H - 2 * P);
  const line = pts.map(d => `${X(d[0]).toFixed(1)},${Y(d[1]).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return `<figure class="spark"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${opts.label}">
    <polygon points="${X(x0)},${H - P} ${line} ${X(x1)},${H - P}" fill="var(--spark-fill)"/>
    <polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/>
    <circle cx="${X(last[0])}" cy="${Y(last[1])}" r="3.5" fill="var(--accent)"/></svg>
    <figcaption><span>${x0}</span><span>${opts.label}</span><span>${x1}</span></figcaption></figure>`;
}
function bars(series, label) {
  const pts = (series || []).filter(d => d[1] != null).slice(-10);
  if (pts.length < 3) return '';
  const W = 300, H = 64, mid = H / 2, m = Math.max(2, ...pts.map(d => Math.abs(d[1])));
  const bw = W / pts.length;
  return `<figure class="spark"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${label}">
    <line x1="0" x2="${W}" y1="${mid}" y2="${mid}" stroke="var(--line-strong)" stroke-width="1"/>
    ${pts.map((d, i) => { const h = Math.abs(d[1]) / m * (mid - 3); return `<rect x="${(i * bw + bw * 0.18).toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" y="${(d[1] >= 0 ? mid - h : mid).toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" rx="1.5" fill="${d[1] >= 0 ? '#5fd3a6' : '#ff8f8c'}"/>`; }).join('')}
    </svg><figcaption><span>${pts[0][0]}</span><span>${label}</span><span>${pts[pts.length - 1][0]}</span></figcaption></figure>`;
}
const pct = (v, d = 1) => (v == null ? '—' : (v > 0 ? '+' : '') + v.toFixed(d) + '%');
function row(k, v) { return `<div class="frow"><span>${k}</span><b>${v}</b></div>`; }
function popDetail(iso, s) {
  const L = wbLast(s.pop), g = wbLast(s.popg), f = wbLast(s.fert), o = wbLast(s.old);
  if (!L) return '<p class="fnote">No World Bank population data for this country.</p>';
  const notes = [];
  // find a run of falling population at the end of the series
  const pts = (s.pop || []).filter(d => d[1] != null);
  let k = pts.length - 1; while (k > 0 && pts[k][1] < pts[k - 1][1]) k--;
  if (k < pts.length - 1) notes.push(`<b class="bad">Shrinking.</b> The population has fallen every year since ${pts[k][0]}.`);
  else if (g && g[1] < 0.4) notes.push('<b class="meh">Barely growing.</b> Growth has slowed close to zero.');
  else if (g && g[1] > 2) notes.push('<b class="mid">Growing fast.</b> A young, fast-growing population needs jobs and schools quickly.');
  else if (g) notes.push('<b class="good">Growing steadily.</b>');
  if (f) {
    if (f[1] < 1.3) notes.push(`Fertility is ${f[1].toFixed(2)} births per woman, among the lowest in the world and far below the 2.1 needed to keep a population stable without immigration.`);
    else if (f[1] < 2.1) notes.push(`Fertility is ${f[1].toFixed(2)} births per woman, below the 2.1 replacement level, so growth increasingly depends on immigration.`);
    else notes.push(`Fertility is ${f[1].toFixed(2)} births per woman, above the 2.1 replacement level.`);
  }
  if (o && o[1] >= 20) notes.push(`${o[1].toFixed(0)}% of people are 65 or older, a fast-aging society that strains pensions and the workforce.`);
  return spark(s.pop, { label: 'Population' }) +
    `<div class="frows">${row('Latest (' + L[0] + ')', fmtPop(L[1]))}${row('Yearly change', pct(g && g[1], 2))}${row('Births per woman', f ? f[1].toFixed(2) : '—')}${row('Aged 65+', o ? o[1].toFixed(1) + '%' : '—')}</div>
    <ul class="fnotes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
}
function gdpDetail(iso, s) {
  const L = wbLast(s.gdp), g = wbLast(s.gdpg), pc = wbLast(s.gdppc), inf = wbLast(s.infl), u = wbLast(s.unemp);
  if (!L) return '<p class="fnote">No World Bank economic data for this country.</p>';
  const gs = (s.gdpg || []).filter(d => d[1] != null);
  const avg = a => a.length ? a.reduce((x, d) => x + d[1], 0) / a.length : null;
  const recent = avg(gs.slice(-3)), before = avg(gs.slice(-8, -3));
  const notes = [];
  if (g) {
    if (g[1] < 0) notes.push(`<b class="bad">Shrinking.</b> The economy contracted ${Math.abs(g[1]).toFixed(1)}% in ${g[0]}.`);
    else if (g[1] < 1.5) notes.push(`<b class="meh">Weak growth</b> of ${g[1].toFixed(1)}% in ${g[0]}.`);
    else if (g[1] < 4) notes.push(`<b class="good">Steady growth</b> of ${g[1].toFixed(1)}% in ${g[0]}.`);
    else notes.push(`<b class="good">Fast growth</b> of ${g[1].toFixed(1)}% in ${g[0]}.`);
  }
  if (recent != null && before != null) {
    if (recent < before - 1) notes.push(`Slowing down: growth averaged ${recent.toFixed(1)}% over the last 3 years, down from ${before.toFixed(1)}% before.`);
    else if (recent > before + 1) notes.push(`Picking up: growth averaged ${recent.toFixed(1)}% over the last 3 years, up from ${before.toFixed(1)}% before.`);
    else notes.push(`Growth has been fairly steady, averaging about ${recent.toFixed(1)}% a year recently.`);
  }
  if (inf) {
    if (inf[1] < 0) notes.push(`Prices fell ${Math.abs(inf[1]).toFixed(1)}% in ${inf[0]}. Falling prices (deflation) can signal weak demand.`);
    else if (inf[1] > 10) notes.push(`<b class="bad">High inflation</b> of ${inf[1].toFixed(1)}% in ${inf[0]} erodes wages and savings.`);
  }
  return bars(s.gdpg, 'Real growth, % per year') +
    `<div class="frows">${row('Size (' + L[0] + ')', fmtGdp(L[1] / 1e6))}${row('Growth', pct(g && g[1]))}${row('Per person', pc ? 'US$' + Math.round(pc[1]).toLocaleString('en-CA') : '—')}${row('Inflation', pct(inf && inf[1]))}${row('Unemployment', u ? u[1].toFixed(1) + '%' : '—')}</div>
    <ul class="fnotes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
}
function leaderDetail(iso) {
  const L = LEADERS[iso], b = B[iso];
  const W = (WBD.get(iso) || {}).wd;
  if (!L && !b && W) return `<div class="frows">${W.hos ? row('Head of state', esc(W.hos) + (W.hosSince ? ' \u00b7 since ' + String(W.hosSince).slice(0, 4) : '')) : ''}${W.hog && W.hog !== W.hos ? row('Head of government', esc(W.hog) + (W.hogSince ? ' \u00b7 since ' + String(W.hogSince).slice(0, 4) : '')) : ''}${W.party ? row('Party', esc(W.party)) : ''}</div>` +
    xbtn(`Who leads ${nameOf(iso)}?`, `${nameOf(iso)}: head of state ${W.hos || 'unknown'}, head of government ${W.hog || 'unknown'}. Explain how they came to power, their politics, how popular they are and what to watch.`);
  if (!L) return `<p class="fnote">${b ? b.role : 'Leader details are loading.'}</p>` + xbtn(`Who is ${b ? b.leader : 'the leader'} of ${nameOf(iso)}?`, `Leader of ${nameOf(iso)}: ${b ? b.leader + ', ' + b.role : ''}`);
  return `<div class="frows">${row('In office since', L.since)}${row('Politics', L.party)}</div><p class="fnote">${L.how}</p>` +
    xbtn(`${L.name}: support and outlook`, `${L.name}, leader of ${nameOf(iso)}. In office since ${L.since}. ${L.how} Politics: ${L.party}. Explain how popular they are, their main policies and what to watch.`);
}
function fillFacts(iso, data) {
  if (state.sel !== iso) return;
  fillOverview(iso, data);
  const s = data && data.series;
  const set = (key, v, sub) => { const b = body.querySelector(`[data-fact="${key}"]`); if (b) { b.querySelector('.dv').textContent = v; b.querySelector('.ds').textContent = sub; } };
  if (s) {
    const P = wbLast(s.pop), G = wbLast(s.gdp);
    if (P) set('pop', fmtPop(P[1]), P[0] + ' · World Bank');
    if (G) set('gdp', fmtGdp(G[1] / 1e6), G[0] + ' · World Bank');
  }
  const pop = body.querySelector('[data-fx="pop"]'), gdp = body.querySelector('[data-fx="gdp"]');
  if (pop) pop.innerHTML = s ? popDetail(iso, s) + xbtn(`${nameOf(iso)}: population trends`, popText(iso, s)) : '<p class="fnote">Population history isn’t reachable right now.</p>';
  if (gdp) gdp.innerHTML = s ? gdpDetail(iso, s) + xbtn(`${nameOf(iso)}: economy`, gdpText(iso, s)) : '<p class="fnote">Economic history isn’t reachable right now.</p>';
}
function popText(iso, s) {
  const L = wbLast(s.pop), g = wbLast(s.popg), f = wbLast(s.fert);
  return `${nameOf(iso)} population ${L ? fmtPop(L[1]) + ' in ' + L[0] : ''}, yearly change ${g ? g[1].toFixed(2) + '%' : 'unknown'}, fertility ${f ? f[1].toFixed(2) : 'unknown'}. Explain the trend, whether it is good or bad, and what it means for the country and the world.`;
}
function gdpText(iso, s) {
  const L = wbLast(s.gdp), g = wbLast(s.gdpg), i = wbLast(s.infl);
  return `${nameOf(iso)} GDP ${L ? fmtGdp(L[1] / 1e6) + ' in ' + L[0] : ''}, real growth ${g ? g[1].toFixed(1) + '%' : 'unknown'}, inflation ${i ? i[1].toFixed(1) + '%' : 'unknown'}. Explain the trajectory, whether it is healthy, and the global knock-on effects.`;
}
function wireFacts(iso) {
  body.querySelectorAll('.fbtn').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.fact, fx = body.querySelector(`[data-fx="${key}"]`);
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    fx.hidden = !open;
    if (open && key === 'leader' && !fx.innerHTML) fx.innerHTML = leaderDetail(iso);
    if (open && key !== 'leader' && !fx.innerHTML) fx.innerHTML = '<p class="fnote">Loading World Bank data…</p>';
  }));
  loadCountry(iso).then(d => fillFacts(iso, d));
}

/* ================= AI ASSISTANT ================= */
const chatEl = document.getElementById('chat'), chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form'), chatIn = document.getElementById('chat-in');
let chatHist = [];
/* saved chats, kept in this browser: [{ id, title, at, msgs: [{ role, content, shown }] }] */
const CHAT_KEY = 'fl-chats';
const chatHistEl = document.getElementById('chat-hist'), histBtn = document.getElementById('chat-histbtn');
let chats = [], curChat = null, chatDel = {}, syncCode = '', syncMsg = '', syncTimer = 0;
try { chats = JSON.parse(localStorage.getItem(CHAT_KEY)) || []; chatDel = JSON.parse(localStorage.getItem(CHAT_KEY + '-del')) || {}; syncCode = localStorage.getItem('fl-sync') || ''; } catch (e) { chats = []; }
function saveChats(noSync) {
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(chats.slice(0, 60))); localStorage.setItem(CHAT_KEY + '-del', JSON.stringify(chatDel)); } catch (e) { /* storage full or blocked */ }
  if (!noSync && syncCode) { clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 1200); }
}
/* cross-device sync: the server merges this device's chats with the stored copy and returns the result */
async function syncNow() {
  if (!syncCode) return;
  try {
    const r = await fetch('/api/chats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: syncCode, chats, deleted: chatDel }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { syncMsg = d.error || 'Couldn’t sync right now.'; }
    else {
      chats = d.chats || []; chatDel = d.deleted || {};
      syncMsg = 'Synced ' + new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
      saveChats(true);
    }
  } catch (e) { syncMsg = 'Offline. Will sync next time.'; }
  if (!chatHistEl.hidden) renderHist();
}
function newSyncCode() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = crypto.getRandomValues(new Uint8Array(12));
  return [...b].map(x => A[x % A.length]).join('').replace(/(.{4})(?=.)/g, '$1-');
}
function setSync(code) {
  syncCode = code; syncMsg = code ? 'Syncing…' : '';
  try { code ? localStorage.setItem('fl-sync', code) : localStorage.removeItem('fl-sync'); } catch (e) { /* ignore */ }
  renderHist();
  if (code) syncNow();
}
function syncBox() {
  if (syncCode) return `<div class="sync on"><div class="sh"><b>Sync is on</b><span>${esc(syncMsg)}</span></div>
    <p>Enter this code on your other devices (History → Sync) to see the same chats:</p>
    <div class="scode"><code>${syncCode}</code><button type="button" class="chat-x" data-sync="copy">Copy</button></div>
    <button type="button" class="slink" data-sync="off">Turn off sync on this device</button></div>`;
  return `<div class="sync"><div class="sh"><b>Sync across devices</b></div>
    <p>Turn on sync to get a code, then enter it on your phone or computer. No account needed.</p>
    <div class="srow"><button type="button" class="chat-x sgo" data-sync="new">Turn on sync</button></div>
    <form class="srow" data-sync-form><input placeholder="Have a code? Enter it" autocomplete="off" autocapitalize="characters" spellcheck="false"><button type="submit" class="chat-x">Use code</button></form>
    ${syncMsg ? `<p class="serr">${esc(syncMsg)}</p>` : ''}</div>`;
}
function wireSync() {
  const q = s => chatHistEl.querySelector(s);
  const n = q('[data-sync="new"]'); if (n) n.addEventListener('click', () => setSync(newSyncCode()));
  const off = q('[data-sync="off"]'); if (off) off.addEventListener('click', () => setSync(''));
  const cp = q('[data-sync="copy"]'); if (cp) cp.addEventListener('click', () => { try { navigator.clipboard.writeText(syncCode); cp.textContent = 'Copied'; } catch (e) { /* ignore */ } });
  const f = q('[data-sync-form]'); if (f) f.addEventListener('submit', e => {
    e.preventDefault();
    const v = f.querySelector('input').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length < 10) { syncMsg = 'That code looks too short.'; renderHist(); return; }
    setSync(v.replace(/(.{4})(?=.)/g, '$1-'));
  });
}
function chatIntro() { chatAdd('bot', `<p>Ask me anything about the world, or tap <b>✦ Explain</b> on any card, stat or headline for a plain-English explanation of what it means and who it affects. Your chats are saved under <b>History</b>${syncCode ? ' and synced across your devices' : ''}.</p>`); }
function showChat(c) {
  curChat = c ? c.id : null;
  chatLog.innerHTML = '';
  chatIntro();
  (c ? c.msgs : []).forEach(m => chatAdd(m.role === 'user' ? 'me' : 'bot', m.role === 'user' ? esc(m.shown || m.content) : md(m.content)));
  chatHist = (c ? c.msgs : []).slice(-10).map(m => ({ role: m.role, content: m.content }));
  toggleHist(false);
}
function toggleHist(open) {
  chatHistEl.hidden = !open;
  chatLog.hidden = open;
  chatForm.hidden = open;
  histBtn.setAttribute('aria-expanded', String(open));
  histBtn.textContent = open ? 'Back' : 'History';
  if (open) renderHist();
}
function renderHist() {
  if (!chats.length) { chatHistEl.innerHTML = syncBox() + `<p class="hnone">No saved chats yet. Questions you ask are saved here${syncCode ? ' and synced' : ', on this device'}.</p>`; wireSync(); return; }
  chatHistEl.innerHTML = syncBox() + '<ol class="hlist">' + chats.map(c => `<li class="hitem${c.id === curChat ? ' is-cur' : ''}">
    <button type="button" class="hopen" data-c="${c.id}"><span class="ht">${esc(c.title)}</span>
    <span class="hm">${new Date(c.at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} · ${Math.ceil(c.msgs.length / 2)} question${c.msgs.length > 2 ? 's' : ''}</span></button>
    <button type="button" class="hdel" data-del="${c.id}" aria-label="Delete this chat">×</button></li>`).join('') + '</ol>' +
    '<button type="button" class="hclear">Delete all chats</button>';
  wireSync();
  chatHistEl.querySelectorAll('.hopen').forEach(b => b.addEventListener('click', () => showChat(chats.find(c => c.id === b.dataset.c))));
  chatHistEl.querySelectorAll('.hdel').forEach(b => b.addEventListener('click', () => {
    chatDel[b.dataset.del] = Date.now();
    chats = chats.filter(c => c.id !== b.dataset.del); saveChats();
    if (curChat === b.dataset.del) { curChat = null; chatHist = []; chatLog.innerHTML = ''; }
    renderHist();
  }));
  chatHistEl.querySelector('.hclear').addEventListener('click', () => {
    if (!confirmClear()) return;
    chats.forEach(c => { chatDel[c.id] = Date.now(); }); chats = []; saveChats(); curChat = null; chatHist = []; chatLog.innerHTML = ''; renderHist();
  });
}
function confirmClear() {
  const b = chatHistEl.querySelector('.hclear');
  if (b.dataset.sure) return true;
  b.dataset.sure = '1'; b.textContent = 'Tap again to delete all'; return false;
}
/* recent confirmed headlines for the assistant, so it knows about events after its training */
function liveContext() {
  if (!LIVE || !LIVE.news) return '';
  const line = (iso, n) => `- ${nameOf(iso)} (${dayOf(n.at)}): ${n.text}`;
  const out = [];
  if (state.sel && LIVE.news[state.sel]) LIVE.news[state.sel].forEach(n => out.push(line(state.sel, n)));
  (LIVE.feed || []).forEach(f => { const n = (LIVE.news[f.iso] || []).find(x => x.id === f.id); if (n && f.iso !== state.sel) out.push(line(f.iso, n)); });
  return out.slice(0, 40).join('\n');
}
function remember(user, shown, answer) {
  let c = chats.find(x => x.id === curChat);
  if (!c) { c = { id: Date.now().toString(36), title: (shown || user).replace(/^✦ Explain: /, 'Explain: ').slice(0, 90), at: Date.now(), msgs: [] }; chats.unshift(c); curChat = c.id; }
  c.msgs.push({ role: 'user', content: user, shown: shown || undefined }, { role: 'assistant', content: answer });
  c.msgs = c.msgs.slice(-40);
  c.at = Date.now();
  chats = [c, ...chats.filter(x => x !== c)];
  saveChats();
}
function xbtn(title, context) {
  return `<button type="button" class="xbtn" data-xt="${esc(title)}" data-x="${esc(context)}">✦ Explain</button>`;
}
function md(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split(/\n{2,}/).map(par => {
    const lines = par.split('\n');
    if (lines.every(l => /^\s*[-•]\s+/.test(l))) return '<ul>' + lines.map(l => '<li>' + l.replace(/^\s*[-•]\s+/, '') + '</li>').join('') + '</ul>';
    return '<p>' + lines.join('<br>') + '</p>';
  }).join('');
}
function chatAdd(role, html) {
  const d = document.createElement('div');
  d.className = 'msg ' + role;
  d.innerHTML = html;
  chatLog.appendChild(d);
  chatLog.scrollTop = chatLog.scrollHeight;
  return d;
}
function openChat() {
  chatEl.hidden = false;
  document.body.classList.add('chat-open');
  if (!chatLog.children.length) showChat(chats[0] && Date.now() - chats[0].at < 12 * 3600e3 ? chats[0] : null);
  if (!isTouch) setTimeout(() => chatIn.focus(), 50);
}
function closeChat() { chatEl.hidden = true; document.body.classList.remove('chat-open'); }
async function ask(text, shown) {
  openChat();
  toggleHist(false);
  chatAdd('me', esc(shown || text));
  chatHist.push({ role: 'user', content: text });
  chatHist = chatHist.slice(-10);
  const wait = chatAdd('bot pending', '<p>Thinking…</p>');
  try {
    const r = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: chatHist, context: liveContext() }) });
    const d = await r.json().catch(() => ({}));
    if (r.status === 501) {
      wait.innerHTML = '<p><b>The assistant isn’t switched on yet.</b> Get a free key at aistudio.google.com, then add it in Vercel (Settings → Environment Variables → <code>GEMINI_API_KEY</code>) and redeploy.</p>';
      chatHist.pop();
    } else if (!r.ok || !d.text) {
      wait.innerHTML = `<p>${esc(d.error || 'Something went wrong. Try again in a moment.')}</p>`;
      chatHist.pop();
    } else {
      wait.innerHTML = md(d.text);
      chatHist.push({ role: 'assistant', content: d.text });
      remember(text, shown, d.text);
    }
  } catch (e) {
    wait.innerHTML = '<p>Couldn’t reach the assistant. Check your connection and try again.</p>';
    chatHist.pop();
  }
  wait.classList.remove('pending');
  chatLog.scrollTop = chatLog.scrollHeight;
}
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const v = chatIn.value.trim();
  if (!v) return;
  chatIn.value = '';
  ask(v);
});
document.getElementById('askbtn').addEventListener('click', () => (chatEl.hidden ? openChat() : closeChat()));
document.getElementById('chat-close').addEventListener('click', closeChat);
document.getElementById('chat-clear').addEventListener('click', () => { showChat(null); openChat(); });
histBtn.addEventListener('click', () => { const open = chatHistEl.hidden; toggleHist(open); if (open) syncNow(); });
if (syncCode) syncNow();
document.addEventListener('click', e => {
  const b = e.target.closest('.xbtn');
  if (!b) return;
  e.stopPropagation();
  ask(`Explain this clearly, then the global ramifications: which countries, markets or people it affects and what to watch next.\n\n${b.dataset.xt}\n${b.dataset.x}`, '✦ Explain: ' + b.dataset.xt);
});

/* ================= PULSE ECONOMIC LINKS ================= */
const PARCS = [];
PULSE_LINKS.forEach(L => {
  if (!byIso[L.a] || !byIso[L.b]) return;
  const A = byIso[L.a].properties, Bp = byIso[L.b].properties;
  L.places = [];
  L.hubPt = L.hub || [Bp.ly, Bp.lx];
  PARCS.push({ L, sLat: A.ly, sLng: A.lx, eLat: L.hubPt[0], eLng: L.hubPt[1] });
});
PARCS.slice().forEach(a => PARCS.push(Object.assign({}, a, { hit: true })));
function visiblePLinks() { return PULSE_LINKS.filter(L => L.tier <= Math.min(state.detail, 3) && byIso[L.a] && byIso[L.b]); }


/* ================= COUNTRY OVERVIEWS, OUTLOOK & AT-A-GLANCE ================= */
function briefHTML(iso, opts) {
  const R = BRIEF[iso] || {};
  let h = '';
  if (opts.overview && R.s) h += `<p class="summary">${R.s}</p>`;
  h += `<section class="sec"><h3>Economy now &amp; outlook</h3>${R.e ? `<p class="prose">${R.e}</p>` : ''}
    <div class="outlook" data-outlook="${iso}"><p class="fnote">Loading IMF forecasts…</p></div></section>`;
  if (R.i && R.i.length) h += `<section class="sec"><h3>Key issues</h3>${R.i.map(([t, d]) =>
    `<div class="issue"><div class="issue-head"><strong>${t}</strong></div><p>${d}</p><div class="iacts">${xbtn(nameOf(iso) + ': ' + t, d)}</div></div>`).join('')}</section>`;
  if (R.w) h += `<section class="sec"><h3>What to watch</h3><p class="prose">${R.w}</p></section>`;
  return h;
}
function glanceHTML(iso) {
  return `<section class="sec"><h3>At a glance</h3><div class="glance" data-glance="${iso}"><p class="fnote">Loading…</p></div></section>`;
}
const yr = () => new Date().getFullYear();
function imfAt(obj, y) { return obj && obj[y] != null ? Number(obj[y]) : null; }
function outlookHTML(iso, d) {
  const I = d && d.imf;
  if (!I || !I.growth) return '<p class="fnote">No IMF forecasts for this country.</p>';
  const Y = yr();
  const years = [Y - 3, Y - 2, Y - 1, Y, Y + 1, Y + 2].filter(y => imfAt(I.growth, y) != null);
  const m = Math.max(2, ...years.map(y => Math.abs(imfAt(I.growth, y))));
  const W = 300, H = 74, mid = 40, bw = W / Math.max(years.length, 1);
  const svg = `<figure class="spark"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Growth, actual and forecast">
    <line x1="0" x2="${W}" y1="${mid}" y2="${mid}" stroke="var(--line-strong)"/>
    ${years.map((y, k) => { const v = imfAt(I.growth, y), h = Math.abs(v) / m * 34, f = y >= Y;
      return `<rect x="${(k * bw + bw * 0.2).toFixed(1)}" width="${(bw * 0.6).toFixed(1)}" y="${(v >= 0 ? mid - h : mid).toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" rx="2" fill="${v >= 0 ? '#5fd3a6' : '#ff8f8c'}" opacity="${f ? 0.5 : 1}" ${f ? 'stroke-dasharray="3 2" stroke="#e7eef6" stroke-width="0.8"' : ''}/>`; }).join('')}
    </svg><figcaption class="yrs">${years.map(y => `<span>${y}${y >= Y ? '<i>f</i>' : ''}<b>${imfAt(I.growth, y).toFixed(1)}%</b></span>`).join('')}</figcaption></figure>`;
  const g0 = imfAt(I.growth, Y), g1 = imfAt(I.growth, Y + 1);
  const i0 = imfAt(I.infl, Y), i1 = imfAt(I.infl, Y + 1);
  const debt = imfAt(I.debt, Y), ca = imfAt(I.ca, Y), un = imfAt(I.unemp, Y), size = imfAt(I.gdp, Y);
  const res = d.series && wbLast(d.series.res);
  const notes = [];
  if (g0 != null && g1 != null) {
    if (g0 < 0) notes.push(`<b class="bad">In recession:</b> the IMF expects the economy to shrink ${Math.abs(g0).toFixed(1)}% in ${Y}${g1 > 0 ? `, then grow ${g1.toFixed(1)}% in ${Y + 1}` : ''}.`);
    else notes.push(`The IMF expects ${g0.toFixed(1)}% growth in ${Y} and ${g1.toFixed(1)}% in ${Y + 1}, ${g1 > g0 + 0.3 ? 'picking up' : g1 < g0 - 0.3 ? 'slowing down' : 'holding about steady'}.`);
  }
  if (i0 != null) {
    if (i0 > 20) notes.push(`<b class="bad">Very high inflation</b> around ${i0.toFixed(0)}% erodes wages and savings.`);
    else if (i0 > 6) notes.push(`<b class="meh">Inflation is high</b> at about ${i0.toFixed(1)}%${i1 != null ? `, forecast at ${i1.toFixed(1)}% next year` : ''}.`);
    else if (i0 < 0) notes.push('<b class="meh">Prices are falling</b>, a sign of weak demand.');
  }
  if (debt != null) {
    if (debt > 100) notes.push(`<b class="bad">Government debt is very high</b> at ${debt.toFixed(0)}% of GDP, which limits room to respond to shocks.`);
    else if (debt > 70) notes.push(`<b class="meh">Government debt is elevated</b> at ${debt.toFixed(0)}% of GDP.`);
  }
  if (ca != null) {
    if (ca < -5) notes.push(`A current-account deficit of ${Math.abs(ca).toFixed(1)}% of GDP means it relies on foreign money, which makes the currency vulnerable.`);
    else if (ca > 5) notes.push(`A current-account surplus of ${ca.toFixed(1)}% of GDP means it earns far more from the world than it spends.`);
  }
  return svg + `<div class="frows">
    ${size != null ? row(`Economy size (${Y})`, fmtGdp(size * 1000)) : ''}
    ${row(`Growth ${Y} → ${Y + 1}`, `${pct(g0)} → ${pct(g1)}`)}
    ${i0 != null ? row(`Inflation ${Y} → ${Y + 1}`, `${i0.toFixed(1)}% → ${i1 != null ? i1.toFixed(1) + '%' : '—'}`) : ''}
    ${debt != null ? row('Government debt', debt.toFixed(0) + '% of GDP') : ''}
    ${ca != null ? row('Current account', (ca >= 0 ? 'surplus ' : 'deficit ') + Math.abs(ca).toFixed(1) + '% of GDP') : ''}
    ${un != null ? row('Unemployment', un.toFixed(1) + '%') : ''}
    ${res ? row(`Reserves incl. gold (${res[0]})`, 'US$' + (res[1] / 1e9).toLocaleString('en-CA', { maximumFractionDigits: res[1] > 1e10 ? 0 : 1 }) + ' B') : ''}
  </div><ul class="fnotes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
  <p class="srcnote">Forecasts: IMF World Economic Outlook (f = forecast). Reserves: World Bank.</p>` +
  xbtn(`${nameOf(iso)}: where the economy is heading`, `${nameOf(iso)}. IMF: growth ${pct(g0)} in ${Y}, ${pct(g1)} in ${Y + 1}; inflation ${i0 != null ? i0.toFixed(1) + '%' : 'n/a'}; government debt ${debt != null ? debt.toFixed(0) + '% of GDP' : 'n/a'}. ${(BRIEF[iso] && BRIEF[iso].e) || ''} Explain where the economy is heading, the risks, and the effects on other countries.`);
}
const ORG_NAMES = [
  ['north atlantic treaty', 'NATO'], ['european union', 'EU'], ['brics', 'BRICS'], ['organization of the petroleum', 'OPEC'], ['opec', 'OPEC'],
  ['group of seven', 'G7'], ['g7', 'G7'], ['g20', 'G20'], ['group of twenty', 'G20'], ['association of southeast asian', 'ASEAN'], ['african union', 'African Union'],
  ['commonwealth of nations', 'Commonwealth'], ['shanghai cooperation', 'SCO'], ['arab league', 'Arab League'], ['organization of american states', 'OAS'],
  ['gulf cooperation council', 'GCC'], ['collective security treaty', 'CSTO'], ['eurasian economic union', 'Eurasian Union'],
  ['economic community of west african', 'ECOWAS'], ['alliance of sahel', 'Sahel Alliance'], ['organisation for economic co-operation', 'OECD'],
  ['organization for economic cooperation', 'OECD'], ['mercosur', 'Mercosur'], ['quadrilateral security', 'Quad'], ['aukus', 'AUKUS'], ['five eyes', 'Five Eyes'],
  ['organisation of islamic cooperation', 'OIC'], ['organization of islamic cooperation', 'OIC'], ['council of europe', 'Council of Europe'], ['schengen', 'Schengen']
];
function orgsOf(list) {
  const out = [];
  (list || []).forEach(l => { const k = l.toLowerCase(); const m = ORG_NAMES.find(([s]) => k.includes(s)); if (m && !out.includes(m[1])) out.push(m[1]); });
  return out;
}
function glanceFill(iso, d) {
  const W = d && d.wd;
  if (!W) return '<p class="fnote">Live profile data isn’t reachable right now.</p>';
  const yrOf = s => (s ? String(s).slice(0, 4) : '');
  const orgs = orgsOf(W.orgs);
  return `<div class="frows">
    ${W.hos ? row('Head of state', `${esc(W.hos)}${W.hosSince ? ' · since ' + yrOf(W.hosSince) : ''}`) : ''}
    ${W.hog && W.hog !== W.hos ? row('Head of government', `${esc(W.hog)}${W.hogSince ? ' · since ' + yrOf(W.hogSince) : ''}`) : ''}
    ${W.party ? row('Leader’s party', esc(W.party)) : ''}
    ${W.gov ? row('System', esc(W.gov.split('|').slice(0, 2).join(', '))) : ''}
    ${W.capital ? row('Capital', esc(W.capital)) : ''}
    ${W.currency ? row('Currency', esc(W.currency)) : ''}
  </div>${orgs.length ? `<div class="orgs">${orgs.map(o => `<span class="org">${o}</span>`).join('')}</div>` : ''}
  <p class="srcnote">Live from Wikidata, updated by volunteers. Leaders can lag a few days after a change.</p>`;
}
function fillOverview(iso, d) {
  const o = body.querySelector(`[data-outlook="${iso}"]`);
  if (o) o.innerHTML = outlookHTML(iso, d);
  const g = body.querySelector(`[data-glance="${iso}"]`);
  if (g) g.innerHTML = glanceFill(iso, d);
  // leader card for countries without a written profile
  if (!LEADERS[iso] && !B[iso] && d && d.wd) {
    const b = body.querySelector('[data-fact="leader"]');
    const W = d.wd, g = (W.gov || '').toLowerCase();
    // in presidential, semi-presidential, one-party and military systems the head of state holds real power
    const useHos = !W.hog || (/presiden|one-party|single-party|dictator|junta|military|absolute monarchy|theocra|communist/.test(g) && !/(^|[^-])parliamentary/.test(g));
    const name = useHos ? (W.hos || W.hog) : W.hog;
    const since = useHos ? (W.hosSince || W.hogSince) : W.hogSince;
    if (b && name) {
      b.querySelector('.dv').textContent = name;
      b.querySelector('.ds').textContent = (useHos ? 'Head of state' : 'Head of government') + (since ? ' \u00b7 since ' + String(since).slice(0, 4) : '');
    }
  }
}

/* ---------- live updates (What's new, auto tension raises) ---------- */
function dayOf(ts) { return new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }); }
function wnItem(n, iso) {
  return `<li class="wni"><div class="wnt">${iso ? `<button type="button" class="cl" data-iso="${iso}">${fname(iso)}</button>` : ''}${esc(n.text)}</div>
    <div class="wnm"><time>${dayOf(n.at)} · ${ago(n.at)}</time>${(n.src || []).map(([s, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(s)}</a>`).join('')}</div></li>`;
}
function wnInner(iso) {
  const list = (LIVE && LIVE.news && LIVE.news[iso]) || [], a0 = autoOf(iso), a = a0 && a0.lv > baseLevel(iso) ? a0 : null;
  if (!list.length && !a) return '';
  let h = `<h3>What’s new</h3>`;
  if (a) h += `<p class="wnauto"><span class="dot" style="background:${LEVELS[levelOf(iso)].color}"></span>Map raised to <b>${LEVELS[levelOf(iso)].label}</b> on ${dayOf(a.at)} for 72 hours. ${esc(a.reason)}</p>`;
  if (list.length) h += `<ol class="wnlist">${list.slice(0, 5).map(n => wnItem(n)).join('')}</ol>` +
    (list.length > 5 ? `<ol class="wnlist" hidden>${list.slice(5).map(n => wnItem(n)).join('')}</ol><button type="button" class="morebtn">+${list.length - 5} more</button>` : '');
  return h + `<p class="srcnote">Auto-updated hourly. Each item comes from Reuters, AP, BBC or AFP, or from at least two major outlets. Open the sources to check. The main briefing is reviewed weekly.</p>`;
}
function wnHTML(iso) { const h = wnInner(iso); return `<section class="sec wn" data-wn="${iso}"${h ? '' : ' hidden'}>${h}</section>`; }
function feedHTML() {
  const F = ((LIVE && LIVE.feed) || []).map(f => { const n = (LIVE.news[f.iso] || []).find(x => x.id === f.id); return n && byIso[f.iso] ? [f.iso, n] : null; }).filter(Boolean);
  if (!F.length) return '';
  return `<section class="sec wn"><h3>Latest updates</h3><ol class="wnlist">${F.slice(0, 8).map(([i, n]) => wnItem(n, i)).join('')}</ol>` +
    (F.length > 8 ? `<ol class="wnlist" hidden>${F.slice(8, 30).map(([i, n]) => wnItem(n, i)).join('')}</ol><button type="button" class="morebtn">+${Math.min(F.length, 30) - 8} more</button>` : '') +
    `<p class="srcnote">From Reuters, AP, BBC or AFP, or at least two major outlets. Checked every hour${LIVE.at ? `, last ${ago(LIVE.at)}` : ''}.</p></section>`;
}
function refreshLive(prevLv) {
  const sec = body.querySelector('[data-wn]');
  if (sec) { const h = wnInner(sec.dataset.wn); sec.innerHTML = h; sec.hidden = !h; }
  const fd = body.querySelector('[data-feed]');
  if (fd) fd.innerHTML = feedHTML();
  if (sec || fd) wireLive();
  if (state.sel && !state.link && !panel.hidden && levelOf(state.sel) !== prevLv) (state.product === 'pulse' ? renderPulse : render)(state.sel);
  paintPolys();
}
function wireLive() {
  body.querySelectorAll('.wn .cl[data-iso]').forEach(c => { if (!c._w) { c._w = 1; c.addEventListener('click', () => select(c.dataset.iso)); } });
  body.querySelectorAll('.wn .morebtn').forEach(m => { if (!m._w) { m._w = 1; m.addEventListener('click', () => { m.previousElementSibling.hidden = false; m.remove(); }); } });
}
async function loadLive() {
  try {
    const r = await fetch('/updates.json?t=' + Math.floor(Date.now() / 300000), { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    if (LIVE && j.at === LIVE.at) return;
    const prev = state.sel ? levelOf(state.sel) : 0;
    LIVE = j;
    refreshLive(prev);
  } catch (e) { /* keep the last copy */ }
}
loadLive();
setInterval(loadLive, 15 * 60 * 1000);

renderBrand();
renderWatch();
applyMode();

  return () => { try { world._destructor && world._destructor(); } catch (e) { /* ignore */ } };
}
