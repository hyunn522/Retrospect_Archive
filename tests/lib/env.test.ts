import { describe, it, expect } from 'vitest';
import { parseEnv } from '@/lib/env';

describe('parseEnv', () => {
  it('throws when required server var is missing', () => {
    expect(() =>
      parseEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'a',
        // SUPABASE_SERVICE_ROLE_KEY missing
        RESEND_API_KEY: 'r',
        CRON_SECRET: 'c',
        NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
        NEXT_PUBLIC_POSTHOG_KEY: 'p',
        NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
      })
    ).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it('returns parsed env when all valid', () => {
    const env = parseEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'a',
      SUPABASE_SERVICE_ROLE_KEY: 's',
      RESEND_API_KEY: 'r',
      CRON_SECRET: 'c',
      NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
      NEXT_PUBLIC_POSTHOG_KEY: 'p',
      NEXT_PUBLIC_POSTHOG_HOST: 'https://app.posthog.com',
    });
    expect(env.RESEND_API_KEY).toBe('r');
  });
});
