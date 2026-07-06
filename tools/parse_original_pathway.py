#!/usr/bin/env python3
"""Parse original Efficient Ironman Pathway Guide wikitext table into ordered steps."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "original-pathway-source.wikitext"
FALLBACK = Path(
    r"C:\Users\james\.cursor\projects\c-Users-james-Projects-rs3-ironman-pathway"
    r"\agent-tools\7d2fb4c1-a08e-4a60-9175-d42a13ad7a95.txt"
)

PART_TABLE = [
    ("part1", "EIP1", "EIP2"),
    ("part2", "EIP2", "EIP3"),
    ("part3", "EIP3", "EIP4"),
    ("part4", "EIP4", "EIP5"),
    ("part5", "EIP5", "==Part 6:"),
]


def clean_wiki(text: str) -> str:
    text = re.sub(r"\{\{QuestIcon\|([^}|]+)[^}]*\}\}", r"\1", text)
    text = re.sub(r"\{\{[^|{}|]*\|([^}|]+)[^}]*\}\}", r"\1", text)
    text = re.sub(r"\{\{[^}]+\}\}", "", text)
    text = re.sub(r"\[\[([^|\]#]+)(?:\|[^\]]+)?\]\]", r"\1", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"'''+?", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip(" |")


def parse_rows(blob: str) -> list[dict]:
    rows: list[dict] = []
    for chunk in blob.split("|- data-rowid"):
        if not chunk.strip():
            continue
        m_id = re.match(r'\s*=\s*"([^"]+)"', chunk)
        row_id = m_id.group(1) if m_id else None
        cells = [clean_wiki(c) for c in re.findall(r"\n\|([^\n][^\n]*)", chunk)]
        if not cells:
            continue
        rows.append(
            {
                "rowId": row_id,
                "activity": cells[0],
                "notes": cells[1] if len(cells) > 1 else "",
            }
        )
    return rows


def extract_table(text: str, start_id: str, end_marker: str) -> list[dict]:
    start_match = re.search(r"\{\|[^\n]*data-tableid=\"" + re.escape(start_id) + r"\"", text)
    if not start_match:
        return []
    table_start = start_match.start()
    end_pos = text.find(end_marker, start_match.end())
    if end_pos < 0:
        end_pos = len(text)
    return parse_rows(text[table_start:end_pos])


def main() -> int:
    if not SOURCE.exists() and FALLBACK.exists():
        SOURCE.parent.mkdir(parents=True, exist_ok=True)
        SOURCE.write_text(FALLBACK.read_text(encoding="utf-8"), encoding="utf-8")
    if not SOURCE.exists():
        print(f"Missing source: {SOURCE}", file=sys.stderr)
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    parts = {
        part: extract_table(text, start_id, end_marker)
        for part, start_id, end_marker in PART_TABLE
    }
    out = ROOT / "data" / "original-pathway.json"
    payload = {
        "source": str(SOURCE),
        "parts": parts,
        "counts": {k: len(v) for k, v in parts.items()},
    }
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps(payload["counts"], indent=2))
    for i, row in enumerate(parts["part1"], 1):
        act = row["activity"].lower()
        if "ancient awakening" in act or "botanist" in act:
            print(i, row["activity"][:120])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
