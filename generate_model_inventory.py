import os
import sys
import django
from django.apps import apps
from django.db import models

# ------------------------------------------------
# 1. Add Backend to PYTHONPATH
# ------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "Backend")
sys.path.insert(0, BACKEND_DIR)

# ------------------------------------------------
# 2. Set Django settings module
# ------------------------------------------------
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smw.settings")

# ------------------------------------------------
# 3. Initialize Django
# ------------------------------------------------
django.setup()

OUTPUT_FILE = "model_inventory.txt"

def format_field(field):
    """Format field details (type, PK, FK, relations)."""
    msg = f"- {field.name} ({field.get_internal_type()})"

    if field.primary_key:
        msg += " [PK]"

    if isinstance(field, models.ForeignKey):
        msg += f" [FK → {field.related_model.__name__}]"

    if isinstance(field, models.OneToOneField):
        msg += f" [OneToOne → {field.related_model.__name__}]"

    if isinstance(field, models.ManyToManyField):
        msg += f" [ManyToMany → {field.related_model.__name__}]"

    return msg


def generate_model_inventory():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("=== Django Model Inventory ===\n\n")

        for model in apps.get_models():
            model_name = model._meta.label   # app.ModelName
            f.write(f"MODEL: {model_name}\n")
            f.write("-" * (len(model_name) + 8) + "\n")

            for field in model._meta.get_fields():
                # skip reverse relations
                if field.auto_created and not field.concrete:
                    continue

                f.write(format_field(field) + "\n")

            f.write("\n")

    print(f"✔ Model inventory written to {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_model_inventory()
