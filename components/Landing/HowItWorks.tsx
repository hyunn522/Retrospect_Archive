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
    title: '지금 한 줄을 남겨요',
    desc: '결정과 그 이유를 짧게 — 부담 없이 한 줄이면 충분해요.',
    Icon: PencilIcon,
  },
  {
    n: '02',
    label: 'PAUSE',
    title: '잊고 일상으로 돌아가요',
    desc: '7일 동안은 그 결정을 떠올리지 않아도 괜찮아요.',
    Icon: HourglassIcon,
  },
  {
    n: '03',
    label: 'REFLECT',
    title: '메일 한 통이 도착해요',
    desc: '그때의 당신이 적은 메모를, 지금의 당신이 다시 읽어요.',
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

      <div className="max-w-[1080px] mx-auto px-5 sm:px-10 py-14 sm:py-[85px]">
        <header className="max-w-[640px] mb-10 sm:mb-[60px]">
          <p className="t-tag-md text-[var(--color-text-secondary)] mb-4">How it works</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            세 번의 호흡으로
            <br />
            끝나요.
          </h2>
        </header>

        <ol className="grid sm:grid-cols-3 gap-9 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden sm:block absolute top-9 left-[88px] right-[-24px] h-px"
                  style={{ background: 'var(--color-border-on-light)' }}
                />
              )}

              <span className="glass-tile glass-tile-brand mb-6">
                <s.Icon size={26} />
              </span>

              <div className="flex items-center gap-3 mb-3">
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
