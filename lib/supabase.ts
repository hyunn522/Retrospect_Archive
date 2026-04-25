import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let _service: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (_service) return _service;
  const e = env();
  _service = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return _service;
}

export function getAnonClient(): SupabaseClient {
  if (_anon) return _anon;
  const e = env();
  _anon = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return _anon;
}
