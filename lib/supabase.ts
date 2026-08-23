// Legatura cu baza de date, de pe server: paginile si actiunile care trebuie sa stie
// cine e conectat si sa poata scrie in numele lui.
//
// Partea de browser sta in `lib/supabase-browser.ts` — nu le amesteca, fiindca aici
// se foloseste `next/headers`, care merge doar pe server.
//
// Cine e conectat isi duce cu el dreptul de a scrie; cine nu e, poate doar citi.
// Regulile sunt in baza de date (RLS), nu aici — vezi baza-de-date.sql.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_CHEIE_PUBLICA, SUPABASE_URL } from "./supabase-config";

export async function dinServer() {
  const cos = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_CHEIE_PUBLICA, {
    cookies: {
      getAll() {
        return cos.getAll();
      },
      setAll(deSetat) {
        try {
          for (const { name, value, options } of deSetat) {
            cos.set(name, value, options);
          }
        } catch {
          // In paginile obisnuite cookie-urile nu se pot scrie; nu-i nimic,
          // reimprospatarea sesiunii se face din browser.
        }
      },
    },
  });
}

/** Cine e conectat acum, sau null. Se cheama din pagini si actiuni de pe server. */
export async function adminulCurent(): Promise<{ email: string } | null> {
  const db = await dinServer();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user?.email) return null;
  return { email: data.user.email };
}
