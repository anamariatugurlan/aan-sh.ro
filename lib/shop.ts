// Datele magazinului. Deocamdata scrise aici, ca sa mearga site-ul fara baza de date.
// Cand trecem pe Supabase, se schimba doar functiile de mai jos, nu si paginile.

export type Categorie = {
  slug: string;
  nume: string;
  leiPeKg: number;
  descriere: string;
};

export type Produs = {
  slug: string;
  nume: string;
  categorie: string; // slug de categorie
  grame: number;
  marime: string;
  stare: "ca nou" | "foarte buna" | "buna";
  marca?: string;
};

export const categorii: Categorie[] = [
  { slug: "tricouri", nume: "Tricouri și bluze", leiPeKg: 45, descriere: "Bumbac, mânecă scurtă și lungă." },
  { slug: "camasi", nume: "Cămăși", leiPeKg: 55, descriere: "Bărbați și damă, bumbac și in." },
  { slug: "blugi", nume: "Blugi și pantaloni", leiPeKg: 35, descriere: "Denim și stofă, toate mărimile." },
  { slug: "geci", nume: "Geci și paltoane", leiPeKg: 28, descriere: "Iarnă și demisezon." },
  { slug: "tricotaje", nume: "Pulovere și tricotaje", leiPeKg: 38, descriere: "Lână, bumbac, amestec." },
  { slug: "copii", nume: "Haine copii", leiPeKg: 42, descriere: "De la 2 la 14 ani." },
];

export const produse: Produs[] = [
  { slug: "tricou-bumbac-alb", nume: "Tricou bumbac alb", categorie: "tricouri", grame: 180, marime: "L", stare: "ca nou" },
  { slug: "tricou-dungi-bleumarin", nume: "Tricou cu dungi bleumarin", categorie: "tricouri", grame: 195, marime: "M", stare: "foarte buna" },
  { slug: "bluza-maneca-lunga-gri", nume: "Bluză mânecă lungă gri", categorie: "tricouri", grame: 260, marime: "XL", stare: "buna" },
  { slug: "camasa-in-bej", nume: "Cămașă in bej", categorie: "camasi", grame: 240, marime: "L", stare: "ca nou", marca: "Zara" },
  { slug: "camasa-carouri-rosu", nume: "Cămașă în carouri roșu", categorie: "camasi", grame: 310, marime: "XL", stare: "foarte buna" },
  { slug: "blugi-drepti-albastri", nume: "Blugi drepți albaștri", categorie: "blugi", grame: 620, marime: "34", stare: "foarte buna", marca: "Levi's" },
  { slug: "blugi-negri-slim", nume: "Blugi negri slim", categorie: "blugi", grame: 540, marime: "32", stare: "buna" },
  { slug: "pantaloni-stofa-gri", nume: "Pantaloni stofă gri", categorie: "blugi", grame: 480, marime: "36", stare: "ca nou" },
  { slug: "geaca-fas-neagra", nume: "Geacă fâș neagră", categorie: "geci", grame: 890, marime: "L", stare: "foarte buna" },
  { slug: "palton-lana-camel", nume: "Palton lână camel", categorie: "geci", grame: 1450, marime: "M", stare: "ca nou" },
  { slug: "pulover-lana-bleu", nume: "Pulover lână bleu", categorie: "tricotaje", grame: 420, marime: "M", stare: "foarte buna" },
  { slug: "cardigan-tricotat-crem", nume: "Cardigan tricotat crem", categorie: "tricotaje", grame: 510, marime: "L", stare: "buna" },
  { slug: "hanorac-copii-verde", nume: "Hanorac copii verde", categorie: "copii", grame: 300, marime: "8 ani", stare: "ca nou" },
  { slug: "rochita-copii-flori", nume: "Rochiță copii cu flori", categorie: "copii", grame: 165, marime: "6 ani", stare: "foarte buna" },
];

export function getCategorie(slug: string) {
  return categorii.find((c) => c.slug === slug);
}

export function getProdus(slug: string) {
  return produse.find((p) => p.slug === slug);
}

export function produseDinCategorie(slug: string) {
  return produse.filter((p) => p.categorie === slug);
}

/** Pretul unei haine = greutatea ei inmultita cu pretul pe kg al categoriei. */
export function pretProdus(p: Produs): number {
  const cat = getCategorie(p.categorie);
  if (!cat) return 0;
  return Math.round((p.grame / 1000) * cat.leiPeKg);
}

export function leiPeKgPentru(p: Produs): number {
  return getCategorie(p.categorie)?.leiPeKg ?? 0;
}

export function formatLei(lei: number): string {
  return lei.toLocaleString("ro-RO") + " lei";
}

export function formatKg(grame: number): string {
  if (grame < 1000) return grame + " g";
  return (grame / 1000).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kg";
}

/** Transportul se calculeaza din greutatea totala. Valorile sunt de confirmat cu proprietarul. */
export function costTransport(grameTotal: number, leiTotal: number): number {
  if (grameTotal === 0) return 0;
  if (leiTotal >= 300) return 0;
  const kg = grameTotal / 1000;
  if (kg <= 5) return 20;
  return 20 + Math.ceil(kg - 5) * 3;
}
