// Depozitul: de unde vin hainele si unde se salveaza cand adminul le adauga.
//
// Cat timp Supabase nu e legat, site-ul merge mai departe cu hainele de proba din
// `lib/shop.ts` — doar ca nu se poate adauga nimic. De indata ce apar cele doua chei,
// totul trece pe baza de date, fara sa se schimbe nicio pagina.
//
// Cele doua chei NU sunt secrete: cheia "anon" e facuta ca sa stea la vedere in site.
// Ce apara datele sunt regulile din baza de date (RLS): scrie doar cine e conectat.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { produse as produseDeProba, type Produs } from "./shop";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CHEIE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const TABEL = "produse";
export const GALERIE = "poze";

/** E legata baza de date? Daca nu, site-ul merge pe hainele de proba. */
export function depozitulELegat(): boolean {
  return Boolean(URL_SUPABASE && CHEIE_SUPABASE);
}

let clientul: SupabaseClient | null = null;

export function client(): SupabaseClient {
  if (!depozitulELegat()) {
    throw new Error(
      "Baza de date nu e legata. Lipsesc NEXT_PUBLIC_SUPABASE_URL si " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY. Vezi baza-de-date.sql.",
    );
  }
  if (!clientul) clientul = createClient(URL_SUPABASE, CHEIE_SUPABASE);
  return clientul;
}

/** Cum arata o haina in baza de date. Aceleasi campuri ca `Produs`, plus pozele. */
export type ProdusSalvat = Produs & {
  id?: string;
  poze?: string[];
  descriere?: string;
};

/** Toate hainele. Fara baza de date, cele de proba. */
export async function toateProdusele(): Promise<ProdusSalvat[]> {
  if (!depozitulELegat()) return produseDeProba;

  const { data, error } = await client()
    .from(TABEL)
    .select("*")
    .order("creat_la", { ascending: false });

  if (error) throw new Error("Nu am putut citi hainele: " + error.message);
  return (data ?? []) as ProdusSalvat[];
}

export async function produsDupaSlug(slug: string): Promise<ProdusSalvat | null> {
  if (!depozitulELegat()) return produseDeProba.find((p) => p.slug === slug) ?? null;

  const { data, error } = await client().from(TABEL).select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Nu am putut citi haina: " + error.message);
  return (data as ProdusSalvat) ?? null;
}

export async function adaugaProdus(p: ProdusSalvat): Promise<void> {
  const { error } = await client().from(TABEL).insert(p);
  if (error) throw new Error("Nu am putut adauga haina: " + error.message);
}

export async function modificaProdus(slug: string, p: Partial<ProdusSalvat>): Promise<void> {
  const { error } = await client().from(TABEL).update(p).eq("slug", slug);
  if (error) throw new Error("Nu am putut modifica haina: " + error.message);
}

export async function stergeProdus(slug: string): Promise<void> {
  const { error } = await client().from(TABEL).delete().eq("slug", slug);
  if (error) throw new Error("Nu am putut sterge haina: " + error.message);
}

/** Face un slug din numele hainei: "Rochie de vară" -> "rochie-de-vara". */
export function slugDinNume(nume: string): string {
  return nume
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
