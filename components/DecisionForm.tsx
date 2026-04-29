'use client';

import { useRef, useState } from 'react';
import type { LandingContent } from '@/content/types';
import { track } from '@/lib/analytics';
import { ArrowRightIcon, MailIcon, PencilIcon } from '@/components/Landing/Icons';

interface Props {
  content: LandingContent;
  onSuccess: (data: { remindAt: string; email: string }) => void;
}

export function DecisionForm({ content, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const decisionRef = useRef<HTMLTextAreaElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const decisionLength = decision.length;
  const decisionValid = decisionLength >= 10 && decisionLength <= 500;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!emailValid) {
      setError('올바른 이메일 주소를 입력해주세요.');
      emailRef.current?.focus();
      return;
    }
    if (!decisionValid) {
      setError(
        decisionLength < 10
          ? '결정 내용을 최소 10자 이상 적어주세요.'
          : '결정 내용은 500자까지만 적을 수 있어요.',
      );
      decisionRef.current?.focus();
      return;
    }

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
          setError('같은 카테고리는 1시간에 한 번만 보낼 수 있어요. 다른 카테고리로 시도해보세요.');
        } else {
          setError(body.error ?? '제출에 실패했어요. 잠시 후 다시 시도해주세요.');
        }
        requestAnimationFrame(() => errorRef.current?.focus());
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
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    border: '1px solid var(--color-border-on-light)',
    borderRadius: 'var(--radius-sm)',
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="w-full max-w-[480px] mx-auto flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="inline-flex items-center gap-2 t-tag-md text-[var(--color-text-secondary)]"
        >
          <span className="glass-tile glass-tile-sm" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <MailIcon size={14} />
          </span>
          Email
        </label>
        <input
          id="email"
          name="email"
          ref={emailRef}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder="you@example.com…"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          className="w-full px-4 h-12 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 outline-none bg-white"
          style={fieldStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="decision"
          className="inline-flex items-center gap-2 t-tag-md text-[var(--color-text-secondary)]"
        >
          <span className="glass-tile glass-tile-sm" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <PencilIcon size={14} />
          </span>
          Decision
        </label>
        <textarea
          id="decision"
          name="decision"
          ref={decisionRef}
          required
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          onFocus={() => track('form_focus', { category: content.category })}
          placeholder={content.placeholder}
          rows={5}
          maxLength={500}
          autoComplete="off"
          className="w-full px-4 py-3 text-[15px] leading-[1.55] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 outline-none resize-none bg-white"
          style={fieldStyle}
        />
        <span aria-live="polite" className="self-end t-caption-sm tnum">
          {decisionLength}/500자 · 최소 10자
        </span>
      </div>

      {error && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none"
          style={{
            background: '#fff',
            border: '1px solid var(--color-text-primary)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {error}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full mt-1">
        {submitting ? (
          <>
            <span
              aria-hidden
              className="block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
            />
            보내는 중…
          </>
        ) : (
          <>
            {content.ctaButton}
            <ArrowRightIcon size={18} />
          </>
        )}
      </button>

      <p className="text-center t-caption-sm">
        7일 뒤 한국 시간 오전 9시에 메일 1통이 도착합니다.
      </p>
    </form>
  );
}
