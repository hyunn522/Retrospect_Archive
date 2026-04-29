'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import type { Category } from '@/lib/types';
import { CheckIcon, ClockIcon, MailIcon } from '@/components/Landing/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  remindAt: string | null;
  email: string;
  category: Category;
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
});

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

  const formatted = remindAt ? dateFormatter.format(new Date(remindAt)) : '';

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) handleClose();
      }}
      className="p-0 max-w-[440px] w-[92vw] bg-white"
      style={{
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border-on-light)',
        boxShadow: 'var(--elevation-ambient)',
        overscrollBehavior: 'contain',
      }}
    >
      <div className="p-7 sm:p-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="glass-tile" style={{ width: 40, height: 40, borderRadius: 12 }}>
            <CheckIcon size={20} />
          </span>
          <span className="t-tag-md text-[var(--color-text-secondary)]">Scheduled</span>
        </div>

        <h2
          id="confirm-dialog-title"
          className="t-heading-md text-[var(--color-text-primary)] mb-5"
        >
          알림 예약 완료.
        </h2>

        <dl
          className="p-4 sm:p-5 mb-5 sm:mb-6 space-y-3"
          style={{
            border: '1px solid var(--color-border-hairline)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div className="flex justify-between items-center gap-4 min-w-0">
            <dt className="inline-flex items-center gap-2 t-tag text-[var(--color-text-secondary)] shrink-0">
              <ClockIcon size={14} />
              When
            </dt>
            <dd className="text-sm font-bold text-[var(--color-text-primary)] text-right min-w-0 truncate">
              {formatted}
            </dd>
          </div>
          <div className="flex justify-between items-center gap-4 min-w-0">
            <dt className="inline-flex items-center gap-2 t-tag text-[var(--color-text-secondary)] shrink-0">
              <MailIcon size={14} />
              To
            </dt>
            <dd
              className="text-[13px] text-[var(--color-text-primary)] text-right min-w-0 truncate"
              translate="no"
              title={email}
            >
              {email}
            </dd>
          </div>
        </dl>

        <p className="text-[var(--color-text-secondary)] text-[15px] leading-[1.6] mb-6 sm:mb-7">
          그동안은 이 결정을 잊고 지내세요.
          <br />
          1주일 뒤, 그때의 맥락과 함께 다시 만나요.
        </p>

        <button onClick={handleClose} className="btn-primary w-full">
          닫기
        </button>
      </div>
    </dialog>
  );
}
