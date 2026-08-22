// Sesiunea de admin: un bilet semnat, ținut într-un cookie.
//
// Biletul nu conține parola, ci doar numele contului și data la care expiră,
// plus o semnătură făcută cu SESIUNE_SECRET. Fără cheia aia, biletul nu poate
// fi fabricat de nimeni din afară. Dacă schimbi SESIUNE_SECRET, toate sesiunile
// deschise se închid pe loc.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SECRET_TEMPORAR } from "./admin-conturi-temporare";

export const COOKIE_ADMIN = "aan-sh-admin";

const DURATA_MS = 7 * 24 * 60 * 60 * 1000; // o săptămână

type Continut = { u: string; exp: number };

function cheie(): string {
  const s = process.env.SESIUNE_SECRET;
  if (s && s.length >= 16) return s;

  // Nimic în setări? Atunci cheia temporară din cod — vezi admin-conturi-temporare.ts.
  return SECRET_TEMPORAR;
}

function semneaza(text: string): string {
  return createHmac("sha256", cheie()).update(text).digest("base64url");
}

export function faceBilet(utilizator: string, acum: number = Date.now()): string {
  const continut: Continut = { u: utilizator, exp: acum + DURATA_MS };
  const corp = Buffer.from(JSON.stringify(continut)).toString("base64url");
  return `${corp}.${semneaza(corp)}`;
}

/** Citește biletul și spune al cui e, sau null dacă e stricat, falsificat ori expirat. */
export function citesteBilet(bilet: string | undefined): string | null {
  if (!bilet) return null;

  const taiat = bilet.lastIndexOf(".");
  if (taiat < 1) return null;

  const corp = bilet.slice(0, taiat);
  const semnatura = bilet.slice(taiat + 1);

  try {
    const primita = Buffer.from(semnatura, "base64url");
    const corecta = Buffer.from(semneaza(corp), "base64url");
    if (primita.length !== corecta.length) return null;
    if (!timingSafeEqual(primita, corecta)) return null;

    const continut = JSON.parse(Buffer.from(corp, "base64url").toString()) as Continut;
    if (typeof continut.u !== "string" || typeof continut.exp !== "number") return null;
    if (continut.exp < Date.now()) return null;

    return continut.u;
  } catch {
    return null;
  }
}

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
