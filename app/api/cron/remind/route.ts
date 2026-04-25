import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getServiceClient } from '@/lib/supabase';
import { getResend, buildReminderEmail } from '@/lib/resend';
import type { Category } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface PendingRow {
  id: string;
  email: string;
  decision: string;
  category: Category;
}

export async function GET(req: Request): Promise<Response> {
  const e = env();
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${e.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sb = getServiceClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await sb
    .from('submissions')
    .select('id, email, decision, category')
    .is('reminded_at', null)
    .lte('remind_at', nowIso)
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  const rows = (data ?? []) as PendingRow[];
  const resend = getResend();
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const mail = buildReminderEmail({
      to: row.email,
      category: row.category,
      decision: row.decision,
      submissionId: row.id,
      siteUrl: e.NEXT_PUBLIC_SITE_URL,
    });
    const resp = await resend.emails.send(mail);
    if (resp.error) {
      failed++;
      await sb
        .from('submissions')
        .update({ email_status: 'failed', reminded_at: new Date().toISOString() })
        .eq('id', row.id);
    } else {
      sent++;
      await sb
        .from('submissions')
        .update({ email_status: 'sent', reminded_at: new Date().toISOString() })
        .eq('id', row.id);
    }
  }

  return NextResponse.json({ ok: true, sent, failed }, { status: 200 });
}
