#!/usr/bin/env python3
"""
generate_model_inventory.py

Generate a human-readable inventory of all Django models in this project,
listing for each model:
  - Primary key
  - ForeignKey fields (with target model)
  - OneToOne fields (with target model)
  - ManyToMany fields (with target model)
  - Other fields

Output: model_inventory.txt in the project root.

Usage:
  From project root (where Backend/ lives):

      python generate_model_inventory.py

Requirements:
  - Django installed
  - Backend/smw/settings.py is the main settings module
"""

import os
import sys
from datetime import datetime

# ---------------------------------------------------------------------------
# 1. Django setup
# ---------------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "Backend")

# Make sure Backend/ is on sys.path so "smw" is importable
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Set Django settings module (adjust if your settings path is different)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smw.settings")

import django  # noqa: E402

django.setup()

from django.apps import apps  # noqa: E402
from django.db import models  # noqa: E402


# ---------------------------------------------------------------------------
# 2. Helper: pretty label for a field
# ---------------------------------------------------------------------------

def get_field_type(field: models.Field) -> str:
    """
    Return a short string describing the field type, e.g. CharField, IntegerField.
    """
    return field.__class__.__name__


def get_related_model_label(field) -> str:
    """
    For FK/O2O/M2M fields, return "app_label.ModelName".
    """
    rel_model = field.remote_field.model
    if isinstance(rel_model, str):
        # Sometimes Django uses "app_label.ModelName" strings
        return rel_model
    return f"{rel_model._meta.app_label}.{rel_model.__name__}"


# ---------------------------------------------------------------------------
# 3. Build inventory
# ---------------------------------------------------------------------------

lines: list[str] = []
now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

lines.append("# Django Model Inventory")
lines.append(f"- Generated: {now}")
lines.append(f"- Base dir: {BASE_DIR}")
lines.append(f"- Settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
lines.append("")
lines.append("")

# Sort apps alphabetically for consistent output
for app_config in sorted(apps.get_app_configs(), key=lambda a: a.label):
    # Skip built-in Django apps if you only want project apps (optional)
    # if app_config.name.startswith("django."):
    #     continue

    lines.append(f"## App: {app_config.label}")
    lines.append("")

    # Sort models alphabetically within the app
    models_in_app = sorted(app_config.get_models(), key=lambda m: m.__name__)
    if not models_in_app:
        lines.append("  (no models)")
        lines.append("")
        continue

    for model in models_in_app:
        meta = model._meta
        model_label = f"{meta.app_label}.{model.__name__}"

        lines.append(f"Model: {model_label}")

        # Primary key
        pk_field = meta.pk
        pk_info = f"{pk_field.name} ({get_field_type(pk_field)})"
        lines.append(f"  - PK: {pk_info}")

        # Prepare buckets
        fks = []
        o2os = []
        m2ms = []
        others = []

        # Iterate concrete fields only (skip auto-created reverse relations)
        for field in meta.get_fields():
            if field.auto_created and not field.concrete:
                continue

            # Skip the PK itself when listing "other" fields
            if field is pk_field:
                continue

            # ForeignKey
            if isinstance(field, models.ForeignKey):
                fks.append(
                    f"    * {field.name}: FK → {get_related_model_label(field)}"
                )
            # OneToOneField
            elif isinstance(field, models.OneToOneField):
                o2os.append(
                    f"    * {field.name}: OneToOne → {get_related_model_label(field)}"
                )
            # ManyToManyField
            elif isinstance(field, models.ManyToManyField):
                m2ms.append(
                    f"    * {field.name}: ManyToMany → {get_related_model_label(field)}"
                )
            else:
                # Regular field
                field_type = get_field_type(field)
                null_str = "nullable" if getattr(field, "null", False) else "not null"
                lines.append(
                    f"    - {field.name}: {field_type} ({null_str})"
                )

        # Insert FK / O2O / M2M sections if non-empty
        if fks:
            lines.append("  - Foreign keys:")
            lines.extend(fks)
        if o2os:
            lines.append("  - One-to-one fields:")
            lines.extend(o2os)
        if m2ms:
            lines.append("  - Many-to-many fields:")
            lines.extend(m2ms)

        lines.append("")  # blank line between models

    lines.append("")  # blank line between apps


# ---------------------------------------------------------------------------
# 4. Write output file
# ---------------------------------------------------------------------------

output_path = os.path.join(BASE_DIR, "model_inventory.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Model inventory written to: {output_path}")
