import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml


@dataclass
class ReplyCfg:
    enabled: bool = False
    auto_send: bool = False
    max_per_hour: int = 10


@dataclass
class Persona:
    name: str
    handle: str
    disclosure: str
    bio: str
    language: str = "ko"
    appearance: str = ""          # fixed look, prepended to every image prompt
    reference_image: str = ""     # path to the AI-generated reference image
    tone: str = ""
    topics: list = field(default_factory=list)
    avoid: list = field(default_factory=list)
    hashtags_base: list = field(default_factory=list)
    ad_label: str = "#광고"
    profile_link: str = ""
    content_mix: dict = field(default_factory=lambda: {"daily": 0.6, "curation": 0.4})
    posts_per_week: int = 3
    post_times: list = field(default_factory=lambda: ["12:00"])
    timezone: str = "UTC"
    comment_reply: ReplyCfg = field(default_factory=ReplyCfg)
    dm_reply: ReplyCfg = field(default_factory=ReplyCfg)


@dataclass
class Env:
    anthropic_key: str
    model: str
    ig_user_id: str
    ig_token: str
    graph_version: str
    dry_run: bool
    db_path: str


def load_persona(path="persona.yaml") -> Persona:
    raw = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    for k in ("comment_reply", "dm_reply"):
        raw[k] = ReplyCfg(**raw.get(k, {}))
    if not raw.get("disclosure"):
        raise ValueError("persona.disclosure is required (AI accounts must be labeled)")
    return Persona(**raw)


def load_env() -> Env:
    g = os.environ.get
    return Env(
        anthropic_key=g("ANTHROPIC_API_KEY", ""),
        model=g("CLAUDE_MODEL", "claude-sonnet-5-5"),
        ig_user_id=g("IG_USER_ID", ""),
        ig_token=g("IG_ACCESS_TOKEN", ""),
        graph_version=g("IG_GRAPH_VERSION", "v21.0"),
        dry_run=g("DRY_RUN", "true").lower() != "false",
        db_path=g("DB_PATH", "insta_persona.db"),
    )
