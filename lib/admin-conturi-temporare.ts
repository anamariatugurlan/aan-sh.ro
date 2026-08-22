// ⚠ TEMPORAR — de mutat în setările găzduirii înainte de deschiderea magazinului.
//
// De ce e aici: proiectul de pe Vercel stă pe contul clientei, la care nu s-a putut
// ajunge ca să se pună setările. Ca să se poată intra în administrare de pe telefon,
// lista conturilor stă deocamdată în cod (decizie a proprietarului, 22 august 2026).
//
// Ce înseamnă asta: cine are acces la depózit (proprietarul și clienta) vede amprentele
// parolelor și cheia de sesiune. Parolele NU se pot citi din amprente, dar o parolă
// scurtă s-ar putea ghici pe îndelete, iar cu cheia de sesiune s-ar putea fabrica o
// intrare. Depózitul e privat și magazinul n-are încă date de clienți.
//
// CUM SE SCAPĂ DE FIȘIERUL ĂSTA, când se ajunge la setările de pe Vercel:
//   1. Settings → Environment Variables: ADMIN_1_EMAIL, ADMIN_1_PAROLA_HASH,
//      ADMIN_2_..., ADMIN_3_..., SESIUNE_SECRET (valorile sunt în `.env.local`).
//   2. Redeploy.
//   3. Se șterge fișierul ăsta și cele două locuri care îl folosesc
//      (`lib/admin-cont.ts` și `lib/sesiune.ts`).
// Setările au ÎNTOTDEAUNA prioritate: de îndată ce există acolo, ce e aici nu se
// mai citește deloc. Deci pasul 1 se poate face oricând, fără grabă.

export type ContTemporar = { email: string; amprenta: string };

export const CONTURI_TEMPORARE: ContTemporar[] = [
  {
    email: "anamariatugurlan1@gmail.com",
    amprenta:
      "scrypt:16384:6edcb3d0c6069f550740e63ea3de7bc7:8e4daed187b52bf0ec3a1d9b19c3fd0bbd00e3d9a630e58717f5f1268e8044abdcd7c64d3fcb29dfba3b3affdf0c1b246ee558658d0ad394409cb51829fc08c5",
  },
  {
    email: "little.demo.uk@gmail.com",
    amprenta:
      "scrypt:16384:576d1737f14ec8cd0dc4e6026dbe5261:2c6871c93f4c681146e647fb0fc2d6f535d45aec98031d2d6ffc53b16d397f06604f681a2d08b6dea2a3f5ad80444dc42b77d6c0d2de0473a3bf91a6b682640e",
  },
  {
    email: "gabipopecu76@gmail.com",
    amprenta:
      "scrypt:16384:67f88eff0e7689a3260de58d0168c8e7:5906a4dfc7d4f49f482bbc0c6d3091952a06a9d7feee19b8cf79b3691b4cbb1f37db75c56945dcace0c63f17468f41622fa90958ce53e8550823e7959eb7fa8b",
  },
];

/** Cheia cu care se semnează sesiunile, cât timp nu există SESIUNE_SECRET în setări. */
export const SECRET_TEMPORAR = "NNgeK2jFv-ZAkTXgBRwzWQtYyX8bjVGDLpV8ehSnfdo";
