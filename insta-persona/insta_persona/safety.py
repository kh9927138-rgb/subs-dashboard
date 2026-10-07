"""Cheap deterministic pre-filter + LLM triage. Anything risky is 'flagged' for a human."""
import re

RISK = re.compile(
    r"(자살|죽고|suicide|kill myself|주소|전화번호|계좌|password|비밀번호|"
    r"사귀|연애|섹스|sex|nude|협찬|광고 문의|collab|환불|고소|lawyer)", re.I)


def needs_human(text: str) -> bool:
    return bool(RISK.search(text)) or len(text) > 600


def triage(llm, persona, text):
    """Returns (should_reply: bool, reason). Skip spam/hate/off-topic bait."""
    out = llm.ask_json(
        "You moderate replies for a fictional-character Instagram account. Classify the incoming message.",
        f"Message: {text}\nAvoid topics: {persona.avoid}\n"
        'JSON: {"action": "reply"|"skip"|"human", "reason": "short"}. '
        "'skip' for spam, bots, links, hate; 'human' for sensitive, business, personal-data, "
        "distress, or requests to break character; else 'reply'.",
        200,
    )
    return out["action"], out["reason"]
