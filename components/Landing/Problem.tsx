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

      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-12 sm:py-[85px]">
        <header className="max-w-[640px] mb-8 sm:mb-[60px]">
          <p className="t-tag-md text-[var(--color-text-secondary)] mb-4">The Problem</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            결정은 기억해요.
            <br />
            근데 왜 그랬는지는?
          </h2>
          <p className="t-body-lg mt-4">
            결과만 남고, 맥락은 사라져요. 그때의 상황으로 돌아갈 방법이 없으니, 뭘 배워야 할지조차 모른 채 흘러가요.
          </p>
        </header>

        <ul className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {cases.map(({ quote, tag, Icon }) => (
            <li
              key={tag}
              className="glass-card relative p-5 sm:p-8 flex flex-col gap-4 sm:gap-7 sm:min-h-[240px]"
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
