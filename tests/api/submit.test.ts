import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInsert = vi.fn();
const mockSelectGte = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getServiceClient: () => ({
    from: () => ({
      insert: (...args: unknown[]) => mockInsert(...args),
      select: () => ({
        eq: () => ({
          eq: () => ({
            gte: (...a: unknown[]) => mockSelectGte(...a),
          }),
        }),
      }),
    }),
  }),
}));

vi.mock('@/lib/env', () => ({
  env: () => ({
    NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
  }),
}));

import { POST } from '@/app/api/submit/route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockInsert.mockReset();
  mockSelectGte.mockReset();
  mockSelectGte.mockResolvedValue({ data: [], error: null });
  mockInsert.mockReturnValue({
    select: () => ({
      single: () => Promise.resolve({
        data: { id: 'gen-id', remind_at: '2026-05-02T00:00:00Z' },
        error: null,
      }),
    }),
  });
});

describe('POST /api/submit', () => {
  it('200 on valid input', async () => {
    const res = await POST(makeRequest({
      email: 'a@b.co',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('gen-id');
  });

  it('400 on bad email', async () => {
    const res = await POST(makeRequest({
      email: 'bad',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(400);
  });

  it('429 on duplicate within 1 hour', async () => {
    mockSelectGte.mockResolvedValue({
      data: [{ id: 'recent' }],
      error: null,
    });
    const res = await POST(makeRequest({
      email: 'a@b.co',
      decision: '결정 한 줄 충분히 길게 적기',
      category: 'devs',
    }));
    expect(res.status).toBe(429);
  });
});
