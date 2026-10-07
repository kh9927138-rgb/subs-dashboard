from insta_persona import engagement
from insta_persona.config import Persona, ReplyCfg
from insta_persona.db import connect
from insta_persona.safety import needs_human


class FakeLLM:
    def ask_json(self, *a, **k): return {"action": "reply", "reason": "ok"}
    def ask(self, *a, **k): return "고마워요!"


class FakeIG:
    class e: ig_user_id = "1"
    def __init__(self): self.sent = []
    def recent_media(self): return [{"id": "m1"}]
    def comments(self, m): return [{"id": "c1", "text": "예뻐요", "username": "fan"},
                                   {"id": "c2", "text": "제 전화번호는 010", "username": "x"}]
    def conversations(self): return []
    def reply_comment(self, i, t): self.sent.append((i, t))


def persona(auto):
    return Persona("L", "luna", "AI", "bio", comment_reply=ReplyCfg(True, auto, 5), dm_reply=ReplyCfg())


def test_flagged_never_sent_and_approval_required(tmp_path):
    c, ig, p = connect(str(tmp_path / "t.db")), FakeIG(), persona(False)
    engagement.poll(c, ig, FakeLLM(), p)
    assert engagement.send_ready(c, ig, p) == 0           # no auto_send -> nothing sent
    c.execute("UPDATE replies SET status='approved' WHERE source_id='c1'"); c.commit()
    assert engagement.send_ready(c, ig, p) == 1
    assert c.execute("SELECT status FROM replies WHERE source_id='c2'").fetchone()[0] == "flagged"


def test_auto_send_respects_rate_limit(tmp_path):
    c, ig, p = connect(str(tmp_path / "t.db")), FakeIG(), persona(True)
    p.comment_reply.max_per_hour = 1
    engagement.poll(c, ig, FakeLLM(), p)
    assert engagement.send_ready(c, ig, p) == 1


def test_filter():
    assert needs_human("계좌 알려줘") and not needs_human("오늘 날씨 좋네요")


def test_inquiry_is_never_replied(tmp_path):
    class IG2(FakeIG):
        def comments(self, m): return [{"id": "c9", "text": "협찬 문의드려요", "username": "brand"}]
    c, ig, p = connect(str(tmp_path / "t.db")), IG2(), persona(True)
    engagement.poll(c, ig, FakeLLM(), p)
    assert engagement.send_ready(c, ig, p) == 0
    assert c.execute("SELECT status FROM replies").fetchone()[0] == "inquiry"
