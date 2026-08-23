import Link from "next/link";
import { categorii, formatLei, grupuri } from "@/lib/shop";
import { toateProdusele } from "@/lib/depozit";

export const metadata = { title: "Administrare" };

export default async function Page() {
  const produse = await toateProdusele();
  const deVanzare = produse.filter((p) => !p.vandut).length;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-principal">Hainele din magazin</h1>
        <Link
          href="/admin/evidenta"
          className="inline-flex min-h-11 items-center rounded-lg border border-linie px-4 text-sm font-medium text-principal transition hover:border-accent"
        >
          Cine ce a făcut
        </Link>
        <Link
          href="/admin/haina/noua"
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-pe-accent transition hover:bg-accent-tare"
        >
          Adaugă o haină
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Cifra numar={produse.length} eticheta="haine în total" />
        <Cifra numar={deVanzare} eticheta="de vânzare acum" />
        <Cifra numar={produse.length - deVanzare} eticheta="vândute" />
        <Cifra numar={categorii.length} eticheta={`categorii, în ${grupuri.length} grupuri`} />
      </div>

      {produse.length === 0 ? (
        <div className="mt-8 rounded-lg border border-linie bg-accent-slab p-6 text-center">
          <p className="text-base font-semibold text-principal">Încă nicio haină</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-secundar">
            {"Magazinul e gol. Apasă „Adaugă o haină”, pune-i o poză, un preț și alege unde intră. Apare pe site imediat."}
          </p>
          <Link
            href="/admin/haina/noua"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-pe-accent transition hover:bg-accent-tare"
          >
            Adaugă prima haină
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-lg border border-linie bg-suprafata">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead className="border-b border-linie text-secundar">
              <tr>
                <th className="px-4 py-3 font-medium">Haina</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Mărime</th>
                <th className="px-4 py-3 font-medium">Preț</th>
                <th className="px-4 py-3 font-medium">Stare</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {produse.map((p) => {
                const cat = categorii.find((c) => c.slug === p.categorie);
                return (
                  <tr key={p.slug} className="border-b border-linie-slaba last:border-0">
                    <td className="px-4 py-3 text-principal">{p.nume}</td>
                    <td className="px-4 py-3 text-secundar">{cat?.nume ?? p.categorie}</td>
                    <td className="px-4 py-3 text-secundar">{p.marime}</td>
                    <td className="px-4 py-3 text-principal">{formatLei(p.pret)}</td>
                    <td className="px-4 py-3">
                      {p.vandut ? (
                        <span className="text-sters">vândută</span>
                      ) : (
                        <span className="text-accent-text">de vânzare</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/haina/${p.slug}`}
                        className="font-medium text-accent-text hover:underline"
                      >
                        Schimbă
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Cifra({ numar, eticheta }: { numar: number; eticheta: string }) {
  return (
    <div className="rounded-lg border border-linie bg-suprafata p-4">
      <div className="text-3xl font-bold text-principal">{numar}</div>
      <div className="mt-1 text-sm text-secundar">{eticheta}</div>
    </div>
  );
}
