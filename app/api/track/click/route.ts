import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  const sb = getServiceClient();
  await sb
    .from('submissions')
    .update({ click_at: new Date().toISOString() })
    .eq('id', id)
    .is('click_at', null);

  const dest = `${env().NEXT_PUBLIC_SITE_URL}/thanks?id=${encodeURIComponent(id)}`;
  return NextResponse.redirect(dest, 302);
}
