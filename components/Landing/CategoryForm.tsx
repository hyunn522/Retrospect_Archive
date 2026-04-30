'use client';

import { useRef, useState } from 'react';
import type { Category } from '@/lib/types';
import type { LandingContent } from '@/content/types';
import { devs } from '@/content/devs';
import { love } from '@/content/love';
import { life } from '@/content/life';
import { DecisionForm } from '@/components/DecisionForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SocialProof } from '@/components/SocialProof';
import { track } from '@/lib/analytics';
import { CodeIcon, CompassIcon, HeartIcon } from './Icons';
import type { ComponentType, SVGProps } from 'react';

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const contents: Record<Category, LandingContent> = { devs, love, life };

const cardMeta: Record<
  Category,
  { title: string; tag: string; teaser: string; Icon: IconCmp }
> = {
  devs: { title: '개발 / 빌더',  tag: 'DEVS', teaser: '왜 그 스택을 골랐는지',           Icon: CodeIcon },
  love: { title: '연애',          tag: 'LOVE', teaser: '그때 마음이 어땠는지',             Icon: HeartIcon },
  life: { title: '라이프',        tag: 'LIFE', teaser: '이직·자취·큰 결정의 이유',       Icon: CompassIcon },
};

const order: Category[] = ['devs', 'love', 'life'];

export function CategoryForm({ initialCategory }: { initialCategory: Category | null }) {
  const [selected, setSelected] = useState<Category | null>(initialCategory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remindAt, setRemindAt] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleSelect(cat: Category) {
    if (cat !== selected) track('category_select', { category: cat });
    setSelected(cat);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % order.length;
      handleSelect(order[next]);
      btnRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + order.length) % order.length;
      handleSelect(order[prev]);
      btnRefs.current[prev]?.focus();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelect(order[idx]);
    }
  }

  const content = selected ? contents[selected] : null;
  const focusableIdx =
    selected != null ? order.indexOf(selected) : 0;

  return (
    <section
      id="form"
      className="relative bg-[var(--color-surface-canvas)] overflow-hidden"
      style={{ borderTop: '1px solid var(--color-border-hairline)' }}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora-soft" />

      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-12 sm:py-[85px]">
        <header className="max-w-[640px] mb-8 sm:mb-14">
          <p className="t-tag-md text-[var(--color-text-secondary)] mb-4">Compose</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            지금, 어떤 결정
            <br />
            앞에 멈춰 계세요?
          </h2>
          <p className="t-body-lg mt-4">
            고민하는 자리를 골라주세요. 바로 한 줄 적을 수 있어요.
          </p>
        </header>

        {/* Category cards — selection inverts surface; keyboard ARROW navigation */}
        <div
          role="radiogroup"
          aria-label="결정 카테고리 선택"
          className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {order.map((cat, idx) => {
            const isSelected = selected === cat;
            const { Icon, title, tag, teaser } = cardMeta[cat];
            return (
              <button
                key={cat}
                ref={(el) => {
                  btnRefs.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={focusableIdx === idx ? 0 : -1}
                onClick={() => handleSelect(cat)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="card-pickable group text-left p-4 sm:p-6"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(7, 181, 59, 0.18), rgba(7, 181, 59, 0.08))'
                    : 'var(--glass-tint-1)',
                  color: 'var(--color-text-primary)',
                  border: isSelected
                    ? '1px solid rgba(7, 181, 59, 0.45)'
                    : '1px solid var(--color-border-on-light)',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                  boxShadow: isSelected
                    ? 'inset 0 1px 0 var(--glass-inner-highlight), 0 10px 24px -12px rgba(7, 181, 59, 0.30)'
                    : 'inset 0 1px 0 var(--glass-inner-highlight)',
                }}
              >
                <div className="flex items-center justify-between mb-5 sm:mb-7">
                  <span
                    className={
                      isSelected ? 'glass-tile glass-tile-brand' : 'glass-tile'
                    }
                    style={{ width: 44, height: 44, borderRadius: 12 }}
                  >
                    <Icon size={20} />
                  </span>
                  <span
                    className="t-tag-md"
                    style={{
                      color: isSelected
                        ? 'var(--color-brand)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {tag}
                  </span>
                </div>
                <div className="t-heading-xs mb-1.5">{title}</div>
                <div
                  className="text-[0.95rem] leading-snug"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {teaser}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form panel */}
        {content ? (
          <div className="glass-card relative p-5 sm:p-10 mt-7 sm:mt-8 overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-[280px] h-[280px] rounded-full -z-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(7, 181, 59, 0.10), transparent 70%)',
              }}
            />

            <header className="relative text-center mb-7 sm:mb-10">
              <p className="t-tag-md text-[var(--color-text-secondary)] mb-3 inline-flex items-center gap-2">
                <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
                {cardMeta[content.category].tag}
              </p>
              <h3 className="t-heading-lg text-[var(--color-text-primary)] max-w-[22ch] mx-auto">
                {content.hookLine}
              </h3>
              <p className="mt-4 t-body-lg whitespace-pre-line max-w-[44ch] mx-auto">
                {content.subline}
              </p>
            </header>

            <div className="relative">
              <DecisionForm
                content={content}
                onSuccess={({ remindAt: at, email }) => {
                  setSubmittedEmail(email);
                  setRemindAt(at);
                  setDialogOpen(true);
                }}
              />
            </div>

            <div
              className="relative mt-8 pt-6"
              style={{ borderTop: '1px solid var(--color-border-hairline)' }}
            >
              <SocialProof content={content} />
            </div>
          </div>
        ) : (
          <div
            className="mt-7 sm:mt-8 p-10 sm:p-16 text-center"
            style={{
              border: '1px dashed var(--color-border-on-light)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <p className="t-tag-md text-[var(--color-text-secondary)] mb-3">Awaiting input</p>
            <p className="text-[var(--color-text-secondary)]">
              위에서 카테고리를 골라주세요.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        remindAt={remindAt}
        email={submittedEmail}
        category={content?.category ?? 'life'}
      />
    </section>
  );
}
