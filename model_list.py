# model_list.py  (place this in SMW-v1/ next to the Backend/ folder)

import os
import sys
from pathlib import Path
from datetime import datetime

# ---- Configure paths & settings module ----
REPO_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = REPO_ROOT / "Backend"

# Ensure Backend/ is importable so 'smw.settings' can be found
sys.path.insert(0, str(BACKEND_DIR))

# If your settings live at Backend/smw/settings.py, this is correct:
DJANGO_SETTINGS_MODULE = os.environ.get("DJANGO_SETTINGS_MODULE", "smw.settings")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", DJANGO_SETTINGS_MODULE)

# ---- Django setup ----
import django
try:
    django.setup()
except Exception as e:
    sys.stderr.write(
        f"\n[ERROR] Could not set up Django with settings '{DJANGO_SETTINGS_MODULE}'. "
        f"Make sure the path is correct relative to Backend/.\n"
        f"Original error: {e}\n"
    )
    sys.exit(1)

from django.apps import apps
from django.db.models import (
    AutoField,
    ForeignKey,
    ManyToManyField,
    OneToOneField,
    Field,
)

def format_field(field: Field) -> str:
    """Return a human-friendly line for a field."""
    # Primary key
    if isinstance(field, AutoField) and getattr(field, "primary_key", False):
        return f"- {field.name}: (PK)"

    # Relations
    if isinstance(field, OneToOneField):
        return f"- {field.name} (O2O → {field.related_model._meta.label})"
    if isinstance(field, ForeignKey):
        return f"- {field.name} (FK → {field.related_model._meta.label})"
    if isinstance(field, ManyToManyField):
        return f"- {field.name} (M2M ↔ {field.related_model._meta.label})"

    # Non-relation concrete field
    if getattr(field, "concrete", False) and not getattr(field, "is_relation", False):
        return f"- {field.name}"

    # For completeness, show editable non-concrete fields if they’re M2M on reverse
    if getattr(field, "many_to_many", False) and not getattr(field, "concrete", False):
        # Skip auto-created reverse M2M to keep output clean
        if getattr(field, "auto_created", False):
            return ""
        return f"- {field.name} (M2M-rev ↔ {field.related_model._meta.label})"

    return ""

def generate_model_report() -> str:
    # Group by app label, then model name
    all_models = sorted(
        apps.get_models(),
        key=lambda m: (m._meta.app_label, m.__name__)
    )

    lines = []
    lines.append("# Django Model Inventory")
    lines.append(f"- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"- Repo root: {REPO_ROOT}")
    lines.append(f"- Using settings: {DJANGO_SETTINGS_MODULE}")
    lines.append("")

    current_app = None
    for model in all_models:
        app_label = model._meta.app_label
        if app_label != current_app:
            current_app = app_label
            lines.append(f"\n## App: {app_label}")

        lines.append(f"\nModel: {model._meta.label}")  # e.g., users.User
        # Use _meta.get_fields() to include relations; filter noisy auto-created reverse relations
        for field in model._meta.get_fields():
            # Skip hidden auto-created reverse relations to keep output readable
            if getattr(field, "auto_created", False) and not getattr(field, "concrete", False):
                continue

            line = format_field(field)
            if line:
                lines.append(f"  {line}")

    lines.append("")  # trailing newline
    return "\n".join(lines)

def main(out_path: str = "model_list.txt", also_print: bool = False) -> None:
    report = generate_model_report()
    out_file = (REPO_ROOT / out_path).resolve()
    out_file.write_text(report, encoding="utf-8")

    if also_print:
        print(report)
    else:
        print(f"[OK] Wrote model list to: {out_file}")

if __name__ == "__main__":
    # Simple CLI: python model_list.py [--out path] [--stdout]
    import argparse
    p = argparse.ArgumentParser(description="Generate Django model list to a text file.")
    p.add_argument("--out", default="model_list.txt", help="Output file path (relative or absolute).")
    p.add_argument("--stdout", action="store_true", help="Also print report to stdout.")
    args = p.parse_args()
    main(out_path=args.out, also_print=args.stdout)
