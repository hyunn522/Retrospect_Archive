import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { CATEGORIES, type Category } from '@/lib/types';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') as Category | null;
  if (!category || !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 });
  }

  const sb = getServiceClient();
  const { count, error } = await sb
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('category', category);

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json(
    { count: count ?? 0 },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
