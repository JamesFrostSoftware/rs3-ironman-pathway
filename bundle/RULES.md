# RuneScape Wiki Knowledge Bundle — AI Reasoning Rules

> **Read this file first.** You do not need the indexer codebase — only this folder.
> Apply these rules to `data/wiki.rs3wi` and `data/wiki.rs3wg` to answer any wiki question.

---

## 1. Package contents

| File | Role |
|------|------|
| `RULES.md` | This document — how to reason over the data |
| `MANIFEST.json` | Build metadata, file paths, page counts |
| `data/wiki.rs3wi` | Every wiki page: wikitext, categories, metadata |
| `data/wiki.rs3wg` | Typed relationships + extracted intel between pages |
| `data/wiki.rs3nav` | Facet index for discovery without scanning all pages |

Copy the entire `bundle/` folder into your project. No other dependencies required.

---

## 1.1 Do you need to scan every page?

**No.** The index has ~910,000 pages (~1–2 GB). An AI cannot read them all — context limits alone make that impossible, and even automated sequential lookup would take hours.

| Operation | Speed | When to use |
|-----------|-------|-------------|
| Exact title lookup (`.rs3wi`) | ~0.01 ms | You know the page title |
| Prefix title search (`.rs3wi`) | ~1 ms + matches | You know title starts with "Dragon" |
| Graph backward traversal (`.rs3wg`) | ~ms per hop | You have a goal, need prerequisites |
| Facet query (`.rs3nav`) | ~ms | You know the *type* of page, not the title |

**Workflow:** use `.rs3nav` to find candidates → verify top matches in `.rs3wi` → use `.rs3wg` for dependency chains.

The navigation index is **not a subjective relevance score**. It is a deterministic registry of extracted facts (page type, skill XP, item tier, combat level) built at index time. Always confirm candidates against full wikitext before recommending.

---

## 1.2 Navigation index (`wiki.rs3nav`) — dynamic, not hardcoded

The nav index is **auto-generated** from per-page signals. It is not a fixed list of use cases.

| Component | Role |
|-----------|------|
| `signals` | Per-page extracted facts (source of truth) |
| `schema` | **Read this first** — every queryable path and its type |
| `index` | Inverted index built automatically from signals |

**Any new field added to extraction becomes a new query path on rebuild.** You do not need code changes for new facet types.

### How to query (any use case)

1. **Discover paths** — load `schema`, find a path matching your need (or closest prefix)
2. **Query index** — traverse `index` by dot-separated path
3. **Fallback** — if no path exists: scan `signals` by tag/type, or prefix-search `.rs3wi`

### Example paths (illustrative — your build's `schema` is authoritative)

| Path | Finds |
|------|-------|
| `pt.quest` | Quest pages |
| `intel.quest.skill_xp.Attack` | Pages with Attack XP rewards (sorted by amount) |
| `intel.skill_req.Attack.75` | Pages requiring Attack 75 |
| `intel.item.tier.50` | Tier-50 items |
| `intel.monster.combat_level.624` | Monsters at combat level 624 |
| `tag.has:skill_xp` | Pages tagged as having skill XP |
| `tag.has:training` | Training-related pages |
| `category.<name>` | Pages in that wiki category |
| `title_suffix.Training` | Pages like `Attack/Training` |

Tags are **derived from content** (`has:recipe`, `type:monster`, `f2p`) — not a curated list.

### When the index cannot help

Some facts only exist in prose, not infoboxes. For those:
1. Prefix-search titles in `.rs3wi`
2. Load candidate pages and parse wikitext (see §4.1 patterns)
3. Use `.rs3wg` graph traversal for relationships

The index covers **structured extraction**; RULES.md covers **everything else**.

---

## 2. File formats (summary)

Full binary layout specs are embedded at the top of each data file. Read until `---END-HEADER---`, then parse the `#META:` JSON line.

### 2.1 Page index (`wiki.rs3wi`)

Lookup by **title** (binary search on sorted title index) or **pageid**.

Record fields after decompress:

| Field | Meaning |
|-------|---------|
| `t` | Page title |
| `i` | Pageid |
| `n` | Namespace (0=article, 6=File, 14=Category…) |
| `x` | Full wikitext source |
| `c` | Categories |
| `rd` | Redirect target if redirect |

### 2.2 Correlation graph (`wiki.rs3wg`)

Nodes = wiki pages. Edges = typed relationships.

**Node fields:**

| Field | Meaning |
|-------|---------|
| `t` | Title |
| `i` | Pageid (join to `.rs3wi`) |
| `pt` | Page type: `item`, `monster`, `quest`, `article`, `category` |
| `m` | Members only |
| `intel` | Extracted structured facts (see §4) |

**Edge types (for prerequisite traversal):**

| Type | Direction | Meaning |
|------|-----------|---------|
| `requires_material` | material → product | Crafting ingredient |
| `requires_skill` | skill → page | Skill level gate (`l` = level) |
| `requires_quest` | quest → page | Quest must be complete |
| `drops` | monster → item | Item drops from monster |

Traverse **backward** from goal: use `in_edges` (edges pointing TO the goal node).

---

## 3. Universal reasoning algorithm

Use this for **any** goal (item, quest, boss, location, skill target):

```
function plan(goal_title, account_state):
  1. RESOLVE    — Find exact title in index (handle redirects via `rd`)
  2. DEPEND     — BFS/DFS backward on graph using edge types in §2.2
  3. ENRICH     — For each node, load wikitext from index + node.intel
  4. GAP        — Compare skill/quest gates vs account_state
  5. RESOLVE_GAPS — Apply rules in §5–§8 (do NOT use hardcoded paths)
  6. ORDER      — Topological sort: deepest dependencies first
  7. NARRATE    — Output phased plan with wiki citations (title + excerpt)
```

---

## 4. Using extracted intel (`node.intel`)

The graph pre-extracts facts from wikitext so you can reason without re-parsing templates.

```json
{
  "item": { "tier": 75, "attack_req": 75, "damage": 1676, "style": "melee", "slot": "weapon" },
  "monster": { "combat_level": 624, "lifepoints": 40000, "recommended_weapon_tier": 70 },
  "quest": { "skill_xp": {"Attack": 13750, "Strength": 13750}, "quest_points": 1 },
  "recipe": { "materials": ["Godsword blade", "Bandos hilt"], "skills": {"Crafting": 1} }
}
```

**Rule:** Prefer `intel` when present. Fall back to parsing `x` (wikitext) when intel is missing or incomplete.

### 4.1 Wikitext patterns to parse when intel is absent

| Pattern | Extract |
|---------|---------|
| `{{Sxp\|Skill\|amount}}` | Quest XP reward |
| `{{sc\|skill\|level}}` | Skill requirement |
| `tier N melee` | Item tier |
| `requires level N [[Skill]]` | Skill gate |
| `{{Infobox Recipe\|...}}` | Materials (`mat1`, `mat2`), outputs (`output1`) |
| `{{DropsLine\|name=Item\|...}}` | Drop source |
| `{{Quest rewards\|...}}` | Quest metadata |

---

## 5. Rules: skill gaps

When a node requires skill level `L` and account has level `A` where `A < L`:

### Rule 5.1 — Quest XP first
Search the index for pages with `pt=quest` or category containing `Quest`. For each quest not yet completed:
- Parse `intel.quest.skill_xp` or `{{Sxp|...}}` in wikitext
- Check quest requirements (`intel.quest.req_skills`, wikitext prose, `{{Questreq}}`)
- If completable now, add quest step **before** grinding

**Efficiency heuristic:** Prefer quests giving XP in the target skill with low requirements and short estimated length (infer from quest difficulty/category; favour famous XP quests when wiki mentions large rewards).

### Rule 5.2 — Training second
Only after exhausting viable quests, plan training for `L - A` levels.

Discover training methods from wiki (do not assume fixed monsters):
1. Search category `Category:Free-to-play combat training` or `Category:Members combat training`
2. Search pages like `Attack/Training`, `Strength training`, `Pay-to-play melee training`
3. Read recommended monsters by level band from those guides
4. Pick monster at or below account combat level with good XP/hour mentioned in wiki

**Heuristic:** Lower levels → low-HP creatures near banks. Mid levels → crabs/sand crabs if members. High levels → slayer creatures or abyssal demons when wiki recommends.

### Rule 5.3 — XP arithmetic
RS3/OSRS use the same XP table. To compute levels from XP rewards:
- Sum quest XP for a skill, add to current XP, convert to level
- Only grind the remainder

---

## 6. Rules: gear progression

Never jump to endgame gear. Build a **tier ladder dynamically** from the index.

### Rule 6.1 — Discover gear options
For the required combat style (usually melee):
1. Prefix-search titles: `Bronze scimitar`, `Iron scimitar`, … OR search `scimitar` / `sword` / style name
2. From each item page, read `intel.item.tier` and `intel.item.attack_req`
3. Sort by tier ascending

### Rule 6.2 — Realistic selection
Given account Attack level `A` and target content tier `T`:
- Equip the **highest tier item where `attack_req <= A`**
- Cap at `T + 10` — do not recommend gear far above content requirements
- Exclude items whose wikitext indicates special unlock (quest boss, raid, high slayer) unless that content is already in the dependency tree

### Rule 6.3 — Obtain method
For chosen gear, read wikitext:
- `buy` / GE / shop locations → add buy step
- `Creation` / `Infobox Recipe` → add craft step with materials from graph
- Quest reward → link to quest in plan

### Rule 6.4 — Boss gear
For `drops` edges (need to kill monster M for item I):
1. Load monster node `intel.monster` or strategy subpage (`M/Strategies`)
2. Read recommended weapon/armour/prayer levels from strategy wikitext
3. Set skill targets to at least those recommendations before boss step
4. Select gear per Rule 6.2 at those levels

---

## 7. Rules: quest and area unlocks

### Rule 7.1 — Quest chains
For each `requires_quest` edge, add quest completion. Check that quest's requirements recursively (other quests, skills) using its wikitext and graph edges.

### Rule 7.2 — Discovering quest order
Topological sort quests by requirements. Parse from each quest page:
- `{{Questreq|...}}` or requirement sections in wikitext
- Links to prerequisite quests in prose

### Rule 7.3 — Area access
When wikitext mentions "requires completion of [[Quest]]" or "defeated [[NPC]] in the [[Quest]] quest", add to unlock chain.

---

## 8. Rules: obtaining items

Apply by edge type:

| Edge | Action |
|------|--------|
| `requires_material` | Obtain material (craft, buy, or trace further dependencies) |
| `drops` | Kill monster; check strategy page for safe setup |
| `requires_quest` | Complete quest (may also unlock drops/areas) |
| `requires_skill` | Resolve via §5 |

For craftable items, follow `intel.recipe.materials` and recurse each material.

---

## 9. Account state model

Track throughout planning:

```json
{
  "skills": {"Attack": 3, "Strength": 3, "Defence": 3, "Prayer": 1},
  "quests_completed": [],
  "members": true,
  "gear": {"weapon": null, "body": null},
  "inventory_gold": 0
}
```

After each planned step, update state (XP from quests, levels from training, gear from upgrades).

---

## 10. Efficiency heuristics (generic)

| Priority | Rule |
|----------|------|
| 1 | Quest XP before grinding when quest gives target skill XP |
| 2 | Lower requirement quests before higher |
| 3 | Gear upgrades only at tier breakpoints (when attack_req exceeds current weapon) |
| 4 | Do not farm endgame bosses before meeting strategy page recommendations |
| 5 | Combine skill training where wiki suggests (e.g. shared combat stats) |
| 6 | Prefer members methods when `members=true` and wiki marks them as faster |

These are **rules**, not fixed paths. Always cite the wiki page that justified each choice.

---

## 11. Output format

Produce plans in phases:

```
## Goal: <title>
## Account: <state summary>

### Phase: unlock
- Complete [[Quest]] — required for [[Area]] (cite wiki excerpt)

### Phase: quest_xp  
- Complete [[Waterfall Quest]] — +13750 Attack XP (cite {{Sxp}} from page)

### Phase: training
- Train Attack 40→75 on [monsters from training guide] — cite training page

### Phase: gear
- Upgrade to [[Rune scimitar]] — tier 50, attack req 50 (cite item page)

### Phase: boss
- Kill [[General Graardor]] for [[Bandos hilt]] — cite drop line + strategy reqs

### Phase: craft
- Combine [[Bandos hilt]] + [[Godsword blade]] → [[Bandos godsword]]
```

---

## 12. Worked example (illustrating rules, not a script)

**Goal:** `Bandos godsword` | **Account:** Attack 3, members

1. **Resolve** → load BGS page. `intel.recipe.materials` = [Godsword blade, Bandos hilt]. Attack req 75.
2. **Depend** → graph backward: hilt drops from General Graardor; blade needs shards; GWD needs Troll Stronghold quest chain + 60 Str/Agi.
3. **Quest XP** → search quest pages with Attack XP; find Waterfall Quest, Fight Arena from wiki (not hardcoded). Add if requirements met.
4. **Train** → remaining Attack gap; read `Attack/Training` for level-appropriate monsters.
5. **Gear** → search scimitar tier ladder; upgrade at 10/20/30/40/50/60 breakpoints.
6. **Boss** → read `General Graardor/Strategies` for 70/70/43 prayer; meet before farming.
7. **Craft** → assemble at anvil per recipe wikitext.

---

## 13. Lookup cheat sheet

| Task | How |
|------|-----|
| Find page by title | Title binary search in `.rs3wi` |
| Find pages by type/fact | Load `schema` in `.rs3nav`, query matching `index` path |
| List available query paths | `.rs3nav` → `schema` |
| Quest XP candidates | `index` → `intel.quest.skill_xp.<Skill>` |
| Gear at tier N | `index` → `intel.item.tier.<N>` |
| No matching path | Scan `signals` by tag, or prefix-search `.rs3wi` |
| Prerequisites | Backward traversal on `.rs3wg` in_edges |
| What drops item X | `in_edges` on X with type `drops` |
| What item needs | `in_edges` on item with type `requires_material` |
| Quest XP | Node `intel.quest` or parse `{{Sxp}}` in wikitext |
| Item tier/reqs | Node `intel.item` or Infobox Bonuses in wikitext |
| Boss requirements | `intel.monster` or `/Strategies` subpage |
| Training methods | Search training guide pages in index |
| Category members | Pages linked via `in_category` edges or `c` field |

---

## 14. Limitations

- Graph edges are extracted automatically; rare requirements may only exist in prose — always read `x` when intel is empty.
- XP/time estimates require inference from wiki text; state assumptions.
- GE prices and meta shifts are not in the bundle; cite wiki, note when live data may differ.

---

*Bundle generated from https://runescape.wiki/ — content © Jagex and wiki contributors.*
