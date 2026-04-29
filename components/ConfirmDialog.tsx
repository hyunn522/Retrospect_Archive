'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import type { Category } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  remindAt: string | null;
  email: string;
  category: Category;
}

export function ConfirmDialog({ open, onClose, remindAt, email, category }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  function handleClose() {
    track('dialog_close', { category });
    onClose();
  }

  const formatted = remindAt ? formatKoreanDate(new Date(remindAt)) : '';

  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); handleClose(); }}
      onClick={(e) => { if (e.target === ref.current) handleClose(); }}
      className="p-0 max-w-[440px] w-[92vw] bg-white"
      style={{
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border-on-light)',
        boxShadow: 'var(--elevation-ambient)',
      }}
    >
      <div className="p-8 sm:p-10">
        <p className="t-tag text-[var(--color-text-secondary)] mb-5 inline-flex items-center gap-2">
          <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
          Scheduled
        </p>

        <h2 className="t-heading-md text-[var(--color-text-primary)] mb-6">
          알림 예약 완료.
        </h2>

        <dl
          className="p-5 mb-6 space-y-3"
          style={{
            border: '1px solid var(--color-border-hairline)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div className="flex justify-between items-baseline gap-4">
            <dt className="t-tag text-[var(--color-text-secondary)]">When</dt>
            <dd className="text-sm font-bold text-[var(--color-text-primary)] text-right">
              {formatted}
            </dd>
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <dt className="t-tag text-[var(--color-text-secondary)]">To</dt>
            <dd
              className="text-[13px] text-[var(--color-text-primary)] truncate text-right"
              title={email}
            >
              {email}
            </dd>
          </div>
        </dl>

        <p className="text-[var(--color-text-secondary)] text-[15px] leading-[1.6] mb-7">
          그동안 이 결정은 잊고 지내세요.
          <br />
          1주일 뒤 그때의 본인이 묻습니다.
        </p>

        <button onClick={handleClose} className="btn-primary w-full">
          닫기
        </button>
      </div>
    </dialog>
  );
}

function formatKoreanDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${y}년 ${m}월 ${day}일 ${ampm} ${h12}시`;
}
