// Adresa proiectului si cheia publica de la Supabase.
//
// Cheile astea NU sunt secrete. Cheia "publishable" e facuta special ca sa stea la
// vedere in site — chiar si daca ar sta in setarile gazduirii, ea ajunge oricum in
// paginile trimise catre browser. Ce apara datele sunt regulile din baza de date (RLS):
// oricine poate CITI hainele, dar poate SCRIE doar cine e conectat cu un cont de admin.
//
// Cheia secreta (`sb_secret_...`) NU are voie sa ajunga niciodata aici. Aia ocoleste
// toate regulile si ramane doar in contul de Supabase.
//
// Setarile de pe gazduire au prioritate, daca se pun vreodata acolo.

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://liquvexbeoeztzfrqjsz.supabase.co";

export const SUPABASE_CHEIE_PUBLICA =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_USGoOUgnX_wNr0NwcAIWoQ_kR9915BP";
