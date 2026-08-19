// Cosul, tinut in afara React-ului si citit cu useSyncExternalStore.
// Asa evitam citirea din localStorage direct intr-un efect (React 19 nu o mai vrea).

const CHEIE = "aan-sh-cos";
const GOL: string[] = [];

let articole: string[] = GOL;
let incarcat = false;
const ascultatori = new Set<() => void>();

function anunta() {
  for (const a of ascultatori) a();
}

function incarcaDinBrowser() {
  try {
    const brut = localStorage.getItem(CHEIE);
    articole = brut ? JSON.parse(brut) : GOL;
  } catch {
    articole = GOL;
  }
  incarcat = true;
  anunta();
}

function salveaza() {
  try {
    localStorage.setItem(CHEIE, JSON.stringify(articole));
  } catch {
    // daca browserul blocheaza salvarea, cosul merge oricum in sesiunea curenta
  }
}

export function aboneaza(asculta: () => void) {
  ascultatori.add(asculta);
  if (!incarcat) incarcaDinBrowser();
  return () => {
    ascultatori.delete(asculta);
  };
}

export function citeste() {
  return articole;
}

export function citesteDeLaServer() {
  return GOL;
}

export function esteIncarcat() {
  return incarcat;
}

export function adauga(slug: string) {
  if (articole.includes(slug)) return;
  articole = [...articole, slug];
  salveaza();
  anunta();
}

export function scoate(slug: string) {
  if (!articole.includes(slug)) return;
  articole = articole.filter((s) => s !== slug);
  salveaza();
  anunta();
}

export function goleste() {
  if (articole.length === 0) return;
  articole = GOL;
  salveaza();
  anunta();
}
