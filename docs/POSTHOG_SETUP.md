# PostHog 깔때기·대시보드 셋업

> SNS 발행 후 실제 트래픽이 들어오기 시작할 때 만들면 됩니다.
> Activity 메뉴에서 이벤트가 보이면 데이터 수집은 작동 중인 상태.

---

## 메뉴 구조 이해

| 메뉴 | 역할 |
| --- | --- |
| **Activity** | raw 이벤트 실시간 피드. 여기 보이면 PostHog 작동 OK |
| **Product analytics** | Insight(차트·깔때기) 만드는 곳 |
| **Dashboards** | 본인이 만든 Insight를 모아두는 보드 (직접 만들어야 함) |
| **Web analytics** | 자동 생성 보드 (페이지뷰 켜야 작동, 우린 끔) |

---

## 깔때기 1개 만들기 (필수, 5분)

### 1. Funnel Insight 생성

1. 좌측 메뉴 **Product analytics** 클릭
2. 우측 상단 **`+ New insight`** → **Funnel** 선택

### 2. 4단계 이벤트 추가

순서대로:

| 단계 | Event |
| --- | --- |
| 1 | `landing_view` |
| 2 | `form_focus` |
| 3 | `form_submit_try` |
| 4 | `form_submit_success` |

### 3. 카테고리별 쪼개기 (검증의 핵심)

상단 **"Breakdown by"** 클릭 → **Event property** → `category` 선택

→ `devs` / `love` / `life` 3개 라인이 같이 표시됨. ICP 비교가 한눈에 가능.

### 4. 저장

- 상단 **Save**
- 이름: `ICP Funnel — devs/love/life`
- **`+ Add to dashboard`** → 새 대시보드 만들기 → 이름 `Validation`

---

## 추가 Insight 2개 (선택, 검증 신호 강화)

### A. ICP별 일별 제출 추이 (시간 흐름)

- New insight → **Trends**
- Event: `form_submit_success`
- Breakdown by `category`
- 차트 타입: 일별 라인 차트
- 저장 → Validation 대시보드에 추가

### B. Decision 글자 수 분포 (진정성 신호)

- New insight → **Trends**
- Event: `form_submit_success`
- Aggregation: **Average of** `decision_length`
- Breakdown by `category`
- 의미:
  - 평균 10~30자 → 의례적·테스트성 입력
  - 평균 100자+ → 진짜 고민 → 페인 강한 신호
- 저장 → Validation 대시보드에 추가

---

## 완성 시 한 화면

Validation 대시보드에서 매일 확인:

```
[ICP Funnel — devs/love/life]                  [일별 제출 추이]
   devs  ████████████████░░░  80%
   love  ███████░░░░░░░░░░░  35%
   life  █████░░░░░░░░░░░░░  25%

[Decision 글자 수 평균]
   devs  ████████████  142자 → 진짜 고민
   love  █████████     98자 → 보통
   life  ████          45자 → 약함
```

이 한 화면이 **"어느 ICP의 페인이 진짜인지"** 답을 줍니다.

---

## 검증 의사결정 기준 (spec 9.4 재인용)

| 신호 | 임계값 | 통과 시 다음 단계 |
| --- | --- | --- |
| 제출률 (Funnel 마지막 단계) | 5%+ | 해당 ICP 본격 제품화 후보 |
| 제출 절대 수 | 30건+ | 인터뷰 단계 진입 |
| Decision 평균 글자 수 | 50자+ | 페인 진정성 입증 |
| 메일 클릭률 (Resend) | 15%+ | retention 신호 |
| 같은 이메일 재제출 | 20%+ | 자발적 재방문 = 페인 강함 |

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
| --- | --- |
| Funnel에 0% 표시 | 이벤트가 아직 안 들어왔거나, breakdown 속성명 오타 (`category`) |
| Activity엔 보이는데 Funnel엔 안 보임 | PostHog는 Funnel 계산에 5~10초 지연이 있음. 새로고침 |
| 카테고리 라인이 1개만 보임 | breakdown 추가 안 됐거나, 모든 이벤트가 같은 category로만 발사됨 (트래픽 부족) |
| `decision_length` 속성 안 보임 | `form_submit_success` 이벤트만 이 속성 갖고 있음. 다른 단계에는 없음 (정상) |
