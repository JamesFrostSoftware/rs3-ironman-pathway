from __future__ import annotations

import json
import re
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SKILL_ORDER = [
    "Overall",
    "Attack",
    "Defence",
    "Strength",
    "Constitution",
    "Ranged",
    "Prayer",
    "Magic",
    "Cooking",
    "Woodcutting",
    "Fletching",
    "Fishing",
    "Firemaking",
    "Crafting",
    "Smithing",
    "Mining",
    "Herblore",
    "Agility",
    "Thieving",
    "Slayer",
    "Farming",
    "Runecrafting",
    "Hunter",
    "Construction",
    "Summoning",
    "Dungeoneering",
    "Divination",
    "Invention",
    "Archaeology",
    "Necromancy",
]

HISCORE_TABLES = {
    "ironman": "hiscore_ironman",
    "hardcore": "hiscore_hardcore_ironman",
    "normal": "hiscore",
}


@dataclass
class AccountState:
    rsn: str
    game_mode: str = "ironman"
    skills: dict[str, int] = field(default_factory=dict)
    xp: dict[str, int] = field(default_factory=dict)
    total_level: int = 0
    combat_level: int = 3
    quest_points: int | None = None
    quests_complete: int | None = None
    completed_quest_titles: set[str] = field(default_factory=set)
    runemetrics_error: str | None = None
    synced_at: str | None = None

    def to_json(self) -> dict[str, Any]:
        data = asdict(self)
        data["completed_quest_titles"] = sorted(self.completed_quest_titles)
        return data

    @classmethod
    def from_json(cls, data: dict[str, Any]) -> AccountState:
        titles = data.get("completed_quest_titles") or []
        return cls(
            rsn=data.get("rsn", ""),
            game_mode=data.get("game_mode", "ironman"),
            skills=data.get("skills") or {},
            xp=data.get("xp") or {},
            total_level=int(data.get("total_level") or 0),
            combat_level=int(data.get("combat_level") or 3),
            quest_points=data.get("quest_points"),
            quests_complete=data.get("quests_complete"),
            completed_quest_titles=set(titles),
            runemetrics_error=data.get("runemetrics_error"),
            synced_at=data.get("synced_at"),
        )

    def skill_level(self, skill: str) -> int | None:
        if skill in {"Combat", "Any Port Skill"}:
            return None
        if skill == "Quest Points":
            return self.quest_points
        return self.skills.get(skill)

    def meets(self, requirements: list[dict[str, Any]]) -> tuple[bool, list[dict[str, Any]]]:
        gaps: list[dict[str, Any]] = []
        for req in requirements or []:
            skill = req.get("skill")
            need = int(req.get("level") or 0)
            if skill == "Combat":
                have = self.combat_level
            elif skill == "Quest Points":
                have = self.quest_points or 0
            elif skill in {"Any Port Skill"}:
                continue
            else:
                have = self.skills.get(skill, 1)
            if have < need:
                gaps.append({"skill": skill, "have": have, "need": need, "missing": need - have})
        return (len(gaps) == 0, gaps)


def normalize_quest_title(title: str) -> str:
    cleaned = (
        title.lower()
        .replace("(miniquest)", "")
        .replace("(quick guide)", "")
        .replace("'", "")
    )
    cleaned = re.sub(r"[^a-z0-9 ]", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def quest_completed(title: str, completed_titles: set[str]) -> bool:
    normalized = normalize_quest_title(title)
    if normalized in completed_titles:
        return True
    for ct in completed_titles:
        if normalized in ct or ct in normalized:
            return True
    aliases = [
        ("dimension of disaster demon slayer", "demon slayer"),
        ("tears of guthix quest", "tears of guthix"),
    ]
    for left, right in aliases:
        if left in normalized and right in completed_titles:
            return True
    return False


def estimate_combat_level(skills: dict[str, int]) -> int:
    base = 0.25 * (
        skills.get("Defence", 1)
        + skills.get("Constitution", 1)
        + (skills.get("Constitution", 1) // 2)
        + (skills.get("Prayer", 1) // 2)
    )
    melee = 0.325 * (skills.get("Attack", 1) + skills.get("Strength", 1))
    ranged = 0.325 * ((skills.get("Ranged", 1) // 2) + skills.get("Ranged", 1))
    magic = 0.325 * ((skills.get("Magic", 1) // 2) + skills.get("Magic", 1))
    necro = 0.325 * ((skills.get("Necromancy", 1) // 2) + skills.get("Necromancy", 1))
    return int(base + max(melee, ranged, magic, necro))


def fetch_hiscores(rsn: str, game_mode: str = "ironman") -> dict[str, Any]:
    slug = rsn.strip().replace(" ", "_")
    table = HISCORE_TABLES.get(game_mode, HISCORE_TABLES["ironman"])
    url = f"https://secure.runescape.com/m={table}/index_lite.ws?player={urllib.parse.quote(slug)}"
    text = _fetch_text(url)
    lines = text.strip().splitlines()
    if len(lines) < len(SKILL_ORDER):
        raise ValueError("Unexpected hiscores response")
    skills: dict[str, int] = {}
    xp: dict[str, int] = {}
    for name, line in zip(SKILL_ORDER, lines):
        parts = line.split(",")
        level = int(parts[1])
        amount = int(parts[2])
        if name != "Overall":
            skills[name] = level
        xp[name] = amount
    profile_skills = {name: skills[name] for name in skills}
    return {
        "skills": profile_skills,
        "xp": xp,
        "total_level": int(lines[0].split(",")[1]),
        "combat_level": estimate_combat_level(profile_skills),
    }


def fetch_runemetrics_quests(rsn: str) -> dict[str, Any]:
    slug = urllib.parse.quote(rsn.strip().replace(" ", "%20"))
    url = f"https://apps.runescape.com/runemetrics/quests?user={slug}"
    data = _fetch_json(url)
    if data.get("error") == "NO_PROFILE" or not data.get("quests"):
        return {
            "error": "NO_PROFILE",
            "quest_points": None,
            "quests_complete": 0,
            "completed_quest_titles": set(),
        }
    completed = [q for q in data["quests"] if q.get("status") == "COMPLETED"]
    titles = {normalize_quest_title(q.get("title", "")) for q in completed}
    quest_points = sum(int(q.get("questPoints") or 0) for q in completed)
    return {
        "error": None,
        "quest_points": quest_points,
        "quests_complete": len(completed),
        "completed_quest_titles": titles,
    }


def sync_account(
    rsn: str,
    *,
    game_mode: str = "ironman",
    cache_path: Path | None = None,
) -> AccountState:
    hiscores = fetch_hiscores(rsn, game_mode)
    quests = fetch_runemetrics_quests(rsn)
    state = AccountState(
        rsn=rsn.strip(),
        game_mode=game_mode,
        skills=hiscores["skills"],
        xp=hiscores["xp"],
        total_level=hiscores["total_level"],
        combat_level=hiscores["combat_level"],
        quest_points=quests.get("quest_points"),
        quests_complete=quests.get("quests_complete"),
        completed_quest_titles=quests.get("completed_quest_titles") or set(),
        runemetrics_error=quests.get("error"),
        synced_at=datetime.now(timezone.utc).isoformat(),
    )
    if cache_path:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(state.to_json(), indent=2), encoding="utf-8")
    return state


def load_account_cache(cache_path: Path) -> AccountState | None:
    if not cache_path.exists():
        return None
    return AccountState.from_json(json.loads(cache_path.read_text(encoding="utf-8")))


def _fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "rs3-ironman-pathway-guide-agent/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _fetch_json(url: str) -> dict[str, Any]:
    text = _fetch_text(url)
    return json.loads(text)
