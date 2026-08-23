-- ============================================================
--  aan-sh.ro — evidenta pe fiecare admin
--  Unde: Supabase -> SQL Editor -> New query -> lipesti tot -> Run
--  Face: un caiet in care se scrie singur cine ce a facut cu hainele.
--
--  Important: scrisul in caiet il face baza de date, nu site-ul. Adica nu poate fi
--  ocolit si nu poate fi sters din administrare — nici din greseala, nici intentionat.
-- ============================================================

-- ---------- 1. Cine a pus haina (ramane pe ea) ----------
alter table public.produse
  add column if not exists adaugat_de text;

-- ---------- 2. Caietul cu tot ce s-a facut ----------
create table if not exists public.jurnal (
  id           bigserial primary key,
  cine         text not null,          -- e-mailul adminului
  fapta        text not null,          -- "adaugat" / "schimbat" / "sters"
  produs_slug  text,
  produs_nume  text,
  cand         timestamptz not null default now()
);

create index if not exists jurnal_cine_idx on public.jurnal (cine);
create index if not exists jurnal_cand_idx on public.jurnal (cand desc);

-- ---------- 3. Scrisul automat in caiet ----------
create or replace function public.scrie_in_jurnal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  autorul text;
  ce_fapta text;
begin
  autorul := coalesce(auth.jwt() ->> 'email', 'necunoscut');

  ce_fapta := case tg_op
    when 'INSERT' then 'adaugat'
    when 'UPDATE' then 'schimbat'
    when 'DELETE' then 'sters'
  end;

  insert into public.jurnal (cine, fapta, produs_slug, produs_nume)
  values (
    autorul,
    ce_fapta,
    coalesce(new.slug, old.slug),
    coalesce(new.nume, old.nume)
  );

  -- cine a pus haina ramane scris pe ea
  if tg_op = 'INSERT' then
    update public.produse set adaugat_de = autorul where id = new.id;
  end if;

  return coalesce(new, old);
end $$;

drop trigger if exists produse_jurnal_adaugat on public.produse;
create trigger produse_jurnal_adaugat
  after insert on public.produse
  for each row execute function public.scrie_in_jurnal();

drop trigger if exists produse_jurnal_schimbat on public.produse;
create trigger produse_jurnal_schimbat
  after update on public.produse
  for each row execute function public.scrie_in_jurnal();

drop trigger if exists produse_jurnal_sters on public.produse;
create trigger produse_jurnal_sters
  after delete on public.produse
  for each row execute function public.scrie_in_jurnal();

-- ---------- 4. Cine poate citi caietul ----------
-- Doar adminii conectati. Nimeni nu poate scrie sau sterge din el de la tastatura:
-- singurul care scrie e functia de mai sus, iar stersul nu e permis nimanui.
alter table public.jurnal enable row level security;

drop policy if exists "adminii citesc jurnalul" on public.jurnal;
create policy "adminii citesc jurnalul"
  on public.jurnal for select
  to authenticated
  using (true);

-- ============================================================
--  Gata. Dupa Run, in administrare apare „Cine ce a facut".
--  Se numara de acum incolo; ce a fost inainte nu are cum sa fie stiut.
-- ============================================================
