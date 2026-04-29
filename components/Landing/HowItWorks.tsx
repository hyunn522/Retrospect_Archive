const steps = [
  {
    n: '01',
    label: 'WRITE',
    title: '결정 한 줄을 적어요',
    desc: '망설이는 결정과 그 이유를 짧게 한 줄로 남겨요.',
  },
  {
    n: '02',
    label: 'PAUSE',
    title: '1주일 동안 잊고 지내요',
    desc: '그 결정은 잠시 잊고 일상으로 돌아가세요.',
  },
  {
    n: '03',
    label: 'REFLECT',
    title: '회고 메일이 도착해요',
    desc: '그때의 본인이 지금의 본인에게 묻습니다.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="bg-[var(--color-surface-canvas)]"
      style={{ borderTop: '1px solid var(--color-border-hairline)' }}
    >
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-20 sm:py-[85px]">
        <header className="max-w-[640px] mb-12 sm:mb-[60px]">
          <p className="t-tag text-[var(--color-text-secondary)] mb-5">How it works</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            세 번의 호흡으로
            <br />
            끝나요.
          </h2>
        </header>

        <ol className="grid sm:grid-cols-3 gap-10 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-3 left-[5.5rem] right-[-1rem] h-px"
                  style={{ background: 'var(--color-border-on-light)' }}
                />
              )}
              <div className="flex items-center gap-3 mb-6">
                <span
                  aria-hidden
                  className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]"
                />
                <span className="t-tag text-[var(--color-text-primary)]">{s.label}</span>
                <span className="t-tag text-[var(--color-text-secondary)] tnum">{s.n}</span>
              </div>
              <h3 className="t-heading-md text-[var(--color-text-primary)] mb-3">
                {s.title}
              </h3>
              <p className="text-[1rem] leading-[1.6] text-[var(--color-text-secondary)]">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
