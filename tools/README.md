# Guide Agent CLI

Agent-facing toolkit for updating the pathway guide using the local wiki bundle (`bundle/`) plus live account data from Jagex APIs. **Does not modify `bundle/`.**

## Setup

```powershell
cd C:\Users\james\Projects\rs3-ironman-pathway\tools
python -m pip install -r requirements.txt
```

Edit `guide-agent.config.json`:

```json
{
  "rsn": "Farm Rat",
  "gameMode": "ironman"
}
```

## Sync account (hiscores + RuneMetrics)

```powershell
python guide_agent.py account sync
python guide_agent.py account show
```

Caches to `tools/.cache/account.json` so you do not need to paste stats into chat.

Requires a **public RuneMetrics profile** for quest/QP data (same as the web tracker).

## Wiki bundle queries

All wiki facts come from `bundle/data/*.rs3wi|wg|nav` — follow `bundle/RULES.md`.

```powershell
# Page summary + graph intel
python guide_agent.py wiki page "Shilo Village"

# Prefix search
python guide_agent.py wiki search "Dragon" --limit 20

# Prerequisite chain (backward graph traversal)
python guide_agent.py wiki deps "Bandos godsword" --depth 4

# Drop sources
python guide_agent.py wiki drops "Bandos hilt"

# Nav facet discovery
python guide_agent.py nav schema --filter quest
python guide_agent.py nav query pt.quest --limit 10
```

Output is JSON on stdout for easy agent consumption.

## Guide analysis

```powershell
# Export js/guide-data.js steps to JSON cache
python guide_agent.py guide export

# Export wiki anchor progress (through Shilo Village by default)
python guide_agent.py guide progress

# What you can do now vs what is level-gated
python guide_agent.py guide status

# Deep dive on one step (requirements + wiki prereqs)
python guide_agent.py guide check "Train Fishing to 53"

# Goal planning vs your account (bundle graph + account gaps)
python guide_agent.py guide goal "Bandos godsword"

# Find steps whose declared reqs may be missing wiki intel fields
python guide_agent.py guide audit
```

## Typical agent workflow

1. `account sync` — refresh cached account state
2. `guide export` — refresh step list from `js/guide-data.js`
3. `guide status` / `guide check "<step>"` — see gaps for the current pathway position
4. `wiki page` / `wiki deps` / `nav query` — confirm facts in bundle before editing the guide
5. `guide audit` — spot requirement mismatches when adding steps

## Architecture

| Module | Role |
|--------|------|
| `rs3wiki/index.py` | `.rs3wi` title/pageid lookup |
| `rs3wiki/graph.py` | `.rs3wg` prerequisite traversal |
| `rs3wiki/nav.py` | `.rs3nav` facet queries |
| `rs3wiki/account.py` | Hiscores + RuneMetrics fetch/cache |
| `rs3wiki/guide.py` | Guide step evaluation vs account + wiki |
| `export_guide.mjs` | Node bridge to `js/guide-data.js` |

## Notes

- First wiki title lookup builds an in-memory offset table (~910k pages, one-time cost per run).
- Nav index decompresses to ~85 MB in memory on first nav query.
- Bundle remains read-only; all caches live under `tools/.cache/`.
