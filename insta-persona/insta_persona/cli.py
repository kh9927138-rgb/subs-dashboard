import argparse
import sys
import time

from . import content, engagement, publisher
from .config import load_env, load_persona
from .db import connect
from .instagram import IG
from .llm import LLM


def main(argv=None):
    ap = argparse.ArgumentParser("insta-persona")
    ap.add_argument("--persona", default="persona.yaml")
    sub = ap.add_subparsers(dest="cmd", required=True)
    d = sub.add_parser("draft", help="generate a post draft"); d.add_argument("--topic")
    sub.add_parser("queue", help="list drafts and pending replies")
    a = sub.add_parser("approve-post"); a.add_argument("id", type=int)
    a.add_argument("--image-url", required=True, help="public URL of the image"); a.add_argument("--at", type=int, help="unix time")
    r = sub.add_parser("reject-post"); r.add_argument("id", type=int)
    ar = sub.add_parser("approve-reply"); ar.add_argument("id", type=int)
    ar.add_argument("--text", help="override the drafted text")
    sub.add_parser("tick", help="one cycle: publish due posts, poll, reply")
    sub.add_parser("run", help="loop forever (tick every 5 min, auto-draft on schedule)")
    args = ap.parse_args(argv)

    env, persona = load_env(), load_persona(args.persona)
    c, ig = connect(env.db_path), IG(env)
    llm = LLM(env.anthropic_key, env.model)

    if args.cmd == "draft":
        print("draft id:", content.generate_draft(c, llm, persona, args.topic))
    elif args.cmd == "queue":
        for p in c.execute("SELECT id,status,topic,image_prompt,caption FROM posts WHERE status IN ('draft','approved')"):
            print(f"[post {p['id']}] {p['status']} · {p['topic']}\n  image: {p['image_prompt']}\n{p['caption']}\n")
        for q in c.execute("SELECT * FROM replies WHERE status IN ('pending','flagged')"):
            print(f"[reply {q['id']}] {q['kind']} {q['status']} @{q['author']}: {q['incoming']}\n  -> {q['reply']} ({q['reason']})\n")
    elif args.cmd == "approve-post":
        c.execute("UPDATE posts SET status='approved', image_url=?, scheduled_at=? WHERE id=?",
                  (args.image_url, args.at, args.id)); c.commit()
    elif args.cmd == "reject-post":
        c.execute("UPDATE posts SET status='rejected' WHERE id=?", (args.id,)); c.commit()
    elif args.cmd == "approve-reply":
        c.execute("UPDATE replies SET status='approved', reply=COALESCE(?,reply) WHERE id=?",
                  (args.text, args.id)); c.commit()
    elif args.cmd in ("tick", "run"):
        while True:
            print("published:", publisher.publish_due(c, ig))
            engagement.poll(c, ig, llm, persona)
            print("replies sent:", engagement.send_ready(c, ig, persona))
            if args.cmd == "tick":
                break
            time.sleep(300)


if __name__ == "__main__":
    sys.exit(main())
