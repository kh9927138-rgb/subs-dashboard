"""Draft generation: caption + hashtags + image prompt, stored as 'draft' for approval."""
import random

from .db import now
from .persona_prompt import system_prompt


def recent_captions(c, n=8):
    return [r["caption"] for r in c.execute("SELECT caption FROM posts ORDER BY id DESC LIMIT ?", (n,))]


def generate_draft(c, llm, persona, topic=None):
    topic = topic or random.choice(persona.topics)
    recent = "\n---\n".join(recent_captions(c)) or "(none)"
    out = llm.ask_json(
        system_prompt(persona),
        f"Write one Instagram feed post about: {topic}.\n"
        f"Recent posts (do not repeat their ideas/phrasing):\n{recent}\n"
        'JSON keys: "caption" (string, no hashtags), "hashtags" (array of 5-10), '
        '"image_prompt" (English prompt describing only the scene, pose, outfit and mood; '
        "the character's fixed look is added automatically).',
    )
    image_prompt = f"{persona.appearance}. {out['image_prompt']}".strip(". ") if persona.appearance else out["image_prompt"]
    tags = list(dict.fromkeys(persona.hashtags_base + out["hashtags"]))[:20]
    caption = f"{out['caption'].strip()}\n\n{' '.join(tags)}\n\n— {persona.disclosure}"
    cur = c.execute(
        "INSERT INTO posts(topic,caption,hashtags,image_prompt,created_at) VALUES(?,?,?,?,?)",
        (topic, caption, " ".join(tags), image_prompt, now()),
    )
    c.commit()
    return cur.lastrowid
