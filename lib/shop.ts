// Categoriile magazinului si ajutoarele care lucreaza cu hainele.
//
// Hainele NU mai stau aici: vin din baza de date (vezi lib/depozit.ts). Functiile de
// mai jos primesc lista ca prim argument, ca sa nu depinda de unde vine.

/** Grupurile mari din meniu: Damă, Accesorii, Ocazie, Bărbați. */
export type Grup = {
  slug: string;
  nume: string;
  descriere: string;
};

/**
 * Categoriile stau in arbore, pe trei niveluri:
 *   grup (Articole dama)  ->  categorie (Geci)  ->  subcategorie (Geci ski)
 * O categorie fara subcategorii (Blugi, Rochii) e ultimul nivel si tine haine direct.
 * `parinte` lipseste la categoriile mari si arata catre ele la subcategorii.
 */
export type Categorie = {
  slug: string;
  nume: string;
  descriere: string;
  grup: string; // slug de grup
  parinte?: string; // slug de categorie mare
};

export type Produs = {
  slug: string;
  nume: string;
  categorie: string; // slug de categorie
  pret: number;      // lei, pretul bucatii
  marime: string;
  stare: "ca nou" | "foarte buna" | "buna";
  marca?: string | null;
  vandut?: boolean;
  poze?: string[] | null;
  descriere?: string | null;
};

export const grupuri: Grup[] = [
  { slug: "dama", nume: "Articole damă", descriere: "Haine de damă, alese bucată cu bucată." },
  { slug: "accesorii", nume: "Accesorii", descriere: "Căciuli, eșarfe, mănuși și restul." },
  { slug: "ocazie", nume: "Articole ocazie", descriere: "Ținute pentru evenimente." },
  { slug: "barbati", nume: "Articole bărbați", descriere: "Haine de bărbați." },
];

export const categorii: Categorie[] = [
  // ================= Articole damă =================
  { slug: "bluze", nume: "Bluze", descriere: "", grup: "dama" },
  { slug: "bluze-maneca-lunga", nume: "Bluze mânecă lungă", descriere: "", grup: "dama", parinte: "bluze" },
  { slug: "bluze-trening", nume: "Bluze trening", descriere: "", grup: "dama", parinte: "bluze" },
  { slug: "bluze-termo", nume: "Bluze termo", descriere: "", grup: "dama", parinte: "bluze" },

  { slug: "camasi", nume: "Cămăși", descriere: "", grup: "dama" },
  { slug: "camasi-in", nume: "Cămăși in", descriere: "", grup: "dama", parinte: "camasi" },
  { slug: "camasi-maneca-scurta", nume: "Cămăși mânecă scurtă", descriere: "", grup: "dama", parinte: "camasi" },
  { slug: "camasi-maneca-lunga", nume: "Cămăși mânecă lungă", descriere: "", grup: "dama", parinte: "camasi" },

  { slug: "geci", nume: "Geci", descriere: "", grup: "dama" },
  { slug: "geci-blugi", nume: "Geci blugi", descriere: "", grup: "dama", parinte: "geci" },
  { slug: "geci-imitatie-piele", nume: "Geci imitație piele", descriere: "", grup: "dama", parinte: "geci" },
  { slug: "geci-subtiri", nume: "Geci subțiri", descriere: "", grup: "dama", parinte: "geci" },
  { slug: "geci-groase", nume: "Geci groase", descriere: "", grup: "dama", parinte: "geci" },
  { slug: "geci-vant", nume: "Geci vânt", descriere: "", grup: "dama", parinte: "geci" },
  { slug: "geci-ski", nume: "Geci ski", descriere: "", grup: "dama", parinte: "geci" },

  { slug: "hanorace", nume: "Hanorace", descriere: "", grup: "dama" },
  { slug: "hanorace-cu-gluga", nume: "Hanorace cu glugă", descriere: "", grup: "dama", parinte: "hanorace" },
  { slug: "hanorace-fara-gluga", nume: "Hanorace fără glugă", descriere: "", grup: "dama", parinte: "hanorace" },

  { slug: "pantaloni", nume: "Pantaloni", descriere: "", grup: "dama" },
  { slug: "pantaloni-scurti", nume: "Pantaloni scurți", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-trening", nume: "Pantaloni trening", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-vant", nume: "Pantaloni vânt", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-fas", nume: "Pantaloni fâș", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-ski", nume: "Pantaloni ski", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-fashion", nume: "Pantaloni fashion", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-vascoza", nume: "Pantaloni vâscoză", descriere: "", grup: "dama", parinte: "pantaloni" },
  { slug: "pantaloni-in", nume: "Pantaloni in", descriere: "", grup: "dama", parinte: "pantaloni" },

  { slug: "pulovere", nume: "Pulovere", descriere: "", grup: "dama" },
  { slug: "pulovere-subtiri", nume: "Pulovere subțiri", descriere: "", grup: "dama", parinte: "pulovere" },
  { slug: "pulovere-groase", nume: "Pulovere groase", descriere: "", grup: "dama", parinte: "pulovere" },

  // fără subcategorii
  { slug: "blugi", nume: "Blugi", descriere: "", grup: "dama" },
  { slug: "colanti", nume: "Colanți", descriere: "", grup: "dama" },
  { slug: "fuste", nume: "Fuste", descriere: "", grup: "dama" },
  { slug: "rochii", nume: "Rochii", descriere: "", grup: "dama" },
  { slug: "sacouri", nume: "Sacouri", descriere: "", grup: "dama" },
  { slug: "tricouri", nume: "Tricouri", descriere: "", grup: "dama" },
  { slug: "maieuri", nume: "Maieuri", descriere: "", grup: "dama" },
  { slug: "paltoane", nume: "Paltoane", descriere: "", grup: "dama" },
  { slug: "haine-munca", nume: "Haine muncă", descriere: "", grup: "dama" },
  { slug: "posete", nume: "Poșete", descriere: "", grup: "dama" },
  { slug: "genti-sport", nume: "Genți sport", descriere: "", grup: "dama" },

  // ================= Accesorii =================
  { slug: "caciuli", nume: "Căciuli", descriere: "", grup: "accesorii" },
  { slug: "esarfe", nume: "Eșarfe", descriere: "", grup: "accesorii" },
  { slug: "fulare", nume: "Fulare", descriere: "", grup: "accesorii" },
  { slug: "manusi", nume: "Mănuși", descriere: "", grup: "accesorii" },
  { slug: "palarii", nume: "Pălării", descriere: "", grup: "accesorii" },
  { slug: "sepci", nume: "Șepci", descriere: "", grup: "accesorii" },
  { slug: "sosete", nume: "Șosete", descriere: "", grup: "accesorii" },

  // ===== Ocazie și bărbați: subcategoriile urmează, când le trimite proprietarul =====
  { slug: "articole-ocazie", nume: "Articole ocazie", descriere: "", grup: "ocazie" },
  { slug: "articole-barbati", nume: "Articole bărbați", descriere: "", grup: "barbati" },
];

export function getCategorie(slug: string) {
  return categorii.find((c) => c.slug === slug);
}

export function getGrup(slug: string) {
  return grupuri.find((g) => g.slug === slug);
}

/** Categoriile mari dintr-un grup (fara subcategorii), in ordinea din lista. */
export function categoriiDinGrup(slugGrup: string): Categorie[] {
  return categorii.filter((c) => c.grup === slugGrup && !c.parinte);
}

/** Subcategoriile unei categorii mari. Lista goala daca n-are. */
export function subcategorii(slugCategorie: string): Categorie[] {
  return categorii.filter((c) => c.parinte === slugCategorie);
}

/** Categoria si toate subcategoriile ei — dupa astea se cauta hainele. */
function slugurileCuTot(slugCategorie: string): string[] {
  return [slugCategorie, ...subcategorii(slugCategorie).map((c) => c.slug)];
}

/** Cate haine de vanzare are un grup, cu tot cu subcategoriile lui. */
export function cateProduseInGrup(lista: Produs[], slugGrup: string): number {
  const ale = new Set(categorii.filter((c) => c.grup === slugGrup).map((c) => c.slug));
  return lista.filter((p) => !p.vandut && ale.has(p.categorie)).length;
}

/**
 * Hainele dintr-o categorie, fara cele deja vandute.
 * La o categorie mare (Geci) intra si hainele din subcategoriile ei (Geci ski).
 * Lista vine din baza de date — vezi lib/depozit.ts.
 */
export function produseDinCategorie<T extends Produs>(lista: T[], slug: string): T[] {
  const ale = new Set(slugurileCuTot(slug));
  return lista.filter((p) => ale.has(p.categorie) && !p.vandut);
}

/** Marimile care chiar exista intr-o categorie, ca sa nu aratam filtre goale. */
export function marimiDinCategorie(lista: Produs[], slug: string): string[] {
  const set = new Set(produseDinCategorie(lista, slug).map((p) => p.marime));
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

export function cautaProduse<T extends Produs>(lista: T[], intrebare: string): T[] {
  const q = normalizeaza(intrebare);
  if (!q) return [];
  const cuvinte = q.split(/\s+/);
  return lista.filter((p) => !p.vandut).filter((p) => {
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
