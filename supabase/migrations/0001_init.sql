-- Gappa initial schema: profiles, progress, invite codes.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

create table public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- One learner's progress is a few KB; the cap stops the row being used as free storage.
  data jsonb not null check (pg_column_size(data) < 1048576),
  updated_at timestamptz not null default now()
);

create table public.invite_codes (
  code text primary key,
  uses_left int not null default 1 check (uses_left >= 0),
  note text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.invite_codes enable row level security;

-- Invite codes are service-role only: no policies, and no table rights for API roles at all.
revoke all on table public.invite_codes from anon, authenticated;
-- Signed-out visitors never touch user tables.
revoke all on table public.profiles, public.progress from anon;

-- Explicit grants, so the schema works with "Automatically expose new tables" turned off.
-- RLS policies below still limit signed-in users to their own rows.
grant select on table public.profiles to authenticated;
grant select, insert, update on table public.progress to authenticated;
-- Server-side code (signup API, invite and reset scripts) uses the service role.
grant all on table public.profiles, public.progress, public.invite_codes to service_role;

create policy "profiles: read own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "progress: read own" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress: insert own" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress: update own" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Atomically spend one use of an invite code; false if unknown or used up.
create function public.claim_invite(p_code text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare claimed int;
begin
  update public.invite_codes set uses_left = uses_left - 1
    where code = p_code and uses_left > 0;
  get diagnostics claimed = row_count;
  return claimed > 0;
end $$;

-- Give a use back when account creation fails after a claim.
create function public.release_invite(p_code text) returns void
language sql security definer set search_path = '' as $$
  update public.invite_codes set uses_left = uses_left + 1 where code = p_code;
$$;

revoke execute on function public.claim_invite(text) from public, anon, authenticated;
revoke execute on function public.release_invite(text) from public, anon, authenticated;
grant execute on function public.claim_invite(text) to service_role;
grant execute on function public.release_invite(text) to service_role;

-- Every new auth user gets a profile row carrying its username
-- (falls back to the email's local part for users created from the dashboard).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)));
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
