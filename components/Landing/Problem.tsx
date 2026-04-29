const cases = [
  {
    quote: '이직했는데 6개월 뒤,\n왜 옮겼는지 헷갈려요.',
    tag: 'LIFE',
  },
  {
    quote: '헤어졌는데 그때 마음이\n어땠는지 기억이 안 나요.',
    tag: 'LOVE',
  },
  {
    quote: '그 스택을 골랐던 이유,\n지금은 뭔지 모르겠어요.',
    tag: 'DEVS',
  },
];

export function Problem() {
  return (
    <section className="bg-[var(--color-surface-canvas)]">
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-20 sm:py-[85px]">
        <header className="max-w-[640px] mb-12 sm:mb-[60px]">
          <p className="t-tag text-[var(--color-text-secondary)] mb-5">The Problem</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            결정의 이유는
            <br />
            왜 매번 잊혀질까요?
          </h2>
          <p className="t-body-lg mt-5">
            시간이 지나면 결과만 남고, 그때의 맥락은 사라져요.
          </p>
        </header>

        <ul className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {cases.map((c) => (
            <li
              key={c.tag}
              className="bg-[var(--color-surface-canvas)] p-7 sm:p-8 flex flex-col gap-7 min-h-[220px]"
              style={{
                border: '1px solid var(--color-border-on-light)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span className="t-tag self-start text-[var(--color-text-secondary)]">
                {c.tag}
              </span>
              <blockquote className="t-body-md whitespace-pre-line">
                {c.quote}
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
