'use client';

import { useEffect } from 'react';
import geo from '../data/countries.json';

export default function GlobeApp() {
  useEffect(() => {
    let cleanup;
    let cancelled = false;
    // globe.gl touches `window`, so load the app code only in the browser.
    import('../lib/app').then(({ start }) => {
      if (cancelled) return;
      cleanup = start(geo);
    });
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <div
        id="globe"
        aria-label="Interactive globe. Drag to rotate, scroll or pinch to zoom, select a country for its briefing."
      />

      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <div>
            <h1>Fault Lines</h1>
            <p className="sub">Conflicts &amp; political tension · briefings updated Nov 1, 2026</p>
          </div>
        </div>
        <div className="modes" role="tablist" aria-label="Map view">
          <button role="tab" id="mode-explore" data-mode="explore" aria-selected="true">
            <span className="ico" />Explore
          </button>
          <button role="tab" id="mode-connections" data-mode="connections" aria-selected="false">
            <span className="ico" />Connections
          </button>
          <button role="tab" id="mode-hotspots" data-mode="hotspots" aria-selected="false">
            <span className="ico" />Hotspots
          </button>
        </div>
        <div className="tools">
          <label className="field" id="metric-field">
            <span>Color by</span>
            <select id="metric" defaultValue="tension">
              <option value="tension">Tension level</option>
              <option value="gdp">GDP</option>
              <option value="pop">Population</option>
            </select>
          </label>
          <label className="field is-off" id="detail-field">
            <span>Detail</span>
            <select id="detail" defaultValue="1">
              <option value="1">Major</option>
              <option value="2">Notable</option>
              <option value="3">All</option>
            </select>
          </label>
          <label className="field">
            <span>Find</span>
            <input id="search" list="names" placeholder="Country name" autoComplete="off" />
          </label>
          <datalist id="names" />
        </div>
        <nav className="watch" id="watch" aria-label="Active conflicts">
          <span className="watch-h">Active conflicts</span>
        </nav>
      </header>

      <div className="legend" id="legend" />

      <aside className="panel" id="panel" hidden aria-live="polite">
        <div className="sheet-head" id="sheet-head">
          <span className="grab" aria-hidden="true" />
          <div id="head-body" />
        </div>
        <button className="close" id="close" aria-label="Close briefing">×</button>
        <div className="panel-scroll" id="panel-body" />
      </aside>
    </>
  );
}
