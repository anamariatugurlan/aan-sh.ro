-- ============================================================
--  aan-sh.ro — de lipit o singura data in Supabase
--  Unde: proiectul aan-sh -> SQL Editor -> New query -> lipesti tot -> Run
--  Face: tabelul cu haine, regulile de acces si locul unde stau pozele.
-- ============================================================

-- ---------- 1. Tabelul cu haine ----------
create table if not exists public.produse (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nume        text not null,
  categorie   text not null,          -- slugul categoriei sau subcategoriei
  pret        integer not null,       -- lei, pretul bucatii
  marime      text not null,
  stare       text not null,          -- "ca nou" / "foarte buna" / "buna"
  marca       text,
  descriere   text,
  poze        text[] default '{}',    -- adresele pozelor
  vandut      boolean not null default false,
  creat_la    timestamptz not null default now(),
  schimbat_la timestamptz not null default now()
);

create index if not exists produse_categorie_idx on public.produse (categorie);
create index if not exists produse_creat_la_idx  on public.produse (creat_la desc);

-- data ultimei modificari, pusa automat
create or replace function public.marcheaza_schimbarea()
returns trigger language plpgsql as $$
begin
  new.schimbat_la = now();
  return new;
end $$;

drop trigger if exists produse_schimbat_la on public.produse;
create trigger produse_schimbat_la
  before update on public.produse
  for each row execute function public.marcheaza_schimbarea();

-- ---------- 2. Cine are voie ce ----------
-- Oricine POATE CITI hainele (asa se vad in magazin).
-- Doar cine e conectat POATE SCRIE (adaugare, modificare, stergere).
alter table public.produse enable row level security;

drop policy if exists "oricine vede hainele" on public.produse;
create policy "oricine vede hainele"
  on public.produse for select
  to anon, authenticated
  using (true);

drop policy if exists "adminii adauga haine" on public.produse;
create policy "adminii adauga haine"
  on public.produse for insert
  to authenticated
  with check (true);

drop policy if exists "adminii modifica haine" on public.produse;
create policy "adminii modifica haine"
  on public.produse for update
  to authenticated
  using (true) with check (true);

drop policy if exists "adminii sterg haine" on public.produse;
create policy "adminii sterg haine"
  on public.produse for delete
  to authenticated
  using (true);

-- ---------- 3. Locul pentru poze ----------
insert into storage.buckets (id, name, public)
values ('poze', 'poze', true)
on conflict (id) do nothing;

drop policy if exists "oricine vede pozele" on storage.objects;
create policy "oricine vede pozele"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'poze');

drop policy if exists "adminii incarca poze" on storage.objects;
create policy "adminii incarca poze"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'poze');

drop policy if exists "adminii sterg poze" on storage.objects;
create policy "adminii sterg poze"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'poze');

-- ============================================================
--  Gata. Dupa Run:
--   1. Authentication -> Users -> Add user, pentru fiecare din cele trei e-mailuri
--      (bifeaza "Auto Confirm User", ca sa nu mai astepte confirmare pe mail)
--   2. Settings -> API -> trimite-mi "Project URL" si cheia "anon public"
-- ============================================================
