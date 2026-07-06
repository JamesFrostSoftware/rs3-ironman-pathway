from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

from .account import AccountState, quest_completed
from .graph import WikiGraph
from .index import WikiIndex


class GuideAnalyzer:
    OPTIONAL_SIDE_TITLES = {
        "PoF prep: verify 17 Farming & 20 Construction",
        "Purchase small pen deed (I) from Farmers' Market",
        "Set up pre-64 PoF: breeding pen + small pens",
        "Daily PoF: check animals, collect beehives, sell adolescents (pre-64)",
        "PoF: purchase medium pen deed (I) when you reach 35 Farming",
        "PoF: purchase large pen deed (I) when you reach 49 Farming",
        "PoF: place grey chinchompas in small pens (Farming 54+)",
        "PoF post-64: spider breeding pair from Lumbridge Catacombs",
        "PoF: unlock shop rewards in order",
        "PoF post-unlocks pen setup",
        "PoF: after all shop unlocks, grow animals to elder",
        "Pathfinder equipment + Ring of potency (Gudrik)",
        "Silverhawk boots from Diango",
        "Enhanced Excalibur (hard Seers' Village achievements)",
        "Craft spiky vambraces (as Ranged allows)",
        "Broken Home",
        "Assemble slayer helmet",
        "Equip Salve amulet (e) vs undead bosses",
        "Requiem for a Dragon",
        "Contact!",
        "Animal Magnetism",
        "Curse of the Black Stone",
        "Illuminate god book",
        "Buy Ring of vigour (50,000 DG tokens)",
        "Buy Spirit cape (45,000 DG tokens)",
        "War's Retreat — progress War's Wares unlocks",
        "Beneath Scabaras' Sands",
        "Succession",
        "Daughter of Chaos",
        "Song from the Depths",
        "Twilight of the Gods",
        "Elite dungeon chest upgrade (750,000 DG tokens)",
        "The Brink of Extinction",
        "The Elder Kiln",
        "Reaper store: Reaper's Choice + Instance cost + Death's Support",
        "Reaper Crew — defeat every Reaper boss once",
    }

    def __init__(
        self,
        *,
        project_root: Path,
        wiki_index: WikiIndex,
        wiki_graph: WikiGraph,
        account: AccountState | None = None,
    ):
        self.project_root = project_root.resolve()
        self.wiki_index = wiki_index
        self.wiki_graph = wiki_graph
        self.account = account
        self._steps: list[dict[str, Any]] | None = None

    @property
    def steps_cache_path(self) -> Path:
        return self.project_root / "tools" / ".cache" / "guide-steps.json"

    @property
    def export_script(self) -> Path:
        return self.project_root / "tools" / "export_guide.mjs"

    @property
    def progress_cache_path(self) -> Path:
        return self.project_root / "tools" / ".cache" / "guide-progress.json"

    @property
    def progress_export_script(self) -> Path:
        return self.project_root / "tools" / "export_wiki_progress.mjs"

    def export_steps(self, *, force: bool = False) -> list[dict[str, Any]]:
        if self._steps is not None and not force:
            return self._steps
        cache = self.steps_cache_path
        if cache.exists() and not force:
            self._steps = json.loads(cache.read_text(encoding="utf-8"))
            return self._steps

        cache.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["node", str(self.export_script), str(cache)],
            cwd=self.project_root,
            check=True,
        )
        self._steps = json.loads(cache.read_text(encoding="utf-8"))
        return self._steps

    def load_progress(self, *, force: bool = False) -> dict[str, Any]:
        cache = self.progress_cache_path
        if cache.exists() and not force:
            return json.loads(cache.read_text(encoding="utf-8"))
        cache.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["node", str(self.progress_export_script), str(cache), "wiki"],
            cwd=self.project_root,
            check=True,
        )
        return json.loads(cache.read_text(encoding="utf-8"))

    def evaluate_step(self, step: dict[str, Any]) -> dict[str, Any]:
        account = self.account
        tags = step.get("tags") or []
        title = step.get("title", "")
        requirements = step.get("skills") or []

        wiki_page = self.wiki_index.page_summary(title)
        graph_node = self.wiki_graph.get_node(title)

        result: dict[str, Any] = {
            "id": step.get("id"),
            "globalIndex": step.get("globalIndex"),
            "partId": step.get("partId"),
            "title": title,
            "tags": tags,
            "requirements": requirements,
            "wiki_found": wiki_page is not None,
            "graph_found": graph_node is not None,
            "wiki": wiki_page,
            "graph_intel": (graph_node or {}).get("intel") or {},
        }

        if account:
            meets, gaps = account.meets(requirements)
            result["meets_requirements"] = meets
            result["gaps"] = gaps
            if "quest" in tags:
                result["quest_completed"] = quest_completed(title, account.completed_quest_titles)
            if account.runemetrics_error == "NO_PROFILE" and "quest" in tags:
                result["quest_sync"] = "NO_PROFILE"

        return result

    def status(
        self,
        *,
        completed_titles: set[str] | None = None,
        use_wiki_progress: bool = True,
        limit: int = 40,
        include_ready: bool = True,
        include_blocked: bool = True,
    ) -> dict[str, Any]:
        steps = self.export_steps()
        progress: dict[str, Any] | None = None
        if completed_titles is None and use_wiki_progress:
            progress = self.load_progress()
            completed_titles = set(progress.get("completedTitles") or [])
        completed_titles = completed_titles or set()
        optional_side = set(self.OPTIONAL_SIDE_TITLES)
        if use_wiki_progress:
            progress = progress or self.load_progress()
            optional_side.update(progress.get("optionalSideTitles") or [])

        ready: list[dict[str, Any]] = []
        blocked: list[dict[str, Any]] = []
        next_main: dict[str, Any] | None = None

        for step in steps:
            title = step["title"]
            if title in completed_titles:
                continue
            if title in optional_side:
                continue
            evaluated = self.evaluate_step(step)
            if evaluated.get("meets_requirements", True):
                ready.append(evaluated)
                if next_main is None:
                    next_main = evaluated
            else:
                blocked.append(evaluated)

        return {
            "account": self.account.to_json() if self.account else None,
            "completed_count": len(completed_titles),
            "next_main_path_step": next_main,
            "ready_count": len(ready),
            "blocked_count": len(blocked),
            "ready": ready[:limit] if include_ready else [],
            "blocked": blocked[:limit] if include_blocked else [],
        }

    def check_step(self, title: str) -> dict[str, Any]:
        steps = self.export_steps()
        matches = [s for s in steps if s.get("title") == title]
        if not matches:
            matches = [s for s in steps if title.lower() in s.get("title", "").lower()]
        if not matches:
            return {"found": False, "title": title}
        step = matches[0]
        evaluated = self.evaluate_step(step)
        prereqs = self.wiki_graph.prerequisites(title, max_depth=3)
        return {"found": True, "step": evaluated, "wiki_prerequisites": prereqs}

    def compare_goal(self, goal_title: str, *, max_depth: int = 4) -> dict[str, Any]:
        prereqs = self.wiki_graph.prerequisites(goal_title, max_depth=max_depth)
        page = self.wiki_index.page_summary(goal_title)
        gaps: list[dict[str, Any]] = []
        if self.account:
            for edge in prereqs.get("chain", []):
                intel = edge.get("from_intel") or {}
                if edge.get("edge_type") == "requires_skill":
                    skill = edge.get("from_title")
                    need = int(edge.get("level") or 0)
                    have = self.account.skills.get(skill, 1) if skill else 1
                    if have < need:
                        gaps.append(
                            {
                                "type": "skill",
                                "skill": skill,
                                "have": have,
                                "need": need,
                                "source_title": edge.get("to_title"),
                            }
                        )
                quest_intel = intel.get("quest") if isinstance(intel, dict) else None
                if edge.get("edge_type") == "requires_quest" and self.account.runemetrics_error != "NO_PROFILE":
                    qtitle = edge.get("from_title") or ""
                    if qtitle and not quest_completed(qtitle, self.account.completed_quest_titles):
                        gaps.append(
                            {
                                "type": "quest",
                                "quest": qtitle,
                                "source_title": edge.get("to_title"),
                            }
                        )
        return {
            "goal": goal_title,
            "wiki_page": page,
            "prerequisites": prereqs,
            "account_gaps": gaps,
            "account": self.account.to_json() if self.account else None,
        }

    def suggest_guide_updates(self, *, limit: int = 20) -> dict[str, Any]:
        """Find guide steps whose declared requirements diverge from wiki intel."""
        steps = self.export_steps()
        mismatches: list[dict[str, Any]] = []
        for step in steps[:500]:
            title = step.get("title", "")
            graph_node = self.wiki_graph.get_node(title)
            if not graph_node:
                continue
            intel = graph_node.get("intel") or {}
            declared = step.get("skills") or []
            wiki_reqs = []
            quest_intel = intel.get("quest") if isinstance(intel.get("quest"), dict) else None
            if quest_intel and quest_intel.get("req_skills"):
                for skill, level in quest_intel["req_skills"].items():
                    wiki_reqs.append({"skill": skill, "level": level})
            item_intel = intel.get("item") if isinstance(intel.get("item"), dict) else None
            if item_intel:
                for key, skill_name in [
                    ("attack_req", "Attack"),
                    ("strength_req", "Strength"),
                    ("defence_req", "Defence"),
                    ("ranged_req", "Ranged"),
                    ("magic_req", "Magic"),
                    ("prayer_req", "Prayer"),
                ]:
                    if item_intel.get(key):
                        wiki_reqs.append({"skill": skill_name, "level": item_intel[key]})
            if not wiki_reqs:
                continue
            declared_set = {(r.get("skill"), int(r.get("level") or 0)) for r in declared}
            wiki_set = {(r.get("skill"), int(r.get("level") or 0)) for r in wiki_reqs}
            if wiki_set - declared_set:
                mismatches.append(
                    {
                        "title": title,
                        "globalIndex": step.get("globalIndex"),
                        "declared": declared,
                        "wiki_intel": wiki_reqs,
                        "missing_from_guide": sorted(
                            wiki_set - declared_set,
                            key=lambda pair: (pair[0] or "", pair[1]),
                        ),
                    }
                )
            if len(mismatches) >= limit:
                break
        return {"mismatches": mismatches, "count": len(mismatches)}
