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

---

## 2026-08-19 — codul urcat pe GitHub

Depózit: **https://github.com/anamariatugurlan/aan-sh.ro** — cont nou, al clientei,
depózit privat. Contul proprietarului (`littledemo2402`) nu are acces acolo și nici
nu-i trebuie; sunt două sertare separate în locuri diferite.

La prima încercare, calculatorul a folosit automat parola contului vechi și GitHub a
refuzat-o. S-a rezolvat punând numele contului în adresa depózitului
(`https://anamariatugurlan@github.com/...`), ca parola veche să rămână neatinsă pentru
preturismart.ro. Conectarea propriu-zisă a făcut-o proprietarul, dintr-un terminal
al lui — eu nu introduc parole.

**Stare: URCAT pe GitHub, dar NEPUBLICAT pe internet.** Nu există încă găzduire, iar
domeniul aan-sh.ro nu arată spre nimic. Nimeni din afară nu poate vedea site-ul.

**Urmează:** cont Vercel prin GitHub-ul clientei, importat depózitul, puse variabilele
`MENTENANTA=1` și `CHEIE_ACCES`, apoi două înregistrări DNS la Hostico.

---

## 2026-08-19 — site-ul urcat pe Vercel, în mentenanță

Cont Vercel nou, făcut prin GitHub-ul clientei. Echipa **aan**, plan **Hobby** (gratuit),
proiectul **aan-sh-ro**. Vercel a recunoscut singur Next.js.

Puse la Environment Variables, înainte de prima publicare:
- `MENTENANTA=1`
- `CHEIE_ACCES` — cuvânt ales de proprietar, pe care nu-l știu și nu-mi trebuie

Adresa: **https://aan-sh-ro.vercel.app**

Verificat din afară, nu doar pe ecranul lui:
- cod de răspuns **503**, cu `X-Robots-Tag: noindex, nofollow` și `Retry-After: 3600`
- conținut: „Pregătim magazinul"

Deci site-ul e viu, dar închis pentru public, iar Google nu-l înregistrează.
Cine are cheia intră normal, prin `/?cheie=...`.

**Stare: PUBLICAT pe adresa Vercel, dar ÎNCHIS cu mentenanță.** Domeniul aan-sh.ro
încă nu e legat.

**Urmează:** Add Domain în Vercel pentru aan-sh.ro, apoi cele două înregistrări la Hostico
(serverele de nume rămân la Hostico, ca la preturismart.ro — se adaugă doar un A la domeniul
gol și un CNAME la www; valorile le dă Vercel, sunt diferite de la un proiect la altul).

**Cum se dă înapoi:** în Vercel, Deployments → versiunea anterioară → Promote to Production.
Ca să se deschidă magazinul: se șterge `MENTENANTA` sau se pune pe 0, apoi Redeploy.

---

## 2026-08-19 — domeniul legat la Hostico

Domeniul `aan-sh.ro` a fost înregistrat chiar azi la Hostico (expiră 2027-08-19).
Serverele de nume rămân la Hostico — s-a luat decizia asta după ce s-a văzut că domeniul
are deja email configurat (`MX` → `mail.aan-sh.ro`). Dacă se mutau serverele la Vercel,
emailul s-ar fi rupt.

Adăugat în editorul „Hostico DNS", verificat direct pe `nsc.hostico.ro`:

    aan-sh.ro        A      216.198.79.1                          <- de la Vercel
    www.aan-sh.ro    CNAME  0abcaa89bff2a87f.vercel-dns-017.com   <- de la Vercel
    aan-sh.ro        MX     mail.aan-sh.ro                        <- neatins
    mail.aan-sh.ro   CNAME  aan-sh.ro                             <- neatins

Vercel a pus `www.aan-sh.ro` ca adresă principală, iar `aan-sh.ro` gol trimite spre ea
printr-o redirecționare 308 — la fel ca la preturismart.ro.

Pe drum: valoarea numerică a ajuns întâi din greșeală pe rândul `www`, ca înregistrare A.
S-a corectat — numărul merge la domeniul gol, șirul lung merge la www.

**Stare la ora scrierii:** zona e corectă, dar domeniul încă nu e vizibil din exteriorul
Hostico (înregistrat azi, propagarea `.ro` ia câteva ore). Deci `aan-sh.ro` nu răspunde încă.
Nu e nimic de reparat, doar de așteptat: Vercel trece singur pe „Valid Configuration"
și emite singur certificatul.

Magazinul merge între timp pe **https://aan-sh-ro.vercel.app**, în mentenanță.

---

## 2026-08-19 — căutare, filtre, starea „vândut"

Adăugat în magazin, fără să fie nevoie de bază de date:

- **căutare** (`/cauta`) — după nume, marcă, mărime sau categorie. Textul e normalizat,
  deci „camasa" găsește „Cămașă". Zero rezultate primesc mesaj, nu pagină goală.
- **filtre pe mărime** în fiecare categorie, arătând doar mărimile care chiar există acolo.
  Mărimile se aranjează firesc: XS, S, M, L, XL, apoi cele numerice.
- **aranjare** — preț crescător, preț descrescător, cele mai ușoare.
- **starea „vândut"** — o haină marcată vândută dispare din magazin și din căutare,
  fără s-o ștergi. Contează la haine unicat.
- căsuță de căutare în bara de sus, pe telefon și pe calculator.

Filtrele se țin în adresa paginii, deci un link filtrat se poate trimite pe WhatsApp
și se deschide la fel la celălalt.

Verificat prin cereri reale către server: Tricouri 3 haine → filtrat pe M rămâne 1;
Cămăși 2 → 1 după ce una e vândută; „camasa" fără diacritice găsește „Cămașă";
aranjarea după preț dă 25, 41 crescător și 41, 25 descrescător.

De reținut pentru Next 16: după ce adaugi o pagină nouă, tipurile de rute nu se regenerează
singure. Se rulează `npx next typegen`, altfel `tsc` se plânge de ruta nouă.

**Stare: NEPUBLICAT** — lucrat local, urcat pe GitHub. Site-ul e tot în mentenanță.
