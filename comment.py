#!/usr/bin/env python3
"""
add_relative_path_headers.py

Run from the project root (SMW-v1).

This version ONLY processes files inside the Backend/ directory.

For supported text/code files, this script ensures that the first line contains
a comment with the file's path relative to the project root.

Example:
    Backend/admissions/models.py  ->  "# Backend/admissions/models.py"

If that exact header is already present as the first line (or second line
when there is a shebang), the file is left unchanged. Otherwise, the header
is inserted.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional


# Root of the project is the directory where this script lives
ROOT = Path(__file__).resolve().parent
BACKEND_ROOT = ROOT / "Backend"

# Directories to skip entirely (inside Backend/)
EXCLUDED_DIRS = {
    ".git",
    "__pycache__",
    ".idea",
    ".vscode",
    ".pytest_cache",
    ".mypy_cache",
    ".DS_Store",
}

# File extensions we want to skip (binary or not safe to add comments)
SKIP_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".svg",
    ".webp",
    ".pdf",
    ".ttf",
    ".woff",
    ".woff2",
    ".eot",
    ".otf",
    ".mp3",
    ".mp4",
    ".mov",
    ".avi",
    ".zip",
    ".tar",
    ".gz",
    ".bz2",
    ".7z",
    ".log",
    ".sqlite3",
}

# Comment style groups
PY_HASH_STYLE = {
    ".py",
    ".env",
    ".ini",
    ".cfg",
    ".conf",
    ".toml",
    ".sh",
    ".ps1",
    ".txt",
}

SLASH_STYLE = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
}

CSS_BLOCK_STYLE = {
    ".css",
    ".scss",
    ".sass",
}

HTML_COMMENT_STYLE = {
    ".html",
    ".htm",
    ".md",
}


def get_comment_header(path: Path, rel_path: str) -> Optional[str]:
    """
    Return the appropriate comment header string for this file, or None if
    the file extension is not supported.
    """
    ext = path.suffix.lower()

    if ext in PY_HASH_STYLE:
        return f"# {rel_path}"
    if ext in SLASH_STYLE:
        return f"// {rel_path}"
    if ext in CSS_BLOCK_STYLE:
        return f"/* {rel_path} */"
    if ext in HTML_COMMENT_STYLE:
        return f"<!-- {rel_path} -->"

    # Unsupported extension -> skip
    return None


def has_header(lines, header: str, has_shebang: bool) -> bool:
    """
    Check whether the file already has this header on the first logical line.
    If there's a shebang on the first line, header should be on the second line.
    """
    if not lines:
        return False

    if has_shebang:
        if len(lines) < 2:
            return False
        candidate = lines[1].lstrip("\ufeff").strip()
    else:
        candidate = lines[0].lstrip("\ufeff").strip()

    return candidate == header


def process_file(path: Path) -> None:
    """
    Ensure the given file has a relative-path header as the first line (or
    second line if there's a shebang).
    """
    # Compute project-relative path with forward slashes
    rel_path = path.relative_to(ROOT).as_posix()

    header = get_comment_header(path, rel_path)
    if header is None:
        return  # unsupported extension

    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        # Probably a binary or non-UTF file, skip
        return

    lines = text.splitlines(keepends=True)
    if not lines:
        # Empty file: just write the header and a newline
        path.write_text(header + "\n", encoding="utf-8")
        print(f"[ADD] {rel_path} (empty file)")
        return

    first_line = lines[0]
    has_shebang = first_line.startswith("#!")

    if has_header(lines, header, has_shebang):
        # Already has the correct header: nothing to do
        return

    if has_shebang:
        # Insert header as second line
        new_lines = [lines[0], header + "\n"] + lines[1:]
    else:
        # Insert header as first line
        new_lines = [header + "\n"] + lines

    new_text = "".join(new_lines)
    path.write_text(new_text, encoding="utf-8")
    print(f"[ADD] {rel_path}")


def main() -> None:
    if not BACKEND_ROOT.exists():
        print(f"Backend directory not found at: {BACKEND_ROOT}")
        return

    print(f"Project root:  {ROOT}")
    print(f"Backend root:  {BACKEND_ROOT}")
    print("Scanning Backend/ and adding relative-path headers where missing...\n")

    for dirpath, dirnames, filenames in os.walk(BACKEND_ROOT):
        # Strip excluded dirs from os.walk traversal
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]

        for filename in filenames:
            full_path = Path(dirpath) / filename

            ext = full_path.suffix.lower()
            if ext in SKIP_EXTENSIONS:
                continue

            process_file(full_path)

    print("\nDone.")


if __name__ == "__main__":
    main()
