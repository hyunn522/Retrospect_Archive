'use client';

import { useState } from 'react';
import type { LandingContent } from '@/content/types';
import { track } from '@/lib/analytics';

interface Props {
  content: LandingContent;
  onSuccess: (data: { remindAt: string; email: string }) => void;
}

export function DecisionForm({ content, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decisionLength = decision.length;
  const decisionValid = decisionLength >= 10 && decisionLength <= 500;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = !submitting && emailValid && decisionValid;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    track('form_submit_try', { category: content.category });
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, decision, category: content.category }),
      });
      const body = await res.json();
      if (!res.ok) {
        track('form_submit_fail', { category: content.category, error_code: res.status });
        if (res.status === 429) {
          setError('같은 카테고리는 1시간에 한 번만 제출할 수 있어요.');
        } else {
          setError(body.error ?? '제출에 실패했어요. 잠시 후 다시 시도해주세요.');
        }
        return;
      }
      track('form_submit_success', {
        category: content.category,
        decision_length: decisionLength,
      });
      onSuccess({ remindAt: body.remind_at, email });
      setEmail('');
      setDecision('');
    } catch {
      setError('네트워크 오류. 잠시 후 다시 시도해주세요.');
      track('form_submit_fail', { category: content.category, error_code: 0 });
    } finally {
      setSubmitting(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    border: '1px solid var(--color-border-on-light)',
    borderRadius: 'var(--radius-sm)',
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[480px] mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="t-tag text-[var(--color-text-secondary)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder="you@example.com"
          className="w-full px-4 h-12 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 outline-none bg-white"
          style={fieldStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="decision" className="t-tag text-[var(--color-text-secondary)]">
          Decision
        </label>
        <textarea
          id="decision"
          required
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder={content.placeholder}
          rows={5}
          maxLength={500}
          className="w-full px-4 py-3 text-[15px] leading-[1.55] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 outline-none resize-none bg-white"
          style={fieldStyle}
        />
        <span className="self-end t-caption-sm tnum">
          {decisionLength}/500 · 최소 10
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="px-4 py-3 text-sm text-[var(--color-text-primary)]"
          style={{
            background: '#fff',
            border: '1px solid var(--color-text-primary)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {error}
        </div>
      )}

      <button type="submit" disabled={!canSubmit} className="btn-primary w-full mt-1">
        {submitting ? (
          <>
            <span
              aria-hidden
              className="block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
            />
            보내는 중
          </>
        ) : (
          <>
            {content.ctaButton}
            <span aria-hidden>→</span>
          </>
        )}
      </button>

      <p className="text-center t-caption-sm">
        7일 뒤 한국 시간 오전 9시에 메일 1통이 도착합니다.
      </p>
    </form>
  );
}
