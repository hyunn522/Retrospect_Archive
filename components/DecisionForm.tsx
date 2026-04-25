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

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[480px] mx-auto flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">이메일</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder="you@example.com"
          className="rounded-md border border-zinc-300 px-3 py-2.5 outline-none focus:border-zinc-900"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">지금 망설이는 결정 한 줄</span>
        <textarea
          required
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder={content.placeholder}
          rows={5}
          maxLength={500}
          className="rounded-md border border-zinc-300 px-3 py-2.5 outline-none focus:border-zinc-900 resize-none"
        />
        <span className="text-xs text-zinc-500 self-end">
          {decisionLength}/500 (최소 10자)
        </span>
      </label>

      {error && (
        <div role="alert" className="text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{ backgroundColor: canSubmit ? content.accent : undefined }}
        className="rounded-md px-4 py-3 text-white font-medium disabled:bg-zinc-300 disabled:cursor-not-allowed transition-opacity"
      >
        {submitting ? '보내는 중...' : content.ctaButton}
      </button>

      <p className="text-xs text-zinc-500 text-center">
        1주일 뒤 입력한 이메일로 알림이 갑니다.
      </p>
    </form>
  );
}
