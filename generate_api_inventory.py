#!/usr/bin/env python3
"""
generate_api_inventory_v2.py

Introspect Django REST Framework views directly (without relying on DRF's
OpenAPI schema) to generate an API inventory that includes:

- Method + path
- Purpose (heuristic, based on view class name + method)
- Request fields (from serializer_class / get_serializer_class)
- Response fields (assumed same serializer)

Output: api_inventory_v2.txt in the project root.

Usage:
  cd D:\1SMW\SMW-v1
  python generate_api_inventory_v2.py
"""

import os
import sys
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "Backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smw.settings")

import django  # noqa: E402

django.setup()

from django.urls import URLPattern, URLResolver, get_resolver  # noqa: E402
from rest_framework.views import APIView  # noqa: E402
from rest_framework import serializers  # noqa: E402


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def walk_urlpatterns(patterns, prefix=""):
    """
    Recursively yield (path, callback) for all URLPattern objects.
    """
    for pattern in patterns:
        if isinstance(pattern, URLPattern):
            path_str = prefix + str(pattern.pattern)
            # Ensure a leading "/"
            if not path_str.startswith("/"):
                path_str = "/" + path_str
            yield path_str, pattern.callback
        elif isinstance(pattern, URLResolver):
            nested_prefix = prefix + str(pattern.pattern)
            yield from walk_urlpatterns(pattern.url_patterns, prefix=nested_prefix)


def get_http_methods(view_cls):
    """
    Get the list of HTTP methods for a DRF APIView.
    """
    names = getattr(view_cls, "http_method_names", None)
    if not names:
        return []
    # Filter out options/head etc.
    return [m for m in names if m not in ("options", "head")]


def infer_purpose(view_cls, method, path):
    """
    Heuristic for "purpose" text:
    - Based on view class name (e.g., AdmissionApplyView -> "Admission apply")
    - And HTTP method (GET -> list/retrieve, POST -> create, etc.)
    """
    cls_name = view_cls.__name__
    base = cls_name.replace("APIView", "").replace("ViewSet", "").replace("View", "")

    # Very rough split Words by capital letter boundaries
    words = []
    current = ""
    for ch in base:
        if ch.isupper() and current:
            words.append(current)
            current = ch
        else:
            current += ch
    if current:
        words.append(current)

    label = " ".join(w.lower() for w in words) or cls_name

    method = method.lower()
    if method == "get":
        if "list" in label or "list" in path:
            action = "list"
        elif "detail" in label or "id" in path or "pk" in path:
            action = "retrieve"
        else:
            action = "retrieve/list"
    elif method == "post":
        action = "create"
    elif method in ("put", "patch"):
        action = "update"
    elif method == "delete":
        action = "delete"
    else:
        action = method

    return f"{action.capitalize()} – {label}"


def describe_serializer_fields(serializer_class):
    """
    Given a DRF serializer class, instantiate it without data and return a list of
    "name: type (required/optional)" lines.
    """
    lines = []

    if not serializer_class or not issubclass(serializer_class, serializers.BaseSerializer):
        lines.append("  (no serializer detected)")
        return lines

    # Try to instantiate without args; for ModelSerializer this is usually fine.
    try:
        serializer = serializer_class()
    except TypeError:
        # Fallback: try with no instance/data; some custom serializers might still fail.
        try:
            serializer = serializer_class(instance=None)
        except Exception:
            lines.append("  (serializer exists but could not be instantiated)")
            return lines

    fields = getattr(serializer, "fields", None)
    if not fields:
        lines.append("  (serializer has no fields attribute)")
        return lines

    for name, field in fields.items():
        ftype = field.__class__.__name__
        required = getattr(field, "required", False)
        req_label = "required" if required else "optional"
        help_text = getattr(field, "help_text", "") or ""
        line = f"  - {name}: {ftype} ({req_label})"
        if help_text:
            line += f" — {help_text.strip()}"
        lines.append(line)

    if not lines:
        lines.append("  (serializer has no visible fields)")

    return lines


def get_serializer_class_for_method(view_cls, method):
    """
    Try to get the serializer class used by a view for a given method.
    - Works for typical DRF APIView / GenericAPIView patterns.
    - For ViewSets with get_serializer_class depending on action,
      this may not be fully accurate but should still capture most cases.
    """
    # Construct an instance of the view; don't dispatch, just use attributes.
    try:
        view = view_cls()
    except Exception:
        return None

    # Some GenericAPIView subclasses define get_serializer_class
    get_sc = getattr(view, "get_serializer_class", None)
    if callable(get_sc):
        try:
            return get_sc()
        except TypeError:
            # Some implementations expect args; ignore
            pass
        except Exception:
            pass

    # Fallback to plain serializer_class attribute
    serializer_class = getattr(view, "serializer_class", None)
    if serializer_class:
        return serializer_class

    return None


# ---------------------------------------------------------------------------
# Main inventory generation
# ---------------------------------------------------------------------------

resolver = get_resolver()
all_patterns = list(walk_urlpatterns(resolver.url_patterns))

entries = []

for path, callback in all_patterns:
    view_cls = getattr(callback, "cls", None)
    if not view_cls:
        continue
    if not issubclass(view_cls, APIView):
        continue

    methods = get_http_methods(view_cls)
    if not methods:
        continue

    for method in methods:
        purpose = infer_purpose(view_cls, method, path)
        serializer_class = get_serializer_class_for_method(view_cls, method)

        entries.append({
            "path": path,
            "method": method.upper(),
            "view": f"{view_cls.__module__}.{view_cls.__name__}",
            "purpose": purpose,
            "serializer_class": serializer_class,
        })

# Sort entries for stable output
entries.sort(key=lambda e: (e["path"], e["method"]))


# ---------------------------------------------------------------------------
# Write to file
# ---------------------------------------------------------------------------

now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
output_lines = []

output_lines.append("# API Inventory (direct view/serializer introspection)")
output_lines.append(f"- Generated: {now}")
output_lines.append(f"- Base dir: {BASE_DIR}")
output_lines.append(f"- Settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
output_lines.append("")
output_lines.append("")

for entry in entries:
    path = entry["path"]
    method = entry["method"]
    view = entry["view"]
    purpose = entry["purpose"]
    serializer_class = entry["serializer_class"]

    output_lines.append(f"## {method} {path}")
    output_lines.append(f"- View: {view}")
    output_lines.append(f"- Purpose: {purpose}")
    output_lines.append("")

    # Request + Response: same serializer (best-effort assumption)
    if method in ("POST", "PUT", "PATCH"):
        output_lines.append("Request body fields:")
        output_lines.extend(describe_serializer_fields(serializer_class))
        output_lines.append("")
    else:
        output_lines.append("Request body: none (or not used)")
        output_lines.append("")

    output_lines.append("Response fields (assumed same serializer):")
    output_lines.extend(describe_serializer_fields(serializer_class))
    output_lines.append("")
    output_lines.append("")

output_path = os.path.join(BASE_DIR, "api_inventory.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(output_lines))

print(f"API inventory written to: {output_path}")
