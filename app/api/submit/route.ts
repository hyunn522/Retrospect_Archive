import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { validateSubmission } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const v = validateSubmission(body);
  if (!v.success) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const { email, decision, category } = v.data;
  const sb = getServiceClient();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: recent, error: recentErr } = await sb
    .from('submissions')
    .select('id')
    .eq('email', email)
    .eq('category', category)
    .gte('created_at', oneHourAgo);

  if (recentErr) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }
  if (recent && recent.length > 0) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const { data, error } = await sb
    .from('submissions')
    .insert({ email, decision, category })
    .select('id, remind_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, remind_at: data.remind_at }, { status: 200 });
}
