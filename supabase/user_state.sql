-- Supabase Auth + user state persistence
create table if not exists public.user_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  state_key text not null,
  state_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, state_key)
);

create index if not exists idx_user_state_user_id on public.user_state(user_id);

alter table public.user_state enable row level security;

create policy "user_state_select_own"
  on public.user_state
  for select
  using (auth.uid() = user_id);

create policy "user_state_insert_own"
  on public.user_state
  for insert
  with check (auth.uid() = user_id);

create policy "user_state_update_own"
  on public.user_state
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_state_delete_own"
  on public.user_state
  for delete
  using (auth.uid() = user_id);
