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
    <section className="px-6 py-20 sm:py-28 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-zinc-500 mb-3 tracking-[0.2em] uppercase">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            자주 묻는 질문
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200 bg-white rounded-2xl px-6 sm:px-8">
          {faqs.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none font-medium text-zinc-900">
                <span className="leading-snug">{f.q}</span>
                <span
                  aria-hidden
                  className="shrink-0 text-zinc-400 group-open:rotate-45 transition-transform text-2xl leading-none mt-[-2px]"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-zinc-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
