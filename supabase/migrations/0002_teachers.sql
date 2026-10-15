-- Gappa teacher mode: roles on profiles, content reviews, role management.
-- Run in the Supabase SQL editor after 0001.

alter table public.profiles
  add column role text not null default 'learner' check (role in ('learner', 'teacher', 'admin'));

-- The caller's role. Security definer so policies can use it without recursing into profiles' own RLS.
create function public.my_role() returns text
language sql security definer stable set search_path = '' as $$
  select coalesce((select p.role from public.profiles p where p.id = (select auth.uid())), 'learner');
$$;

revoke execute on function public.my_role() from public, anon;
grant execute on function public.my_role() to authenticated, service_role;

create policy "profiles: admins read all" on public.profiles
  for select to authenticated using ((select public.my_role()) = 'admin');

create table public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_key text not null check (char_length(item_key) < 500),
  lesson_id text not null check (char_length(lesson_id) < 100),
  -- Snapshot of the text that was reviewed, so a later content edit does not change what the note refers to.
  target text not null check (char_length(target) < 2000),
  verdict text not null check (verdict in ('ok', 'fix')),
  correction text check (char_length(correction) < 2000),
  comment text check (char_length(comment) < 2000),
  -- Which recorded voice sounded wrong: a voice id, 'all', or null.
  voice text check (char_length(voice) < 100),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reviewer_id, item_key)
);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger content_reviews_touch
  before update on public.content_reviews
  for each row execute function public.touch_updated_at();

alter table public.content_reviews enable row level security;
revoke all on table public.content_reviews from anon;
-- No delete for clients: reviews are resolved, never removed.
grant select, insert, update on table public.content_reviews to authenticated;
grant all on table public.content_reviews to service_role;

create policy "reviews: read own" on public.content_reviews
  for select to authenticated using (reviewer_id = (select auth.uid()));
create policy "reviews: teachers insert own" on public.content_reviews
  for insert to authenticated
  with check (reviewer_id = (select auth.uid()) and (select public.my_role()) in ('teacher', 'admin'));
create policy "reviews: teachers update own" on public.content_reviews
  for update to authenticated
  using (reviewer_id = (select auth.uid()) and (select public.my_role()) in ('teacher', 'admin'))
  with check (reviewer_id = (select auth.uid()) and (select public.my_role()) in ('teacher', 'admin'));
create policy "reviews: admins read all" on public.content_reviews
  for select to authenticated using ((select public.my_role()) = 'admin');
create policy "reviews: admins update all" on public.content_reviews
  for update to authenticated
  using ((select public.my_role()) = 'admin') with check ((select public.my_role()) = 'admin');

-- Admins change roles through this (clients cannot write profiles at all).
create function public.set_role(p_username text, p_role text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if (select public.my_role()) <> 'admin' then
    raise exception 'Only admins can change roles.';
  end if;
  if p_role not in ('learner', 'teacher', 'admin') then
    raise exception 'Unknown role.';
  end if;
  if exists (select 1 from public.profiles where username = p_username and id = (select auth.uid())) then
    raise exception 'You cannot change your own role.';
  end if;
  update public.profiles set role = p_role where username = p_username;
  if not found then
    raise exception 'No user with that username.';
  end if;
end $$;

revoke execute on function public.set_role(text, text) from public, anon;
grant execute on function public.set_role(text, text) to authenticated;
