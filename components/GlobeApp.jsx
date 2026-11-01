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
        <button type="button" className="brand" id="product" aria-label="Switch between Fault Lines and Pulse">
          <span className="mark" aria-hidden="true" />
          <span className="btext">
            <span className="bname" id="bname">Fault Lines</span>
            <span className="sub" id="bsub">Conflicts &amp; political tension · briefings updated Nov 1, 2026</span>
          </span>
          <span className="swap" id="bswap">⇄ Pulse</span>
        </button>
        <div className="modes" role="tablist" aria-label="Map view" />
        <div className="tools">
          <label className="field" id="metric-field">
            <span>Color by</span>
            <select id="metric" defaultValue="tension">
              <option value="tension">Tension level</option>
              <option value="gdp">GDP</option>
              <option value="pop">Population</option>
            </select>
          </label>
          <label className="field">
            <span>Find</span>
            <input id="search" list="names" placeholder="Country name" autoComplete="off" />
          </label>
          <datalist id="names" />
          <button type="button" className="askbtn" id="askbtn" aria-label="Ask the AI assistant">✦ Ask AI</button>
        </div>
        <nav className="watch" id="watch" aria-label="Quick picks" />
      </header>

      <div className="legend" id="legend" />
      <div className="detailctl" id="detailctl" />
      <aside className="chat" id="chat" hidden aria-label="AI assistant">
        <div className="chat-head">
          <span className="chat-title">✦ Ask about the world</span>
          <button type="button" className="chat-x" id="chat-clear">New chat</button>
          <button type="button" className="chat-x" id="chat-close" aria-label="Close assistant">×</button>
        </div>
        <div className="chat-log" id="chat-log" aria-live="polite" />
        <form className="chat-form" id="chat-form">
          <input id="chat-in" autoComplete="off" placeholder="Ask about a country, a deal, a market…" />
          <button type="submit">Send</button>
        </form>
      </aside>

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
