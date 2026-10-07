import json
import re

import anthropic


class LLM:
    def __init__(self, key, model):
        self.client = anthropic.Anthropic(api_key=key)
        self.model = model

    def ask(self, system, user, max_tokens=1000):
        r = self.client.messages.create(
            model=self.model, max_tokens=max_tokens, system=system,
            messages=[{"role": "user", "content": user}],
        )
        return "".join(b.text for b in r.content if b.type == "text")

    def ask_json(self, system, user, max_tokens=1000):
        txt = self.ask(system + "\nRespond with a single JSON object only.", user, max_tokens)
        m = re.search(r"\{.*\}", txt, re.S)
        return json.loads(m.group(0))
