#!/usr/bin/env python3
"""CLI for querying the RS3 wiki bundle and live account data."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TOOLS_DIR.parent
if str(TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(TOOLS_DIR))

from rs3wiki.account import load_account_cache, sync_account
from rs3wiki.bundle import resolve_bundle
from rs3wiki.graph import WikiGraph
from rs3wiki.guide import GuideAnalyzer
from rs3wiki.index import WikiIndex
from rs3wiki.nav import WikiNav


def load_config() -> dict:
    config_path = TOOLS_DIR / "guide-agent.config.json"
    if not config_path.exists():
        return {}
    return json.loads(config_path.read_text(encoding="utf-8"))


def emit(data) -> None:
    text = json.dumps(data, indent=2, ensure_ascii=False)
    sys.stdout.buffer.write(text.encode("utf-8"))
    sys.stdout.buffer.write(b"\n")


def get_services(config: dict):
    bundle = resolve_bundle((TOOLS_DIR / config.get("bundleDir", "../bundle")).resolve())
    cache_dir = (TOOLS_DIR / config.get("cacheDir", ".cache")).resolve()
    wiki_index = WikiIndex(bundle.index)
    wiki_graph = WikiGraph(bundle.graph)
    wiki_nav = WikiNav(bundle.nav)
    account_cache = cache_dir / "account.json"
    account = load_account_cache(account_cache)
    guide = GuideAnalyzer(
        project_root=PROJECT_ROOT,
        wiki_index=wiki_index,
        wiki_graph=wiki_graph,
        account=account,
    )
    return {
        "config": config,
        "bundle": bundle,
        "cache_dir": cache_dir,
        "account_cache": account_cache,
        "wiki_index": wiki_index,
        "wiki_graph": wiki_graph,
        "wiki_nav": wiki_nav,
        "account": account,
        "guide": guide,
    }


def cmd_account_sync(args, ctx) -> None:
    config = ctx["config"]
    rsn = args.rsn or config.get("rsn")
    mode = args.mode or config.get("gameMode", "ironman")
    if not rsn:
        raise SystemExit("Set rsn in guide-agent.config.json or pass --rsn")
    state = sync_account(rsn, game_mode=mode, cache_path=ctx["account_cache"])
    ctx["guide"].account = state
    emit({"ok": True, "account": state.to_json()})


def cmd_account_show(_args, ctx) -> None:
    account = ctx["account"]
    if not account:
        emit({"ok": False, "error": "No cached account. Run: account sync"})
        return
    emit({"ok": True, "account": account.to_json()})


def cmd_wiki_page(args, ctx) -> None:
    page = ctx["wiki_index"].page_summary(args.title, wikitext_chars=args.chars)
    node = ctx["wiki_graph"].get_node(args.title)
    emit({"page": page, "graph_node": node})


def cmd_wiki_search(args, ctx) -> None:
    titles = ctx["wiki_index"].search_title_prefix(args.prefix, limit=args.limit)
    emit({"prefix": args.prefix, "results": titles})


def cmd_wiki_deps(args, ctx) -> None:
    emit(ctx["wiki_graph"].prerequisites(args.title, max_depth=args.depth))


def cmd_wiki_drops(args, ctx) -> None:
    emit({"item": args.title, "sources": ctx["wiki_graph"].drop_sources(args.title)})


def cmd_nav_schema(args, ctx) -> None:
    emit({"paths": ctx["wiki_nav"].schema(filter_text=args.filter, limit=args.limit)})


def cmd_nav_query(args, ctx) -> None:
    emit(ctx["wiki_nav"].query(args.path, limit=args.limit))


def cmd_guide_export(_args, ctx) -> None:
    steps = ctx["guide"].export_steps(force=True)
    emit({"ok": True, "count": len(steps), "path": str(ctx["guide"].steps_cache_path)})


def cmd_guide_progress(_args, ctx) -> None:
    progress = ctx["guide"].load_progress(force=True)
    emit({"ok": True, "path": str(ctx["guide"].progress_cache_path), "progress": progress})


def cmd_guide_status(args, ctx) -> None:
    completed = set(args.completed or [])
    emit(
        ctx["guide"].status(
            limit=args.limit,
            completed_titles=completed if completed else None,
            use_wiki_progress=not args.no_wiki_progress,
        )
    )


def cmd_guide_check(args, ctx) -> None:
    emit(ctx["guide"].check_step(args.title))


def cmd_guide_goal(args, ctx) -> None:
    emit(ctx["guide"].compare_goal(args.title, max_depth=args.depth))


def cmd_guide_audit(_args, ctx) -> None:
    emit(ctx["guide"].suggest_guide_updates())


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="RS3 guide agent — wiki bundle + account CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    account = sub.add_parser("account", help="Live account data (hiscores + RuneMetrics)")
    account_sub = account.add_subparsers(dest="account_cmd", required=True)
    sync = account_sub.add_parser("sync", help="Fetch hiscores + RuneMetrics and cache locally")
    sync.add_argument("--rsn")
    sync.add_argument("--mode", choices=["ironman", "hardcore", "normal"])
    account_sub.add_parser("show", help="Show cached account state")

    wiki = sub.add_parser("wiki", help="Query bundle/wiki data")
    wiki_sub = wiki.add_subparsers(dest="wiki_cmd", required=True)
    page = wiki_sub.add_parser("page", help="Load a wiki page summary")
    page.add_argument("title")
    page.add_argument("--chars", type=int, default=1200)
    search = wiki_sub.add_parser("search", help="Prefix search page titles")
    search.add_argument("prefix")
    search.add_argument("--limit", type=int, default=25)
    deps = wiki_sub.add_parser("deps", help="Backward prerequisite chain from graph")
    deps.add_argument("title")
    deps.add_argument("--depth", type=int, default=4)
    drops = wiki_sub.add_parser("drops", help="Drop sources for an item")
    drops.add_argument("title")

    nav = sub.add_parser("nav", help="Facet index queries")
    nav_sub = nav.add_subparsers(dest="nav_cmd", required=True)
    schema = nav_sub.add_parser("schema", help="List queryable nav paths")
    schema.add_argument("--filter")
    schema.add_argument("--limit", type=int, default=100)
    query = nav_sub.add_parser("query", help="Query a nav path (e.g. pt.quest)")
    query.add_argument("path")
    query.add_argument("--limit", type=int, default=25)

    guide = sub.add_parser("guide", help="Guide-specific analysis")
    guide_sub = guide.add_subparsers(dest="guide_cmd", required=True)
    guide_sub.add_parser("export", help="Export guide steps to JSON cache")
    progress = guide_sub.add_parser("progress", help="Export wiki anchor progress to JSON cache")
    status = guide_sub.add_parser("status", help="Next steps vs account requirements")
    status.add_argument("--limit", type=int, default=30)
    status.add_argument("--completed", action="append", help="Completed step title (repeatable)")
    status.add_argument("--no-wiki-progress", action="store_true")
    check = guide_sub.add_parser("check", help="Evaluate one guide step")
    check.add_argument("title")
    goal = guide_sub.add_parser("goal", help="Compare account against a wiki goal")
    goal.add_argument("title")
    goal.add_argument("--depth", type=int, default=4)
    guide_sub.add_parser("audit", help="Find guide/wiki requirement mismatches")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    config = load_config()
    ctx = get_services(config)

    handlers = {
        ("account", "sync"): cmd_account_sync,
        ("account", "show"): cmd_account_show,
        ("wiki", "page"): cmd_wiki_page,
        ("wiki", "search"): cmd_wiki_search,
        ("wiki", "deps"): cmd_wiki_deps,
        ("wiki", "drops"): cmd_wiki_drops,
        ("nav", "schema"): cmd_nav_schema,
        ("nav", "query"): cmd_nav_query,
        ("guide", "export"): cmd_guide_export,
        ("guide", "progress"): cmd_guide_progress,
        ("guide", "status"): cmd_guide_status,
        ("guide", "check"): cmd_guide_check,
        ("guide", "goal"): cmd_guide_goal,
        ("guide", "audit"): cmd_guide_audit,
    }

    cmd_key = (args.command, getattr(args, f"{args.command}_cmd", None))
    handler = handlers.get(cmd_key)
    if not handler:
        parser.error(f"Unknown command: {args.command}")
    try:
        handler(args, ctx)
        return 0
    except Exception as exc:  # noqa: BLE001 - CLI boundary
        emit({"ok": False, "error": str(exc)})
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
