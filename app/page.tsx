import Link from 'next/link';

const cards = [
  { href: '/devs', title: '개발자/빌더', desc: '기술 결정의 이유를 1주일 뒤 다시 보기', accent: '#22c55e' },
  { href: '/love', title: '연애 결정', desc: '그때의 마음을 1주일 뒤 다시 만나기', accent: '#ec4899' },
  { href: '/life', title: '라이프 결정', desc: '이직, 자취, 큰 소비의 맥락 기록', accent: '#1e3a8a' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Decision Validate
      </h1>
      <p className="text-zinc-600 mb-12 text-center max-w-[480px]">
        결정의 맥락은 1주일이면 흐려집니다. 한 줄 적어두면 그때 마음이 다시 돌아와요.
      </p>
      <div className="grid gap-4 sm:grid-cols-3 max-w-[840px] w-full">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-900 transition-colors"
          >
            <div className="w-3 h-3 rounded-full mb-4" style={{ backgroundColor: c.accent }} />
            <h2 className="font-semibold mb-1">{c.title}</h2>
            <p className="text-sm text-zinc-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
