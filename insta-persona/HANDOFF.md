# HANDOFF — insta-persona (read this first)

새 세션(특히 크롬 연결이 되는 로컬 세션)에서 이어가기 위한 요약입니다. PR: kh9927138-rgb/subs-dashboard#1, 브랜치 `claude/dreamy-einstein-krbzn6`.

## 목표
Claude가 가상 캐릭터 **ena**의 인스타그램 계정을 자동 운영(게시 초안·예약 게시·댓글/DM 응대)하고, 브랜딩과 수익화(큐레이션/제휴/협찬)를 목표로 한다.

## 확정된 결정
- 인물: AI 가상 캐릭터(사용자가 AI 생성 이미지임을 확인). 참조 이미지 `assets/reference.jpg`, 외형은 `persona.example.yaml`의 `appearance`.
- 이름: ena. 말투/주제는 초안(담백한 존댓말, 일상 60% + 큐레이션 40%)이며 사용자가 아직 최종 확정하지 않음. 한국어, 팔로워는 아이디로 호칭.
- 자동화: 게시 + 댓글/DM 응대. 기본은 승인 후 전송(`auto_send: false`), `DRY_RUN=true`.
- 구현: `insta-persona/` (Python, 공식 Instagram Graph API + Claude API, SQLite). 테스트 9개 통과(가짜 LLM/IG 사용, 실제 API는 미호출).

## 구현된 것
게시물 초안(`draft`), 승인/예약 게시, 댓글·DM 수집/분류/답변, 위험 키워드·LLM 분류(`flagged`/`skipped`), 시간당 전송 상한,
수익화 장치: 게시물 유형(daily/curation/sponsored), `#광고` 자동 삽입 + 누락 시 게시 차단, "써봤어요/후기" 경험 가장 표현 차단(재생성 3회), 상품 목록(`products-import`), 협업 문의 `inquiry` 분류(자동 답장 안 함).

## 아직 안 된 것 / 열린 질문
1. **릴스 지원 없음.** 현재는 사진 1장짜리 게시물만 가능. vidIQ 조사에서 반응이 확인된 건 전부 릴스였음 → 릴스 지원이 우선순위 높을 수 있음(근거는 약함).
2. **이미지/영상 생성 도구 미정.** 지금은 이미지 프롬프트만 생성하고 사용자가 이미지를 만들어 공개 URL로 승인함.
3. **릴스 조사 미완료.** 아래 3개 릴스의 형식을 확인하려 했으나 vidIQ 크레딧 부족, 클라우드 세션에서 인스타 접속 차단, 크롬 연결 불가로 못 봄.
   - https://www.instagram.com/reel/DdlOoXnStyD/ (@aistudio.jessica, AI 패션, 130만 조회)
   - https://www.instagram.com/reel/DdlpB1QysiK/ (@aistudio.jessica, 57만 조회)
   - https://www.instagram.com/reel/DQUWg9RCQLW/ (@eunique_szn, 큐레이션, 90만 조회; 좋아요 대비 댓글이 매우 많음 → 댓글로 링크 DM 받는 방식일 가능성은 **추측**)
   확인할 것: 영상 길이/구성, 첫 3초, 자막, 캡션의 AI 표기, 링크/CTA 방식.
4. 게시 빈도(`posts_per_week: 4`)는 근거 없는 초기값. 반응을 보며 조정.
5. 사용자 준비물: 실제 `handle`, 제휴 상품(`products.yaml`), 인스타 비즈니스 계정+Meta 앱+토큰, `ANTHROPIC_API_KEY`.

## 지켜야 할 선 (사용자와 합의)
- 가상 인물이 제품을 "써봤다/후기"라고 말하지 않음. 큐레이션은 고른 이유와 어울리는 대상만.
- 제휴/협찬에는 광고 표기. 프로필/캡션에 AI 캐릭터 표기 유지. 규정은 협업 전 최신 내용을 사용자가 확인.
- 팔로워/좋아요 인위 증가(대량 팔로우 등) 자동화는 만들지 않음.
- 실존 인물 사진은 사용하지 않음(사용자가 AI 생성 이미지라고 확인함).

## 다음 단계 제안
1. 크롬으로 위 릴스 3개 확인 → 결과를 근거로 릴스 형식 결정
2. 릴스 게시(Graph API reels publish) 지원 추가: 영상 URL 승인 → 예약 → 게시, `kind=reel`
3. 이미지/영상 생성 도구 확정 후 자동 연동
4. `persona.yaml` 최종 확정(말투/주제/금지 주제)
