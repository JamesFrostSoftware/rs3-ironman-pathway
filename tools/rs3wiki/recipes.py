"""Parse crafting/smithing recipes from the wiki bundle (intel + wikitext)."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

from .graph import WikiGraph
from .index import WikiIndex

_WIKI_LINK = re.compile(r"\[\[([^|\]#]+)")
_INFobox_LINE = re.compile(r"^\|([^=|]+?)\s*=\s*(.+)$")


@dataclass
class RecipeMaterial:
    name: str
    qty: int = 1


@dataclass
class Recipe:
    title: str
    materials: list[RecipeMaterial] = field(default_factory=list)
    outputs: list[RecipeMaterial] = field(default_factory=list)
    skills: dict[str, int] = field(default_factory=dict)
    source: str = "unknown"


def clean_wiki_value(value: str) -> str:
    match = _WIKI_LINK.search(value)
    if match:
        return match.group(1).strip()
    return value.strip()


def parse_infobox_fields(wikitext: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for line in wikitext.splitlines():
        match = _INFobox_LINE.match(line.strip())
        if match:
            fields[match.group(1).strip().lower()] = match.group(2).strip()
    return fields


def recipe_from_intel(intel: dict[str, Any]) -> Recipe | None:
    raw = intel.get("recipe")
    if not isinstance(raw, dict):
        return None
    materials = raw.get("materials") or []
    outputs = raw.get("outputs") or []
    skills = raw.get("skills") or {}
    if not materials and not outputs:
        return None
    return Recipe(
        title="",
        materials=[RecipeMaterial(str(name), 1) for name in materials],
        outputs=[RecipeMaterial(str(name), 1) for name in outputs],
        skills={str(k): int(v) for k, v in skills.items()},
        source="intel",
    )


def recipe_from_wikitext(title: str, wikitext: str) -> Recipe | None:
    fields = parse_infobox_fields(wikitext)
    if not fields.get("mat1") and not fields.get("output1"):
        return None

    materials: list[RecipeMaterial] = []
    outputs: list[RecipeMaterial] = []
    idx = 1
    while f"mat{idx}" in fields:
        qty_raw = fields.get(f"mat{idx}qty", "1")
        try:
            qty = int(re.sub(r"[^\d]", "", qty_raw) or "1")
        except ValueError:
            qty = 1
        materials.append(RecipeMaterial(clean_wiki_value(fields[f"mat{idx}"]), qty))
        idx += 1

    idx = 1
    while f"output{idx}" in fields:
        qty_raw = fields.get(f"output{idx}qty", "1")
        try:
            qty = int(re.sub(r"[^\d]", "", qty_raw) or "1")
        except ValueError:
            qty = 1
        outputs.append(RecipeMaterial(clean_wiki_value(fields[f"output{idx}"]), qty))
        idx += 1

    if not materials and not outputs:
        return None
    return Recipe(title=title, materials=materials, outputs=outputs, source="wikitext")


def merge_wikitext_quantities(recipe: Recipe, wikitext: str) -> Recipe:
    """Fill missing per-material quantities from infobox matNqty / outputNqty fields."""
    fields = parse_infobox_fields(wikitext)
    for idx, material in enumerate(recipe.materials, start=1):
        qty_raw = fields.get(f"mat{idx}qty")
        if qty_raw:
            material.qty = int(re.sub(r"[^\d]", "", qty_raw) or "1")
    for idx, output in enumerate(recipe.outputs, start=1):
        qty_raw = fields.get(f"output{idx}qty")
        if qty_raw:
            output.qty = int(re.sub(r"[^\d]", "", qty_raw) or "1")
    return recipe


def get_page_wikitext(index: WikiIndex, title: str) -> str:
    page = index.get_by_title(title)
    return str((page or {}).get("x") or "")


def get_recipe(
    title: str,
    *,
    index: WikiIndex,
    graph: WikiGraph,
) -> Recipe | None:
    node = graph.get_node(title)
    wikitext = get_page_wikitext(index, title)
    intel = (node or {}).get("intel") or {}

    recipe = recipe_from_intel(intel)
    if recipe:
        recipe.title = title
        if wikitext:
            merge_wikitext_quantities(recipe, wikitext)
        return recipe

    recipe = recipe_from_wikitext(title, wikitext)
    if recipe:
        return recipe

    prereqs = graph.prerequisites(title, max_depth=1)
    goal_intel = prereqs.get("goal_intel") or {}
    recipe = recipe_from_intel(goal_intel)
    if recipe:
        recipe.title = title
        if wikitext:
            merge_wikitext_quantities(recipe, wikitext)
        return recipe
    return None


def smelt_materials(
    bar_title: str,
    *,
    index: WikiIndex,
    graph: WikiGraph,
) -> dict[str, int]:
    """Return ore/coal inputs for a smelted bar (qty 1 each unless wikitext says otherwise)."""
    recipe = get_recipe(bar_title, index=index, graph=graph)
    if recipe and recipe.materials:
        return {material.name: material.qty for material in recipe.materials}

    prereqs = graph.prerequisites(bar_title, max_depth=2, edge_types={"requires_material"})
    goal_recipe = (prereqs.get("goal_intel") or {}).get("recipe") or {}
    materials = goal_recipe.get("materials") or []
    if materials:
        return {name: 1 for name in materials}

    for edge in prereqs.get("chain", []):
        if edge.get("edge_type") != "requires_material":
            continue
        edge_recipe = (edge.get("from_intel") or {}).get("recipe") or {}
        edge_materials = edge_recipe.get("materials") or []
        if edge.get("from_title") == bar_title and edge_materials:
            return {name: 1 for name in edge_materials}
    return {}


def output_per_input(product_title: str, *, index: WikiIndex, graph: WikiGraph) -> int | None:
    recipe = get_recipe(product_title, index=index, graph=graph)
    if not recipe or not recipe.materials or not recipe.outputs:
        return None
    if len(recipe.materials) != 1 or len(recipe.outputs) != 1:
        return None
    material = recipe.materials[0]
    output = recipe.outputs[0]
    if material.qty <= 0:
        return None
    return output.qty // material.qty


def spell_runes(spell_title: str, *, index: WikiIndex) -> dict[str, int]:
    fields = parse_infobox_fields(get_page_wikitext(index, spell_title))
    runes: dict[str, int] = {}
    for idx in range(1, 4):
        name_raw = fields.get(f"rune{idx}")
        if not name_raw:
            continue
        name = clean_wiki_value(name_raw)
        if "rune" not in name.lower():
            name = f"{name} rune"
        qty_raw = fields.get(f"rune{idx}qty") or fields.get(f"rune{idx}num") or "1"
        runes[name] = int(re.sub(r"[^\d]", "", qty_raw) or "1")
    return runes


def prose_ratio(index: WikiIndex, *, page: str, pattern: str) -> str | None:
    wikitext = get_page_wikitext(index, page)
    match = re.search(pattern, wikitext, re.I)
    return match.group(0) if match else None
