# RS3 Efficient Ironman Pathway Tracker

Modern personal tracker for the [Efficient Ironman Pathway Guide](https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide).

## Features

- **Live stat sync** from Jagex ironman hiscores ([API docs](https://runescape.wiki/w/Application_programming_interface)) — auto-refreshes every 15 minutes
- **Repeatables sidebar** with UTC reset countdowns (daily / Wednesday weekly / monthly) and tick-off tracking
- **Training steps** show wiki-sourced gear prerequisites, methods, and combat settings
- Checklists, multi-select bulk complete, per-step notes (localStorage)
- PoF steps woven ahead of level gates
- **Pathway assistant** (Composer 2.5) — Q&A chat via server proxy; does not change your checklist

## GitHub Pages (free hosting)

The tracker is a **static site** — no server required. GitHub Pages hosts it for free.

### One-time setup

1. **Create a GitHub repo** (if you have not already):
   - Go to [github.com/new](https://github.com/new)
   - Name: `rs3-ironman-pathway` (or any name — update the URL below)
   - Public repository, **no** README/license (this repo already has them)
   - Create repository

2. **Push from your machine** (first time):

```powershell
cd C:\Users\james\Projects\rs3-ironman-pathway
git checkout -B main
git add .
git commit -m "Initial commit: RS3 ironman pathway tracker"
git remote add origin https://github.com/YOUR_USERNAME/rs3-ironman-pathway.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

3. **Enable Pages**:
   - Repo → **Settings** → **Pages**
   - **Build and deployment** → Source: **Deploy from a branch**
   - Branch: **main** → folder **/ (root)** → Save
   - Wait 1–2 minutes; your site will be at:

   `https://YOUR_USERNAME.github.io/rs3-ironman-pathway/`

### What works on GitHub Pages

| Feature | On Pages |
|---------|----------|
| Pathway checklist, notes, filters | Yes |
| Live hiscores & quest sync | Yes (via CORS proxies) |
| Pathway assistant chat | No — needs the local proxy (see below) |

### Updating the live site

After you change files locally:

```powershell
git add .
git commit -m "Describe your change"
git push
```

Pages redeploys automatically within a minute or two.

## Local preview (with pathway assistant)

The assistant uses a **server-side proxy** so your Cursor API key never reaches the browser.

```powershell
cd C:\Users\james\Projects\rs3-ironman-pathway
copy .env.example .env
# Edit .env — set CURSOR_API_KEY from Cursor Dashboard → Integrations
npm run dev
```

Open http://localhost:3000 and click the chat button (bottom-right).

### GitHub Pages only

Static Pages hosting serves the tracker UI but **not** the agent proxy. Deploy `server/agent-proxy.mjs` separately (VPS, Cloud Run, etc.) or run `npm run dev` locally. In chat settings, set **Proxy URL** to your deployed origin.

## Local preview (static only)

```powershell
npx --yes serve .
```

Tracker works; assistant shows offline without the proxy.

## Config

- **RSN & game mode** — sidebar (saved locally)
- **Quest points** — from RuneMetrics when public profile is enabled
- **Guide agent CLI** — see [`tools/README.md`](tools/README.md) for bundle-backed guide analysis
- Fallback stats in `js/user-profile.js` if API fails

## Credits

Guide content © RuneScape Wiki contributors. Not affiliated with Jagex.
