export function Hero() {
  return (
    <section className="relative px-6 pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-28 text-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-white" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, rgba(34,197,94,0.08), transparent 60%), radial-gradient(60% 60% at 20% 10%, rgba(236,72,153,0.06), transparent 60%), radial-gradient(60% 60% at 80% 10%, rgba(30,58,138,0.05), transparent 60%)',
        }}
      />

      <p className="text-xs sm:text-sm font-medium text-zinc-500 mb-5 tracking-[0.2em] uppercase">
        회고 아카이브
      </p>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight mb-6 max-w-3xl mx-auto">
        결정의 맥락은
        <br className="sm:hidden" /> <span className="text-zinc-400">1주일이면</span>
        <br />
        흐려집니다.
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-xl mx-auto mb-10 leading-relaxed">
        한 줄 적어두면, 그때의 마음이
        <br className="sm:hidden" /> 1주일 뒤 다시 돌아와요.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="#form"
          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 text-white px-7 py-3.5 font-medium hover:bg-zinc-700 transition-colors"
        >
          지금 결정 한 줄 적기
          <span aria-hidden>→</span>
        </a>
        <a
          href="#how"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 text-zinc-700 px-6 py-3.5 font-medium hover:border-zinc-900 transition-colors"
        >
          어떻게 작동하나요?
        </a>
      </div>

      <p className="mt-10 text-xs text-zinc-400">
        무료 · 1주일 후 메일 1통 · 스팸 없음
      </p>
    </section>
  );
}
