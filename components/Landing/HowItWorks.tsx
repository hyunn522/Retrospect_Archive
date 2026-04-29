import { HourglassIcon, MailIcon, PencilIcon } from './Icons';
import type { ComponentType, SVGProps } from 'react';

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const steps: Array<{
  n: string;
  label: string;
  title: string;
  desc: string;
  Icon: IconCmp;
}> = [
  {
    n: '01',
    label: 'WRITE',
    title: '한 줄 적어요',
    desc: '결정과 그 이유를 짧게. 길게 안 써도 돼요.',
    Icon: PencilIcon,
  },
  {
    n: '02',
    label: 'PAUSE',
    title: '잠시 잊고 지내요',
    desc: '7일 동안은 떠올리지 않아도 괜찮아요. 일상으로 돌아가세요.',
    Icon: HourglassIcon,
  },
  {
    n: '03',
    label: 'RETURN',
    title: '맥락이 다시 돌아와요',
    desc: '7일 뒤 회고 메일이 와요. 그때의 결정과 맥락을 다시 만나요.',
    Icon: MailIcon,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative bg-[var(--color-surface-canvas)] overflow-hidden"
      style={{ borderTop: '1px solid var(--color-border-hairline)' }}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora-soft opacity-70" />

      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-12 sm:py-[85px]">
        <header className="max-w-[640px] mb-9 sm:mb-[60px]">
          <p className="t-tag-md text-[var(--color-text-secondary)] mb-4">How it works</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            1분이면
            <br />
            충분해요.
          </h2>
        </header>

        <ol className="grid sm:grid-cols-3 gap-7 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-9 left-[88px] right-[-24px] h-px"
                  style={{ background: 'var(--color-border-on-light)' }}
                />
              )}

              <span className="glass-tile mb-5 sm:mb-6">
                <s.Icon size={26} />
              </span>

              <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                <span className="t-tag-md text-[var(--color-text-primary)]">{s.label}</span>
                <span className="t-tag text-[var(--color-text-secondary)] tnum">{s.n}</span>
              </div>
              <h3 className="t-heading-md text-[var(--color-text-primary)] mb-3">{s.title}</h3>
              <p className="text-[1rem] leading-[1.65] text-[var(--color-text-secondary)]">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
