import pytest

from insta_persona import content, publisher
from insta_persona.claims import violations
from insta_persona.config import Persona
from insta_persona.db import connect


class LLM:
    def __init__(self, captions): self.caps = list(captions)
    def ask_json(self, *a, **k):
        return {"caption": self.caps.pop(0), "hashtags": ["#a"], "image_prompt": "cafe window"}


def setup(tmp_path):
    c = connect(str(tmp_path / "t.db"))
    c.execute("INSERT INTO products(name,url) VALUES('Tee','https://x')"); c.commit()
    return c, Persona("ena", "ena", "AI 가상 캐릭터", "bio", appearance="LOOK")


def test_claims():
    assert violations("이거 직접 써봤어요") and violations("내돈내산 후기") and violations("I tried it")
    assert not violations("은회색 머리에 어울리는 핏이라 골랐어요")


def test_retry_then_ad_label(tmp_path):
    c, p = setup(tmp_path)
    pid = content.generate_draft(c, LLM(["써봤는데 좋아요", "핏이 좋아서 골랐어요"]), p, kind="curation")
    r = c.execute("SELECT * FROM posts WHERE id=?", (pid,)).fetchone()
    assert r["caption"].startswith("#광고") and "써봤" not in r["caption"]
    assert r["image_prompt"].startswith("LOOK")


def test_gives_up_on_persistent_claims(tmp_path):
    c, p = setup(tmp_path)
    with pytest.raises(RuntimeError):
        content.generate_draft(c, LLM(["써봤어요"] * 3), p, kind="curation")


def test_daily_needs_no_product_and_curation_does(tmp_path):
    c = connect(str(tmp_path / "t.db"))
    p = Persona("ena", "ena", "AI", "bio", topics=["walk"])
    content.generate_draft(c, LLM(["산책했어요"]), p)
    with pytest.raises(ValueError):
        content.generate_draft(c, LLM(["x"]), p, kind="curation")


def test_publisher_blocks_missing_ad_label(tmp_path):
    c = connect(str(tmp_path / "t.db"))
    c.execute("INSERT INTO posts(kind,caption,status,image_url) VALUES('curation','no label','approved','u')"); c.commit()
    class IG:
        def publish_image(self, *a): raise AssertionError("must not publish")
    assert publisher.publish_due(c, IG()) == 0
    assert c.execute("SELECT error FROM posts").fetchone()[0] == "missing ad label"
