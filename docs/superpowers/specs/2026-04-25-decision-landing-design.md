# Decision Validate — 3-ICP 랜딩 페이지 설계 문서

- **작성일**: 2026-04-25
- **목적**: "의사결정 아카이브" 아이디어의 ICP별 수요를 동시 검증하기 위한 3개 랜딩 페이지 설계
- **상태**: 설계 승인 완료, 구현 계획 단계로 이전 예정

---

## 1. 배경 & 목표

### 1.1 배경

이전 검토에서 "의사결정 아카이브" 아이디어가 일반 ICP("결정을 자주 하는 사람")로는 너무 광범위해서 페인 정의가 약하다는 결론에 도달했다. 또한 인접 시장(Loqbooq 폐업, Limitless Meta 흡수, Woebot D2C 종료)이 보여주는 신호는 "AI 메모리 회고 D2C" 카테고리가 단독으로는 검증 어려움을 시사한다.

따라서 진짜 페인이 어디에 있는지 확인하기 위해 **세 가지 ICP 가설을 동시에 테스트**하는 페이크도어형 랜딩 페이지를 운영한다.

### 1.2 검증 대상 가설

| ICP | 페이지 | 가설 |
| --- | --- | --- |
| 개발자/빌더 | `/devs` | 1인 빌더는 매주 다수의 기술 결정을 내리고, 6개월 뒤 결정의 맥락이 사라져 후회한다 |
| 연애 결정자 | `/love` | 연애·관계 결정의 맥락은 시간이 지나면 흐려져 같은 패턴을 반복한다 |
| 라이프 결정자 | `/life` | 이직·자취·큰 소비 등 라이프 결정 후 1주~1개월 뒤 회고가 필요한데 도구가 없다 |

### 1.3 성공 정의

- 1주차에 **어느 ICP든 제출률 5% 이상 또는 제출 30건+** 도달
- 2주차에 **회고 메일 클릭률 15%+** 또는 **재제출률 20%+**
- 위 기준 통과한 ICP가 다음 단계 후보가 된다. 다 못 넘으면 페인 가설 자체를 재검토한다.

---

## 2. 페르소나

### 2.1 `/devs` — 김도현, 26세, 1인 사이드프로젝트 빌더

- **상황**: 본업 백엔드 주니어 2년 차, 평일 저녁/주말에 SaaS 사이드프로젝트. 모든 기술 결정을 본인이 내림 (매주 5개+)
- **페인**: 3개월 전 "Prisma 쓰자" 결정 이유 기억 안 남. 노션에 적어보려 했으나 결정 시점에 적기 귀찮음, 적었어도 다시 안 봄
- **유입 채널**: 디스콰이엇, GeekNews, 글또
- **제출 트리거**: hook 한 줄 보고 "맞아 나도 그래"

### 2.2 `/love` — 이지은, 28세, IT 마케터

- **상황**: 1년 사귄 연인과 6개월차부터 미묘하게 어긋남. 헤어질지 한 달째 고민
- **페인**: 지난번 비슷한 상황에서 헤어졌는데 그때 이유가 흐려짐. 같은 패턴 반복하는 것 같은데 본인이 못 잡아냄
- **유입 채널**: 트위터/X, 더쿠 연애담
- **제출 트리거**: "1주일 뒤 다시 마음 본다"가 가벼운 액션으로 느껴짐

### 2.3 `/life` — 박세준, 31세, 5년 차 직장인

- **상황**: 첫 회사 5년 다녔고, 최근 이직 제안 받음. 2년 전 이직 제안 거절했었는데 그때 이유 가물가물
- **페인**: 회고 시도(노션·일기·블로그) 다 실패. 결정 직후 안 적고, 시간 지나면 맥락 사라짐
- **유입 채널**: Threads, 페이스북, 브런치
- **제출 트리거**: "이직 결정 한 줄만 적어두면 1주일 뒤 자동으로 묻는다"는 약속이 부담 없음

세 페르소나의 공통점: 결정 빈도가 높음, 이미 회고 시도했으나 실패, 본인 채널이 명확함 → SNS 검증 채널 매핑 가능.

---

## 3. 아키텍처

### 3.1 스택

```
Frontend  : Next.js 15 (App Router) + Tailwind CSS + TypeScript
Storage   : Supabase Postgres
Email     : Resend (onboarding@resend.dev 발송, 도메인 인증은 추후)
Scheduler : Vercel Cron (1일 1회)
Tracking  : Vercel Analytics + PostHog
Hosting   : Vercel
```

### 3.2 디렉터리 구조

```
decision-validate/
├── app/
│   ├── layout.tsx               공통 레이아웃 + PostHog 초기화
│   ├── page.tsx                 / 루트 (3개 카드 허브)
│   ├── devs/page.tsx
│   ├── love/page.tsx
│   ├── life/page.tsx
│   ├── api/
│   │   ├── submit/route.ts      POST 결정 입력
│   │   └── cron/remind/route.ts Vercel Cron 진입점
│   └── globals.css
├── components/
│   ├── LandingShell.tsx         3페이지 공유 쉘 (props로 카피·색 받음)
│   ├── DecisionForm.tsx         이메일 + 결정 입력
│   ├── ConfirmDialog.tsx        제출 후 다이얼로그
│   └── SocialProof.tsx          "지금까지 N명이 결정 기록"
├── content/
│   ├── devs.ts                  ICP별 카피
│   ├── love.ts
│   └── life.ts
├── lib/
│   ├── supabase.ts
│   ├── resend.ts
│   ├── analytics.ts
│   └── env.ts
├── docs/superpowers/specs/
│   └── 2026-04-25-decision-landing-design.md   (이 문서)
├── .env.local.example
├── vercel.json
├── package.json
└── README.md
```

핵심: 3페이지가 같은 `LandingShell`을 재사용, 차이는 `content/{devs,love,life}.ts`의 데이터로만. 코드 약 95% 공유.

### 3.3 데이터 흐름

```
사용자 → /devs (or /love, /life)
          ↓
       LandingShell (히어로 + 폼)
          ↓ 제출
       POST /api/submit  { email, decision, category }
          ↓
       Supabase: submissions 테이블 INSERT
       remind_at = now + 7days, reminded_at = null
          ↓
       응답 → ConfirmDialog "1주일 뒤 알림 보내드려요"
          ↓
       PostHog 이벤트 발사

[별도] Vercel Cron (매일 KST 09:00)
          ↓
       GET /api/cron/remind  (CRON_SECRET 인증)
          ↓
       Supabase: remind_at < now AND reminded_at IS NULL (LIMIT 50)
          ↓
       각 행 Resend로 이메일 발송
          ↓
       reminded_at = now() 업데이트
```

### 3.4 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # API 라우트에서만 사용
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
CRON_SECRET=                       # Vercel Cron 인증
```

---

## 4. ICP별 카피 & 비주얼

같은 쉘 위에 카피·색·예시만 다름. 폰트·레이아웃은 동일.

### 4.1 `/devs` — 개발자/빌더

```ts
export const devs = {
  category: 'devs',
  accent: '#22c55e',
  hookLine: '왜 그때 그 스택을 골랐죠?',
  subline:
    '6개월 전 내린 기술 결정의 이유, 지금 기억나세요?\n' +
    '결정을 한 줄 적어두면, 1주일 뒤 회고 알림이 갑니다.',
  placeholder:
    '예) Nest.js로 갈지 Express로 갈지 고민. Nest 선택. ' +
    'TypeScript와 DI 때문에. 1주일 써본 후기 남기기.',
  ctaButton: '1주일 뒤 나에게 묻기',
  socialProofPrefix: '지금까지 개발자 ',
};
```

### 4.2 `/love` — 연애

```ts
export const love = {
  category: 'love',
  accent: '#ec4899',
  hookLine: '왜 그때 그렇게 결정했어요?',
  subline:
    '관계의 결정은 시간이 지나면 마음이 흐려져요.\n' +
    '그때 마음을 한 줄 적어두면, 1주일 뒤 다시 만나요.',
  placeholder:
    '예) 헤어질지 말지 고민 중. 일단 한 번 더 만나보기로. ' +
    '이번 주말에 만나보고 1주일 뒤 다시 점검.',
  ctaButton: '1주일 뒤 마음 다시 보기',
  socialProofPrefix: '지금까지 ',
};
```

### 4.3 `/life` — 일반 라이프 결정

```ts
export const life = {
  category: 'life',
  accent: '#1e3a8a',
  hookLine: '그때 왜 그 결정을 내렸지?',
  subline:
    '이직, 자취, 큰 소비, 진로.\n' +
    '결정의 맥락은 사라지고 결과만 남죠. 1주일 뒤 회고 알림이 갑니다.',
  placeholder:
    '예) 회사 옮길지 고민. 연봉은 비슷한데 성장 기회가 더 클 것 같아서 ' +
    '이직 결정. 1주일 뒤 후회 없는지 확인.',
  ctaButton: '1주일 뒤 나에게 묻기',
  socialProofPrefix: '지금까지 ',
};
```

### 4.4 비주얼 차별화 정리

| 요소 | `/devs` | `/love` | `/life` |
| --- | --- | --- | --- |
| 액센트 색 | emerald-500 (#22c55e) | pink-500 (#ec4899) | blue-900 (#1e3a8a) |
| 분위기 | 실용 | 감성 | 진중 |
| 예시 톤 | 기술 스택 | 관계 | 진로/이사 |
| 폼 placeholder | 코드 결정 | 마음 결정 | 라이프 결정 |
| 폰트·레이아웃 | 공통 | 공통 | 공통 |

변수가 색·카피·예시 3개로만 제한되어서 검증할 때 신뢰성이 보장된다.

---

## 5. 폼 & 다이얼로그

### 5.1 폼 (`DecisionForm.tsx`)

필드 2개 확정.

```
┌────────────────────────────────────┐
│ 이메일                                │
│ [ you@example.com               ]   │
│                                    │
│ 지금 망설이는 결정 한 줄              │
│ [ ICP별 placeholder              ]   │
│ [                                ]   │
│                                    │
│  [ 1주일 뒤 나에게 묻기 ]              │
│  · 1주일 뒤 입력한 이메일로 알림이 갑니다  │
└────────────────────────────────────┘
```

- 이메일: HTML5 `type=email` + 클라이언트 정규식 검증
- 결정: textarea, **10~500자**, 자수 카운터
- 제출 버튼: ICP 액센트 색
- 로딩 상태: disabled + "보내는 중..."

### 5.2 다이얼로그 (`ConfirmDialog.tsx`)

성공 시:

```
┌──────────────────────────────────────┐
│           ✓                          │
│      알림 예약 완료                    │
│                                      │
│   2026년 5월 2일 오전 9시에            │
│   you@example.com 으로                │
│   회고 알림을 보내드릴게요.            │
│                                      │
│   그동안 이 결정은 잊고 지내세요.       │
│       [ 닫기 ]                       │
└──────────────────────────────────────┘
```

- Radix Dialog 또는 native `<dialog>`
- ESC·바깥 클릭 닫힘
- 닫히면 폼 초기화 + hero로 스크롤

실패 시: 인라인 에러 ("이메일 형식 확인해주세요" 등)

---

## 6. 데이터베이스

### 6.1 스키마

```sql
create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  decision    text not null check (length(decision) between 10 and 500),
  category    text not null check (category in ('devs', 'love', 'life')),
  created_at  timestamptz not null default now(),
  remind_at   timestamptz not null default (now() + interval '7 days'),
  reminded_at timestamptz,
  email_status text,                                       -- 'sent' | 'failed' | null
  click_at    timestamptz                                  -- 회고 메일 링크 클릭 시각
);

create index idx_remind_pending
  on public.submissions (remind_at)
  where reminded_at is null;

alter table public.submissions enable row level security;

create policy "anonymous_insert"
  on public.submissions for insert
  to anon
  with check (true);
```

RLS는 익명 키로 INSERT만 허용하고 SELECT는 차단. 통계는 service role로 서버에서만 조회.

---

## 7. API 라우트

### 7.1 `POST /api/submit`

```typescript
// 요청
{ email: string, decision: string, category: 'devs' | 'love' | 'life' }

// 검증
- 이메일 정규식
- decision 10~500자
- category 화이트리스트
- 동일 이메일 + 동일 category 1시간 내 재제출 차단 (간단한 rate limit)

// 응답
200 { id, remind_at }
400 { error }
500 { error }
```

### 7.2 `GET /api/cron/remind`

```typescript
// 인증: Authorization: Bearer ${CRON_SECRET}

// 동작
1. submissions에서 remind_at < now() AND reminded_at IS NULL 조회 (LIMIT 50)
2. 각 행:
   - Resend로 메일 발송 (ICP별 템플릿)
   - 성공 → reminded_at = now(), email_status = 'sent'
   - 실패 → email_status = 'failed' (재시도 X, 운영자 수동 점검)
3. 로그 기록
```

### 7.3 `GET /api/stats/count?category=devs`

```typescript
// SocialProof 컴포넌트가 호출
// 응답: { count: number }
// 캐시: edge cache 60초 (방문마다 DB 안 치게)
// service role 키로 Supabase에서 count(*) where category=?
```

### 7.4 `GET /api/track/click?id=<submission_id>`

```typescript
// 회고 메일 본문 링크가 이걸로 라우팅
// 1. submission row의 click_at = now() 업데이트
// 2. 사용자는 간단한 "회고 한 줄 적기" 페이지로 redirect (v1은 Tally form 또는 mailto)
// → Resend webhook 없이도 클릭률 측정 가능
```

### 7.5 `vercel.json`

```json
{
  "crons": [
    { "path": "/api/cron/remind", "schedule": "0 0 * * *" }
  ]
}
```

UTC 00:00 = KST 09:00.

---

## 8. 이메일 템플릿

ICP별 톤 살짝 다름. `/devs` 예시:

```
제목: 1주일 전 그 결정, 어떻게 됐어요?

안녕하세요,

1주일 전 이런 결정을 적으셨네요.

> [decision 내용]

지금은 어떻게 됐나요?
잘 됐든, 후회되든, 30초만 적어두시면 다음 회고 때 큰 도움이 됩니다.

[회고 한 줄 남기기 →]

— Decision Validate
```

회신은 v1에서 받지 않음. 클릭률만 측정 (Resend webhook 또는 트래킹 링크).

---

## 9. 트래킹 & 검증 지표

### 9.1 도구 분담

| 도구 | 측정 대상 |
| --- | --- |
| Vercel Analytics | path별 방문자, 유입 referrer |
| PostHog | 깔때기 이벤트, retention |
| Supabase 카운트 | 정확한 제출 수 (ICP별) |
| Resend webhook | 이메일 open/click |

### 9.2 PostHog 이벤트

```typescript
posthog.capture('landing_view',         { category });
posthog.capture('form_focus',           { category });
posthog.capture('form_submit_try',      { category });
posthog.capture('form_submit_success',  { category, decision_length });
posthog.capture('form_submit_fail',     { category, error_code });
posthog.capture('dialog_close',         { category });
```

→ Funnel UI에서 `landing_view → form_focus → submit_try → submit_success` 4단 깔때기. 카테고리별 비교.

### 9.3 KPI

**1차 — ICP 페인 강도 비교**

페인 강도 = 제출 수 / 방문자 수

| 카테고리 | 방문 | 폼 포커스 | 제출 시도 | 제출 성공 | 제출률 |
| --- | --- | --- | --- | --- | --- |
| `/devs` | ? | ? | ? | ? | ? |
| `/love` | ? | ? | ? | ? | ? |
| `/life` | ? | ? | ? | ? | ? |

**2차 — 진정성 신호**

- decision 글자 수 평균 (의례적 vs 진짜 고민 구분)
- 같은 이메일 재제출률
- 1주일 뒤 회고 메일 open/click

**3차 — 채널 효율**

- referrer별 제출률 (어느 채널이 페인 강한 사람을 데려오는가)

### 9.4 검증 성공 기준

| 기간 | 측정 | 성공 기준 |
| --- | --- | --- |
| 1주차 | 제출 깔때기 | 어느 ICP든 제출률 5%+ |
| 1주차 | 제출 절대 수 | 1개 ICP라도 제출 30건+ |
| 2주차 | 회고 메일 클릭률 | 15%+ |
| 2주차 | 이메일 재방문 | 20%+ |

위 기준 통과한 ICP만 다음 단계 후보. 다 못 넘으면 페인 가설 재검토.

---

## 10. 비기능 요구사항

### 10.1 반응형

- Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- 모바일 우선 설계, 폼은 화면 어디서든 손가락으로 한 번에 닿는 위치
- 데스크톱은 폼 너비 max 480px로 가운데 정렬

### 10.2 접근성

- 시맨틱 HTML (`<form>`, `<label>`, `<button>`)
- 폼 라벨은 `aria-label` 또는 시각적 라벨
- 다이얼로그는 Radix(접근성 자동 처리) 또는 native `<dialog>`
- 색만으로 상태 표현 X (텍스트 동반)

### 10.3 성능

- LCP < 2.5s (Vercel Edge + 정적 페이지)
- 이미지 없음 또는 SVG만
- 외부 스크립트는 PostHog만 (defer 로드)

### 10.4 보안

- Supabase RLS로 anon 키는 INSERT만
- service role 키는 서버에서만 사용
- Cron은 `CRON_SECRET`으로 보호
- 입력 검증은 클라이언트 + 서버 모두

---

## 11. 범위 외 (v1에 안 함)

- 회고 답변 받기 (메일 회신, 회고 페이지)
- 사용자 계정·로그인
- 결정 검색·기록 조회
- AI 자동 분석·코멘트
- 푸시 알림 (이메일만)
- 다국어 (한국어만)
- 광고/유료 플랜
- 진짜 도메인 (Vercel `*.vercel.app` 사용)

이 모두 검증 결과에 따라 다음 단계에서 결정.

---

## 12. 위험 & 완화

| 위험 | 완화 |
| --- | --- |
| 트래픽이 너무 적어 데이터가 안 모임 | SNS 채널 매핑(페르소나 섹션)에 직접 글 올리기. 1주차에 ICP당 100명 유입 목표 |
| 같은 사람이 호기심으로 3페이지 다 제출 | 동일 이메일 + 동일 카테고리 1시간 차단으로 방지. 다른 카테고리 제출은 허용(데이터로 활용) |
| 페이크 이메일 제출 | 발송 실패 시 email_status='failed' 기록. bounce율로 진정성 측정 |
| Resend 무료 100통/일 초과 | 1주차엔 100통 미만 예상. 초과 시 일별 분산 발송 |
| Vercel Cron이 누락 | 다음 실행에서 remind_at < now AND reminded_at IS NULL 그대로 재처리 |

---

## 13. 다음 단계

- [ ] writing-plans 스킬로 구현 계획 작성
- [ ] Supabase 프로젝트 생성, Resend 계정 생성, PostHog 프로젝트 생성
- [ ] Vercel에 배포
- [ ] SNS 채널 글 발행 (페르소나별)
- [ ] 1주차 데이터 수집 후 회고

---

## 14. 변경 이력

- 2026-04-25: 초안 작성, 사용자 승인 완료
