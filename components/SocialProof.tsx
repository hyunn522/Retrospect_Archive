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
    <p className="text-sm text-zinc-500 text-center">
      {content.socialProofPrefix}
      <span className="font-medium text-zinc-700">{count}</span>
      명이 결정을 기록했어요.
    </p>
  );
}
