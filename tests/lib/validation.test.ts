import { describe, it, expect } from 'vitest';
import { validateSubmission } from '@/lib/validation';

describe('validateSubmission', () => {
  const valid = {
    email: 'a@b.co',
    decision: '결정 한 줄 적어보기 — 충분히 긴 문장.',
    category: 'devs',
  };

  it('passes valid input', () => {
    const r = validateSubmission(valid);
    expect(r.success).toBe(true);
  });

  it('fails on bad email', () => {
    const r = validateSubmission({ ...valid, email: 'not-email' });
    expect(r.success).toBe(false);
  });

  it('fails on too short decision', () => {
    const r = validateSubmission({ ...valid, decision: '짧음' });
    expect(r.success).toBe(false);
  });

  it('fails on too long decision', () => {
    const r = validateSubmission({ ...valid, decision: 'a'.repeat(501) });
    expect(r.success).toBe(false);
  });

  it('fails on unknown category', () => {
    const r = validateSubmission({ ...valid, category: 'food' as never });
    expect(r.success).toBe(false);
  });
});
