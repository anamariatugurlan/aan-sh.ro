// Face amprenta unei parole de admin, ca s-o poți pune în setările site-ului.
//
// Se rulează așa, în dosarul proiectului (e-mailul contului și numărul lui: 1, 2, 3…):
//     node scripts/parola.mjs anamariatugurlan1@gmail.com 1
//
// Îți cere parola (nu se vede pe ecran, nu se salvează nicăieri, nu rămâne în
// istoricul comenzilor) și îți scrie liniile de pus în setări.
//
// Parametrii de mai jos trebuie să fie aceiași ca în lib/parola.ts.

import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const COST = 16384;
const LUNGIME = 64;

function faceAmprenta(parola) {
  const sare = randomBytes(16);
  const amprenta = scryptSync(parola.normalize("NFKC"), sare, LUNGIME, { N: COST });
  return `scrypt:${COST}:${sare.toString("hex")}:${amprenta.toString("hex")}`;
}

/** Citește o linie fără s-o arate pe ecran. */
function intreabaAscuns(intrebare) {
  return new Promise((gata) => {
    const cititor = createInterface({ input: stdin, output: stdout, terminal: true });
    stdout.write(intrebare);
    const scrieOriginal = stdout.write.bind(stdout);
    stdout.write = (bucata, ...restul) => {
      // cât timp se scrie parola, nu lăsăm ecoul pe ecran
      if (typeof bucata === "string" && !bucata.includes("\n")) return true;
      return scrieOriginal(bucata, ...restul);
    };
    cititor.question("", (raspuns) => {
      stdout.write = scrieOriginal;
      stdout.write("\n");
      cititor.close();
      gata(raspuns);
    });
  });
}

const email = process.argv[2] || "pune-aici@emailul.tau";
const loc = process.argv[3] || "1";

const parola = await intreabaAscuns(`Parola pentru ${email}: `);
if (parola.length < 8) {
  console.error("\nParola e prea scurtă. Pune cel puțin 8 caractere.\n");
  process.exit(1);
}

const dinNou = await intreabaAscuns("Încă o dată, ca să fim siguri: ");
if (parola !== dinNou) {
  console.error("\nCele două parole nu sunt la fel. Ia-o de la capăt.\n");
  process.exit(1);
}

if (/^[0-9]+$/.test(parola) || parola.length < 12) {
  console.warn(
    "\nAtenție: parola e scurtă sau doar din cifre — se ghicește mai ușor.\n" +
      "Merge, dar una mai lungă (o propoziție scurtă) e mult mai sigură.",
  );
}

console.log(`
Gata. Pune liniile astea în setările site-ului
(local: în fișierul .env.local — pe Vercel: Settings -> Environment Variables):

ADMIN_${loc}_EMAIL=${email}
ADMIN_${loc}_PAROLA_HASH=${faceAmprenta(parola)}

Parola în sine nu se salvează nicăieri: din amprenta de mai sus nu se poate reface.
Dacă o uiți, rulezi scriptul din nou și pui alta.

SESIUNE_SECRET se pune o singură dată, pentru tot site-ul. Dacă n-ai unul, ia-l pe ăsta:
SESIUNE_SECRET=${randomBytes(32).toString("base64url")}
(dacă îl schimbi, toți cei conectați acum trebuie să intre din nou)
`);
