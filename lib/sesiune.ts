// Sesiunea de admin: un bilet semnat, ținut într-un cookie.
//
// Biletul nu conține parola, ci doar numele contului și data la care expiră, plus o
// semnătură. Fabricarea și verificarea lui sunt în `lib/bilet.ts`, ca să le poată folosi
// și paznicul de la intrarea în site (`proxy.ts`), care rulează înaintea paginilor.

import { cookies } from "next/headers";
import { COOKIE_ADMIN, DURATA_MS, citesteBilet, faceBilet } from "./bilet";

export { COOKIE_ADMIN, citesteBilet, faceBilet };

export async function pornesteSesiune(utilizator: string): Promise<void> {
  const cos = await cookies();
  cos.set({
    name: COOKIE_ADMIN,
    value: faceBilet(utilizator),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURATA_MS / 1000,
  });
}

export async function inchideSesiune(): Promise<void> {
  (await cookies()).delete(COOKIE_ADMIN);
}

/** Numele adminului conectat acum, sau null dacă nu e nimeni. */
export async function adminulCurent(): Promise<string | null> {
  return citesteBilet((await cookies()).get(COOKIE_ADMIN)?.value);
}
