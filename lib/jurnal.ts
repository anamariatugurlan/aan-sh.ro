// Evidenta pe fiecare admin: cine cate haine a pus, a schimbat si a sters.
//
// Caietul se scrie singur, din baza de date (vezi contorizare.sql). Site-ul doar il
// citeste. Asa, numaratoarea nu poate fi ocolita si nu poate fi stearsa din administrare.

import { dinServer } from "./supabase";

export type Fapta = {
  cine: string;
  fapta: "adaugat" | "schimbat" | "sters";
  produs_nume: string | null;
  cand: string;
};

export type SocotealaUnuiAdmin = {
  cine: string;
  adaugate: number;
  schimbate: number;
  sterse: number;
  ultima: string | null;
};

/** Ultimele fapte, cele mai noi intai. */
export async function ultimeleFapte(cate = 20): Promise<Fapta[]> {
  const db = await dinServer();
  const { data, error } = await db
    .from("jurnal")
    .select("cine, fapta, produs_nume, cand")
    .order("cand", { ascending: false })
    .limit(cate);

  if (error) return [];
  return (data ?? []) as Fapta[];
}

/** Socoteala pe fiecare admin, cu cei mai harnici primii. */
export async function socoteala(): Promise<SocotealaUnuiAdmin[]> {
  const db = await dinServer();
  const { data, error } = await db.from("jurnal").select("cine, fapta, cand");
  if (error) return [];

  const pe = new Map<string, SocotealaUnuiAdmin>();

  for (const rand of (data ?? []) as { cine: string; fapta: string; cand: string }[]) {
    const a =
      pe.get(rand.cine) ??
      { cine: rand.cine, adaugate: 0, schimbate: 0, sterse: 0, ultima: null };

    if (rand.fapta === "adaugat") a.adaugate++;
    else if (rand.fapta === "schimbat") a.schimbate++;
    else if (rand.fapta === "sters") a.sterse++;

    if (!a.ultima || rand.cand > a.ultima) a.ultima = rand.cand;
    pe.set(rand.cine, a);
  }

  return [...pe.values()].sort((x, y) => y.adaugate - x.adaugate);
}

/** E pornita evidenta? (adica a fost rulat contorizare.sql) */
export async function evidentaEPornita(): Promise<boolean> {
  const db = await dinServer();
  const { error } = await db.from("jurnal").select("id").limit(1);
  return !error;
}

export function candScris(cand: string): string {
  return new Date(cand).toLocaleString("ro-RO", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
