const steps = [
  {
    n: '01',
    title: '결정 한 줄을 적어요',
    desc: '망설이는 결정과 그 이유를\n짧게 한 줄로 남겨요.',
  },
  {
    n: '02',
    title: '1주일 동안 잊고 지내요',
    desc: '그 결정은 잠시 잊고\n일상으로 돌아가세요.',
  },
  {
    n: '03',
    title: '회고 메일이 도착해요',
    desc: '그때의 본인이 지금의\n본인에게 묻습니다.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-6 py-20 sm:py-28 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-zinc-500 mb-3 tracking-[0.2em] uppercase">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            세 번의 호흡으로 끝나요.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden sm:block absolute top-7 left-[60%] right-[-30%] h-px bg-zinc-200"
                />
              )}
              <div className="relative">
                <div className="text-sm font-mono font-semibold text-zinc-400 mb-3 tracking-wider">
                  {s.n}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
