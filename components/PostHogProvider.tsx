'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

interface Props {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
    });
  }, []);

  return <>{children}</>;
}
