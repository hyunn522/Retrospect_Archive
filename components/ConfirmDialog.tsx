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
      className="rounded-lg p-0 max-w-[420px] w-[90vw] backdrop:bg-black/40"
    >
      <div className="p-8 text-center">
        <div className="text-3xl mb-4">✓</div>
        <h2 className="text-lg font-semibold mb-3">알림 예약 완료</h2>
        <p className="text-zinc-700 mb-2">
          {formatted}에<br />
          <span className="font-medium">{email}</span> 으로<br />
          회고 알림을 보내드릴게요.
        </p>
        <p className="text-zinc-500 text-sm mb-6">그동안 이 결정은 잊고 지내세요.</p>
        <button
          onClick={handleClose}
          className="px-5 py-2 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-700"
        >
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
