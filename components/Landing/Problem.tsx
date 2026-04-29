const cases = [
  {
    quote: '이직했는데 6개월 뒤,\n왜 옮겼는지 헷갈려요.',
    tag: '라이프',
    accent: '#1e3a8a',
  },
  {
    quote: '헤어졌는데 그때 마음이\n어땠는지 기억이 안 나요.',
    tag: '연애',
    accent: '#ec4899',
  },
  {
    quote: '그 스택을 골랐던 이유,\n지금은 뭔지 모르겠어요.',
    tag: '개발',
    accent: '#22c55e',
  },
];

export function Problem() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
            왜 결정의 이유는 매번 잊혀질까요?
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg">
            시간이 지나면 결과만 남고, 그때의 맥락은 사라져요.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {cases.map((c, i) => (
            <figure
              key={i}
              className="relative rounded-2xl border border-zinc-200 p-6 sm:p-7 bg-white"
            >
              <div
                className="absolute left-6 top-0 -translate-y-1/2 px-2.5 py-0.5 text-[11px] font-medium tracking-wide rounded-full text-white"
                style={{ backgroundColor: c.accent }}
              >
                {c.tag}
              </div>
              <blockquote className="text-base sm:text-lg text-zinc-800 whitespace-pre-line leading-relaxed">
                <span className="text-zinc-300 text-2xl leading-none mr-1 align-top">“</span>
                {c.quote}
                <span className="text-zinc-300 text-2xl leading-none ml-1 align-bottom">”</span>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
