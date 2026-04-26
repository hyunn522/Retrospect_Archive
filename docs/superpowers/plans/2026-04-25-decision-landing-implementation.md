# 회고 아카이브 — 3-ICP 랜딩 페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **사용자 선호: 자동 커밋 금지.** 각 Task의 마지막 "체크포인트" 단계는 사용자가 직접 실행하거나 건너뜁니다. 다른 단계는 자동 진행 가능.

**Goal:** 3개 ICP(개발자/연애/일반)의 의사결정 회고 페인 강도를 동시에 검증하기 위한 페이크도어형 랜딩 페이지 3개를 Next.js + Supabase + Resend + Vercel Cron 스택으로 구현하고 배포.

**Architecture:** 단일 Next.js App Router 프로젝트. `/devs`, `/love`, `/life` 3개 라우트가 동일한 `LandingShell` 컴포넌트를 재사용하고 `content/{devs,love,life}.ts`로 카피·색·예시만 주입. 사용자 입력은 Supabase에 저장, Vercel Cron이 매일 KST 09:00에 7일 경과한 결정에 Resend로 회고 메일 발송. 트래킹은 Vercel Analytics + PostHog.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Resend, Vercel Cron, PostHog, Vitest

---

## Spec 참조

- 설계 문서: `docs/superpowers/specs/2026-04-25-decision-landing-design.md`
- 모든 결정은 spec 문서에 따름. 충돌 시 spec 우선.

---

## File Structure

| 파일 | 책임 |
| --- | --- |
| `package.json` | 의존성 |
| `tsconfig.json` | TS 설정 |
| `next.config.mjs` | Next.js 설정 |
| `tailwind.config.ts` | Tailwind |
| `postcss.config.mjs` | PostCSS |
| `vercel.json` | Vercel Cron 스케줄 |
| `vitest.config.ts` | 테스트 |
| `.env.local.example` | 환경 변수 템플릿 |
| `.gitignore` | Git 제외 |
| `README.md` | 셋업·배포 가이드 |
| `supabase/schema.sql` | DB 스키마 (수동 실행) |
| `app/layout.tsx` | 루트 레이아웃 + PostHog Provider |
| `app/page.tsx` | / 허브 (3개 카드) |
| `app/devs/page.tsx` | /devs 페이지 |
| `app/love/page.tsx` | /love 페이지 |
| `app/life/page.tsx` | /life 페이지 |
| `app/globals.css` | Tailwind 베이스 |
| `app/api/submit/route.ts` | POST 결정 입력 |
| `app/api/cron/remind/route.ts` | Cron 회고 메일 발송 |
| `app/api/stats/count/route.ts` | GET 카테고리별 카운트 |
| `app/api/track/click/route.ts` | GET 회고 메일 링크 클릭 트래킹 |
| `components/LandingShell.tsx` | 3페이지 공유 쉘 |
| `components/DecisionForm.tsx` | 이메일 + 결정 폼 |
| `components/ConfirmDialog.tsx` | 제출 후 다이얼로그 |
| `components/SocialProof.tsx` | "지금까지 N명" |
| `components/PostHogProvider.tsx` | 클라이언트 PostHog 초기화 |
| `content/types.ts` | Content TS 타입 |
| `content/devs.ts` | 개발자 카피 |
| `content/love.ts` | 연애 카피 |
| `content/life.ts` | 일반 카피 |
| `lib/supabase.ts` | Supabase 클라이언트 (anon + service role) |
| `lib/resend.ts` | Resend 클라이언트 + 메일 빌더 |
| `lib/analytics.ts` | PostHog 이벤트 헬퍼 |
| `lib/env.ts` | 환경 변수 검증 |
| `lib/validation.ts` | 폼 입력 검증 |
| `lib/types.ts` | 공유 도메인 타입 |
| `tests/lib/validation.test.ts` | 검증 단위 테스트 |
| `tests/lib/resend.test.ts` | 메일 빌더 단위 테스트 |
| `tests/api/submit.test.ts` | submit 라우트 통합 테스트 |
| `tests/api/cron.test.ts` | cron 라우트 통합 테스트 |

---

## 외부 서비스 사전 준비 (사용자 수동 작업)

이 작업은 코드 시작 전에 완료되어야 합니다. **사용자가 직접 수행**하고 발급된 키를 `.env.local`에 채웁니다.

- [ ] Supabase 계정 생성 → 새 프로젝트 `decision-validate` 생성 → Project URL, anon key, service role key 확보
- [ ] Resend 계정 생성 → API 키 발급 (무료 도메인 `onboarding@resend.dev` 사용)
- [ ] PostHog 계정 생성 → 프로젝트 생성 → API 키 + host URL 확보
- [ ] Vercel 계정 (이미 있음) → 빈 프로젝트 자리만 확보 (실제 연결은 Task 24)

---

## Task 1: Next.js 프로젝트 초기화

**Files:**
- Create: `/Users/seohyun/decision-validate/package.json`
- Create: `/Users/seohyun/decision-validate/tsconfig.json`
- Create: `/Users/seohyun/decision-validate/next.config.mjs`
- Create: `/Users/seohyun/decision-validate/.gitignore`

- [ ] **Step 1: 작업 디렉터리 이동 + Next.js 생성**

```bash
cd /Users/seohyun/decision-validate
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --no-eslint --yes
```

Expected: `package.json`, `app/`, `tailwind.config.ts` 등이 자동 생성됨. 기존 `docs/`, `.gitignore`, `.git/` 보존.

- [ ] **Step 2: 추가 의존성 설치**

```bash
cd /Users/seohyun/decision-validate
npm install @supabase/supabase-js resend posthog-js zod
npm install -D vitest @vitest/ui happy-dom @types/node
```

Expected: `package.json`에 의존성 추가됨, lock 파일 생성됨.

- [ ] **Step 3: 체크포인트** (사용자 선택)

```bash
git status
# 사용자가 원하면: git add -A && git commit -m "chore: bootstrap Next.js project"
```

---

## Task 2: 환경 변수 템플릿 + 검증

**Files:**
- Create: `/Users/seohyun/decision-validate/.env.local.example`
- Create: `/Users/seohyun/decision-validate/lib/env.ts`
- Create: `/Users/seohyun/decision-validate/tests/lib/env.test.ts`

- [ ] **Step 1: 환경 변수 예시 작성**

`.env.local.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Cron 인증
CRON_SECRET=

# 사이트 URL (이메일 링크에 사용)
NEXT_PUBLIC_SITE_URL=https://decision-validate.vercel.app
```

- [ ] **Step 2: 실패하는 테스트 작성**

`tests/lib/env.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseEnv } from '@/lib/env';

describe('parseEnv', () => {
  it('throws when required server var is missing', () => {
    expect(() =>
      parseEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'a',
        // SUPABASE_SERVICE_ROLE_KEY missing
        RESEND_API_KEY: 'r',
        CRON_SECRET: 'c',
        NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
        NEXT_PUBLIC_POSTHOG_KEY: 'p',
        NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
      })
    ).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it('returns parsed env when all valid', () => {
    const env = parseEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'a',
      SUPABASE_SERVICE_ROLE_KEY: 's',
      RESEND_API_KEY: 'r',
      CRON_SECRET: 'c',
      NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
      NEXT_PUBLIC_POSTHOG_KEY: 'p',
      NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
    });
    expect(env.RESEND_API_KEY).toBe('r');
  });
});
```

- [ ] **Step 3: vitest 설정 + 실행해 실패 확인**

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

`package.json` scripts에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Run: `npm test`
Expected: FAIL — `lib/env.ts` 모듈 없음

- [ ] **Step 4: env.ts 구현**

`lib/env.ts`:
```typescript
import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  CRON_SECRET: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new Error(`Invalid environment variables: ${missing}`);
  }
  return parsed.data;
}

export const env = (): Env => parseEnv(process.env);
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: 체크포인트**

```bash
git status
# 사용자 선택: git add -A && git commit -m "feat: add env validation"
```

---

## Task 3: 도메인 타입 + 입력 검증

**Files:**
- Create: `/Users/seohyun/decision-validate/lib/types.ts`
- Create: `/Users/seohyun/decision-validate/lib/validation.ts`
- Create: `/Users/seohyun/decision-validate/tests/lib/validation.test.ts`

- [ ] **Step 1: 도메인 타입 작성**

`lib/types.ts`:
```typescript
export const CATEGORIES = ['devs', 'love', 'life'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface SubmissionInput {
  email: string;
  decision: string;
  category: Category;
}

export interface SubmissionRecord extends SubmissionInput {
  id: string;
  created_at: string;
  remind_at: string;
  reminded_at: string | null;
  email_status: 'sent' | 'failed' | null;
  click_at: string | null;
}
```

- [ ] **Step 2: 검증 실패 테스트 작성**

`tests/lib/validation.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { validateSubmission } from '@/lib/validation';

describe('validateSubmission', () => {
  const valid = {
    email: 'a@b.co',
    decision: '결정 한 줄 적어보기 — 충분히 긴 문장.',
    category: 'devs',
  };

  it('passes valid input', () => {
    const r = validateSubmission(valid);
    expect(r.success).toBe(true);
  });

  it('fails on bad email', () => {
    const r = validateSubmission({ ...valid, email: 'not-email' });
    expect(r.success).toBe(false);
  });

  it('fails on too short decision', () => {
    const r = validateSubmission({ ...valid, decision: '짧음' });
    expect(r.success).toBe(false);
  });

  it('fails on too long decision', () => {
    const r = validateSubmission({ ...valid, decision: 'a'.repeat(501) });
    expect(r.success).toBe(false);
  });

  it('fails on unknown category', () => {
    const r = validateSubmission({ ...valid, category: 'food' as never });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 3: 테스트 실행해 실패 확인**

Run: `npm test`
Expected: FAIL — `lib/validation.ts` 없음

- [ ] **Step 4: validation.ts 구현**

`lib/validation.ts`:
```typescript
import { z } from 'zod';
import { CATEGORIES, type SubmissionInput } from '@/lib/types';

const submissionSchema = z.object({
  email: z.string().email(),
  decision: z.string().min(10).max(500),
  category: z.enum(CATEGORIES),
});

export type ValidationResult =
  | { success: true; data: SubmissionInput }
  | { success: false; error: string };

export function validateSubmission(input: unknown): ValidationResult {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'invalid' };
  }
  return { success: true, data: parsed.data };
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (5 tests)

- [ ] **Step 6: 체크포인트**

---

## Task 4: Supabase 스키마 + 클라이언트

**Files:**
- Create: `/Users/seohyun/decision-validate/supabase/schema.sql`
- Create: `/Users/seohyun/decision-validate/lib/supabase.ts`

- [ ] **Step 1: 스키마 SQL 작성**

`supabase/schema.sql`:
```sql
-- Run this in Supabase SQL Editor on first setup.

create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  decision     text not null check (length(decision) between 10 and 500),
  category     text not null check (category in ('devs', 'love', 'life')),
  created_at   timestamptz not null default now(),
  remind_at    timestamptz not null default (now() + interval '7 days'),
  reminded_at  timestamptz,
  email_status text,
  click_at     timestamptz
);

create index if not exists idx_remind_pending
  on public.submissions (remind_at)
  where reminded_at is null;

create index if not exists idx_email_category_created
  on public.submissions (email, category, created_at desc);

alter table public.submissions enable row level security;

drop policy if exists "anonymous_insert" on public.submissions;
create policy "anonymous_insert"
  on public.submissions for insert
  to anon
  with check (true);
```

- [ ] **Step 2: Supabase 클라이언트 작성**

`lib/supabase.ts`:
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let _service: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (_service) return _service;
  const e = env();
  _service = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return _service;
}

export function getAnonClient(): SupabaseClient {
  if (_anon) return _anon;
  const e = env();
  _anon = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return _anon;
}
```

- [ ] **Step 3: 사용자가 Supabase Dashboard에서 SQL 실행**

수동 작업: Supabase Dashboard → SQL Editor → `supabase/schema.sql` 내용 붙여넣고 Run.
Expected: `submissions` 테이블 생성됨, RLS 정책 1개 활성화.

- [ ] **Step 4: 체크포인트**

---

## Task 5: Resend 클라이언트 + 메일 빌더

**Files:**
- Create: `/Users/seohyun/decision-validate/lib/resend.ts`
- Create: `/Users/seohyun/decision-validate/tests/lib/resend.test.ts`

- [ ] **Step 1: 메일 빌더 실패 테스트 작성**

`tests/lib/resend.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { buildReminderEmail } from '@/lib/resend';

describe('buildReminderEmail', () => {
  it('builds devs reminder with decision quoted', () => {
    const mail = buildReminderEmail({
      to: 'a@b.co',
      category: 'devs',
      decision: 'Nest.js로 결정. 1주일 써본 후기 남기기.',
      submissionId: 'abc-123',
      siteUrl: 'https://x.vercel.app',
    });
    expect(mail.to).toBe('a@b.co');
    expect(mail.subject).toContain('1주일 전');
    expect(mail.html).toContain('Nest.js로 결정');
    expect(mail.html).toContain('https://x.vercel.app/api/track/click?id=abc-123');
  });

  it('uses different greeting per category', () => {
    const devs = buildReminderEmail({
      to: 'a@b.co', category: 'devs', decision: 'x'.repeat(20),
      submissionId: 'i', siteUrl: 'https://x',
    });
    const love = buildReminderEmail({
      to: 'a@b.co', category: 'love', decision: 'x'.repeat(20),
      submissionId: 'i', siteUrl: 'https://x',
    });
    expect(devs.html).not.toBe(love.html);
  });
});
```

- [ ] **Step 2: 테스트 실행 (실패 확인)**

Run: `npm test -- resend`
Expected: FAIL — 모듈 없음

- [ ] **Step 3: resend.ts 구현**

`lib/resend.ts`:
```typescript
import { Resend } from 'resend';
import { env } from '@/lib/env';
import type { Category } from '@/lib/types';

let _client: Resend | null = null;
export function getResend(): Resend {
  if (_client) return _client;
  _client = new Resend(env().RESEND_API_KEY);
  return _client;
}

interface BuildArgs {
  to: string;
  category: Category;
  decision: string;
  submissionId: string;
  siteUrl: string;
}

const SUBJECT = '1주일 전 그 결정, 어떻게 됐어요?';

const HEADLINE: Record<Category, string> = {
  devs: '1주일 전 적어두신 그 기술 결정, 지금은 어떻게 됐나요?',
  love: '1주일 전 적어두신 마음, 지금은 어떻게 됐나요?',
  life: '1주일 전 적어두신 그 결정, 지금은 어떻게 됐나요?',
};

export interface BuiltEmail {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export function buildReminderEmail(args: BuildArgs): BuiltEmail {
  const trackUrl = `${args.siteUrl}/api/track/click?id=${args.submissionId}`;
  const html = `
<!doctype html>
<html lang="ko">
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:24px auto;padding:0 16px;color:#111;">
  <h2 style="font-weight:600;font-size:18px;margin:0 0 16px;">${HEADLINE[args.category]}</h2>
  <blockquote style="border-left:3px solid #d4d4d8;margin:0 0 24px;padding:8px 12px;color:#52525b;">${escapeHtml(args.decision)}</blockquote>
  <p style="margin:0 0 24px;line-height:1.6;">잘 됐든, 후회되든, 30초만 적어두시면 다음 회고 때 큰 도움이 됩니다.</p>
  <p><a href="${trackUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">회고 한 줄 남기기 →</a></p>
  <p style="margin-top:32px;font-size:12px;color:#a1a1aa;">— 회고 아카이브</p>
</body>
</html>`.trim();
  return {
    to: args.to,
    from: '회고 아카이브 <onboarding@resend.dev>',
    subject: SUBJECT,
    html,
  };
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- resend`
Expected: PASS (2 tests)

- [ ] **Step 5: 체크포인트**

---

## Task 6: PostHog 클라이언트 + 이벤트 헬퍼

**Files:**
- Create: `/Users/seohyun/decision-validate/lib/analytics.ts`
- Create: `/Users/seohyun/decision-validate/components/PostHogProvider.tsx`

- [ ] **Step 1: 이벤트 헬퍼 작성 (테스트 없이, 직접 호출 래퍼)**

`lib/analytics.ts`:
```typescript
'use client';

import posthog from 'posthog-js';
import type { Category } from '@/lib/types';

export type AnalyticsEvent =
  | 'landing_view'
  | 'form_focus'
  | 'form_submit_try'
  | 'form_submit_success'
  | 'form_submit_fail'
  | 'dialog_close';

export function track(
  event: AnalyticsEvent,
  props: { category: Category; [key: string]: unknown }
): void {
  if (typeof window === 'undefined') return;
  posthog.capture(event, props);
}
```

- [ ] **Step 2: PostHogProvider 작성**

`components/PostHogProvider.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (posthog.__loaded) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

- [ ] **Step 3: posthog-js/react 추가 설치**

```bash
cd /Users/seohyun/decision-validate
npm install posthog-js
```

(posthog-js 패키지가 react export를 포함합니다.)

- [ ] **Step 4: 체크포인트**

---

## Task 7: ICP 콘텐츠 파일 (devs/love/life)

**Files:**
- Create: `/Users/seohyun/decision-validate/content/types.ts`
- Create: `/Users/seohyun/decision-validate/content/devs.ts`
- Create: `/Users/seohyun/decision-validate/content/love.ts`
- Create: `/Users/seohyun/decision-validate/content/life.ts`

- [ ] **Step 1: 콘텐츠 타입**

`content/types.ts`:
```typescript
import type { Category } from '@/lib/types';

export interface LandingContent {
  category: Category;
  accent: string;
  hookLine: string;
  subline: string;
  placeholder: string;
  ctaButton: string;
  socialProofPrefix: string;
}
```

- [ ] **Step 2: devs 콘텐츠**

`content/devs.ts`:
```typescript
import type { LandingContent } from '@/content/types';

export const devs: LandingContent = {
  category: 'devs',
  accent: '#22c55e',
  hookLine: '왜 그때 그 스택을 골랐죠?',
  subline:
    '6개월 전 내린 기술 결정의 이유, 지금 기억나세요?\n결정을 한 줄 적어두면, 1주일 뒤 회고 알림이 갑니다.',
  placeholder:
    '예) Nest.js로 갈지 Express로 갈지 고민. Nest 선택. TypeScript와 DI 때문에. 1주일 써본 후기 남기기.',
  ctaButton: '1주일 뒤 나에게 묻기',
  socialProofPrefix: '지금까지 개발자 ',
};
```

- [ ] **Step 3: love 콘텐츠**

`content/love.ts`:
```typescript
import type { LandingContent } from '@/content/types';

export const love: LandingContent = {
  category: 'love',
  accent: '#ec4899',
  hookLine: '왜 그때 그렇게 결정했어요?',
  subline:
    '관계의 결정은 시간이 지나면 마음이 흐려져요.\n그때 마음을 한 줄 적어두면, 1주일 뒤 다시 만나요.',
  placeholder:
    '예) 헤어질지 말지 고민 중. 일단 한 번 더 만나보기로. 이번 주말에 만나보고 1주일 뒤 다시 점검.',
  ctaButton: '1주일 뒤 마음 다시 보기',
  socialProofPrefix: '지금까지 ',
};
```

- [ ] **Step 4: life 콘텐츠**

`content/life.ts`:
```typescript
import type { LandingContent } from '@/content/types';

export const life: LandingContent = {
  category: 'life',
  accent: '#1e3a8a',
  hookLine: '그때 왜 그 결정을 내렸지?',
  subline:
    '이직, 자취, 큰 소비, 진로.\n결정의 맥락은 사라지고 결과만 남죠. 1주일 뒤 회고 알림이 갑니다.',
  placeholder:
    '예) 회사 옮길지 고민. 연봉은 비슷한데 성장 기회가 더 클 것 같아서 이직 결정. 1주일 뒤 후회 없는지 확인.',
  ctaButton: '1주일 뒤 나에게 묻기',
  socialProofPrefix: '지금까지 ',
};
```

- [ ] **Step 5: 체크포인트**

---

## Task 8: POST /api/submit 라우트

**Files:**
- Create: `/Users/seohyun/decision-validate/app/api/submit/route.ts`
- Create: `/Users/seohyun/decision-validate/tests/api/submit.test.ts`

- [ ] **Step 1: 통합 테스트 작성 (Supabase 모킹)**

`tests/api/submit.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInsert = vi.fn();
const mockSelectMaybeSingle = vi.fn();
const mockSelectGte = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getServiceClient: () => ({
    from: () => ({
      insert: (...args: unknown[]) => mockInsert(...args),
      select: () => ({
        eq: () => ({
          eq: () => ({
            gte: (...a: unknown[]) => mockSelectGte(...a),
          }),
        }),
      }),
    }),
  }),
}));

vi.mock('@/lib/env', () => ({
  env: () => ({
    NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
  }),
}));

import { POST } from '@/app/api/submit/route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockInsert.mockReset();
  mockSelectGte.mockReset();
  mockSelectGte.mockResolvedValue({ data: [], error: null });
  mockInsert.mockReturnValue({
    select: () => ({
      single: () => Promise.resolve({
        data: { id: 'gen-id', remind_at: '2026-05-02T00:00:00Z' },
        error: null,
      }),
    }),
  });
});

describe('POST /api/submit', () => {
  it('200 on valid input', async () => {
    const res = await POST(makeRequest({
      email: 'a@b.co',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('gen-id');
  });

  it('400 on bad email', async () => {
    const res = await POST(makeRequest({
      email: 'bad',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(400);
  });

  it('429 on duplicate within 1 hour', async () => {
    mockSelectGte.mockResolvedValue({
      data: [{ id: 'recent' }],
      error: null,
    });
    const res = await POST(makeRequest({
      email: 'a@b.co',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(429);
  });
});
```

- [ ] **Step 2: 테스트 실행 (실패 확인)**

Run: `npm test -- submit`
Expected: FAIL — `app/api/submit/route.ts` 없음

- [ ] **Step 3: 라우트 구현**

`app/api/submit/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { validateSubmission } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const v = validateSubmission(body);
  if (!v.success) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const { email, decision, category } = v.data;
  const sb = getServiceClient();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recent, error: recentErr } = await sb
    .from('submissions')
    .select('id')
    .eq('email', email)
    .eq('category', category)
    .gte('created_at', oneHourAgo);

  if (recentErr) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
  if (recent && recent.length > 0) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const { data, error } = await sb
    .from('submissions')
    .insert({ email, decision, category })
    .select('id, remind_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, remind_at: data.remind_at }, { status: 200 });
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- submit`
Expected: PASS (3 tests)

- [ ] **Step 5: 체크포인트**

---

## Task 9: GET /api/cron/remind 라우트

**Files:**
- Create: `/Users/seohyun/decision-validate/app/api/cron/remind/route.ts`
- Create: `/Users/seohyun/decision-validate/tests/api/cron.test.ts`

- [ ] **Step 1: 테스트 작성**

`tests/api/cron.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPending = vi.fn();
const mockUpdate = vi.fn();
const mockSend = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getServiceClient: () => ({
    from: () => ({
      select: () => ({
        is: () => ({
          lte: () => ({
            limit: (...a: unknown[]) => mockPending(...a),
          }),
        }),
      }),
      update: (...a: unknown[]) => mockUpdate(...a),
    }),
  }),
}));

vi.mock('@/lib/resend', () => ({
  getResend: () => ({
    emails: { send: (...a: unknown[]) => mockSend(...a) },
  }),
  buildReminderEmail: () => ({
    to: 'a@b.co', from: 'x', subject: 'y', html: 'z',
  }),
}));

vi.mock('@/lib/env', () => ({
  env: () => ({
    CRON_SECRET: 'sec',
    NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
  }),
}));

import { GET } from '@/app/api/cron/remind/route';

function makeReq(authHeader?: string): Request {
  return new Request('http://x/api/cron/remind', {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

beforeEach(() => {
  mockPending.mockReset();
  mockUpdate.mockReset();
  mockSend.mockReset();
  mockUpdate.mockReturnValue({
    eq: () => Promise.resolve({ error: null }),
  });
});

describe('GET /api/cron/remind', () => {
  it('401 without secret', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it('200 with valid secret, sends pending', async () => {
    mockPending.mockResolvedValue({
      data: [{
        id: '1', email: 'a@b.co', decision: 'd'.repeat(20), category: 'devs',
      }],
      error: null,
    });
    mockSend.mockResolvedValue({ data: { id: 'msg' }, error: null });

    const res = await GET(makeReq('Bearer sec'));
    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('marks email_status=failed when send errors', async () => {
    mockPending.mockResolvedValue({
      data: [{
        id: '1', email: 'a@b.co', decision: 'd'.repeat(20), category: 'devs',
      }],
      error: null,
    });
    mockSend.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const res = await GET(makeReq('Bearer sec'));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ email_status: 'failed' })
    );
  });
});
```

- [ ] **Step 2: 테스트 실행 (실패 확인)**

Run: `npm test -- cron`
Expected: FAIL

- [ ] **Step 3: 라우트 구현**

`app/api/cron/remind/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getServiceClient } from '@/lib/supabase';
import { getResend, buildReminderEmail } from '@/lib/resend';
import type { Category } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface PendingRow {
  id: string;
  email: string;
  decision: string;
  category: Category;
}

export async function GET(req: Request): Promise<Response> {
  const e = env();
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${e.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sb = getServiceClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await sb
    .from('submissions')
    .select('id, email, decision, category')
    .is('reminded_at', null)
    .lte('remind_at', nowIso)
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  const rows = (data ?? []) as PendingRow[];
  const resend = getResend();
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const mail = buildReminderEmail({
      to: row.email,
      category: row.category,
      decision: row.decision,
      submissionId: row.id,
      siteUrl: e.NEXT_PUBLIC_SITE_URL,
    });
    const resp = await resend.emails.send(mail);
    if (resp.error) {
      failed++;
      await sb
        .from('submissions')
        .update({ email_status: 'failed', reminded_at: new Date().toISOString() })
        .eq('id', row.id);
    } else {
      sent++;
      await sb
        .from('submissions')
        .update({ email_status: 'sent', reminded_at: new Date().toISOString() })
        .eq('id', row.id);
    }
  }

  return NextResponse.json({ ok: true, sent, failed }, { status: 200 });
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- cron`
Expected: PASS (3 tests)

- [ ] **Step 5: 체크포인트**

---

## Task 10: GET /api/stats/count 라우트

**Files:**
- Create: `/Users/seohyun/decision-validate/app/api/stats/count/route.ts`

- [ ] **Step 1: 라우트 구현 (테스트 생략 — 단순 카운트)**

`app/api/stats/count/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { CATEGORIES, type Category } from '@/lib/types';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') as Category | null;
  if (!category || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 });
  }

  const sb = getServiceClient();
  const { count, error } = await sb
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('category', category);

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json(
    { count: count ?? 0 },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
```

- [ ] **Step 2: 빌드로 라우트 등록 확인**

Run: `npx tsc --noEmit`
Expected: PASS (타입 에러 없음)

- [ ] **Step 3: 체크포인트**

---

## Task 11: GET /api/track/click 라우트

**Files:**
- Create: `/Users/seohyun/decision-validate/app/api/track/click/route.ts`

- [ ] **Step 1: 라우트 구현**

`app/api/track/click/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  const sb = getServiceClient();
  await sb
    .from('submissions')
    .update({ click_at: new Date().toISOString() })
    .eq('id', id)
    .is('click_at', null);

  const dest = `${env().NEXT_PUBLIC_SITE_URL}/thanks?id=${encodeURIComponent(id)}`;
  return NextResponse.redirect(dest, 302);
}
```

- [ ] **Step 2: thanks 페이지 stub 작성** (회고 메일 클릭 도착지)

Create: `/Users/seohyun/decision-validate/app/thanks/page.tsx`
```typescript
export default function ThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">회고 한 줄 남기기</h1>
        <p className="text-zinc-600 mb-8">
          지금 어떻게 됐나요? 잘 됐든, 후회되든 한 줄만 적어보세요.
          <br />
          (현재는 베타 단계라 수동 응답이에요. 메일에 답장 보내주시면 직접 회신드릴게요.)
        </p>
        <a href="mailto:yeonwoogie@gmail.com?subject=회고 한 줄" className="underline">
          답장으로 회고 보내기
        </a>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: 체크포인트**

---

## Task 12: DecisionForm 컴포넌트

**Files:**
- Create: `/Users/seohyun/decision-validate/components/DecisionForm.tsx`

- [ ] **Step 1: 컴포넌트 작성**

`components/DecisionForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import type { LandingContent } from '@/content/types';
import { track } from '@/lib/analytics';

interface Props {
  content: LandingContent;
  onSuccess: (remindAt: string) => void;
}

export function DecisionForm({ content, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decisionLength = decision.length;
  const decisionValid = decisionLength >= 10 && decisionLength <= 500;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = !submitting && emailValid && decisionValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    track('form_submit_try', { category: content.category });
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, decision, category: content.category }),
      });
      const body = await res.json();
      if (!res.ok) {
        track('form_submit_fail', { category: content.category, error_code: res.status });
        if (res.status === 429) {
          setError('같은 카테고리는 1시간에 한 번만 제출할 수 있어요.');
        } else {
          setError(body.error ?? '제출에 실패했어요. 잠시 후 다시 시도해주세요.');
        }
        return;
      }
      track('form_submit_success', {
        category: content.category,
        decision_length: decisionLength,
      });
      onSuccess(body.remind_at);
      setEmail('');
      setDecision('');
    } catch {
      setError('네트워크 오류. 잠시 후 다시 시도해주세요.');
      track('form_submit_fail', { category: content.category, error_code: 0 });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[480px] mx-auto flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">이메일</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder="you@example.com"
          className="rounded-md border border-zinc-300 px-3 py-2.5 outline-none focus:border-zinc-900"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">지금 망설이는 결정 한 줄</span>
        <textarea
          required
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder={content.placeholder}
          rows={5}
          maxLength={500}
          className="rounded-md border border-zinc-300 px-3 py-2.5 outline-none focus:border-zinc-900 resize-none"
        />
        <span className="text-xs text-zinc-500 self-end">
          {decisionLength}/500 (최소 10자)
        </span>
      </label>

      {error && (
        <div role="alert" className="text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{ backgroundColor: canSubmit ? content.accent : undefined }}
        className="rounded-md px-4 py-3 text-white font-medium disabled:bg-zinc-300 disabled:cursor-not-allowed transition-opacity"
      >
        {submitting ? '보내는 중...' : content.ctaButton}
      </button>

      <p className="text-xs text-zinc-500 text-center">
        1주일 뒤 입력한 이메일로 알림이 갑니다.
      </p>
    </form>
  );
}
```

- [ ] **Step 2: 체크포인트**

---

## Task 13: ConfirmDialog 컴포넌트

**Files:**
- Create: `/Users/seohyun/decision-validate/components/ConfirmDialog.tsx`

- [ ] **Step 1: 컴포넌트 작성**

`components/ConfirmDialog.tsx`:
```typescript
'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import type { Category } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  remindAt: string | null;
  email: string;
  category: Category;
}

export function ConfirmDialog({ open, onClose, remindAt, email, category }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  function handleClose() {
    track('dialog_close', { category });
    onClose();
  }

  const formatted = remindAt ? formatKoreanDate(new Date(remindAt)) : '';

  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); handleClose(); }}
      onClick={(e) => { if (e.target === ref.current) handleClose(); }}
      className="rounded-lg p-0 max-w-[420px] w-[90vw] backdrop:bg-black/40"
    >
      <div className="p-8 text-center">
        <div className="text-3xl mb-4">✓</div>
        <h2 className="text-lg font-semibold mb-3">알림 예약 완료</h2>
        <p className="text-zinc-700 mb-2">
          {formatted}에<br />
          <span className="font-medium">{email}</span> 으로<br />
          회고 알림을 보내드릴게요.
        </p>
        <p className="text-zinc-500 text-sm mb-6">그동안 이 결정은 잊고 지내세요.</p>
        <button
          onClick={handleClose}
          className="px-5 py-2 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-700"
        >
          닫기
        </button>
      </div>
    </dialog>
  );
}

function formatKoreanDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${y}년 ${m}월 ${day}일 ${ampm} ${h12}시`;
}
```

- [ ] **Step 2: 체크포인트**

---

## Task 14: SocialProof 컴포넌트

**Files:**
- Create: `/Users/seohyun/decision-validate/components/SocialProof.tsx`

- [ ] **Step 1: 컴포넌트 작성**

`components/SocialProof.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import type { LandingContent } from '@/content/types';

export function SocialProof({ content }: { content: LandingContent }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/stats/count?category=${content.category}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setCount(d.count ?? 0); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [content.category]);

  if (count === null || count === 0) return null;

  return (
    <p className="text-sm text-zinc-500 text-center">
      {content.socialProofPrefix}
      <span className="font-medium text-zinc-700">{count}</span>
      명이 결정을 기록했어요.
    </p>
  );
}
```

- [ ] **Step 2: 체크포인트**

---

## Task 15: LandingShell 공유 컴포넌트

**Files:**
- Create: `/Users/seohyun/decision-validate/components/LandingShell.tsx`

- [ ] **Step 1: 쉘 컴포넌트 작성**

`components/LandingShell.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import type { LandingContent } from '@/content/types';
import { DecisionForm } from '@/components/DecisionForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SocialProof } from '@/components/SocialProof';
import { track } from '@/lib/analytics';

export function LandingShell({ content }: { content: LandingContent }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remindAt, setRemindAt] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  useEffect(() => {
    track('landing_view', { category: content.category });
  }, [content.category]);

  function handleSuccess(at: string) {
    setRemindAt(at);
    setDialogOpen(true);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 pt-16 pb-24 sm:pt-24">
      <section className="text-center max-w-[640px] mb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight mb-5"
          style={{ color: content.accent }}
        >
          {content.hookLine}
        </h1>
        <p className="text-base sm:text-lg text-zinc-700 whitespace-pre-line">
          {content.subline}
        </p>
      </section>

      <DecisionForm
        content={content}
        onSuccess={(at) => {
          setSubmittedEmail(
            (document.querySelector('input[type=email]') as HTMLInputElement)?.value ?? ''
          );
          handleSuccess(at);
        }}
      />

      <div className="mt-10">
        <SocialProof content={content} />
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        remindAt={remindAt}
        email={submittedEmail}
        category={content.category}
      />
    </main>
  );
}
```

**참고**: `submittedEmail`을 DOM에서 가져오는 hack이 있는데, 더 깔끔하게 하려면 `DecisionForm`이 onSuccess 시 email도 함께 전달해야 합니다. 다음 단계에서 정리합니다.

- [ ] **Step 2: DecisionForm onSuccess 시그니처 정리**

`components/DecisionForm.tsx`의 `onSuccess` 시그니처를 변경:

기존:
```typescript
onSuccess: (remindAt: string) => void;
```

변경:
```typescript
onSuccess: (data: { remindAt: string; email: string }) => void;
```

호출부 변경:
```typescript
onSuccess({ remindAt: body.remind_at, email });
```

`LandingShell.tsx`에서 hack 제거:
```typescript
<DecisionForm
  content={content}
  onSuccess={({ remindAt: at, email }) => {
    setSubmittedEmail(email);
    handleSuccess(at);
  }}
/>
```

- [ ] **Step 3: 체크포인트**

---

## Task 16: 루트 레이아웃 + PostHog Provider 연결

**Files:**
- Modify: `/Users/seohyun/decision-validate/app/layout.tsx`

- [ ] **Step 1: layout.tsx 작성**

`app/layout.tsx`:
```typescript
import './globals.css';
import { PostHogProvider } from '@/components/PostHogProvider';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: '회고 아카이브',
  description: '결정의 맥락을 기록하고 1주일 뒤 회고하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-zinc-900 antialiased">
        <PostHogProvider>{children}</PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Vercel Analytics 패키지 설치**

```bash
cd /Users/seohyun/decision-validate
npm install @vercel/analytics
```

- [ ] **Step 3: 체크포인트**

---

## Task 17: globals.css 정리

**Files:**
- Modify: `/Users/seohyun/decision-validate/app/globals.css`

- [ ] **Step 1: globals.css 작성**

`app/globals.css`:
```css
@import "tailwindcss";

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Apple SD Gothic Neo", sans-serif;
  }

  dialog::backdrop {
    background-color: rgb(0 0 0 / 0.4);
  }
}
```

(Tailwind 4 기준. `create-next-app`이 Tailwind 4를 깔았다면 위 형식. 만약 Tailwind 3이면 `@tailwind base; @tailwind components; @tailwind utilities;`)

- [ ] **Step 2: 체크포인트**

---

## Task 18: /devs, /love, /life 페이지

**Files:**
- Create: `/Users/seohyun/decision-validate/app/devs/page.tsx`
- Create: `/Users/seohyun/decision-validate/app/love/page.tsx`
- Create: `/Users/seohyun/decision-validate/app/life/page.tsx`

- [ ] **Step 1: /devs 작성**

`app/devs/page.tsx`:
```typescript
import { LandingShell } from '@/components/LandingShell';
import { devs } from '@/content/devs';

export const metadata = {
  title: '개발자를 위한 회고 아카이브',
  description: '6개월 전 그 기술 결정의 이유, 지금 기억나세요?',
};

export default function DevsPage() {
  return <LandingShell content={devs} />;
}
```

- [ ] **Step 2: /love 작성**

`app/love/page.tsx`:
```typescript
import { LandingShell } from '@/components/LandingShell';
import { love } from '@/content/love';

export const metadata = {
  title: '관계의 결정을 다시 만나기',
  description: '관계의 결정은 시간이 지나면 마음이 흐려져요.',
};

export default function LovePage() {
  return <LandingShell content={love} />;
}
```

- [ ] **Step 3: /life 작성**

`app/life/page.tsx`:
```typescript
import { LandingShell } from '@/components/LandingShell';
import { life } from '@/content/life';

export const metadata = {
  title: '라이프 회고 아카이브',
  description: '이직, 자취, 큰 소비. 결정의 맥락을 1주일 뒤 다시 만나요.',
};

export default function LifePage() {
  return <LandingShell content={life} />;
}
```

- [ ] **Step 4: 체크포인트**

---

## Task 19: 루트 / 허브 페이지

**Files:**
- Modify: `/Users/seohyun/decision-validate/app/page.tsx`

- [ ] **Step 1: 허브 페이지 작성**

`app/page.tsx`:
```typescript
import Link from 'next/link';

const cards = [
  { href: '/devs', title: '개발자/빌더', desc: '기술 결정의 이유를 1주일 뒤 다시 보기', accent: '#22c55e' },
  { href: '/love', title: '연애 결정', desc: '그때의 마음을 1주일 뒤 다시 만나기', accent: '#ec4899' },
  { href: '/life', title: '라이프 결정', desc: '이직, 자취, 큰 소비의 맥락 기록', accent: '#1e3a8a' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        회고 아카이브
      </h1>
      <p className="text-zinc-600 mb-12 text-center max-w-[480px]">
        결정의 맥락은 1주일이면 흐려집니다. 한 줄 적어두면 그때 마음이 다시 돌아와요.
      </p>
      <div className="grid gap-4 sm:grid-cols-3 max-w-[840px] w-full">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition-colors"
          >
            <div className="w-3 h-3 rounded-full mb-4" style={{ backgroundColor: c.accent }} />
            <h2 className="font-semibold mb-1">{c.title}</h2>
            <p className="text-sm text-zinc-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 체크포인트**

---

## Task 20: vercel.json + Cron 설정

**Files:**
- Create: `/Users/seohyun/decision-validate/vercel.json`

- [ ] **Step 1: vercel.json 작성**

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/remind",
      "schedule": "0 0 * * *"
    }
  ]
}
```

UTC 00:00 = KST 09:00.

- [ ] **Step 2: 체크포인트**

---

## Task 21: README + 배포 가이드

**Files:**
- Create: `/Users/seohyun/decision-validate/README.md`

- [ ] **Step 1: README 작성**

`README.md`:
````markdown
# 회고 아카이브

3-ICP 의사결정 회고 페인 강도 검증용 페이크도어 랜딩 페이지.

## 라우트

- `/` — 3개 카테고리 허브
- `/devs` — 개발자/빌더
- `/love` — 연애
- `/life` — 일반 라이프 결정

## 로컬 셋업

```bash
git clone <repo>
cd decision-validate
npm install
cp .env.local.example .env.local   # 값 채우기
npm run dev
```

## 외부 서비스 셋업

1. **Supabase**: 새 프로젝트 → SQL Editor에서 `supabase/schema.sql` 실행 → URL/anon/service role 키 복사
2. **Resend**: 계정 생성 → API 키 발급
3. **PostHog**: 프로젝트 생성 → API 키 + Host 복사
4. **Cron Secret**: 임의 문자열 (예: `openssl rand -hex 32`)

## 배포 (Vercel)

```bash
vercel link
vercel env add ...   # 모든 환경 변수
vercel --prod
```

또는 GitHub repo 연동 후 Vercel Dashboard에서 환경 변수 입력.

## 검증 지표 보기

- **Vercel Analytics**: path별 방문 수
- **PostHog**: `landing_view → form_focus → form_submit_try → form_submit_success` 깔때기
- **Supabase**: `select category, count(*) from submissions group by category`
- **Resend**: 발송 로그
````

- [ ] **Step 2: 체크포인트**

---

## Task 22: 전체 빌드 + 타입 체크

- [ ] **Step 1: 타입 체크**

```bash
cd /Users/seohyun/decision-validate
npx tsc --noEmit
```

Expected: 에러 0개

- [ ] **Step 2: 전체 테스트**

```bash
npm test
```

Expected: PASS — env(2) + validation(5) + resend(2) + submit(3) + cron(3) = 15 tests

- [ ] **Step 3: 빌드**

```bash
npm run build
```

Expected: SUCCESS, `.next/` 생성

- [ ] **Step 4: 로컬 dev 서버로 수동 검증**

```bash
npm run dev
```

브라우저에서 확인:
- `http://localhost:3000/` 허브 정상
- `http://localhost:3000/devs`, `/love`, `/life` 각각 ICP 카피·색 다름 확인
- 폼 제출 → 다이얼로그 → 닫기 동작 확인 (실제 Supabase에 row 생성 확인)
- 모바일 뷰 (Chrome DevTools 모바일 모드) 깨지지 않음

- [ ] **Step 5: 체크포인트**

---

## Task 23: Vercel 배포

이 단계는 **사용자 직접 수행** 권장. 자동화 스크립트는 키 노출 위험 있음.

- [ ] **Step 1: Vercel CLI 또는 Dashboard로 프로젝트 생성**

```bash
cd /Users/seohyun/decision-validate
npx vercel link
```

- [ ] **Step 2: 환경 변수 입력**

Vercel Dashboard → Settings → Environment Variables에 `.env.local`의 모든 키 입력. (Production / Preview / Development 각각)

- [ ] **Step 3: 첫 배포**

```bash
npx vercel --prod
```

- [ ] **Step 4: 도메인 확인**

배포 URL (예: `decision-validate.vercel.app`)을 `NEXT_PUBLIC_SITE_URL`에 다시 반영하고 재배포.

- [ ] **Step 5: Cron 활성화 확인**

Vercel Dashboard → Project → Cron Jobs에서 `/api/cron/remind`가 `0 0 * * *`로 등록됐는지 확인.

- [ ] **Step 6: 운영 점검**

배포된 URL에서:
- 3개 라우트 정상 렌더링
- 폼 제출 → Supabase에 row 생성
- (1주일 후 실제 cron이 도는지 확인은 시간이 지나야 함. 임시로 cron URL을 수동 호출해볼 수 있음: `curl -H "Authorization: Bearer <CRON_SECRET>" <URL>/api/cron/remind`)

---

## Task 24: 검증 채널 글 발행 (수동)

이 태스크는 코드가 아니라 **마케팅 액션**입니다.

- [ ] **Step 1: 페르소나 매핑 채널에 글 발행**
  - `/devs`: 디스콰이엇, GeekNews, 글또
  - `/love`: 트위터/X, 더쿠
  - `/life`: Threads, 페이스북, 브런치
- [ ] **Step 2: 1주일 후 데이터 확인**
  - PostHog 깔때기, Vercel Analytics, Supabase 카운트
  - 검증 KPI (spec 9.4)와 비교

---

## Self-Review 체크리스트 (계획 작성자용)

- [x] **Spec 커버리지**: spec의 모든 섹션이 태스크에 매핑됐는지
  - 1 배경: README + 페이지 metadata로 표현
  - 2 페르소나: 마케팅 채널 Task 24
  - 3 아키텍처: Task 1, 디렉터리 구조 동일
  - 4 ICP 카피: Task 7
  - 5 폼/다이얼로그: Task 12, 13
  - 6 DB: Task 4
  - 7 API 라우트 4개: Task 8, 9, 10, 11
  - 8 이메일 템플릿: Task 5
  - 9 트래킹: Task 6, 14, 16
  - 10 비기능: 반응형은 Tailwind, 접근성은 native dialog, 성능은 Vercel Edge, 보안은 RLS + CRON_SECRET
  - 11 범위 외: 그대로 안 함
  - 12 위험: rate limit (Task 8), email_status (Task 9), Cron 누락 시 다음 실행 픽업 (Task 9 SQL 인덱스)
  - 13 다음 단계: Task 23, 24
- [x] **Placeholder 스캔**: 모든 step에 실제 코드/명령. TBD 없음.
- [x] **타입 일관성**: `Category`, `LandingContent`, `SubmissionInput` 등 전 태스크에서 동일.
