# 회고 아카이브

3-ICP 의사결정 회고 페인 강도 검증용 페이크도어 랜딩 페이지

## 라우트

- `/` — 3개 카테고리 허브
- `/devs` — 개발자/빌더
- `/love` — 연애
- `/life` — 일반 라이프 결정

## 로컬 셋업

```bash
git clone https://github.com/hyunn522/Retrospect_Archive.git decision-validate
cd decision-validate
npm install
cp .env.local.example .env.local   # 값 채우기
npm run dev
```

## 외부 서비스 셋업

1. **Supabase** (DB): `submissions` 테이블에 결정/이메일/리마인드 일정 저장. 새 프로젝트 → SQL Editor에서 `supabase/schema.sql` 실행 → URL/anon/service role 키 복사
2. **Resend** (메일): 1주일 뒤 회고 리마인더 발송. 계정 생성 → API 키 발급 (무료 도메인 `onboarding@resend.dev` 사용)
3. **PostHog** (이벤트 분석): 랜딩 뷰 → 카테고리 선택 → 제출 깔때기 추적. 프로젝트 생성 → API 키 + Host 복사
4. **Vercel** (호스팅 + 크론 + 페이지 애널리틱스): 매일 자정 `/api/cron/remind` 트리거. **Cron Secret**은 임의 문자열로 (예: `openssl rand -hex 32`)

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

## 테스트

```bash
npm test
```

## 빌드

```bash
npm run build
```

## 디렉터리 구조

```
app/                     Next.js App Router 페이지·라우트
  api/submit/            POST 결정 입력
  api/cron/remind/       매일 KST 09:00 회고 메일 발송
  api/stats/count/       카테고리별 카운트 (SocialProof용)
  api/track/click/       회고 메일 링크 클릭 트래킹
  devs/love/life/        3개 ICP 랜딩
  thanks/                회고 메일 클릭 후 도착지
components/              공유 React 컴포넌트
content/                 ICP별 카피 데이터
lib/                     env, types, validation, supabase, resend, analytics
supabase/schema.sql      DB 스키마 (수동 실행)
tests/                   Vitest 단위·통합 테스트
docs/superpowers/        spec + plan
vercel.json              Cron 스케줄
```
