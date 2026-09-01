create table if not exists public.votes (
  id bigint generated always as identity primary key,
  option text not null,
  name text,
  created_at timestamptz not null default now(),
  constraint votes_option_check check (option in ('the_deep', 'wild_west'))
);

alter table public.votes add column if not exists name text;

alter table public.votes enable row level security;

alter table public.votes drop constraint if exists votes_option_check;
alter table public.votes
add constraint votes_option_check check (option in ('the_deep', 'wild_west'));

grant usage on schema public to anon, authenticated;
grant select, insert, delete on table public.votes to anon, authenticated;

drop policy if exists "Anyone can read votes" on public.votes;

create policy "Anyone can read votes"
on public.votes
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can insert votes" on public.votes;

create policy "Anyone can insert votes"
on public.votes
for insert
to anon, authenticated
with check (option in ('the_deep', 'wild_west'));

drop policy if exists "Anyone can delete votes" on public.votes;

create policy "Anyone can delete votes"
on public.votes
for delete
to anon, authenticated
using (true);
