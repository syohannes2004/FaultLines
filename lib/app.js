import Globe from 'globe.gl';
import { UPDATED, LEVELS, LINK_TYPES, DETAIL, B, LINKS, HOTS, PLACES } from '../data/content';

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
const levelOf = iso => (B[iso] ? B[iso].lv : 0);
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
const state = { mode: 'explore', metric: 'tension', detail: 1, link: null, sel: null, hov: null, hot: null, place: null, alt: 2.25, focus: null, snap: 'half' };

/* ================= STATIC UI ================= */
const watchEl = document.getElementById('watch');
Object.keys(B).filter(k => B[k].lv === 3).forEach(iso => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.type = 'button';
  b.innerHTML = `<span class="dot" style="background:${LEVELS[3].color}"></span>${fname(iso)}`;
  b.addEventListener('click', () => select(iso));
  watchEl.appendChild(b);
});
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
      <div class="detail hint">Showing ${visibleLinks().length} ${DETAIL[state.detail].toLowerCase()} connections. Tap a line to open it.</div>`;
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
      <li><span class="sw" style="background:#1d2e43;border:1px solid var(--line-strong)"></span>No briefing yet</li></ul>
      <div class="detail foot">${Object.keys(B).length} countries briefed so far. Zoom in to see more country names.</div>`;
  }
  const isG = state.metric === 'gdp';
  return `<h4>${isG ? 'GDP' : 'Population'}</h4><div class="ramp"></div>
    <div class="ramp-labels"><span>${isG ? '< $1 B' : '< 100 K'}</span><span>${isG ? '$20 T' : '1.4 B'}</span></div>
    <div class="detail foot">Natural Earth estimates (${isG ? '2016' : '2017'}), log scale. Live figures come next.</div>`;
}
const legendEl = document.getElementById('legend');
function renderLegend() { legendEl.innerHTML = legendHTML(); }

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
function tierLimit(t) {
  const k = isPhone() ? 0.78 : 1;
  return [0, 99, 1.95 * k, 1.3 * k, 0.8 * k][t];
}

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
  const showHot = state.mode === 'hotspots';
  const focusIsos = new Set(state.link ? [state.link.a, state.link.b] : (state.sel ? [state.sel] : []));
  const labels = LABELS.filter(l => focusIsos.has(l.iso) || alt < tierLimit(l.tier));
  const hots = showHot ? HOT_ITEMS.filter(h => !(PLACE_ITEMS.length && focusIsos.has(h.iso))) : [];
  const items = labels.concat(hots, PLACE_ITEMS);
  LABELS.forEach(l => l.el.classList.toggle('is-sel', focusIsos.has(l.iso)));
  // place names only show once zoomed in (or when opened), so nearby pins don't pile up
  PLACE_ITEMS.forEach(it => it.el.classList.toggle('compact', alt > 1.15));
  const key = items.map(i => i.kind + (i.iso || '') + (i.idx != null ? i.idx : '')).join('|') + state.sel + (state.link ? state.link.label : '');
  if (!force && key === lastKey) return;
  lastKey = key;
  world.htmlElementsData(items);
}

const el = document.getElementById('globe');
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
    el.style.cursor = f ? 'pointer' : 'grab';
    paintPolys();
  })
  .onPolygonClick(f => select(f.properties.iso))
  .arcStartLat('sLat').arcStartLng('sLng').arcEndLat('eLat').arcEndLng('eLng')
  .arcAltitudeAutoScale(0.42)
  .arcAltitude(a => a.branch ? Math.min(0.06, 0.012 + a.len * 0.006) : null)
  .arcDashLength(0.62).arcDashGap(0.06)
  .arcDashAnimateTime(reduceMotion ? 0 : 2600)
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
  .htmlAltitude(d => d.kind === 'place' ? 0.085 : (d.kind === 'label' && (d.iso === state.sel || (state.link && (d.iso === state.link.a || d.iso === state.link.b))) ? 0.08 : 0.02))
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
function visibleLinks() { return LINKS.filter(L => L.tier <= state.detail && byIso[L.a] && byIso[L.b]); }
function visibleArcs() { return ARCS.filter(a => a.L.tier <= state.detail); }
function linkTouches(L, iso) { return L.a === iso || L.b === iso; }

function tooltipFor(p) {
  const lv = levelOf(p.iso);
  const pill = lv ? `<span class="lvl"><span class="sw" style="width:8px;height:8px;border-radius:50%;background:${LEVELS[lv].color}"></span>${LEVELS[lv].label}</span>` : '';
  return `<div class="tt">${pill}<b>${fname(p.iso)}</b>
    <span class="row"><span>Pop ${fmtPop(p.pop)}</span><span>GDP ${fmtGdp(p.gdp)}</span></span>
    <span class="go">${B[p.iso] ? 'Click for the full briefing' : 'Click for basic stats'}</span></div>`;
}

/* ---------- painting ---------- */
function shaded(hex, s, hi) {
  // darken by up to 30% based on the country's shade so same-status neighbours separate
  if (hi) return mix(hex, '#ffffff', 0.12);
  return mix(hex, '#060b13', 0.04 + s * 0.3);
}
function capColor(f) {
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
  return 0.006 + shadeOf[iso] * 0.012 + (state.mode === 'explore' && state.metric === 'tension' ? 0.004 * levelOf(iso) : 0);
}
function strokeColor(f) {
  const iso = f.properties.iso;
  if (state.sel === iso || (state.link && linkTouches(state.link, iso))) return '#ffffff';
  if (state.hov === f) return 'rgba(255,255,255,0.9)';
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
function paint() {
  paintPolys();
  world
    .arcColor(a => { const c = LINK_TYPES[a.L.type].color; const al = arcOn(a) ? 0.95 : 0.08; return [rgba(c, al), rgba(c, al)]; })
    .arcStroke(a => { const focused = (state.link || state.sel) && arcOn(a); return a.branch ? (focused ? 0.7 : 0.42) : (focused ? 1.2 : 0.72); });
}

function applyMode() {
  document.querySelectorAll('.modes button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === state.mode)));
  document.getElementById('metric-field').classList.toggle('is-off', state.mode !== 'explore');
  document.getElementById('detail-field').classList.toggle('is-off', state.mode !== 'connections');
  world.arcsData(state.mode === 'connections' || state.link ? visibleArcs().filter(a => state.mode === 'connections' || a.L === state.link) : []);
  const showHot = state.mode === 'hotspots';
  world.pointsData(showHot ? HOTS : []);
  updateRings();
  renderLegend();
  paint();
  updateHtml(true);
}
function updateRings() {
  if (reduceMotion) { world.ringsData([]); return; }
  const rings = state.mode === 'hotspots' ? HOTS.slice() : [];
  CUR_PLACES.filter(p => p.lv === 3).forEach(p => rings.push(p));
  world.ringsData(rings);
}

document.querySelectorAll('.modes button').forEach(b => b.addEventListener('click', () => {
  state.mode = b.dataset.mode;
  applyMode();
  if (state.mode === 'connections' && !state.sel) world.pointOfView({ lat: 28, lng: 40, altitude: isPhone() ? 3.0 : 2.3 }, 900);
}));
document.getElementById('detail').addEventListener('change', e => {
  state.detail = Number(e.target.value);
  if (state.link && state.link.tier > state.detail) closePanel();
  applyMode();
});
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
  if (changed) buildPlaces(PLACES[iso] ? PLACES[iso].list : []);
  render(iso);
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
  h += `<dl class="facts">`;
  if (b) {
    h += `<div class="fact wide"><dt>Leader</dt><dd>${b.leader}<small>${b.role}</small></dd></div>`;
    if (b.second) h += `<div class="fact wide"><dt>${b.second[0]}</dt><dd>${b.second[1]}</dd></div>`;
    h += `<div class="fact wide"><dt>Government</dt><dd>${b.gov}</dd></div>`;
  }
  h += `<div class="fact"><dt>Population</dt><dd>${fmtPop(p.pop)}<small>est. ${p.popY || ''}</small></dd></div>
    <div class="fact"><dt>GDP</dt><dd>${fmtGdp(p.gdp)}<small>est. ${p.gdpY || ''}</small></dd></div></dl>`;

  if (b) {
    h += `<p class="summary">${b.summary}</p>`;
    h += `<section class="sec"><h3>Conflicts &amp; tensions</h3>${b.issues.map((i, k) => {
      const pi = P && P.ip[k] != null ? P.ip[k] : null;
      const btn = pi != null ? `<button type="button" class="maplink" data-p="${pi}"><span class="mpin" aria-hidden="true"></span>Show ${P.list[pi].n} on map</button>` : '';
      return `<div class="issue"><div class="issue-head"><strong>${i.t}</strong><span class="status" style="${statusStyle(i.s)}">${i.s}</span></div><p>${i.d}</p>${btn}</div>`;
    }).join('')}</section>`;
    if (P) {
      h += `<section class="sec"><h3>On the map</h3><div class="links">${P.list.map((pl, k) =>
        `<button type="button" class="chip maplink" data-p="${k}"><span class="dot" style="background:${LEVELS[pl.lv] ? LEVELS[pl.lv].color : '#8fd0ff'}"></span>${pl.n}</button>`).join('')}</div></section>`;
    }
    h += `<section class="sec"><h3>Recent timeline</h3><ol class="timeline">${b.timeline.map(([d, t]) => `<li><time>${d}</time>${t}</li>`).join('')}</ol></section>`;
  } else {
    h += `<p class="empty">No briefing for ${nameOf(iso)} yet. This prototype covers the ${Object.keys(B).length} countries most involved in current wars and standoffs; more are on the way.</p>`;
  }

  const rel = LINKS.filter(L => linkTouches(L, iso) && byIso[L.a] && byIso[L.b]);
  if (rel.length) {
    h += `<section class="sec"><h3>Connections</h3><div class="links">${rel.map(L => {
      const other = L.a === iso ? L.b : L.a;
      return `<button type="button" class="chip" data-link="${LINKS.indexOf(L)}"><span class="dot" style="background:${LINK_TYPES[L.type].color}"></span>${fname(other)} <small>${L.label}</small></button>`;
    }).join('')}</div></section>`;
  }
  if (b) {
    h += `<section class="sec"><h3>Sources</h3><ul class="sources">${b.sources.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>`).join('')}</ul></section>
      <p class="stamp">Briefing written ${UPDATED}. Population and GDP are Natural Earth estimates.</p>`;
  }
  body.innerHTML = h;
  body.scrollTop = 0;
  wirePanel();
  openPanel();
}
function wirePanel() {
  body.querySelectorAll('.chip[data-iso], .btn[data-iso]').forEach(c => c.addEventListener('click', () => select(c.dataset.iso)));
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
  let h = `<p class="summary"><strong>${L.label}.</strong> ${L.d}</p>`;
  if (L.places.length) {
    h += `<section class="sec"><h3>Where it plays out</h3><div class="links">${L.places.map((p, k) =>
      `<button type="button" class="chip maplink" data-p="${k}"><span class="dot" style="background:${LEVELS[p.lv] ? LEVELS[p.lv].color : '#8fd0ff'}"></span>${p.n}</button>`).join('')}</div></section>`;
  }
  h += `<section class="sec"><h3>Country briefings</h3><div class="pairbtns">
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
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });

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

applyMode();

  return () => { try { world._destructor && world._destructor(); } catch (e) { /* ignore */ } };
}
