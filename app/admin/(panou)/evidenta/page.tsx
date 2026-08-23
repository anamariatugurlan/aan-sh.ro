import Link from "next/link";
import { candScris, evidentaEPornita, socoteala, ultimeleFapte } from "@/lib/jurnal";

export const metadata = { title: "Cine ce a făcut" };

export default async function Page() {
  const pornita = await evidentaEPornita();

  if (!pornita) {
    return (
      <div className="mt-8 max-w-2xl">
        <Link href="/admin" className="text-sm text-secundar hover:text-accent-text">
          ← Înapoi la haine
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-principal">Cine ce a făcut</h1>
        <div className="mt-6 rounded-lg border border-linie bg-accent-slab p-5 text-sm leading-relaxed text-secundar">
          <p className="text-base font-semibold text-principal">Evidența nu e pornită încă</p>
          <p className="mt-2">
            Se pornește o singură dată, ca și baza de date: în Supabase → SQL Editor →
            lipești fișierul <span className="font-medium text-principal">contorizare.sql</span>{" "}
            din proiect → Run.
          </p>
          <p className="mt-2">
            După aceea, baza de date scrie singură cine ce a făcut cu hainele. Se numără de
            atunci încolo — ce a fost înainte n-are cum să fie știut.
          </p>
        </div>
      </div>
    );
  }

  const pe = await socoteala();
  const fapte = await ultimeleFapte(25);

  return (
    <div className="mt-8">
      <Link href="/admin" className="text-sm text-secundar hover:text-accent-text">
        ← Înapoi la haine
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-principal">Cine ce a făcut</h1>
      <p className="mt-2 text-secundar">
        Scrisă de baza de date, nu de site. Nu se poate schimba și nu se poate șterge de aici.
      </p>

      {pe.length === 0 ? (
        <p className="mt-8 rounded-lg border border-linie bg-suprafata p-6 text-center text-sters">
          Încă n-a făcut nimeni nimic. Adaugă o haină și apare aici.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-linie bg-suprafata">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead className="border-b border-linie text-secundar">
              <tr>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium">Puse</th>
                <th className="px-4 py-3 font-medium">Schimbate</th>
                <th className="px-4 py-3 font-medium">Șterse</th>
                <th className="px-4 py-3 font-medium">Ultima dată</th>
              </tr>
            </thead>
            <tbody>
              {pe.map((a) => (
                <tr key={a.cine} className="border-b border-linie-slaba last:border-0">
                  <td className="px-4 py-3 font-medium text-principal">{a.cine}</td>
                  <td className="px-4 py-3 text-accent-text">{a.adaugate}</td>
                  <td className="px-4 py-3 text-secundar">{a.schimbate}</td>
                  <td className="px-4 py-3 text-secundar">{a.sterse}</td>
                  <td className="px-4 py-3 text-sters">{a.ultima ? candScris(a.ultima) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fapte.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold tracking-tight text-principal">
            Ultimele mișcări
          </h2>
          <ul className="mt-4 space-y-2">
            {fapte.map((f, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline gap-x-2 rounded-lg border border-linie bg-suprafata px-4 py-3 text-sm"
              >
                <span className="font-medium text-principal">{f.cine}</span>
                <span className={f.fapta === "sters" ? "text-pericol" : "text-accent-text"}>
                  a {f.fapta}
                </span>
                <span className="text-secundar">{f.produs_nume ?? "o haină"}</span>
                <span className="ml-auto text-sters">{candScris(f.cand)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
