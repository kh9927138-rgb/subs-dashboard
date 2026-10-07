"""Poll comments/DMs, draft replies, and send them (auto or after approval) under rate limits."""
from .db import now, sent_last_hour
from .persona_prompt import system_prompt
from .safety import is_inquiry, needs_human, triage


def _draft(c, llm, persona, kind, source_id, author, text):
    if c.execute("SELECT 1 FROM replies WHERE source_id=?", (source_id,)).fetchone():
        return
    status, reason, reply = "pending", "", None
    if is_inquiry(text):
        status, reason = "inquiry", "business inquiry - human only"
    elif needs_human(text):
        status, reason = "flagged", "keyword/length filter"
    else:
        action, reason = triage(llm, persona, text)
        if action == "skip":
            status = "skipped"
        elif action == "human":
            status = "flagged"
        else:
            reply = llm.ask(system_prompt(persona),
                            f"Reply to this {kind} from @{author} in 1-2 short sentences:\n{text}", 300).strip()
    c.execute("INSERT INTO replies(kind,source_id,author,incoming,reply,status,reason,created_at) "
              "VALUES(?,?,?,?,?,?,?,?)", (kind, source_id, author, text, reply, status, reason, now()))
    c.commit()


def poll(c, ig, llm, persona):
    if persona.comment_reply.enabled:
        for m in ig.recent_media():
            for cm in ig.comments(m["id"]):
                if cm.get("username") == persona.handle:
                    continue
                _draft(c, llm, persona, "comment", cm["id"], cm["username"], cm["text"])
    if persona.dm_reply.enabled:
        for conv in ig.conversations():
            msgs = conv.get("messages", {}).get("data", [])
            if not msgs:
                continue
            m = msgs[0]
            if str(m["from"]["id"]) == str(ig.e.ig_user_id):
                continue
            _draft(c, llm, persona, "dm", f"dm:{m['id']}:{m['from']['id']}",
                   m["from"].get("username", m["from"]["id"]), m.get("message", ""))


def send_ready(c, ig, persona):
    """Send replies that are approved, or pending when auto_send is on."""
    sent = 0
    for r in c.execute("SELECT * FROM replies WHERE reply IS NOT NULL AND status IN ('pending','approved')").fetchall():
        cfg = persona.comment_reply if r["kind"] == "comment" else persona.dm_reply
        if r["status"] == "pending" and not cfg.auto_send:
            continue
        if sent_last_hour(c, r["kind"]) >= cfg.max_per_hour:
            continue
        try:
            if r["kind"] == "comment":
                ig.reply_comment(r["source_id"], r["reply"])
            else:
                ig.send_dm(r["source_id"].split(":")[2], r["reply"])
            c.execute("UPDATE replies SET status='sent', sent_at=? WHERE id=?", (now(), r["id"]))
            sent += 1
        except Exception as e:  # noqa: BLE001
            c.execute("UPDATE replies SET status='failed', reason=? WHERE id=?", (str(e)[:200], r["id"]))
        c.commit()
    return sent
