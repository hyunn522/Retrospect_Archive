import { CodeIcon, CompassIcon, HeartIcon } from './Icons';
import type { ComponentType, SVGProps } from 'react';

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const cases: Array<{ quote: string; tag: string; Icon: IconCmp }> = [
  {
    quote: '이직했는데 6개월 뒤,\n왜 옮겼는지 헷갈려요.',
    tag: 'LIFE',
    Icon: CompassIcon,
  },
  {
    quote: '헤어졌는데 그때 마음이\n어땠는지 기억이 안 나요.',
    tag: 'LOVE',
    Icon: HeartIcon,
  },
  {
    quote: '그 스택을 골랐던 이유,\n지금은 뭔지 모르겠어요.',
    tag: 'DEVS',
    Icon: CodeIcon,
  },
];

export function Problem() {
  return (
    <section className="relative bg-[var(--color-surface-canvas)] overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora-soft" />

      <div className="max-w-[1080px] mx-auto px-5 sm:px-10 py-14 sm:py-[85px]">
        <header className="max-w-[640px] mb-9 sm:mb-[60px]">
          <p className="t-tag-md text-[var(--color-text-secondary)] mb-4">The Problem</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            결정한 이유는,
            <br />
            시간이 지나면 사라져요.
          </h2>
          <p className="t-body-lg mt-4">
            결과만 기억나고, 그때의 맥락은 흐려져요. 후회하지 않으려면 지금의 마음을 남겨두세요.
          </p>
        </header>

        <ul className="grid sm:grid-cols-3 gap-3 sm:gap-5">
          {cases.map(({ quote, tag, Icon }) => (
            <li
              key={tag}
              className="relative p-6 sm:p-8 flex flex-col gap-6 sm:gap-7 min-h-[200px] sm:min-h-[240px]"
              style={{
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid var(--color-border-on-light)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="glass-tile glass-tile-sm">
                  <Icon size={22} />
                </span>
                <span className="t-tag-md text-[var(--color-text-secondary)]">{tag}</span>
              </div>
              <blockquote className="t-body-md whitespace-pre-line">{quote}</blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
