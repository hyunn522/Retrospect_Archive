import { describe, it, expect } from 'vitest';
import { buildReminderEmail } from '@/lib/resend';

describe('buildReminderEmail', () => {
  it('builds devs reminder with decision quoted', () => {
    const mail = buildReminderEmail({
      to: 'a@b.co',
      category: 'devs',
      decision: 'Nest.js로 결정. 1주일 써본 후기 남기기.',
      submissionId: 'abc-123',
      siteUrl: 'https://x.vercel.app',
    });
    expect(mail.to).toBe('a@b.co');
    expect(mail.subject).toContain('1주일 전');
    expect(mail.html).toContain('Nest.js로 결정');
    expect(mail.html).toContain('https://x.vercel.app/api/track/click?id=abc-123');
  });

  it('uses different greeting per category', () => {
    const devs = buildReminderEmail({
      to: 'a@b.co', category: 'devs', decision: 'x'.repeat(20),
      submissionId: 'i', siteUrl: 'https://x',
    });
    const love = buildReminderEmail({
      to: 'a@b.co', category: 'love', decision: 'x'.repeat(20),
      submissionId: 'i', siteUrl: 'https://x',
    });
    expect(devs.html).not.toBe(love.html);
  });
});
