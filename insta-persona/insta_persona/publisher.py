from .db import now


def publish_due(c, ig):
    """Publish approved posts whose scheduled time has passed and that have an image_url."""
    n = 0
    for p in c.execute("SELECT * FROM posts WHERE status='approved' AND image_url IS NOT NULL "
                       "AND COALESCE(scheduled_at,0)<=?", (now(),)).fetchall():
        try:
            mid = ig.publish_image(p["image_url"], p["caption"])
            c.execute("UPDATE posts SET status='published', published_at=?, ig_media_id=? WHERE id=?",
                      (now(), mid, p["id"]))
            n += 1
        except Exception as e:  # noqa: BLE001
            c.execute("UPDATE posts SET status='failed', error=? WHERE id=?", (str(e)[:300], p["id"]))
        c.commit()
    return n
