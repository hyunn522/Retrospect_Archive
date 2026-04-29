export function Hero() {
  return (
    <section className="relative bg-[var(--color-surface-canvas)]">
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 pt-20 sm:pt-[85px] md:pt-[120px] pb-20 sm:pb-[85px]">
        <div className="flex flex-col items-center text-center gap-10 sm:gap-12">
          <span className="t-tag inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)]"
            style={{ border: '1px solid var(--color-border-on-light)' }}
          >
            <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
            회고 아카이브
          </span>

          <h1 className="t-display-lg text-[var(--color-text-primary)] max-w-[14ch]">
            결정의 맥락은
            <br />
            1주일이면 흐려집니다.
          </h1>

          <p className="t-body-lg max-w-[36ch] sm:max-w-[44ch]">
            한 줄 적어두면, 그때의 마음이
            <br className="hidden sm:block" /> 1주일 뒤 다시 돌아와요.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a href="#form" className="btn-primary">
              결정 한 줄 적기
              <span aria-hidden>→</span>
            </a>
            <a href="#how" className="btn-ghost">
              어떻게 작동하나요
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 t-caption-md">
            <span>무료</span>
            <span aria-hidden className="block w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-60" />
            <span>1주일 후 메일 1통</span>
            <span aria-hidden className="block w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-60" />
            <span>스팸 없음</span>
          </div>
        </div>
      </div>
    </section>
  );
}
