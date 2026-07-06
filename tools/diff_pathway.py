#!/usr/bin/env python3
"""Diff current guide-data.js against parsed original pathway."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def quest_title(activity: str) -> str | None:
    m = re.match(r"^([^(]+?)(?:\s*\(|$)", activity.strip())
    if not m:
        return None
    title = m.group(1).strip()
    if title.lower().startswith(
        (
            "train ",
            "build ",
            "purchase ",
            "obtain ",
            "complete ",
            "activate ",
            "gather ",
            "get ",
            "start ",
            "create ",
            "open ",
            "talk ",
            "skip ",
            "level ",
            "while ",
            "go ",
            "collect ",
            "perform ",
            "claim ",
            "buy ",
            "cook ",
            "fish ",
            "make ",
            "travel ",
            "sail ",
            "teleport ",
            "fill ",
            "cut ",
            "kill ",
            "run ",
            "steal ",
            "repair ",
            "cast ",
            "farm ",
            "chop ",
            "smith ",
            "daily ",
            "you can",
        )
    ):
        return None
    return title


def match_current(activity: str, current_titles: list[str], used: set[str]) -> str | None:
    act_norm = normalize(activity)
    q = quest_title(activity)
    for title in current_titles:
        if title in used:
            continue
        if normalize(title) == act_norm:
            return title
        if q and normalize(q) == normalize(title):
            return title
        if act_norm in normalize(title) or normalize(title) in act_norm:
            return title
    return None


def main() -> int:
    orig = json.loads((ROOT / "data" / "original-pathway.json").read_text(encoding="utf-8"))
    cache = ROOT / "tools" / ".cache" / "guide-steps.json"
    subprocess.run(["node", str(ROOT / "tools" / "export_guide.mjs"), str(cache)], check=True, cwd=ROOT)
    cur = json.loads(cache.read_text(encoding="utf-8"))
    by_part: dict[str, list[str]] = {}
    for step in cur:
        by_part.setdefault(step["partId"], []).append(step["title"])

    for part in ("part1", "part2", "part3", "part4", "part5"):
        rows = orig["parts"].get(part, [])
        titles = by_part.get(part, [])
        used: set[str] = set()
        missing = []
        for i, row in enumerate(rows, 1):
            hit = match_current(row["activity"], titles, used)
            if hit:
                used.add(hit)
            else:
                missing.append((i, row["activity"], row["notes"][:80]))
        print(f"=== {part}: original {len(rows)} current {len(titles)} matched {len(used)} missing {len(missing)}")
        for i, act, notes in missing[:40]:
            print(f"  {i:3d} | {act[:90]}")
        if len(missing) > 40:
            print(f"  ... {len(missing) - 40} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
