from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class BundlePaths:
    root: Path
    rules: Path
    manifest: Path
    index: Path
    graph: Path
    nav: Path


def load_manifest(bundle_dir: Path) -> dict:
    manifest_path = bundle_dir / "MANIFEST.json"
    if not manifest_path.exists():
        manifest_path = bundle_dir / "MANIFEST.example.json"
    with manifest_path.open(encoding="utf-8") as f:
        return json.load(f)


def resolve_bundle(bundle_dir: Path | None = None) -> BundlePaths:
    if bundle_dir is None:
        bundle_dir = Path(__file__).resolve().parents[2] / "bundle"
    bundle_dir = bundle_dir.resolve()
    files = load_manifest(bundle_dir).get("files", {})
    return BundlePaths(
        root=bundle_dir,
        rules=bundle_dir / files.get("rules", "RULES.md"),
        manifest=bundle_dir / "MANIFEST.json",
        index=bundle_dir / files.get("index", "data/wiki.rs3wi"),
        graph=bundle_dir / files.get("graph", "data/wiki.rs3wg"),
        nav=bundle_dir / files.get("nav", "data/wiki.rs3nav"),
    )


def read_file_meta(path: Path) -> dict:
    with path.open("rb") as f:
        while True:
            line = f.readline()
            if not line:
                raise ValueError(f"No #META line in {path}")
            if line.strip() == b"---END-HEADER---":
                break
            if line.startswith(b"#META:"):
                raw = line[6:].strip()
                return json.loads(raw.decode("utf-8"))
    raise ValueError(f"No #META line in {path}")
