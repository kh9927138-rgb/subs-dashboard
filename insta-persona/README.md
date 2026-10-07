# insta-persona

Claude가 가상 캐릭터(페르소나) 인스타그램 계정의 게시물 초안, 댓글/DM 응대를 운영하는 시스템.
공식 **Instagram Graph API**만 사용합니다(비공식 로그인/스크래핑 없음 → 계정 정지 위험 최소화).

## 흐름
1. `persona.yaml` 에 캐릭터 정의 (`persona.example.yaml` 복사)
2. `draft` → 캡션·해시태그·이미지 프롬프트 생성 (AI 표기 문구 자동 포함)
3. 이미지를 만들어 공개 URL로 올린 뒤 `approve-post <id> --image-url URL`
4. `tick`/`run` → 예약 게시, 댓글/DM 수집 → 위험 필터 + LLM 분류 → 답변 초안 → 승인 또는 자동 전송

## 시작
```bash
pip install -r requirements.txt
cp .env.example .env && cp persona.example.yaml persona.yaml   # 값 채우기
export $(grep -v '^#' .env | xargs)
python -m insta_persona.cli draft
python -m insta_persona.cli queue
python -m insta_persona.cli approve-post 1 --image-url https://.../a.jpg
python -m insta_persona.cli tick          # DRY_RUN=true 면 전송 대신 로그만 출력
pytest
```

## 수익화 장치 (큐레이션/협찬)
- 게시물 종류: `daily`(일상) / `curation`(제휴 상품 소개) / `sponsored`(협찬). `persona.content_mix`로 비율 지정
- `curation`/`sponsored`는 `#광고` 표기를 자동 삽입, 표기가 없으면 게시 단계에서 차단
- "써봤어요/후기/내돈내산" 등 경험 가장 표현은 프롬프트로 금지 + 코드로 재검사(3회 실패 시 초안 폐기)
- 상품: `products.example.yaml` → `products.yaml` 작성 후 `products-import`, `draft --kind curation --product <id>`
- 협찬/제휴 문의는 `inquiry`로 분류되어 자동 답장하지 않음 → `inquiries`로 확인
- 광고 표기 규정(공정위 지침, 인스타 유료 파트너십 표시 등)은 협업 전에 최신 내용을 직접 확인하세요

## Instagram 준비물
- 인스타 **비즈니스/크리에이터 계정** + 연결된 Facebook 페이지 + Meta 개발자 앱
- 권한: `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`
- 장기 토큰(IG_ACCESS_TOKEN), IG_USER_ID

## 안전장치
- 기본 `DRY_RUN=true`, 답글 `auto_send: false` (승인 후 전송)
- 민감 키워드/장문/LLM 판단 시 `flagged` → 사람이 확인 (자동 전송 안 함)
- 시간당 전송 상한, 중복 응답 방지(source_id UNIQUE)
- 계정 프로필에 "AI 캐릭터" 표기 필수, 사용자가 진짜 사람인지 물으면 AI임을 밝히도록 프롬프트 고정
- DM은 상대 마지막 메시지 후 24시간 내에만 API로 답장 가능(Meta 정책)

## 한계 / 다음 단계
- 이미지 생성은 포함하지 않음(프롬프트만 생성). 이미지 생성 API 연동 + 업로드(S3 등) 추가 가능
- 릴스/캐러셀, 성과 분석 기반 주제 추천, 웹 승인 대시보드는 후속 작업
