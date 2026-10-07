"""Thin client over the official Instagram Graph API. Writes are skipped when dry_run=True."""
import json

import requests


class IG:
    def __init__(self, env):
        self.e = env
        self.base = f"https://graph.facebook.com/{env.graph_version}"

    def _call(self, method, path, write=False, **params):
        if write and self.e.dry_run:
            print(f"[DRY_RUN] {method} {path} {params}")
            return {"id": "dry-run"}
        params["access_token"] = self.e.ig_token
        r = requests.request(method, f"{self.base}/{path}", params=params, timeout=30)
        if not r.ok:
            raise RuntimeError(f"IG API {r.status_code}: {r.text[:300]}")
        return r.json()

    # --- publishing (image must be a publicly reachable URL) ---
    def publish_image(self, image_url, caption):
        c = self._call("POST", f"{self.e.ig_user_id}/media", write=True,
                       image_url=image_url, caption=caption)
        return self._call("POST", f"{self.e.ig_user_id}/media_publish", write=True,
                          creation_id=c["id"])["id"]

    # --- comments ---
    def recent_media(self, limit=10):
        return self._call("GET", f"{self.e.ig_user_id}/media", fields="id,caption", limit=limit)["data"]

    def comments(self, media_id):
        return self._call("GET", f"{media_id}/comments",
                          fields="id,text,username,timestamp", limit=50)["data"]

    def reply_comment(self, comment_id, text):
        return self._call("POST", f"{comment_id}/replies", write=True, message=text)

    # --- DMs (Messaging API; only within 24h of the user's last message) ---
    def conversations(self):
        return self._call("GET", f"{self.e.ig_user_id}/conversations", platform="instagram",
                          fields="id,messages.limit(1){id,message,from,created_time}")["data"]

    def send_dm(self, recipient_id, text):
        return self._call("POST", f"{self.e.ig_user_id}/messages", write=True,
                          recipient=json.dumps({"id": recipient_id}),
                          message=json.dumps({"text": text}))
