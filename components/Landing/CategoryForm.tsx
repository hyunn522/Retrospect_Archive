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

const cardMeta: Record<Category, { title: string; emoji: string; teaser: string }> = {
  devs: { title: '개발자 / 빌더', emoji: '⚙️', teaser: '왜 그 스택을 골랐는지' },
  love: { title: '연애', emoji: '💗', teaser: '그때의 마음이 어땠는지' },
  life: { title: '라이프', emoji: '🧭', teaser: '이직·자취·큰 결정의 이유' },
};

const order: Category[] = ['devs', 'love', 'life'];

export function CategoryForm({ initialCategory }: { initialCategory: Category | null }) {
  const [selected, setSelected] = useState<Category | null>(initialCategory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remindAt, setRemindAt] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  function handleSelect(cat: Category) {
    if (cat !== selected) {
      track('category_select', { category: cat });
    }
    setSelected(cat);
  }

  const content = selected ? contents[selected] : null;

  return (
    <section id="form" className="px-6 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
            지금, 어떤 결정을 망설이고 계세요?
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg">
            카테고리를 고르면 그 자리에서 한 줄 적을 수 있어요.
          </p>
        </div>

        <div role="radiogroup" aria-label="카테고리 선택" className="grid sm:grid-cols-3 gap-3 mb-8">
          {order.map((cat) => {
            const isSelected = selected === cat;
            const accent = contents[cat].accent;
            const meta = cardMeta[cat];
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(cat)}
                className="text-left rounded-xl border-2 p-5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:-translate-y-0.5"
                style={{
                  borderColor: isSelected ? accent : '#e4e4e7',
                  backgroundColor: isSelected ? `${accent}0F` : '#ffffff',
                  // @ts-expect-error CSS var
                  '--tw-ring-color': accent,
                }}
              >
                <div className="text-2xl mb-2">{meta.emoji}</div>
                <div
                  className="font-semibold mb-0.5 transition-colors"
                  style={{ color: isSelected ? accent : '#18181b' }}
                >
                  {meta.title}
                </div>
                <div className="text-sm text-zinc-500">{meta.teaser}</div>
              </button>
            );
          })}
        </div>

        {content ? (
          <div
            className="bg-white rounded-2xl border-2 p-6 sm:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-colors"
            style={{ borderColor: `${content.accent}33` }}
          >
            <h3
              className="text-xl sm:text-2xl font-bold leading-snug mb-3 text-center transition-colors"
              style={{ color: content.accent }}
            >
              {content.hookLine}
            </h3>
            <p className="text-zinc-600 text-center whitespace-pre-line mb-7 leading-relaxed">
              {content.subline}
            </p>
            <DecisionForm
              content={content}
              onSuccess={({ remindAt: at, email }) => {
                setSubmittedEmail(email);
                setRemindAt(at);
                setDialogOpen(true);
              }}
            />
            <div className="mt-6">
              <SocialProof content={content} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-10 sm:p-14 text-center">
            <p className="text-zinc-400 text-base">
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
