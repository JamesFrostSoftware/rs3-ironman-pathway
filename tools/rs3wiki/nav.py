from __future__ import annotations

from pathlib import Path
from typing import Any

import msgpack
import zstandard as zstd

from .bundle import read_file_meta


class WikiNav:
    def __init__(self, path: Path):
        self.path = path.resolve()
        self.meta = read_file_meta(self.path)
        self._payload: dict[str, Any] | None = None

    def _load(self) -> dict[str, Any]:
        if self._payload is not None:
            return self._payload
        raw = self.path.read_bytes()
        zstd_magic = b"\x28\xb5\x2f\xfd"
        pos = raw.find(zstd_magic)
        if pos < 0:
            raise ValueError("Could not locate nav zstd payload")
        payload = msgpack.unpackb(
            zstd.ZstdDecompressor().decompress(raw[pos:]),
            strict_map_key=False,
        )
        if not isinstance(payload, dict):
            raise ValueError("Unexpected nav payload")
        self._payload = payload
        return payload

    def schema(self, *, filter_text: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
        payload = self._load()
        schema = payload.get("schema") or {}
        rows = []
        for path, meta in schema.items():
            if filter_text and filter_text.lower() not in path.lower():
                continue
            rows.append({"path": path, **meta})
            if len(rows) >= limit:
                break
        rows.sort(key=lambda row: row["path"])
        return rows

    def query(self, path: str, *, limit: int = 25) -> dict[str, Any]:
        payload = self._load()
        index = payload.get("index") or {}
        node: Any = index
        for part in path.split("."):
            if not isinstance(node, dict) or part not in node:
                return {"path": path, "found": False, "results": []}
            node = node[part]

        if isinstance(node, list):
            results = node[:limit]
        elif isinstance(node, dict):
            results = [{"key": key, "value": value} for key, value in list(node.items())[:limit]]
        else:
            results = [node]

        return {"path": path, "found": True, "count": len(node) if isinstance(node, list) else None, "results": results}

    def resolve_titles(self, page_refs: list[dict[str, Any]]) -> list[str]:
        titles = []
        for ref in page_refs:
            if isinstance(ref, dict) and ref.get("t"):
                titles.append(str(ref["t"]))
            elif isinstance(ref, str):
                titles.append(ref)
        return titles
