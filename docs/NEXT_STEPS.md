# 다음 단계 — 셋업부터 검증까지

> 작성일: 2026-04-25
> 상태: 22-task 구현 완료, GitHub push 완료. 외부 서비스 셋업 + 검증 단계만 남음.

---

## 4단계 요약

| 단계 | 내용 | 예상 시간 |
| --- | --- | --- |
| 1️⃣ | 외부 서비스 셋업 (Supabase, Resend, PostHog) + `.env.local` 채우기 | 30분 |
| 2️⃣ | 로컬에서 폼·DB·이벤트 작동 검증 | 15분 |
| 3️⃣ | Vercel 배포 + Cron 활성화 + 발송 테스트 | 30분 |
| 4️⃣ | SNS 채널 발행 — **검증의 진짜 시작** | 1주+ |

---

## 1️⃣ 외부 서비스 셋업

### Supabase (10분)

- [ ] [supabase.com](https://supabase.com) 가입 → 새 프로젝트 `decision-validate` 생성
  - 무료 티어, 리전은 **Northeast Asia (Tokyo)** 추천
- [ ] 프로젝트 생성 후 **SQL Editor** 진입
- [ ] `supabase/schema.sql` 파일 내용 전체 복사 → SQL Editor에 붙여넣기 → **Run**
- [ ] 실행 확인: `submissions` 테이블 생성됨, RLS 활성화됨, 정책 1개(anonymous_insert) 보임
- [ ] **Settings → API** 에서 3개 키 복사 → `.env.local`에 붙여넣기:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon` `public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` 키 (⚠️ "Reveal" 클릭) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` 키는 RLS를 우회하므로 절대 클라이언트에 노출 금지. `.env.local`과 Vercel 환경변수에만.

### Resend (5분)

- [ ] [resend.com](https://resend.com) 가입
- [ ] **API Keys → Create API Key** → 권한 `Full access` → Create
- [ ] 발급된 키 복사 → `RESEND_API_KEY`
- [ ] 도메인 인증은 일단 패스 — 무료 `onboarding@resend.dev`로 발송됨

### PostHog (5분)

- [ ] [posthog.com](https://posthog.com) 가입 → 새 프로젝트 생성
- [ ] **Project Settings → Project API Key** 복사 → `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] 리전 확인:
  - 미국 (기본) → host 그대로 `https://app.posthog.com`
  - EU → `.env.local`의 `NEXT_PUBLIC_POSTHOG_HOST`를 `https://eu.posthog.com`로 수정

### `.env.local` 최종 점검

```bash
# 채워져 있어야 할 7개 키
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
CRON_SECRET=...                                     # 이미 자동 생성됨
NEXT_PUBLIC_SITE_URL=https://retrospect-archive.vercel.app   # Vercel 배포 후 실제 URL로 교체
```

---

## 2️⃣ 로컬 검증

```bash
cd ~/Desktop/Dev/decision-validate
npm run dev
```

검증 체크리스트:

- [ ] http://localhost:3000/devs 접속 → hookLine·폼 정상 표시
- [ ] 이메일·결정(10자 이상) 입력 → "1주일 뒤 나에게 묻기" 클릭
- [ ] **다이얼로그** 뜨고 "5월 2일 오전 9시" 식 날짜 표시
- [ ] **Supabase Dashboard → Table Editor → submissions** 테이블에 row 1개 추가됨
  - `email`, `decision`, `category=devs`, `remind_at`이 7일 후, `reminded_at=null` 확인
- [ ] http://localhost:3000/love, /life 도 같은 방식으로 검증
- [ ] **PostHog Dashboard → Activity → Live events** 에 다음 이벤트들 들어왔는지:
  - `landing_view`, `form_focus`, `form_submit_try`, `form_submit_success`, `dialog_close`
- [ ] 같은 이메일·카테고리로 1시간 내 재제출 시 **429 에러** 발생 (rate limit)

### 흔한 문제

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| 폼 제출 시 500 | env 키 오타 또는 미입력 | `.env.local` 재확인 후 `npm run dev` 재시작 |
| Supabase 403 | RLS 정책 누락 | SQL Editor에서 schema.sql 다시 실행 |
| PostHog 이벤트 안 들어옴 | 호스트 미스매치 (US/EU) | `.env.local`의 `NEXT_PUBLIC_POSTHOG_HOST` 확인 |
| 다이얼로그 안 뜸 | 브라우저 콘솔 에러 확인 | `<dialog>` 미지원 브라우저는 거의 없음, 다른 원인일 가능성 |

---

## 3️⃣ Vercel 배포

### 프로젝트 연결

```bash
npx vercel link
```
- 새 프로젝트 또는 기존 선택 → GitHub repo `Retrospect_Archive` 연결

### 환경변수 입력

**Vercel Dashboard → Project → Settings → Environment Variables**:

- `.env.local`의 모든 7개 키 입력
- `NEXT_PUBLIC_SITE_URL`은 Vercel 발급 URL로 교체 (예: `https://retrospect-archive.vercel.app`)
- 적용 환경: **Production / Preview / Development** 모두 체크

### 첫 배포

```bash
npx vercel --prod
```

배포 후 검증:

- [ ] 배포 URL의 `/devs`, `/love`, `/life` 정상 작동
- [ ] 폼 제출 → Supabase에 row 생성
- [ ] **Settings → Cron Jobs** 에 `/api/cron/remind`가 `0 0 * * *`로 등록됨

### Cron 발송 수동 테스트 (1주일 안 기다리기)

1. Supabase Table Editor에서 row 하나의 `remind_at`을 과거 시점으로 수정 (예: `2026-04-01T00:00:00Z`)
2. 터미널에서:
   ```bash
   curl -H "Authorization: Bearer <CRON_SECRET값>" \
        https://<배포URL>/api/cron/remind
   ```
3. 응답: `{"ok":true,"sent":1,"failed":0}`
4. 입력했던 이메일에 회고 메일 도착 확인
5. Supabase에서 해당 row의 `email_status='sent'`, `reminded_at` 업데이트됨 확인

---

## 4️⃣ SNS 채널 발행 — 검증의 진짜 시작 ⭐

> **핵심**: 빌드보다 발행이 더 어렵습니다. 트래픽이 안 들어오면 데이터도 없고 검증도 없습니다.

### 채널 매핑

| ICP | 채널 | 글 톤 |
| --- | --- | --- |
| `/devs` | 디스콰이엇, GeekNews, 글또, 사이드프로젝트 디스코드 | "결정 회고가 안 됐던 경험 + 도구 만들었음" |
| `/love` | 트위터/X, 더쿠 연애담 | "관계 결정 후 마음 흐려진 경험" 공감 후크 |
| `/life` | Threads, 페이스북, 브런치 | "이직·자취 결정 회고 안 되는 사람들 모여라" |

### 발행 전 체크리스트

- [ ] 광고처럼 안 보이게 — **본인 경험·고민을 먼저 풀고 도구는 끝에 짧게 언급**
- [ ] 채널 규약 확인 (글또는 외부 링크 제한 가능)
- [ ] 같은 글 복붙 금지 — 채널마다 톤·길이 변형
- [ ] 댓글에 적극 반응 (유저와 직접 대화가 가장 강한 신호)
- [ ] 한 채널에 한 번에 몰빵하지 말고 **하루 1~2개 채널씩 분산** (검증 채널별 효율 비교 가능)

### 1주차 성공 기준 (spec 9.4)

- 어느 ICP든 **제출률 5% 이상** (방문 100명 → 제출 5명)
- 1개 ICP라도 **제출 절대 수 30건+**
- 통과 못 하면 페인 가설 자체 재검토

### 1주차 데이터 보는 곳

- **Vercel Analytics**: path별 방문자 수
- **PostHog**: `landing_view → form_focus → form_submit_try → form_submit_success` 4단 깔때기, 카테고리별로 비교
- **Supabase**: 정확한 제출 수
  ```sql
  select category, count(*) as submissions, avg(length(decision)) as avg_decision_length
  from submissions
  group by category;
  ```

### 2주차 — 회고 메일 효과 측정

- Resend Dashboard → 발송 로그 → open/click rate
- Supabase에서 `click_at` 채워진 row 비율 = 회고 메일 클릭률
- 같은 이메일이 다시 제출했는지 (재방문률 = retention 신호)

---

## 우선순위 정리

**오늘 (2~3시간)**:
1. 1️⃣ 서비스 셋업
2. 2️⃣ 로컬 검증

**내일~모레**:
3. 3️⃣ Vercel 배포 + Cron 발송 테스트
4. ICP별 SNS 글 초안 작성

**이번 주말~다음 주**:
5. 4️⃣ 1차 채널 발행 (`/devs` 먼저 — 본인이 가장 직접 페인 느끼는 ICP)
6. 1주차 데이터 모이는 거 매일 체크

**1주 후**:
7. KPI 통과 여부 판단 → 통과한 ICP만 다음 단계로
8. 다 통과 못 하면 페인 가설 자체 재검토 (피벗 또는 폐기)

---

## 참고 문서

- 설계: `docs/superpowers/specs/2026-04-25-decision-landing-design.md`
- 구현 계획: `docs/superpowers/plans/2026-04-25-decision-landing-implementation.md`
- 이 문서: `docs/NEXT_STEPS.md`
