# Fault Lines

Interactive 3D globe that briefs people on wars, disputes and political tension, country by country. Owner: Simon. He mostly works from his phone, so keep replies short and test that changes work at phone width (about 390px).

## Stack
- Next.js 16 (App Router), plain JavaScript, no TypeScript.
- `globe.gl` for the globe (three.js under the hood).
- `flag-icons` for SVG flags, `@fontsource/*` for self-hosted fonts.
- Hosted on Vercel. There is no database yet. All content lives in `data/`.

## File map
- `data/content.js` holds all editorial content:
  - `B`: country briefings, keyed by ISO-3 code.
  - `LINKS`: connections between countries.
  - `HOTS`: hotspot markers.
  - `PLACES`: where each conflict happens inside a country.
  - `UPDATED`: the date shown on briefings.
- `data/countries.json` holds Natural Earth 1:110m country shapes. Each country has:
  - `iso`, the ISO-3 code, and `a2`, the ISO-2 code used for flags.
  - `n`, the country name.
  - `pop` and `gdp`, Natural Earth estimates from 2016 and 2017.
  - `lx` and `ly`, the label point's longitude and latitude.
  - `ar`, the country's size, used for label tiers.
- `lib/app.js` builds the globe, labels, panel and bottom-sheet gestures. It is plain DOM code, not React components.
- `components/GlobeApp.jsx` holds the static markup and loads `lib/app.js` in the browser.
- `app/globals.css` holds all styles. Colors are tokens on `:root`, and the page has a single dark theme.

## Content rules
- Every briefing, link and place must be factually current. Check current leaders and conflict status with a web search before writing, and put the sources in `sources` or `src`.
- Keep the tone neutral and factual. Attribute contested claims ("the UN says", "Rwanda denies").
- `lv` levels: 3 is Active conflict, 2 is High tension, 1 is Watch.
- Link `tier` levels: 1 is Major, 2 is Notable, 3 is All. Link `type` is `conflict`, `dispute`, `alliance` or `diplomacy`.
- Each `PLACES[iso].ip` array maps briefing issues, in order, to a place index. Use `null` for an issue with no single location. Its length must equal `issues.length`.
- For a link, `br` lists `[iso, placeName]` pairs, and each one must exist in `PLACES`. `hub` is where the main arc lands before it branches.
- Bump `UPDATED` whenever briefings change.

## Working efficiently
- Make the smallest change that does the job. Don't reformat or restructure `lib/app.js` unless asked.
- Run `npm run build` before committing, and don't commit if it fails.
- One commit per request, with a short message.

## Roadmap (owner's requests, not done yet)
1. State, province and city names for the selected country only. Load Natural Earth admin-1 (1:10m) shapes on demand for that country, not globally.
2. More countries with full briefings, eventually all of them.
3. More connections at the Notable and All tiers, such as trade disputes.
4. A live "latest news" strip per country, for example GDELT fetched server-side in a Next.js route.
5. Current population and GDP figures, for example from the World Bank API at build time.
6. A typography and UI polish pass, once the owner decides what he wants.
7. Supabase only if an admin editor or stored news is needed.
