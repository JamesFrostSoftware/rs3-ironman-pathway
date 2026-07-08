"""Generate js/quest-requirements.js from data/quest-requirements.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "quest-requirements.json"
OUT = ROOT / "js" / "quest-requirements.js"

HEADER = """/**
 * Wiki minimum skill requirements for quests (from bundle export).
 * Regenerate: python tools/export_quest_reqs.py && python tools/build_quest_requirements_js.py
 */
"""


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    lines = [
        HEADER.strip(),
        "",
        "/** @type {Record<string, Array<{ skill: string, level: number }>>} */",
        "export const QUEST_REQUIREMENTS = ",
        json.dumps(data, indent=2, ensure_ascii=False),
        ";",
        "",
        "export function getQuestRequirements(title) {",
        "  return QUEST_REQUIREMENTS[title] ? [...QUEST_REQUIREMENTS[title]] : [];",
        "}",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(data)} quests)")


if __name__ == "__main__":
    main()
