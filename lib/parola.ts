// Verificarea parolei de admin.
//
// Parola NU se ține nicăieri în clar — nici în cod, nici în setări. Se ține doar
// "amprenta" ei (scrypt): un șir din care parola nu se poate reface. La intrare
// se calculează amprenta parolei scrise și se compară cu cea salvată.
//
// Amprenta se face cu:  node scripts/parola.mjs
// Dacă schimbi parametrii de mai jos, schimbă-i și acolo.

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const COST = 16384; // cât de lentă e verificarea (apără de ghicit cu forța)
const LUNGIME = 64;

/** Face amprenta unei parole. Folosit de scriptul din scripts/parola.mjs. */
export function faceAmprenta(parola: string): string {
  const sare = randomBytes(16);
  const amprenta = scryptSync(parola.normalize("NFKC"), sare, LUNGIME, { N: COST });
  return `scrypt:${COST}:${sare.toString("hex")}:${amprenta.toString("hex")}`;
}

/** Spune dacă parola scrisă se potrivește cu amprenta salvată. */
export function parolaEBuna(parola: string, amprentaSalvata: string): boolean {
  const parti = amprentaSalvata.split(":");
  if (parti.length !== 4 || parti[0] !== "scrypt") return false;

  const cost = Number(parti[1]);
  if (!Number.isInteger(cost) || cost < 1024 || cost > 1048576) return false;

  try {
    const sare = Buffer.from(parti[2], "hex");
    const asteptat = Buffer.from(parti[3], "hex");
    if (sare.length === 0 || asteptat.length === 0) return false;

    const calculat = scryptSync(parola.normalize("NFKC"), sare, asteptat.length, { N: cost });
    return timingSafeEqual(calculat, asteptat);
  } catch {
    return false;
  }
}
