const faqs = [
  {
    q: '1주일 뒤 정확히 언제 알림이 오나요?',
    a: '결정을 등록한 시각으로부터 7일 뒤 한국 시간 오전 9시 즈음에 메일이 도착합니다.',
  },
  {
    q: '결정 내용은 어디에 저장되나요?',
    a: '본인에게 보낼 회고 메일을 발송하기 위해서만 저장됩니다. 외부에 공개되는 건 카테고리별 익명 카운트뿐이에요.',
  },
  {
    q: '카테고리를 잘못 골랐어요. 다시 보낼 수 있나요?',
    a: '같은 카테고리는 1시간에 한 번 제출할 수 있어요. 다른 카테고리로는 바로 한 번 더 보내도 됩니다.',
  },
  {
    q: '회고 메일이 안 와요.',
    a: '먼저 스팸함을 확인해주세요. 그래도 없으면 다시 한 번 등록해보시고, 계속 문제가 있으면 GitHub 이슈로 알려주세요.',
  },
  {
    q: '무료인가요?',
    a: '네, 지금은 검증 단계라 무료로 운영합니다.',
  },
];

export function Faq() {
  return (
    <section
      className="bg-[var(--color-surface-canvas)]"
      style={{ borderTop: '1px solid var(--color-border-hairline)' }}
    >
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-20 sm:py-[85px] grid md:grid-cols-[260px_1fr] gap-10 md:gap-[60px]">
        <div>
          <p className="t-tag text-[var(--color-text-secondary)] mb-5">FAQ</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            자주 묻는
            <br />
            질문
          </h2>
        </div>

        <div>
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group py-5"
              style={{
                borderTop: i === 0 ? '1px solid var(--color-border-hairline)' : 'none',
                borderBottom: '1px solid var(--color-border-hairline)',
              }}
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                <span className="text-[1.0625rem] font-bold text-[var(--color-text-primary)] leading-snug">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 mt-0.5 w-7 h-7 grid place-items-center text-[var(--color-text-primary)] group-open:bg-[var(--color-surface-inverse)] group-open:text-[var(--color-text-inverse)] group-open:rotate-45 transition-all duration-200"
                  style={{
                    border: '1px solid var(--color-border-on-light)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  <span className="text-[15px] leading-none -mt-0.5">+</span>
                </span>
              </summary>
              <p className="mt-4 pr-10 text-[1rem] leading-[1.65] text-[var(--color-text-secondary)]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
