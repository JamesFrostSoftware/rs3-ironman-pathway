"""Export quest skill requirements from wiki bundle for guide-data.js."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from rs3wiki.bundle import resolve_bundle
from rs3wiki.graph import WikiGraph
from rs3wiki.index import WikiIndex

SKILLREQ = re.compile(r"\{\{Skillreq\|([^|]+)\|(\d+)\}\}", re.I)
SC = re.compile(r"\{\{sc\|([^|]+)\|(\d+)\}\}", re.I)
SKIP = {"combat", "quest", "quest points", "qp", "combat level"}


def parse_reqs_from_wikitext(wikitext: str) -> dict[str, int]:
    reqs: dict[str, int] = {}
    m = re.search(r"\|requirements\s*=\s*(.*?)(?=\n\|[a-z_]+\s*=|\n\}\})", wikitext, re.S | re.I)
    block = m.group(1) if m else wikitext
    for pat in (SKILLREQ, SC):
        for skill, lvl in pat.findall(block):
            skill = skill.strip()
            if skill.lower() in SKIP:
                continue
            try:
                lv = int(re.sub(r"[^0-9]", "", str(lvl)))
            except ValueError:
                continue
            reqs[skill] = max(reqs.get(skill, 0), lv)
    return reqs


def main() -> None:
    titles_path = ROOT / "data" / "quest-titles.txt"
    if titles_path.exists():
        quests = [ln.strip() for ln in titles_path.read_text(encoding="utf-8").splitlines() if ln.strip()]
    else:
        guide_text = (ROOT / "js" / "guide-data.js").read_text(encoding="utf-8")
        quests = list(dict.fromkeys(re.findall(r"q\('((?:\\'|[^'])+)'", guide_text)))
        quests = [q.replace("\\'", "'") for q in quests]

    paths = resolve_bundle(ROOT / "bundle")
    graph = WikiGraph(paths.graph)
    index = WikiIndex(paths.index)

    out: dict[str, list[dict[str, int | str]]] = {}
    for title in quests:
        node = graph.get_node(title)
        req_skills = None
        if node and isinstance(node, dict):
            intel = node.get("intel") or node.get("i") or {}
            if isinstance(intel, dict):
                quest_intel = intel.get("quest") or intel.get("q")
                if isinstance(quest_intel, dict) and quest_intel.get("req_skills"):
                    req_skills = quest_intel["req_skills"]

        if req_skills:
            out[title] = [
                {"skill": k, "level": int(v)}
                for k, v in sorted(req_skills.items(), key=lambda x: x[0])
            ]
            continue

        page = index.get_by_title(title)
        if not page:
            out[title] = []
            continue
        wt = str(page.get("x") or "")
        parsed = parse_reqs_from_wikitext(wt)
        out[title] = [
            {"skill": k, "level": v} for k, v in sorted(parsed.items(), key=lambda x: x[0])
        ]

    out_path = ROOT / "data" / "quest-requirements.json"
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(out)} quests ({sum(1 for v in out.values() if v)} with skill reqs) -> {out_path}")


if __name__ == "__main__":
    main()
