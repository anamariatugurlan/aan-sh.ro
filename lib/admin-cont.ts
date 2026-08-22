// De unde vin conturile de admin.
//
// ACUM: conturile stau în setările site-ului, numerotate. Fiecare om are două linii:
//
//   ADMIN_1_EMAIL=cineva@gmail.com
//   ADMIN_1_PAROLA_HASH=scrypt:16384:...
//   ADMIN_2_EMAIL=altcineva@gmail.com
//   ADMIN_2_PAROLA_HASH=scrypt:16384:...
//
// Se pot pune până la LOCURI conturi. Liniile se fac cu: node scripts/parola.mjs
//
// MAI TÂRZIU (Supabase): se schimbă DOAR funcțiile din acest fișier, ca să caute
// conturile în baza de date. Paginile, sesiunea și formularul rămân neatinse.

import { parolaEBuna } from "./parola";
import { CONTURI_TEMPORARE } from "./admin-conturi-temporare";

const LOCURI = 5;

export type Admin = { email: string };

type ContSalvat = { email: string; amprenta: string };

function conturiSalvate(): ContSalvat[] {
  const conturi: ContSalvat[] = [];
  for (let i = 1; i <= LOCURI; i++) {
    const email = process.env[`ADMIN_${i}_EMAIL`];
    const amprenta = process.env[`ADMIN_${i}_PAROLA_HASH`];
    if (email && amprenta) {
      conturi.push({ email: email.trim().toLowerCase(), amprenta });
    }
  }

  // Nimic în setări? Atunci lista temporară din cod — vezi admin-conturi-temporare.ts.
  // Setările au întotdeauna prioritate: de îndată ce apar acolo, lista din cod nu se
  // mai citește deloc.
  if (conturi.length === 0) {
    return CONTURI_TEMPORARE.map((c) => ({
      email: c.email.trim().toLowerCase(),
      amprenta: c.amprenta,
    }));
  }

  return conturi;
}

/** Verifică e-mailul și parola. Întoarce contul, sau null dacă nu se potrivesc. */
export async function verificaCont(
  email: string,
  parola: string,
): Promise<Admin | null> {
  const conturi = conturiSalvate();
  if (conturi.length === 0) return null;

  const cautat = email.trim().toLowerCase();
  const gasit = conturi.find((c) => c.email === cautat);

  // Parola se verifică întotdeauna, chiar dacă e-mailul nu există în listă:
  // altfel s-ar putea ghici, după cât durează răspunsul, ce e-mailuri au cont.
  const deVerificat = gasit ?? conturi[0];
  const parolaSePotriveste = parolaEBuna(parola, deVerificat.amprenta);

  if (!gasit || !parolaSePotriveste) return null;
  return { email: gasit.email };
}

/** Câte conturi sunt configurate. 0 înseamnă că nu poate intra nimeni. */
export function cateConturi(): number {
  return conturiSalvate().length;
}

/** E configurat măcar un cont? Ca să dăm un mesaj clar, nu „parolă greșită". */
export function contulEConfigurat(): boolean {
  return cateConturi() > 0;
}
