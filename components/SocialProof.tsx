'use client';

import { useEffect, useState } from 'react';
import type { LandingContent } from '@/content/types';

export function SocialProof({ content }: { content: LandingContent }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/stats/count?category=${content.category}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setCount(d.count ?? 0); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [content.category]);

  if (count === null || count === 0) return null;

  return (
    <p className="flex items-center justify-center gap-2.5 t-caption-md">
      <span aria-hidden className="block w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
      <span>
        {content.socialProofPrefix}
        <span className="tnum text-[var(--color-text-primary)] font-bold mx-1">{count}</span>
        명이 결정을 기록했어요.
      </span>
    </p>
  );
}
