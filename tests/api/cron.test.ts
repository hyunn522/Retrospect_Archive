import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPending = vi.fn();
const mockUpdate = vi.fn();
const mockSend = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getServiceClient: () => ({
    from: () => ({
      select: () => ({
        is: () => ({
          lte: () => ({
            limit: (...a: unknown[]) => mockPending(...a),
          }),
        }),
      }),
      update: (...a: unknown[]) => mockUpdate(...a),
    }),
  }),
}));

vi.mock('@/lib/resend', () => ({
  getResend: () => ({
    emails: { send: (...a: unknown[]) => mockSend(...a) },
  }),
  buildReminderEmail: () => ({
    to: 'a@b.co', from: 'x', subject: 'y', html: 'z',
  }),
}));

vi.mock('@/lib/env', () => ({
  env: () => ({
    CRON_SECRET: 'sec',
    NEXT_PUBLIC_SITE_URL: 'https://x.vercel.app',
  }),
}));

import { GET } from '@/app/api/cron/remind/route';

function makeReq(authHeader?: string): Request {
  return new Request('http://x/api/cron/remind', {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

beforeEach(() => {
  mockPending.mockReset();
  mockUpdate.mockReset();
  mockSend.mockReset();
  mockUpdate.mockReturnValue({
    eq: () => Promise.resolve({ error: null }),
  });
});

describe('GET /api/cron/remind', () => {
  it('401 without secret', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it('200 with valid secret, sends pending', async () => {
    mockPending.mockResolvedValue({
      data: [{
        id: '1', email: 'a@b.co', decision: 'd'.repeat(20), category: 'devs',
      }],
      error: null,
    });
    mockSend.mockResolvedValue({ data: { id: 'msg' }, error: null });

    const res = await GET(makeReq('Bearer sec'));
    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('marks email_status=failed when send errors', async () => {
    mockPending.mockResolvedValue({
      data: [{
        id: '1', email: 'a@b.co', decision: 'd'.repeat(20), category: 'devs',
      }],
      error: null,
    });
    mockSend.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const res = await GET(makeReq('Bearer sec'));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ email_status: 'failed' })
    );
  });
});
