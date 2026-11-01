# Fault Lines

Interactive 3D globe with two views, switched by tapping the brand at top left (or the `#pulse` link):
- **Fault Lines**: wars, disputes and political tension, country by country.
- **Pulse**: elections, economy and prices, trade wars, energy and shipping, AI and tech, protests, gangs and crime, plus live markets and live headlines.

Owner: Simon.  He mostly works from his phone, so keep replies short and test that changes work at phone width (about 390px).

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
  - `WATERS`: ocean, sea and strait labels.
  - `PULSE_THEMES` and `PULSE`: Pulse themes and stories. A story has `theme`, `iso` (a list), `date`, `t` (the title), `d` (the text), `src`, and an optional map `pin` as [lat, lng, label].
  - `BRIEF`: an overview for every country: `s` (what to know), `e` (economy now and outlook), `i` (key issues), `w` (what to watch), and `lv` (tension level for countries without a full `B` briefing).
  - `LEADERS`: leader profiles, `PULSE_LINKS`: economic ties shown in Pulse.
  - `UPDATED`: the date shown on briefings.
- `data/countries.json` holds Natural Earth 1:110m country shapes. Each country has:
  - `iso`, the ISO-3 code, and `a2`, the ISO-2 code used for flags.
  - `n`, the country name.
  - `pop` and `gdp`, Natural Earth estimates from 2016 and 2017.
  - `lx` and `ly`, the label point's longitude and latitude.
  - `ar`, the country's size, used for label tiers.
- `lib/app.js` builds the globe, labels, panel and bottom-sheet gestures. It is plain DOM code, not React components.
- `app/api/news/route.js` serves live headlines from Google News RSS, keeping only outlets on the list in `lib/sources.js`. It caches for 10 minutes, and `&fresh=1` bypasses the cache.
- `app/api/country/route.js` is the live data for every country, cached for a day: World Bank history, IMF World Economic Outlook forecasts, and Wikidata (leaders with start dates, system, capital, currency, memberships).
- `app/api/preview/route.js` returns an article's own summary (og:description) for trusted outlets only. `app/api/ask/route.js` is the AI assistant: Google Gemini when `GEMINI_API_KEY` is set in Vercel (free tier, tries Google Search grounding first; optional `GEMINI_MODEL`), otherwise Anthropic with `ANTHROPIC_API_KEY`.
- `app/api/markets/route.js` serves currency rates (ECB via Frankfurter), gold (gold-api.com) and bitcoin (Coinbase), cached for 15 minutes.
- `components/GlobeApp.jsx` holds the static markup and loads `lib/app.js` in the browser.
- `app/globals.css` holds all styles. Colors are tokens on `:root`, and the page has a single dark theme.

## Live updates (free, automatic)
- `.github/workflows/update.yml` runs `scripts/update.mjs` every hour at :17 (repo is public, so Actions minutes are free). It can also be run by hand from the Actions tab.
- The script pulls Google News RSS per country (trusted outlets only), groups headlines into events, keeps events reported by 2+ trusted outlets or by one of Reuters, AP, BBC or AFP alone (max one single-source story per country per run), and uses the headline from the most established outlet. GitHub Models was retired in July 2026; optional AI summaries work with any OpenAI-compatible API via repo secrets `AI_URL`, `AI_KEY`, `AI_MODEL`.
- Each run checks GDELT coverage of conflict and unrest for 12 watched countries in rotation (GDELT is slow and rate-limits GitHub's IPs, so this is best-effort). A spike (2.5x normal, 60+ articles) plus confirmed news in the last 48 h raises a country's map level by one step for 72 hours.
- Output: `public/updates.json` (`news`, `auto`, `feed`, `status`). The site loads it every 15 minutes and shows "What's new" at the top of each country panel and "Latest updates" in Pulse > News.
- The updater never edits `data/content.js`. A weekly Claude scheduled task (Sundays 4:30 PM Toronto) reads `public/updates.json`, verifies the past week with web searches, and folds real changes into `B`, `BRIEF`, `PULSE`, `LINKS`, `LEADERS` and `UPDATED`.

## Content rules
- Prices are shown in CAD first, with USD alongside, because that is the owner's preference.
- Every briefing, link and place must be factually current. Check current leaders and conflict status with a web search before writing, and put the sources in `sources` or `src`.
- Keep the tone neutral and factual. Attribute contested claims ("the UN says", "Rwanda denies").
- `lv` levels: 3 is Active conflict, 2 is High tension, 1 is Watch.
- Link `tier` levels: 1 is Major, 2 is Notable, 3 is Significant, 4 is Minor, 5 is Everything. The Detail control also shows more place names at higher levels. Link `type` is `conflict`, `dispute`, `alliance` or `diplomacy`.
- Each `PLACES[iso].ip` array maps briefing issues, in order, to a place index. Use `null` for an issue with no single location. Its length must equal `issues.length`.
- For a link, `br` lists `[iso, placeName]` pairs, and each one must exist in `PLACES`. `hub` is where the main arc lands before it branches.
- Bump `UPDATED` whenever briefings change.

## Working efficiently
- Make the smallest change that does the job. Don't reformat or restructure `lib/app.js` unless asked.
- Run `npm run build` before committing, and don't commit if it fails.
- One commit per request, with a short message.

## Roadmap (owner's requests, not done yet)
1. State, province and city names for the selected country only. Load Natural Earth admin-1 (1:10m) shapes on demand for that country, not globally.
2. Every country now has an overview. Next: full conflict briefings (`B`) for more of the countries marked high tension or active conflict.
3. More connections at the Notable and All tiers, such as trade disputes.
4. Live news is done. Next: per-theme news queries in Pulse, and oil prices, which need an API key.
5. Live World Bank, IMF and Wikidata data is done.
6. A typography and UI polish pass, once the owner decides what he wants.
7. Supabase only if an admin editor or stored news is needed.
