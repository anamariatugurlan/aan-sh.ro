// Datele magazinului. Deocamdata scrise aici, ca sa mearga site-ul fara baza de date.
// Cand trecem pe Supabase, se schimba doar functiile de mai jos, nu si paginile.

export type Categorie = {
  slug: string;
  nume: string;
  descriere: string;
};

export type Produs = {
  slug: string;
  nume: string;
  categorie: string; // slug de categorie
  pret: number;      // lei, pretul bucatii
  marime: string;
  stare: "ca nou" | "foarte buna" | "buna";
  marca?: string;
  vandut?: boolean;
};

export const categorii: Categorie[] = [
  { slug: "tricouri", nume: "Tricouri și bluze", descriere: "Bumbac, mânecă scurtă și lungă." },
  { slug: "camasi", nume: "Cămăși", descriere: "Bărbați și damă, bumbac și in." },
  { slug: "blugi", nume: "Blugi și pantaloni", descriere: "Denim și stofă, toate mărimile." },
  { slug: "geci", nume: "Geci și paltoane", descriere: "Iarnă și demisezon." },
  { slug: "tricotaje", nume: "Pulovere și tricotaje", descriere: "Lână, bumbac, amestec." },
  { slug: "copii", nume: "Haine copii", descriere: "De la 2 la 14 ani." },
];

export const produse: Produs[] = [
  { slug: "tricou-bumbac-alb", nume: "Tricou bumbac alb", categorie: "tricouri", pret: 15, marime: "L", stare: "ca nou" },
  { slug: "tricou-dungi-bleumarin", nume: "Tricou cu dungi bleumarin", categorie: "tricouri", pret: 18, marime: "M", stare: "foarte buna" },
  { slug: "bluza-maneca-lunga-gri", nume: "Bluză mânecă lungă gri", categorie: "tricouri", pret: 22, marime: "XL", stare: "buna" },
  { slug: "camasa-in-bej", nume: "Cămașă in bej", categorie: "camasi", pret: 35, marime: "L", stare: "ca nou", marca: "Zara", vandut: true },
  { slug: "camasa-carouri-rosu", nume: "Cămașă în carouri roșu", categorie: "camasi", pret: 28, marime: "XL", stare: "foarte buna" },
  { slug: "blugi-drepti-albastri", nume: "Blugi drepți albaștri", categorie: "blugi", pret: 55, marime: "34", stare: "foarte buna", marca: "Levi's" },
  { slug: "blugi-negri-slim", nume: "Blugi negri slim", categorie: "blugi", pret: 40, marime: "32", stare: "buna", vandut: true },
  { slug: "pantaloni-stofa-gri", nume: "Pantaloni stofă gri", categorie: "blugi", pret: 45, marime: "36", stare: "ca nou" },
  { slug: "geaca-fas-neagra", nume: "Geacă fâș neagră", categorie: "geci", pret: 70, marime: "L", stare: "foarte buna" },
  { slug: "palton-lana-camel", nume: "Palton lână camel", categorie: "geci", pret: 120, marime: "M", stare: "ca nou" },
  { slug: "pulover-lana-bleu", nume: "Pulover lână bleu", categorie: "tricotaje", pret: 38, marime: "M", stare: "foarte buna" },
  { slug: "cardigan-tricotat-crem", nume: "Cardigan tricotat crem", categorie: "tricotaje", pret: 42, marime: "L", stare: "buna" },
  { slug: "hanorac-copii-verde", nume: "Hanorac copii verde", categorie: "copii", pret: 25, marime: "8 ani", stare: "ca nou" },
  { slug: "rochita-copii-flori", nume: "Rochiță copii cu flori", categorie: "copii", pret: 20, marime: "6 ani", stare: "foarte buna" },
];

export function getCategorie(slug: string) {
  return categorii.find((c) => c.slug === slug);
}

export function getProdus(slug: string) {
  return produse.find((p) => p.slug === slug);
}

/** Hainele dintr-o categorie, fara cele deja vandute. */
export function produseDinCategorie(slug: string) {
  return produse.filter((p) => p.categorie === slug && !p.vandut);
}

export function produseDeVanzare() {
  return produse.filter((p) => !p.vandut);
}

/** Cel mai mic pret dintr-o categorie, pentru "de la X lei". */
export function pretMinimCategorie(slug: string): number | null {
  const lista = produseDinCategorie(slug);
  if (lista.length === 0) return null;
  return Math.min(...lista.map((p) => p.pret));
}

/** Marimile care chiar exista intr-o categorie, ca sa nu aratam filtre goale. */
export function marimiDinCategorie(slug: string): string[] {
  const set = new Set(produseDinCategorie(slug).map((p) => p.marime));
  return [...set].sort(comparaMarimi);
}

function comparaMarimi(a: string, b: string): number {
  const ordine = ["XS", "S", "M", "L", "XL", "XXL"];
  const ia = ordine.indexOf(a);
  const ib = ordine.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  const na = parseInt(a);
  const nb = parseInt(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return a.localeCompare(b, "ro");
}

/** Scoate diacriticele si majusculele, ca sa gaseasca si cine scrie "camasa" in loc de "cămașă". */
function normalizeaza(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function cautaProduse(intrebare: string): Produs[] {
  const q = normalizeaza(intrebare);
  if (!q) return [];
  const cuvinte = q.split(/\s+/);
  return produseDeVanzare().filter((p) => {
    const cat = getCategorie(p.categorie);
    const text = normalizeaza([p.nume, p.marca ?? "", p.marime, cat?.nume ?? ""].join(" "));
    return cuvinte.every((cuv) => text.includes(cuv));
  });
}

export type Sortare = "noi" | "pret-crescator" | "pret-descrescator";

export function sorteaza(lista: Produs[], cum: Sortare): Produs[] {
  const copie = [...lista];
  switch (cum) {
    case "pret-crescator":
      return copie.sort((a, b) => a.pret - b.pret);
    case "pret-descrescator":
      return copie.sort((a, b) => b.pret - a.pret);
    default:
      return copie;
  }
}

export function formatLei(lei: number): string {
  return lei.toLocaleString("ro-RO") + " lei";
}

/** Pragul de la care transportul e gratuit. */
export const TRANSPORT_GRATUIT_DE_LA = 250;
export const COST_TRANSPORT = 20;

export function costTransport(leiTotal: number): number {
  if (leiTotal === 0) return 0;
  return leiTotal >= TRANSPORT_GRATUIT_DE_LA ? 0 : COST_TRANSPORT;
}
