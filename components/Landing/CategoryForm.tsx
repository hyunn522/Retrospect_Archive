'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
import type { LandingContent } from '@/content/types';
import { devs } from '@/content/devs';
import { love } from '@/content/love';
import { life } from '@/content/life';
import { DecisionForm } from '@/components/DecisionForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SocialProof } from '@/components/SocialProof';
import { track } from '@/lib/analytics';

const contents: Record<Category, LandingContent> = { devs, love, life };

const cardMeta: Record<Category, { title: string; tag: string; teaser: string }> = {
  devs: { title: '개발자 / 빌더', tag: 'DEVS', teaser: '왜 그 스택을 골랐는지' },
  love: { title: '연애',          tag: 'LOVE', teaser: '그때의 마음이 어땠는지' },
  life: { title: '라이프',        tag: 'LIFE', teaser: '이직·자취·큰 결정의 이유' },
};

const order: Category[] = ['devs', 'love', 'life'];

export function CategoryForm({ initialCategory }: { initialCategory: Category | null }) {
  const [selected, setSelected] = useState<Category | null>(initialCategory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remindAt, setRemindAt] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  function handleSelect(cat: Category) {
    if (cat !== selected) track('category_select', { category: cat });
    setSelected(cat);
  }

  const content = selected ? contents[selected] : null;

  return (
    <section
      id="form"
      className="bg-[var(--color-surface-canvas)]"
      style={{ borderTop: '1px solid var(--color-border-hairline)' }}
    >
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-20 sm:py-[85px]">
        <header className="max-w-[640px] mb-10 sm:mb-12">
          <p className="t-tag text-[var(--color-text-secondary)] mb-5">Compose</p>
          <h2 className="t-heading-lg text-[var(--color-text-primary)]">
            지금, 어떤 결정을
            <br />
            망설이고 계세요?
          </h2>
          <p className="t-body-lg mt-5">
            카테고리를 고르면 그 자리에서 한 줄 적을 수 있어요.
          </p>
        </header>

        {/* Category cards — selection inverts surface, no chromatic differentiation */}
        <div
          role="radiogroup"
          aria-label="카테고리 선택"
          className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {order.map((cat) => {
            const isSelected = selected === cat;
            const meta = cardMeta[cat];
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(cat)}
                className="text-left p-5 sm:p-6 transition-all"
                style={{
                  background: isSelected
                    ? 'var(--color-surface-inverse)'
                    : 'var(--color-surface-canvas)',
                  color: isSelected
                    ? 'var(--color-text-inverse)'
                    : 'var(--color-text-primary)',
                  border: isSelected
                    ? '1px solid var(--color-surface-inverse)'
                    : '1px solid var(--color-border-on-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div className="flex items-center justify-between mb-7">
                  <span
                    className="t-tag"
                    style={{
                      color: isSelected
                        ? 'rgba(255,255,255,0.8)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {meta.tag}
                  </span>
                  <span
                    aria-hidden
                    className="block w-2 h-2 rounded-full transition-opacity"
                    style={{
                      background: 'var(--color-brand)',
                      opacity: isSelected ? 1 : 0,
                    }}
                  />
                </div>
                <div className="t-heading-xs mb-1.5">{meta.title}</div>
                <div
                  className="text-sm leading-snug"
                  style={{
                    color: isSelected
                      ? 'rgba(255,255,255,0.7)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  {meta.teaser}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form panel — single ambient shadow per DESIGN.md */}
        {content ? (
          <div
            className="bg-[var(--color-surface-canvas)] p-6 sm:p-10 mt-8"
            style={{
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-hairline)',
              boxShadow: 'var(--elevation-ambient)',
            }}
          >
            <header className="text-center mb-8 sm:mb-10">
              <p className="t-tag text-[var(--color-text-secondary)] mb-3 inline-flex items-center gap-2">
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

            <DecisionForm
              content={content}
              onSuccess={({ remindAt: at, email }) => {
                setSubmittedEmail(email);
                setRemindAt(at);
                setDialogOpen(true);
              }}
            />

            <div
              className="mt-8 pt-6"
              style={{ borderTop: '1px solid var(--color-border-hairline)' }}
            >
              <SocialProof content={content} />
            </div>
          </div>
        ) : (
          <div
            className="mt-8 p-12 sm:p-16 text-center"
            style={{
              border: '1px dashed var(--color-border-on-light)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <p className="t-tag text-[var(--color-text-secondary)] mb-3">Awaiting input</p>
            <p className="text-[var(--color-text-secondary)]">
              위에서 카테고리를 선택해주세요.
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
