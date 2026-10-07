"""Guard: a fictional character must not claim personal product experience or results."""
import re

EXPERIENCE = re.compile(
    r"(써\s?봤|써보니|사용\s?해\s?봤|사용해보니|먹어\s?봤|발라\s?봤|입어\s?봤|써본|직접 (써|사용|구매|먹)|"
    r"내돈내산|솔직\s?후기|리얼\s?후기|후기|효과\s?(봤|좋|있었)|피부가\s?좋아|"
    r"\bI (tried|used|bought|tested)\b|\bmy review\b|\bworks (great|for me)\b|\bit changed my\b)", re.I)


def violations(text: str) -> list[str]:
    return sorted({m.group(0) for m in EXPERIENCE.finditer(text)})
