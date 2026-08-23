// Depozitul: de unde vin hainele si unde se salveaza cand adminul le adauga.
//
// Totul trece prin legatura de pe server, care duce cu ea si contul conectat. Asa,
// baza de date stie cine scrie: un vizitator poate doar citi, un admin poate si scrie.
// Regulile sunt acolo, nu aici — vezi baza-de-date.sql.

import { dinServer } from "./supabase";
import type { Produs } from "./shop";

export const TABEL = "produse";
export const GALERIE = "poze";

/** Cum arata o haina in baza de date: ca `Produs`, plus pozele si descrierea. */
export type ProdusSalvat = Produs & {
  id?: string;
  poze?: string[];
  descriere?: string | null;
  creat_la?: string;
};

export async function toateProdusele(): Promise<ProdusSalvat[]> {
  const db = await dinServer();
  const { data, error } = await db
    .from(TABEL)
    .select("*")
    .order("creat_la", { ascending: false });

  if (error) throw new Error("Nu am putut citi hainele: " + error.message);
  return (data ?? []) as ProdusSalvat[];
}

export async function produseDeVanzare(): Promise<ProdusSalvat[]> {
  return (await toateProdusele()).filter((p) => !p.vandut);
}

export async function produsDupaSlug(slug: string): Promise<ProdusSalvat | null> {
  const db = await dinServer();
  const { data, error } = await db.from(TABEL).select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Nu am putut citi haina: " + error.message);
  return (data as ProdusSalvat) ?? null;
}

export async function adaugaProdus(p: ProdusSalvat): Promise<void> {
  const db = await dinServer();
  const { error } = await db.from(TABEL).insert(p);
  if (error) throw new Error(traduEroarea(error.message));
}

export async function modificaProdus(slug: string, p: Partial<ProdusSalvat>): Promise<void> {
  const db = await dinServer();
  const { error } = await db.from(TABEL).update(p).eq("slug", slug);
  if (error) throw new Error(traduEroarea(error.message));
}

export async function stergeProdus(slug: string): Promise<void> {
  const db = await dinServer();
  const { error } = await db.from(TABEL).delete().eq("slug", slug);
  if (error) throw new Error(traduEroarea(error.message));
}

/** Mesajele bazei de date sunt in engleza; le facem pe intelesul omului. */
function traduEroarea(mesaj: string): string {
  const m = mesaj.toLowerCase();
  if (m.includes("duplicate key") || m.includes("unique")) {
    return "Mai există o haină cu același nume. Schimbă puțin numele.";
  }
  if (m.includes("row-level security") || m.includes("permission")) {
    return "Nu ai voie să faci asta. Ieși și intră din nou în cont.";
  }
  return "Nu a mers: " + mesaj;
}

/** Face un nume scurt pentru adresa hainei: "Rochie de vară" -> "rochie-de-vara". */
export function slugDinNume(nume: string): string {
  return nume
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
