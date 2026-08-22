"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { verificaCont, contulEConfigurat } from "@/lib/admin-cont";
import { adminulCurent, inchideSesiune, pornesteSesiune } from "@/lib/sesiune";

export type StareIntrare = { eroare?: string; email?: string };

// Apărare simplă împotriva ghicitului parolei: după 8 încercări greșite de la
// aceeași adresă, se așteaptă 15 minute. Ținut în memorie — la repornirea
// serverului se uită, dar încetinește destul cât să nu merite încercat.
const INCERCARI_MAXIME = 8;
const PAUZA_MS = 15 * 60 * 1000;
const incercari = new Map<string, { nr: number; pana: number }>();

async function deUndeVine(): Promise<string> {
  const h = await headers();
  const inainte = h.get("x-forwarded-for");
  return inainte?.split(",")[0]?.trim() || "necunoscut";
}

export async function intra(
  _stare: StareIntrare,
  date: FormData,
): Promise<StareIntrare> {
  const email = String(date.get("email") ?? "").trim();
  const parola = String(date.get("parola") ?? "");

  if (!contulEConfigurat()) {
    return {
      email,
      eroare:
        "Nu e configurat niciun cont de admin. Vezi instrucțiunile din .env.example.",
    };
  }

  if (!email || !parola) {
    return { email, eroare: "Scrie și e-mailul, și parola." };
  }

  const adresa = await deUndeVine();
  const acum = Date.now();
  const stare = incercari.get(adresa);

  if (stare && stare.nr >= INCERCARI_MAXIME && stare.pana > acum) {
    const minute = Math.ceil((stare.pana - acum) / 60000);
    return {
      email,
      eroare: `Prea multe încercări greșite. Mai încearcă peste ${minute} minute.`,
    };
  }

  const cont = await verificaCont(email, parola);

  if (!cont) {
    const nr = stare && stare.pana > acum ? stare.nr + 1 : 1;
    incercari.set(adresa, { nr, pana: acum + PAUZA_MS });
    return { email, eroare: "E-mailul sau parola nu sunt bune." };
  }

  incercari.delete(adresa);
  await pornesteSesiune(cont.email);

  // redirect() aruncă mai departe ca să oprească acțiunea — de aceea stă la final.
  redirect("/admin");
}

export async function iesi(): Promise<void> {
  await inchideSesiune();
  redirect("/admin/intrare");
}

/** E-mailul adminului conectat, pentru paginile care vor să-l arate. */
export async function cineEsteConectat(): Promise<string | null> {
  return adminulCurent();
}
