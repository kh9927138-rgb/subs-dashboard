import sqlite3
import time

SCHEMA = """
CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY, topic TEXT, caption TEXT, hashtags TEXT, image_prompt TEXT,
  image_url TEXT, status TEXT DEFAULT 'draft',  -- draft|approved|published|rejected|failed
  scheduled_at INTEGER, published_at INTEGER, ig_media_id TEXT, error TEXT, created_at INTEGER);
CREATE TABLE IF NOT EXISTS replies(
  id INTEGER PRIMARY KEY, kind TEXT, -- comment|dm
  source_id TEXT UNIQUE, author TEXT, incoming TEXT, reply TEXT,
  status TEXT DEFAULT 'pending',  -- pending|approved|sent|skipped|flagged|failed
  reason TEXT, created_at INTEGER, sent_at INTEGER);
"""


def connect(path):
    c = sqlite3.connect(path)
    c.row_factory = sqlite3.Row
    c.executescript(SCHEMA)
    return c


def now():
    return int(time.time())


def sent_last_hour(c, kind):
    return c.execute(
        "SELECT COUNT(*) FROM replies WHERE kind=? AND status='sent' AND sent_at>?",
        (kind, now() - 3600),
    ).fetchone()[0]
