import yaml

from pathlib import Path


def import_products(c, path="products.yaml"):
    items = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or []
    for it in items:
        c.execute(
            "INSERT INTO products(name,url,price_range,notes) VALUES(?,?,?,?) "
            "ON CONFLICT(name) DO UPDATE SET url=excluded.url, price_range=excluded.price_range, notes=excluded.notes",
            (it["name"], it.get("url", ""), it.get("price_range", ""), it.get("notes", "")))
    c.commit()
    return len(items)
