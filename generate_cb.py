#!/usr/bin/env python3
"""
generate_cb.py — One-click exporter for your whole codebase into codebase.docx

Usage:
  python generate_cb.py

Behavior:
  • Scans the CURRENT WORKING DIRECTORY recursively (run it from your project root).
  • Respects .gitignore if present.
  • Skips noisy/binary folders and files (node_modules, .next, __pycache__, images, media, archives, etc.).
  • Writes a single Word document 'codebase.docx' with file-by-file content, using monospace formatting.

Tip:
  If Word says permission denied, close codebase.docx and run again.
"""

import os
import sys
from datetime import datetime

from docx import Document
from docx.shared import Pt
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

try:
    from pathspec import PathSpec
    from pathspec.patterns import GitWildMatchPattern
except ImportError:
    print("Missing dependency: pathspec\nInstall with: pip install pathspec python-docx")
    sys.exit(1)

# ====== SETTINGS ======
OUTPUT_FILE = "codebase.docx"
START_DIR = os.getcwd()  # scan from where you run the script

# File/dir filters (merged & tuned)
DEFAULT_SKIP_FILENAMES = {
    # utility scripts commonly excluded
    'api_list.py', 'clear_project.py', 'clear_migrations.py', 'clear_pg_tables.py',
    'count_django_loc.py', 'inspect_apis.py', 'model_list.py', 'reset.py',
    'save_structure.py', 'seed_db.py',
    # this script name will be added dynamically below
}

DEFAULT_SKIP_EXTENSIONS = {
    # docs & text
    '.docx', '.pdf',
    # images & assets
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico', '.svg',
    # fonts
    '.ttf', '.woff', '.woff2', '.eot',
    # misc/binary
    '.map', '.lock', '.env', '.zip', '.tar', '.gz', '.7z', '.rar',
    # media
    '.mp4', '.mp3', '.wav', '.webm', '.ogg',
    # big artifacts
    '.sqlite3',
}

DEFAULT_EXCLUDED_DIRS = {
    '__pycache__', 'migrations', '.git', '.idea', '.vscode',
    '.venv', 'env', 'venv', 'media',
    'node_modules', '.next', 'public', 'out', '.vercel',
    'build', 'dist', '.cache', '.pytest_cache', '.tox',
}

# ====== Helpers ======
def load_gitignore_spec(root_dir: str):
    """Load .gitignore as a PathSpec matcher, if available."""
    gitignore_path = os.path.join(root_dir, '.gitignore')
    if os.path.exists(gitignore_path):
        try:
            with open(gitignore_path, 'r', encoding='utf-8', errors='ignore') as f:
                patterns = f.read().splitlines()
            return PathSpec.from_lines(GitWildMatchPattern, patterns)
        except Exception:
            return None
    return None

def add_heading(doc: Document, text: str, level: int = 1):
    doc.add_heading(text, level=level)

def add_code_block(doc: Document, header: str, content: str):
    """Add a file header and its text content in monospace formatting."""
    # Header (bold)
    p = doc.add_paragraph()
    run = p.add_run(header)
    run.bold = True

    # Content (monospace, small)
    p2 = doc.add_paragraph()
    run2 = p2.add_run(content)
    run2.font.name = 'Consolas'
    run2.font.size = Pt(9)

    # Force Word to actually use Consolas across locales
    r = run2._element
    rPr = r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), 'Consolas')
    rFonts.set(qn('w:hAnsi'), 'Consolas')
    rFonts.set(qn('w:cs'), 'Consolas')
    rFonts.set(qn('w:eastAsia'), 'Consolas')

def scan_everything(doc: Document, root_dir: str, output_file: str):
    """Walk the repo from root_dir, respecting .gitignore and skip rules, and write into doc."""
    add_heading(doc, f"Project Root — {os.path.abspath(root_dir)}", level=2)
    spec = load_gitignore_spec(root_dir)

    # Skip this script file too
    skip_filenames = set(DEFAULT_SKIP_FILENAMES)
    try:
        skip_filenames.add(os.path.basename(__file__))
    except NameError:
        pass

    for current_root, dirs, files in os.walk(root_dir):
        # Prune excluded/hidden dirs
        dirs[:] = [
            d for d in dirs
            if d not in DEFAULT_EXCLUDED_DIRS and not d.startswith('.')
        ]

        for filename in files:
            # basic skips
            if filename == os.path.basename(output_file):
                continue
            if filename.startswith('.'):
                continue
            if filename in skip_filenames:
                continue

            ext = os.path.splitext(filename)[1].lower()
            if ext in DEFAULT_SKIP_EXTENSIONS:
                continue

            full_path = os.path.join(current_root, filename)
            rel_path = os.path.relpath(full_path, root_dir)

            # .gitignore filtering (use POSIX-style rel path for match)
            rel_posix = rel_path.replace(os.sep, '/')
            if spec and spec.match_file(rel_posix):
                continue

            # read as text
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception:
                # likely binary/unreadable — skip silently
                continue

            add_code_block(doc, f"# {rel_path}", content)

# ====== Main ======
def main():
    doc = Document()
    doc.add_heading('Full Codebase Documentation', 0)
    doc.add_paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    doc.add_paragraph(
        "This document lists source files under the current directory. "
        "Each file is preceded by a header of its relative path. "
        "Binary/asset files and noisy directories are skipped by default, "
        "and .gitignore rules are respected."
    )

    scan_everything(doc, START_DIR, OUTPUT_FILE)

    try:
        doc.save(OUTPUT_FILE)
        print(f"✅ Wrote {OUTPUT_FILE}")
    except PermissionError:
        print(f"❌ Permission denied: Could not save '{OUTPUT_FILE}'. Close it if open and run again.")
        sys.exit(2)

if __name__ == '__main__':
    main()
