# aan-sh.ro — jurnalul proiectului

Magazin online de haine second hand, vândute la kilogram. Site făcut pentru o clientă.
**Proiect complet separat de preturismart.ro**: alt folder, alt domeniu, alt cod, alte
conturi, altă bază de date. Nu au niciun fișier comun.

---

## 2026-08-19 — pornirea proiectului

**Ce s-a stabilit cu proprietarul:**
- magazin online complet (coș, comandă, livrare), nu doar vitrină de prezentare;
- totul se vinde **la kilogram**, inclusiv hainele individuale: clientul alege piesa,
  dar prețul iese din cântar, exact ca în magazin;
- domeniul e **aan-sh.ro** (cu doi de „a"), deja cumpărat, încă fără DNS;
- site-ul se urcă pe domeniu **în mentenanță**, ca să se lucreze la el în liniște.

**Ce s-a făcut:**
- proiect nou Next.js 16.3.1 + Tailwind 4 în `D:\aan-sh.ro`;
- mecanica de preț la kilogram: fiecare haină are greutatea ei, categoria dă lei/kg,
  prețul se calculează singur (`lib/shop.ts`);
- pagini: acasă, categorie, produs, coș;
- coșul adună kilogramele și banii, calculează transportul din greutatea totală,
  are formular de comandă cu plata ramburs;
- coșul e ținut în `localStorage` printr-un magazin extern citit cu `useSyncExternalStore`
  (`lib/cos-store.ts`), ca să nu încalce regulile React 19;
- **mentenanță** în `proxy.ts`: cu `MENTENANTA=1` vizitatorii primesc 503 + „Pregătim
  magazinul" + `noindex`; cine intră cu `?cheie=...` (variabila `CHEIE_ACCES`) primește
  un cookie de 30 de zile și vede site-ul normal.

**Stare: NEPUBLICAT.** Rulează doar local, pe `http://localhost:3100`.
Verificări trecute: `npx tsc --noEmit`, `npx eslint .`, `npm run build` (25 de pagini).

**Datele sunt de probă** — 6 categorii și 14 haine inventate, poze înlocuite cu
dreptunghiuri colorate. Se schimbă când vin datele reale de la clientă.

**Rămâne de aflat de la clientă:** logo, culori, poze reale, linkurile de Facebook /
TikTok / Instagram, categoriile ei reale cu lei/kg, firma și CUI, curierul.

**Cum se dă înapoi:** proiectul e într-un git al lui; `git log` arată pașii,
`git revert <hash>` anulează un pas.
