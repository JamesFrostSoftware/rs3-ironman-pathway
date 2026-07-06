#!/usr/bin/env python3
"""Verify step-materials smelt/nail math against the local wiki bundle only."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from rs3wiki.bundle import resolve_bundle
from rs3wiki.graph import WikiGraph
from rs3wiki.index import WikiIndex
from rs3wiki.recipes import get_page_wikitext, get_recipe, output_per_input, smelt_materials, spell_runes

CANON = {
    "nails_per_bar": 75,
    "steel_bar": {"Iron ore": 1, "Coal": 1},
    "mithril_bar": {"Mithril ore": 1, "Coal": 1},
    "rune_bar": {"Runite ore": 1, "Luminite": 1},
    "iron_bar": {"Iron ore": 1},
    "stone_wall_segment_ratio": 4,
}


def verify_bar_smelt(
    bar: str,
    expected: dict[str, int],
    *,
    index: WikiIndex,
    graph: WikiGraph,
) -> list[str]:
    errors: list[str] = []
    got = smelt_materials(bar, index=index, graph=graph)
    for mat, qty in expected.items():
        if got.get(mat) != qty:
            errors.append(f"{bar}: expected {mat}×{qty}, bundle has {got or 'no smelt recipe'}")
    return errors


def verify_nails(
    nail: str,
    *,
    index: WikiIndex,
    graph: WikiGraph,
) -> list[str]:
    errors: list[str] = []
    per_bar = output_per_input(nail, index=index, graph=graph)
    if per_bar != CANON["nails_per_bar"]:
        errors.append(f"{nail}: expected {CANON['nails_per_bar']} nails/bar, bundle has {per_bar}")

    wikitext = index.page_summary(nail, wikitext_chars=4000)
    excerpt = (wikitext or {}).get("wikitext_excerpt") or ""
    if "output1qty = 75" not in excerpt:
        errors.append(f"{nail}: bundle wikitext missing output1qty = 75")
    return errors


def scan_step_materials() -> list[str]:
    text = (ROOT / "js" / "step-materials.js").read_text(encoding="utf-8")
    errors: list[str] = []
    if "15 nails/bar" in text or "15 nails per" in text:
        errors.append("step-materials.js still mentions 15 nails/bar")
    if re.search(r"10 iron ore \+ 20 coal", text):
        errors.append("step-materials.js still has wrong 10 steel bar smelt (20 coal)")
    if "runite ore + 120 coal" in text.lower():
        errors.append("step-materials.js still uses coal for rune bars (should be luminite)")
    if "oak planks each" in text and "stone wall" in text:
        errors.append("step-materials.js still has oak planks in stone wall segments")
    if "cosmic + water runes" in text.lower():
        errors.append("step-materials.js still lists water runes for Lvl-2 Enchant (bundle: air + cosmic)")
    if re.search(r"see sign of the porter wiki", text, re.I):
        errors.append("step-materials.js still references live wiki instead of bundle")
    return errors


def verify_bundle_constants(*, index: WikiIndex, graph: WikiGraph) -> list[str]:
    errors: list[str] = []
    training_text = get_page_wikitext(index, "Construction/training")
    if "four-to-one ratio" not in training_text.lower():
        errors.append("Construction/training bundle page missing stone wall segment 4:1 prose")
    if "Kitchen]] T2" not in training_text:
        errors.append("Construction/training bundle page missing Kitchen T2 material table")

    lvl2 = spell_runes("Lvl-2 Enchant", index=index)
    if lvl2.get("Air rune") != 3 or lvl2.get("Cosmic rune") != 1:
        errors.append(f"Lvl-2 Enchant runes mismatch: {lvl2}")

    emerald = get_recipe("Emerald bracelet", index=index, graph=graph)
    if not emerald or {m.name for m in emerald.materials} != {"Gold bar", "Emerald"}:
        errors.append("Emerald bracelet recipe not confirmed in bundle (expected gold bar + emerald)")
    return errors


def main() -> int:
    bundle = resolve_bundle(ROOT / "bundle")
    index = WikiIndex(bundle.index)
    graph = WikiGraph(bundle.graph)

    errors: list[str] = []
    errors.extend(scan_step_materials())
    errors.extend(verify_bundle_constants(index=index, graph=graph))
    errors.extend(verify_bar_smelt("Steel bar", CANON["steel_bar"], index=index, graph=graph))
    errors.extend(verify_bar_smelt("Rune bar", CANON["rune_bar"], index=index, graph=graph))
    for nail in ("Steel nails", "Mithril nails", "Rune nails"):
        errors.extend(verify_nails(nail, index=index, graph=graph))

    if errors:
        print("Recipe verification FAILED:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("Recipe verification OK (bundle + step-materials scan)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
