from __future__ import annotations

import struct
from pathlib import Path
from typing import Any

import msgpack
import zstandard as zstd

from .bundle import read_file_meta


class WikiGraph:
    TRAVERSAL_TYPES = frozenset(
        {"requires_material", "requires_skill", "requires_quest", "drops"}
    )

    def __init__(self, path: Path):
        self.path = path.resolve()
        self.meta = read_file_meta(self.path)
        self.node_count = int(self.meta["node_count"])
        self._title_map: dict[str, int] | None = None
        self._nodes: list[dict[str, Any]] | None = None
        self._in_edges: list[list[dict[str, Any]]] | None = None

    def _load_title_map(self) -> dict[str, int]:
        if self._title_map is not None:
            return self._title_map
        mapping: dict[str, int] = {}
        with self.path.open("rb") as f:
            f.seek(int(self.meta["title_map_offset"]))
            count = struct.unpack("<Q", f.read(8))[0]
            for _ in range(count):
                title_len = struct.unpack("<I", f.read(4))[0]
                title = f.read(title_len).decode("utf-8", errors="surrogateescape")
                node_index = struct.unpack("<I", f.read(4))[0]
                mapping[title] = node_index
        self._title_map = mapping
        return mapping

    def _load_nodes(self) -> list[dict[str, Any]]:
        if self._nodes is not None:
            return self._nodes
        with self.path.open("rb") as f:
            f.seek(int(self.meta["nodes_offset"]))
            blob = f.read(int(self.meta["nodes_length"]))
        nodes = msgpack.unpackb(zstd.ZstdDecompressor().decompress(blob), strict_map_key=False)
        if not isinstance(nodes, list):
            raise ValueError("Unexpected nodes payload")
        self._nodes = nodes
        return nodes

    def _load_in_edges(self) -> list[list[dict[str, Any]]]:
        if self._in_edges is not None:
            return self._in_edges
        with self.path.open("rb") as f:
            f.seek(int(self.meta["in_edges_offset"]))
            blob = f.read(int(self.meta["in_edges_length"]))
        in_edges = msgpack.unpackb(zstd.ZstdDecompressor().decompress(blob), strict_map_key=False)
        if not isinstance(in_edges, list):
            raise ValueError("Unexpected in_edges payload")
        self._in_edges = in_edges
        return in_edges

    def _node_array_index(self, title: str) -> int | None:
        mapped = self._load_title_map().get(title)
        if mapped is None:
            return None
        return mapped - 1 if mapped > 0 else mapped

    def get_node(self, title: str) -> dict[str, Any] | None:
        idx = self._node_array_index(title)
        if idx is None or idx < 0 or idx >= self.node_count:
            return None
        node = self._load_nodes()[idx]
        return dict(node)

    def prerequisites(
        self,
        title: str,
        *,
        max_depth: int = 4,
        edge_types: set[str] | None = None,
    ) -> dict[str, Any]:
        edge_types = edge_types or set(self.TRAVERSAL_TYPES)
        start_idx = self._node_array_index(title)
        if start_idx is None:
            return {"goal": title, "found": False, "chain": []}

        nodes = self._load_nodes()
        in_edges = self._load_in_edges()
        seen: set[int] = set()
        chain: list[dict[str, Any]] = []

        def walk(node_idx: int, depth: int) -> None:
            if depth > max_depth or node_idx in seen:
                return
            seen.add(node_idx)
            node = nodes[node_idx]
            for edge in in_edges[node_idx]:
                edge_type = edge.get("y")
                if edge_type not in edge_types:
                    continue
                from_idx = edge.get("f")
                if from_idx is None:
                    continue
                from_node = nodes[from_idx]
                chain.append(
                    {
                        "depth": depth,
                        "edge_type": edge_type,
                        "level": edge.get("l"),
                        "meta": edge.get("d") or {},
                        "from_title": from_node.get("t"),
                        "from_page_type": from_node.get("pt"),
                        "from_intel": from_node.get("intel") or {},
                        "to_title": node.get("t"),
                    }
                )
                walk(from_idx, depth + 1)

        walk(start_idx, 1)
        goal_node = nodes[start_idx]
        return {
            "goal": title,
            "found": True,
            "goal_page_type": goal_node.get("pt"),
            "goal_intel": goal_node.get("intel") or {},
            "chain": chain,
        }

    def drop_sources(self, item_title: str) -> list[dict[str, Any]]:
        idx = self._node_array_index(item_title)
        if idx is None:
            return []
        nodes = self._load_nodes()
        in_edges = self._load_in_edges()
        sources = []
        for edge in in_edges[idx]:
            if edge.get("y") != "drops":
                continue
            from_node = nodes[edge["f"]]
            sources.append(
                {
                    "monster": from_node.get("t"),
                    "intel": from_node.get("intel") or {},
                    "meta": edge.get("d") or {},
                }
            )
        return sources
