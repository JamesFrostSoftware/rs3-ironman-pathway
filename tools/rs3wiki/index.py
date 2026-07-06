from __future__ import annotations

import struct
from pathlib import Path
from typing import Any

import msgpack
import zstandard as zstd

from .bundle import read_file_meta


class WikiIndex:
    """Lookup wiki pages by exact title, pageid, or title prefix."""

    TRAVERSAL_EDGE_TYPES = frozenset(
        {"requires_material", "requires_skill", "requires_quest", "drops"}
    )

    def __init__(self, path: Path):
        self.path = path.resolve()
        self.meta = read_file_meta(self.path)
        self.count = int(self.meta["page_count"])
        self._title_base = int(self.meta["title_index_offset"]) + 4
        self._pageid_base = int(self.meta["pageid_index_offset"])
        self._pageid_count = self.count
        self._title_offsets: list[int] | None = None

    def _ensure_title_offsets(self) -> None:
        if self._title_offsets is not None:
            return
        offsets: list[int] = []
        with self.path.open("rb") as f:
            f.seek(self._title_base)
            for _ in range(self.count):
                offsets.append(f.tell() - self._title_base)
                title_len = struct.unpack("<H", f.read(2))[0]
                f.read(title_len + 16)
        self._title_offsets = offsets

    def _read_title_entry(self, index: int) -> tuple[str, int, int, int]:
        self._ensure_title_offsets()
        with self.path.open("rb") as f:
            f.seek(self._title_base + self._title_offsets[index])
            title_len = struct.unpack("<H", f.read(2))[0]
            title = f.read(title_len).decode("utf-8", errors="surrogateescape")
            data_offset, data_length, pageid = struct.unpack("<QII", f.read(16))
            return title, data_offset, data_length, pageid

    def _read_record(self, data_offset: int, data_length: int) -> dict[str, Any]:
        with self.path.open("rb") as f:
            f.seek(data_offset)
            blob = f.read(data_length)
        raw = zstd.ZstdDecompressor().decompress(blob)
        record = msgpack.unpackb(raw, strict_map_key=False)
        if not isinstance(record, dict):
            raise ValueError("Unexpected wiki record shape")
        return record

    def get_by_title(self, title: str) -> dict[str, Any] | None:
        idx = self._title_index(title)
        if idx is None:
            return None
        _, data_offset, data_length, _pageid = self._read_title_entry(idx)
        record = self._read_record(data_offset, data_length)
        redirect = record.get("rd")
        if redirect:
            resolved = self.get_by_title(str(redirect))
            if resolved:
                resolved = dict(resolved)
                resolved["resolved_from"] = title
                resolved["redirect"] = redirect
                return resolved
        return record

    def get_by_pageid(self, pageid: int) -> dict[str, Any] | None:
        with self.path.open("rb") as f:
            f.seek(self._pageid_base)
            count = struct.unpack("<I", f.read(4))[0]
            lo, hi = 0, count - 1
            found: tuple[int, int] | None = None
            while lo <= hi:
                mid = (lo + hi) // 2
                f.seek(self._pageid_base + 4 + mid * 16)
                pid, data_offset, data_length = struct.unpack("<IQI", f.read(16))
                if pid == pageid:
                    found = (data_offset, data_length)
                    break
                if pid < pageid:
                    lo = mid + 1
                else:
                    hi = mid - 1
        if not found:
            return None
        return self._read_record(found[0], found[1])

    def search_title_prefix(self, prefix: str, limit: int = 25) -> list[str]:
        if not prefix:
            return []
        self._ensure_title_offsets()
        key = prefix.encode("utf-8")
        lo, hi = 0, self.count - 1
        start = self.count
        while lo <= hi:
            mid = (lo + hi) // 2
            title = self._read_title_entry(mid)[0].encode("utf-8")
            if title >= key:
                start = mid
                hi = mid - 1
            else:
                lo = mid + 1
        titles: list[str] = []
        for i in range(start, self.count):
            title = self._read_title_entry(i)[0]
            if not title.startswith(prefix):
                break
            titles.append(title)
            if len(titles) >= limit:
                break
        return titles

    def page_summary(self, title: str, wikitext_chars: int = 1200) -> dict[str, Any] | None:
        page = self.get_by_title(title)
        if not page:
            return None
        text = str(page.get("x") or "")
        return {
            "title": page.get("t", title),
            "pageid": page.get("i"),
            "namespace": page.get("n"),
            "redirect": page.get("rd"),
            "categories": page.get("c") or [],
            "wikitext_excerpt": text[:wikitext_chars],
            "wikitext_length": len(text),
            "url": page.get("u"),
        }

    def _title_index(self, title: str) -> int | None:
        self._ensure_title_offsets()
        key = title.encode("utf-8")
        lo, hi = 0, self.count - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            mid_title = self._read_title_entry(mid)[0].encode("utf-8")
            if mid_title == key:
                return mid
            if mid_title < key:
                lo = mid + 1
            else:
                hi = mid - 1
        return None
