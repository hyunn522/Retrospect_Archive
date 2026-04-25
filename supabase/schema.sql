-- Run this in Supabase SQL Editor on first setup.

create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  decision     text not null check (length(decision) between 10 and 500),
  category     text not null check (category in ('devs', 'love', 'life')),
  created_at   timestamptz not null default now(),
  remind_at    timestamptz not null default (now() + interval '7 days'),
  reminded_at  timestamptz,
  email_status text,
  click_at     timestamptz
);

create index if not exists idx_remind_pending
  on public.submissions (remind_at)
  where reminded_at is null;

create index if not exists idx_email_category_created
  on public.submissions (email, category, created_at desc);

alter table public.submissions enable row level security;

drop policy if exists "anonymous_insert" on public.submissions;
create policy "anonymous_insert"
  on public.submissions for insert
  to anon
  with check (true);
