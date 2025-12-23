import argparse
import csv
import json
import os
import re
import unicodedata
from typing import Any, Dict, Iterable, List, Optional, Tuple

SHOPIFY_HEADERS: List[str] = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Type",
    "Tags",
    "Published",
    "Option1 Name",
    "Option1 Value",
    "Variant SKU",
    "Variant Grams",
    "Variant Inventory Tracker",
    "Variant Inventory Qty",
    "Variant Price",
    "Image Src",
]


def slugify(value: str) -> str:
    """Make a Shopify-safe handle (lowercase, hyphenated, ascii when possible)."""
    value = (value or "").strip().lower()
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "item"


def ensure_unique_handle(base: str, used: Dict[str, int]) -> str:
    if base not in used:
        used[base] = 1
        return base
    used[base] += 1
    return f"{base}-{used[base]}"


def parse_price(value: Any) -> str:
    # Shopify expects '.' decimal and no currency symbol.
    if value is None:
        return ""
    if isinstance(value, (int, float)):
        return f"{value:.2f}"
    s = str(value).strip()
    s = s.replace(",", ".")
    s = re.sub(r"[^0-9.]", "", s)
    if s == "":
        return ""
    try:
        return f"{float(s):.2f}"
    except ValueError:
        return ""


def as_tags(*parts: str) -> str:
    clean = [p.strip() for p in parts if (p or "").strip()]
    # Shopify tags are comma-separated.
    # Deduplicate while preserving order.
    seen = set()
    out: List[str] = []
    for p in clean:
        key = p.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
    return ", ".join(out)


def resolve_image_src(image_path: Optional[str], public_base_url: str = "") -> str:
    if not image_path:
        return ""
    image_path = image_path.strip()
    if image_path.startswith("http://") or image_path.startswith("https://"):
        return image_path
    if public_base_url:
        return public_base_url.rstrip("/") + "/" + image_path.lstrip("/")
    # Shopify imports do best with absolute URLs, but we allow relative for local workflows.
    return image_path


def iter_menu_items(menu_json: Dict[str, Any]) -> Iterable[Tuple[Dict[str, Any], Dict[str, Any]]]:
    """Yield (category, item) pairs from src/data/menu.json."""
    for cat in menu_json.get("categories", []) or []:
        items = cat.get("items", []) or []
        for item in items:
            yield cat, item


def convert_menu_to_rows(
    menu_json: Dict[str, Any],
    vendor: str,
    published: str,
    inventory_tracker: str,
    inventory_qty: str,
    grams: str,
    public_base_url: str,
) -> List[List[str]]:
    used_handles: Dict[str, int] = {}
    rows: List[List[str]] = []

    for cat, item in iter_menu_items(menu_json):
        title = str(item.get("title") or "").strip()
        if not title:
            continue

        category_name = str(cat.get("name") or "").strip()
        category_slug = str(cat.get("slug") or "").strip()

        amount = str(item.get("amount") or "").strip()
        option1_name = "Size" if amount else "Title"
        option1_value = amount if amount else "Default Title"

        body_text = str(item.get("text") or "").strip()
        # If no long description, use category description as fallback.
        if not body_text:
            body_text = str(cat.get("description") or "").strip()
        body_html = body_text

        price = parse_price(item.get("price"))

        # Handle: base on title + amount to reduce collisions.
        base_handle = slugify(title if not amount else f"{title} {amount}")
        handle = ensure_unique_handle(base_handle, used_handles)

        sku = slugify(handle).upper()

        tags = as_tags(category_name, category_slug)
        img_src = resolve_image_src(item.get("image"), public_base_url=public_base_url)

        rows.append(
            [
                handle,
                title,
                body_html,
                vendor,
                category_name or "Menu",
                tags,
                published,
                option1_name,
                option1_value,
                sku,
                grams,
                inventory_tracker,
                inventory_qty,
                price,
                img_src,
            ]
        )

    return rows


def convert_products_json_to_rows(
    products_json: Dict[str, Any],
    vendor: str,
    published: str,
    inventory_tracker: str,
    inventory_qty: str,
    grams: str,
    public_base_url: str,
) -> List[List[str]]:
    used_handles: Dict[str, int] = {}
    rows: List[List[str]] = []

    items = products_json.get("items", []) or []
    for item in items:
        title = str(item.get("title") or "").strip()
        if not title:
            continue

        body_html = str(item.get("short") or "").strip()
        price = parse_price(item.get("price"))
        image = resolve_image_src(item.get("image"), public_base_url=public_base_url)

        base_handle = slugify(title)
        handle = ensure_unique_handle(base_handle, used_handles)
        sku = slugify(handle).upper()

        tags = as_tags("products")

        rows.append(
            [
                handle,
                title,
                body_html,
                vendor,
                "Product",
                tags,
                published,
                "Title",
                "Default Title",
                sku,
                grams,
                inventory_tracker,
                inventory_qty,
                price,
                image,
            ]
        )

    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert deliorman JSON to Shopify product CSV")
    parser.add_argument(
        "--input",
        default=os.path.join("src", "data", "menu.json"),
        help="Path to input JSON (default: src/data/menu.json)",
    )
    parser.add_argument(
        "--kind",
        choices=["menu", "products"],
        default="menu",
        help="Which JSON shape to parse (default: menu)",
    )
    parser.add_argument(
        "--output",
        default="shopify_import.csv",
        help="Output CSV filename (default: shopify_import.csv)",
    )
    parser.add_argument("--vendor", default="Deliorman", help="Shopify Vendor field")
    parser.add_argument("--published", default="TRUE", help="Published TRUE/FALSE")
    parser.add_argument(
        "--inventory-tracker",
        default="",
        help="Variant Inventory Tracker (blank, 'shopify', etc.)",
    )
    parser.add_argument(
        "--inventory-qty",
        default="0",
        help="Variant Inventory Qty (default: 0)",
    )
    parser.add_argument(
        "--grams",
        default="0",
        help="Variant Grams (default: 0)",
    )
    parser.add_argument(
        "--public-base-url",
        default="",
        help="If set, relative image paths become absolute URLs (e.g. https://example.com)",
    )

    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        data = json.load(f)

    if args.kind == "menu":
        rows = convert_menu_to_rows(
            data,
            vendor=args.vendor,
            published=args.published,
            inventory_tracker=args.inventory_tracker,
            inventory_qty=str(args.inventory_qty),
            grams=str(args.grams),
            public_base_url=args.public_base_url,
        )
    else:
        rows = convert_products_json_to_rows(
            data,
            vendor=args.vendor,
            published=args.published,
            inventory_tracker=args.inventory_tracker,
            inventory_qty=str(args.inventory_qty),
            grams=str(args.grams),
            public_base_url=args.public_base_url,
        )

    with open(args.output, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(SHOPIFY_HEADERS)
        writer.writerows(rows)

    print(f"Wrote {len(rows)} product rows to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

