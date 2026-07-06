# Agent proxy

Keeps `CURSOR_API_KEY` on the server only. The static site calls `/api/agent/chat`.

## Local

```powershell
cd ..
copy .env.example .env
# Set CURSOR_API_KEY in .env
npm run dev
```

## Security

| Secret | Where | Never |
|--------|-------|-------|
| `CURSOR_API_KEY` | `.env` on server | Browser, git, GitHub Pages |
| `AGENT_PROXY_TOKEN` | `.env` optional | Committed; user enters in chat settings if set |

Optional `AGENT_PROXY_TOKEN` requires `Authorization: Bearer <token>` on chat requests.

## Endpoints

- `GET /api/agent/health` — proxy status
- `POST /api/agent/chat` — SSE stream; body `{ message, agentId?, context? }`

Uses Cursor Cloud Agents **without a repo** — Q&A only, no guide edits.

## Troubleshooting chat errors

| Symptom | Fix |
|---------|-----|
| `Agent offline` | Run `npm run dev` locally (GitHub Pages has no proxy). |
| `CURSOR_API_KEY not configured` | Add key to `.env` from [Cursor Dashboard → Integrations](https://cursor.com/dashboard/integrations). |
| `run stream error` / stream failures | Tap **↺ New chat** once, then retry. The proxy now auto-retries with a fresh session and polls for results if the stream drops. |
| `Invalid proxy token` | Match chat settings token to `AGENT_PROXY_TOKEN` in `.env`, or leave both blank. |
| Using deployed site | Set **Proxy URL** in chat settings to your server running this proxy (not the GitHub Pages URL). |
