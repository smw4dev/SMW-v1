#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import argparse
import sys

# ---------- Defaults ----------
DEFAULT_OUTPUT = "PROJECT_STRUCTURE.txt"

EXCLUDED_DIRS = {
    ".git", ".github", ".gitlab",
    ".idea", ".vscode",
    "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache", ".cache",
    "node_modules", ".next", ".turbo", ".parcel-cache", ".svelte-kit", ".pnpm-store",
    "dist", "build", "coverage", "out",
    "venv", ".venv", ".tox",
    "migrations",              # Django migrations (skip entirely)
    "staticfiles", "media",    # typical collected/static dumps
}

EXCLUDED_FILE_NAMES = {
    ".DS_Store", "Thumbs.db",
    DEFAULT_OUTPUT,            # prevent listing the output itself
}

EXCLUDED_SUFFIXES = {
    ".pyc", ".pyo", ".pyd",
    ".log",
    ".sqlite3",
}

# Always-include whitelist (even if hidden)
INCLUDE_ALWAYS_FILES = {
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
}

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Print a tree-style project structure.")
    p.add_argument("--root", default=".", help="Root directory to scan (default: .)")
    p.add_argument("--out", default=DEFAULT_OUTPUT, help=f"Output file name (default: {DEFAULT_OUTPUT})")
    p.add_argument("--max-depth", type=int, default=0,
                   help="Max depth to print (0 = unlimited).")
    p.add_argument("--ascii", action="store_true",
                   help="Use ASCII connectors instead of Unicode.")
    p.add_argument("--dirs-only", action="store_true",
                   help="Only show directories (no files).")
    p.add_argument("--show-hidden", action="store_true",
                   help="Include hidden files/dirs (starting with .).")
    return p.parse_args()

def is_hidden(path: Path, root: Path) -> bool:
    try:
        rel = path.relative_to(root)
    except ValueError:
        rel = path
    return any(part.startswith(".") for part in rel.parts)

def skip_dir(name: str, show_hidden: bool) -> bool:
    if name in EXCLUDED_DIRS:
        return True
    if not show_hidden and name.startswith("."):
        return True
    return False

def skip_file(p: Path, show_hidden: bool) -> bool:
    # ----- Always include certain env files -----
    if p.name in INCLUDE_ALWAYS_FILES:
        return False

    # Standard skips
    if p.name in EXCLUDED_FILE_NAMES:
        return True
    if p.suffix in EXCLUDED_SUFFIXES:
        return True
    if not show_hidden and p.name.startswith("."):
        return True
    # Skip anything inside a migrations folder
    if "migrations" in p.parts:
        return True
    return False

def sort_entries(dirs: list[Path], files: list[Path]) -> tuple[list[Path], list[Path]]:
    key = lambda x: x.name.lower()
    return sorted(dirs, key=key), sorted(files, key=key)

def connectors(ascii_mode: bool):
    if ascii_mode:
        return ("|   ", "|-- ", "`-- ")
    return ("│   ", "├── ", "└── ")

def build_tree_lines(
    root: Path,
    cur: Path,
    prefix: str,
    depth: int,
    max_depth: int,
    ascii_mode: bool,
    dirs_only: bool,
    show_hidden: bool,
    counters: dict[str, int],
) -> list[str]:
    lines: list[str] = []
    try:
        children = [p for p in cur.iterdir()]
    except PermissionError:
        return [prefix + "[permission denied]"]

    dirs = [c for c in children if c.is_dir() and not skip_dir(c.name, show_hidden)]
    files = [] if dirs_only else [c for c in children if c.is_file() and not skip_file(c, show_hidden)]
    dirs, files = sort_entries(dirs, files)

    for d in dirs:
        counters["dirs"] += 1
        lines.append(prefix + d.name + "/")
        if max_depth and depth >= max_depth:
            continue
        lines.extend(
            draw_subtree(
                root=root,
                parent=cur,
                node=d,
                depth=depth,
                max_depth=max_depth,
                ascii_mode=ascii_mode,
                dirs_only=dirs_only,
                show_hidden=show_hidden,
                counters=counters,
                is_last=(d == dirs[-1] and (dirs_only or not files)),
                parent_prefix=prefix,
            )
        )

    for f in files:
        counters["files"] += 1
        lines.append(prefix + f.name)

    return lines

def draw_subtree(
    root: Path,
    parent: Path,
    node: Path,
    depth: int,
    max_depth: int,
    ascii_mode: bool,
    dirs_only: bool,
    show_hidden: bool,
    counters: dict[str, int],
    is_last: bool,
    parent_prefix: str,
) -> list[str]:
    pad, _, _ = connectors(ascii_mode)
    # Indent children; the simple “pad” maintains vertical guides reasonably in plain text
    return build_tree_lines(
        root=root,
        cur=node,
        prefix=parent_prefix + pad,
        depth=depth + 1,
        max_depth=max_depth,
        ascii_mode=ascii_mode,
        dirs_only=dirs_only,
        show_hidden=show_hidden,
        counters=counters,
    )

def make_header(root: Path, max_depth: int, ascii_mode: bool, dirs_only: bool, show_hidden: bool) -> list[str]:
    hdr = [
        f"Project Structure: {root.name}/",
        "-" * (20 + len(root.name)),
        f"Options: max_depth={'∞' if max_depth==0 else max_depth}, charset={'ASCII' if ascii_mode else 'Unicode'}, "
        f"show_hidden={show_hidden}, dirs_only={dirs_only}",
        "",
    ]
    return hdr

def main():
    args = parse_args()
    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"Root '{root}' is not a directory.", file=sys.stderr)
        sys.exit(2)

    counters = {"dirs": 0, "files": 0}

    lines: list[str] = []
    lines.extend(make_header(root, args.max_depth, args.ascii, args.dirs_only, args.show_hidden))
    lines.append(root.name + "/")

    dirs = [p for p in root.iterdir() if p.is_dir() and not skip_dir(p.name, args.show_hidden)]
    files = [] if args.dirs_only else [p for p in root.iterdir() if p.is_file() and not skip_file(p, args.show_hidden)]
    dirs, files = sort_entries(dirs, files)

    pad, _, _ = connectors(args.ascii)

    # Directories first
    for idx, d in enumerate(dirs):
        counters["dirs"] += 1
        is_last_dir = idx == len(dirs) - 1 and (args.dirs_only or not files)
        lines.append("├── " + d.name + "/")
        if args.max_depth == 0 or 1 <= args.max_depth:
            subtree = build_tree_lines(
                root=root,
                cur=d,
                prefix=(pad if not is_last_dir else "    "),
                depth=1,
                max_depth=args.max_depth,
                ascii_mode=args.ascii,
                dirs_only=args.dirs_only,
                show_hidden=args.show_hidden,
                counters=counters,
            )
            lines.extend(subtree)

    # Then files
    for i, f in enumerate(files):
        counters["files"] += 1
        connector = "└── " if i == len(files) - 1 else "├── "
        lines.append(connector + f.name)

    lines.extend([
        "",
        f"Summary: {counters['dirs']} dirs, {counters['files']} files (excluded common junk).",
    ])

    out_path = root / args.out
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote structure to {out_path}")

if __name__ == "__main__":
    main()
