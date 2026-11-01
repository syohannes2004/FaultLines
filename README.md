# Fault Lines

An interactive 3D globe showing wars, disputes and political tension by country, with briefings, connections between countries and conflict hotspots.

## Run locally
```
npm install
npm run dev
```
Then open http://localhost:3000.

## Deploy on Vercel
1. Sign in at vercel.com with your GitHub account.
2. Choose **Add New → Project** and import this repo.
3. Leave every setting at its default. Vercel detects Next.js.
4. Press **Deploy**.

Every push to `main` redeploys the site automatically.

## Editing content
All briefings, connections and map places are in `data/content.js`. See `CLAUDE.md` for the data format and rules.
