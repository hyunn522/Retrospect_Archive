# 단일 랜딩 페이지 리디자인 (회고 아카이브)

**작성일**: 2026-04-30
**상태**: Draft → User Review

## 배경

현재 구조:
- `/` — 3개 카테고리 카드만 있는 미니멀 허브
- `/devs` `/love` `/life` — 각각 hero + DecisionForm + SocialProof 만 있는 단조로운 페이지

문제:
- `/` 는 가치 제안(왜 이 서비스를 쓰는가)이 거의 없음. 페이크도어 검증 도구로서도 카피의 흡인력이 약함.
- 카테고리 페이지들은 풍부한 랜딩 경험이 아니라 "폼 한 장"에 가까움.
- 사용자가 결정 카테고리를 고르려면 라우팅(클릭 → 페이지 이동)을 해야 해서 흐름이 끊김.

## 목표

**한 페이지에서 완결되는 풍부한 랜딩 페이지**로 재구성하되:
1. 사용자가 3개 카테고리 중 본인 것을 능동적으로 선택 → 그 자리에서 카테고리에 맞는 폼 작성 → 제출까지 한 흐름.
2. 기존 기능(폼 제출, SocialProof, ConfirmDialog, 1주일 뒤 회고 메일, 분석 이벤트)은 동일하게 유지.
3. 기존 라우트(`/devs`, `/love`, `/life`)는 보존 — 같은 랜딩에서 해당 카테고리를 사전 선택한 상태로 진입.

## 비목표 (Not in scope)

- 신규 백엔드 기능 추가 (API, DB 스키마 변경 없음).
- 가짜 testimonial / 가격 / 플랜 — 페이크도어 검증의 신호를 오염시킴.
- 다국어, 다크모드.
- 신규 카테고리 추가.

## 페이지 구조

`/` 가 단일 랜딩 페이지가 됨. 위→아래로:

```
1. Hero
2. Problem (왜 회고 알림인가)
3. How it works (3 steps)
4. Category & Form (핵심 컨버전 섹션)
5. SocialProof
6. FAQ
7. Footer
```

각 섹션 상세:

### 1. Hero

- 메인 후크: "결정의 맥락은 1주일이면 흐려집니다."
- 서브 후크: "한 줄 적어두면, 그때의 마음이 1주일 뒤 다시 돌아와요."
- CTA 버튼: "지금 결정 한 줄 적기" → smooth scroll to `#form`
- 배경: 화이트 + 미묘한 zinc-50 그라데이션. 일러스트 없이 타이포 중심.

### 2. Problem

- 헤딩: "왜 결정의 이유는 매번 잊혀질까요?"
- 3개 카드(아이콘 없이 텍스트만):
  - "이직했는데 6개월 뒤, 왜 옮겼는지 헷갈려요."
  - "헤어졌는데 그때 마음이 어땠는지 기억이 안 나요."
  - "그 스택을 골랐던 이유가 지금은 뭔지 모르겠어요."
- 톤: 공감 우선, 해결책은 다음 섹션에서.

### 3. How it works

3-step. 가로(데스크탑) / 세로(모바일):

1. **결정 한 줄을 적어요** — 망설이는 결정과 그 이유를 한 줄.
2. **1주일 동안 잊고 지내요** — 일상으로 돌아가세요.
3. **회고 메일이 도착해요** — 그때의 본인이 지금의 본인에게 묻습니다.

각 step에 큰 숫자 + 짧은 한 줄 + 보조 한 줄.

### 4. Category & Form (핵심)

`#form` 앵커. 이 섹션이 컨버전의 중심.

레이아웃:

```
"어떤 결정이세요?"

[개발자/빌더]   [연애]   [라이프]      ← 카드 3개, 항상 노출
                                         ← 선택된 카드는 ring + 배경 강조

────────── (선택 시 펼쳐짐) ──────────

{선택한 카테고리의 hookLine — accent 색}
{subline}

[이메일 입력]
[결정 한 줄 textarea + 글자수]
[CTA 버튼 — accent 색, 카테고리 ctaButton 텍스트]

"1주일 뒤 입력한 이메일로 알림이 갑니다."
```

상호작용:
- 초기 상태: 카드 3개만 보이고, 폼 영역은 가려짐 (또는 dim된 안내 — "위에서 선택해주세요").
  - 단, `?cat=devs|love|life` 쿼리로 진입한 경우 해당 카드 사전 선택 + 폼 영역 노출 + 자동 스크롤.
- 카드 클릭 → 선택 상태 변경 → 폼 영역에 해당 카테고리의 `LandingContent`가 즉시 반영 (hookLine, subline, placeholder, accent, ctaButton).
- 다른 카드 클릭 → 폼 내용은 유지하되 카테고리 메시지/색만 스왑 (이미 입력 중인 경우 폼 값 보존). PostHog `category_select` 이벤트 트래킹.
- 제출 흐름 / 에러 / ConfirmDialog 는 기존 `DecisionForm` 그대로.

### 5. SocialProof

선택된 카테고리의 카운트만 보여주거나, 카테고리 미선택 시 전체 카운트(또는 hide).
기존 `SocialProof` 컴포넌트 재사용 — props로 선택된 category를 넘김. 미선택일 때는 hide.

### 6. FAQ

`<details>` 기반 4-5개 항목:
- 1주일 뒤 정확히 언제 알림이 오나요?
- 결정 내용은 어디에 저장되나요?
- 카테고리를 잘못 골랐어요. 다시 보낼 수 있나요?
- 회고 메일이 안 와요.
- 무료인가요?

### 7. Footer

- "회고 아카이브" 로고 텍스트
- GitHub 링크 (Retrospect_Archive)
- 만든이 한 줄
- 저작권/연도

## 기술 설계

### 라우팅 변경

- `/` → 새 단일 랜딩 페이지 (`app/page.tsx` 교체)
- `/devs` `/love` `/life` → `redirect('/?cat=devs')` 등으로 영구 리다이렉트.
  - Next.js 16: `redirect` from `next/navigation` in a server component.
- `/thanks` → 기존 유지 (회고 메일 클릭 후 도착지).

### 컴포넌트 구조

```
app/page.tsx                 (server component)
  └─ <Landing />             (client component, in components/Landing/)

components/Landing/
  Landing.tsx                (top-level client wrapper, reads ?cat= via useSearchParams)
  Hero.tsx
  Problem.tsx
  HowItWorks.tsx
  CategoryForm.tsx           (카드 3개 + 폼 통합 — 선택 상태 관리)
  Faq.tsx
  Footer.tsx
```

기존 컴포넌트 재사용 / 수정:
- `DecisionForm` — `content` prop을 외부에서 받는 기존 인터페이스 그대로. 호출자가 선택된 카테고리의 `LandingContent`를 넘김. 변경 없음 (또는 최소 스타일 변경).
- `ConfirmDialog` — 변경 없음.
- `SocialProof` — `content` prop 그대로. `category` 미선택 시 호출하지 않음.
- `LandingShell` — 더 이상 사용 안 함. 삭제.

### 상태 관리

`CategoryForm` 내부에서:
- `selectedCategory: Category | null` (useState)
- 초기값: `useSearchParams().get('cat')` 가 `devs|love|life` 중 하나면 그 값, 아니면 null.
- 선택 시 `track('category_select', { category })` 호출. (신규 이벤트 — `lib/analytics.ts`의 기존 `track` 함수에 카테고리 추가만 하면 되므로 타입 변경 없음)
- 선택된 카테고리 → `content/{devs,love,life}` 에서 `LandingContent` 가져오기.

### 분석 이벤트

기존 이벤트 그대로 + 신규 1개:
- `landing_view` — 페이지 진입 시 (category 없이, 또는 사전 선택된 category 있으면 함께)
- **`category_select`** — 카드 클릭 시 (신규)
- `form_focus`, `form_submit_try`, `form_submit_success`, `form_submit_fail`, `dialog_close` — 기존 그대로

### 스타일

- Tailwind v4 그대로.
- 색상: zinc 톤 베이스 + 카테고리 accent 색 (`#22c55e`, `#ec4899`, `#1e3a8a`).
- 섹션 구분: white / zinc-50 교차 배경.
- 모바일 우선 — 카드는 모바일에선 세로 stack, ≥sm 부터 가로 3열.
- 부드러운 전환: 카테고리 스왑 시 색상/텍스트는 `transition-colors`/`transition-opacity`. 폼 펼침은 max-height 또는 conditional render + fade.

## 마이그레이션 / 호환성

- 기존 `/devs` `/love` `/life` 북마크/광고 링크: redirect 로 보존.
- DB 스키마 / API: 변경 없음.
- 환경변수: 변경 없음.
- 분석 깔때기: `landing_view → form_focus → form_submit_try → form_submit_success` 그대로 작동. `category_select`는 보조 신호로 추가.

## 테스트

- 기존 단위 테스트(`tests/lib/`, `tests/api/`) 영향 없음 — 라이브러리/API 변경 없음.
- 신규 컴포넌트 테스트는 본 스펙 범위 외 (페이크도어 검증 단계라 수동 QA로 충분).
- 수동 QA:
  - `/` 진입 → 각 섹션 렌더 확인.
  - `/?cat=devs` `/devs` 진입 → 개발 카드 사전 선택 + 폼 메시지 정확.
  - 카드 전환 → 색/메시지/CTA 스왑, 입력값 보존.
  - 폼 제출 → 기존 흐름(429 에러, success 시 ConfirmDialog).
  - 모바일 반응형.

## 위험 / 트레이드오프

- **카테고리 미선택 시 폼이 안 보이는 UX**: 일부 사용자가 "어디에 적지?" 헷갈릴 수 있음.
  → 카드 위에 "어떤 결정이세요?" 라는 명확한 헤딩 + 카드 클릭 전 폼 영역에 dim된 안내 한 줄로 완화.
- **단일 페이지 SEO**: 기존 3개 페이지가 각자 메타데이터를 가졌는데 이제 하나로 통합됨.
  → `/devs` `/love` `/life`는 redirect되므로 검색 노출은 잃을 수 있음. 페이크도어 단계라 SEO 가치 낮음 — 수용.
- **분석 깔때기 카테고리 분해**: `landing_view`는 카테고리 없이 발생, `category_select` 이후에야 카테고리가 붙음.
  → PostHog에서 funnel을 `landing_view → category_select → form_focus → form_submit_success`로 재구성. (페이크도어 검증 핵심 깔때기)

## 다음 단계

이 스펙 승인 후 → `writing-plans` 스킬로 구현 플랜 작성 → 단계별 구현.
