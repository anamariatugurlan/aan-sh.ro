// Legatura cu baza de date, din browser: formularul de intrare si incarcarea pozelor.
// Tine sesiunea in cookie-uri, ca s-o vada si serverul.
//
// Sta separat de partea de server fiindca aceea foloseste `next/headers`, care n-are
// ce cauta in codul trimis catre browser.

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_CHEIE_PUBLICA, SUPABASE_URL } from "./supabase-config";

export function dinBrowser() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_CHEIE_PUBLICA);
}
