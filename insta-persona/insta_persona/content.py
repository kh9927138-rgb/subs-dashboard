"""Draft generation: caption + hashtags + image prompt, stored as 'draft' for approval.

kinds: daily (no commerce) | curation (affiliate product pick) | sponsored (paid collab).
curation/sponsored always carry the ad label and may never claim personal product experience.
"""
import random

from .claims import violations
from .db import now
from .persona_prompt import system_prompt

KINDS = ("daily", "curation", "sponsored")
MAX_TRIES = 3


def recent_captions(c, n=8):
    return [r["caption"] for r in c.execute("SELECT caption FROM posts ORDER BY id DESC LIMIT ?", (n,))]


def pick_kind(persona):
    kinds, weights = zip(*persona.content_mix.items())
    return random.choices(kinds, weights)[0]


def _commerce_brief(product, persona):
    return (
        f"This is a curated product pick (advertising). Product: {product['name']} "
        f"({product['price_range'] or 'price n/a'}). Notes: {product['notes'] or '-'}\n"
        "You are a fictional character and have NOT used it. Never say you tried/used/bought it, never "
        "write reviews or results. Explain only WHY it was picked (style fit, look, design) and WHO it suits. "
        f"Mention the link is in the profile ({persona.profile_link or 'bio link'}).\n"
    )


def generate_draft(c, llm, persona, topic=None, kind="daily", product_id=None):
    if kind not in KINDS:
        raise ValueError(f"kind must be one of {KINDS}")
    product = None
    if kind != "daily":
        row = (c.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone() if product_id
               else c.execute("SELECT * FROM products ORDER BY RANDOM() LIMIT 1").fetchone())
        if not row:
            raise ValueError("curation/sponsored posts need a product (products-import first)")
        product = dict(row)
    topic = topic or (product["name"] if product else random.choice(persona.topics))
    recent = "\n---\n".join(recent_captions(c)) or "(none)"
    brief = _commerce_brief(product, persona) if product else ""

    for _ in range(MAX_TRIES):
        out = llm.ask_json(
            system_prompt(persona),
            f"Write one Instagram feed post about: {topic}.\n{brief}"
            f"Recent posts (do not repeat their ideas/phrasing):\n{recent}\n"
            'JSON keys: "caption" (string, no hashtags), "hashtags" (array of 5-10), '
            '"image_prompt" (English prompt describing only the scene, pose, outfit and mood; '
            "the character's fixed look is added automatically).",
        )
        if not violations(out["caption"]):
            break
    else:
        raise RuntimeError(f"draft kept claiming product experience: {violations(out['caption'])}")

    tags = list(dict.fromkeys(persona.hashtags_base + out["hashtags"]))[:20]
    parts = [out["caption"].strip()]
    if kind != "daily":
        parts.insert(0, persona.ad_label)
        if product["url"]:
            parts.append(f"🔗 {product['name']}: 프로필 링크에서 확인")
    parts += [" ".join(tags), f"— {persona.disclosure}"]
    caption = "\n\n".join(parts)
    image_prompt = (f"{persona.appearance}. {out['image_prompt']}".strip(". ")
                    if persona.appearance else out["image_prompt"])
    cur = c.execute(
        "INSERT INTO posts(kind,product_id,topic,caption,hashtags,image_prompt,created_at) VALUES(?,?,?,?,?,?,?)",
        (kind, product["id"] if product else None, topic, caption, " ".join(tags), image_prompt, now()),
    )
    c.commit()
    return cur.lastrowid
