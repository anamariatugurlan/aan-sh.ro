import Link from "next/link";
import { formatLei, grupuri, categorii } from "@/lib/shop";
import { depozitulELegat, toateProdusele } from "@/lib/depozit";

export const metadata = { title: "Administrare" };

export default async function Page() {
  const legat = depozitulELegat();
  const produse = await toateProdusele();
  const deVanzare = produse.filter((p) => !p.vandut).length;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-principal">Panou de administrare</h1>
        {legat && (
          <Link
            href="/admin/produse/nou"
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-pe-accent transition hover:bg-accent-tare"
          >
            Adaugă o haină
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Cifra numar={produse.length} eticheta="haine în total" />
        <Cifra numar={deVanzare} eticheta="de vânzare acum" />
        <Cifra numar={produse.length - deVanzare} eticheta="vândute" />
        <Cifra numar={categorii.length} eticheta={`categorii, în ${grupuri.length} grupuri`} />
      </div>

      {!legat && <CumSeLeaga />}

      <div className="mt-8 overflow-x-auto rounded-lg border border-linie bg-suprafata">
        <table className="w-full min-w-2xl text-left text-sm">
          <thead className="border-b border-linie text-secundar">
            <tr>
              <th className="px-4 py-3 font-medium">Haina</th>
              <th className="px-4 py-3 font-medium">Categorie</th>
              <th className="px-4 py-3 font-medium">Mărime</th>
              <th className="px-4 py-3 font-medium">Preț</th>
              <th className="px-4 py-3 font-medium">Stare</th>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function CumSeLeaga() {
  return (
    <div className="mt-8 rounded-lg border border-linie bg-accent-slab p-5 text-sm text-secundar">
      <p className="text-base font-semibold text-principal">
        Ca să poți adăuga haine, mai lipsește un pas
      </p>
      <p className="mt-2 leading-relaxed">
        Hainele de mai jos sunt cele de probă, scrise în cod — de aceea nu se pot încă
        adăuga sau șterge de aici. E nevoie de o bază de date, care ține hainele și pozele.
        Se face o singură dată, e gratuită, și durează câteva minute:
      </p>
      <ol className="mt-4 space-y-2 leading-relaxed">
        <li>
          <span className="font-semibold text-principal">1.</span> Pe{" "}
          <span className="font-medium text-principal">supabase.com</span> faci un proiect
          nou, numit <span className="font-medium text-principal">aan-sh</span>, regiunea
          Frankfurt.
        </li>
        <li>
          <span className="font-semibold text-principal">2.</span> În{" "}
          <span className="font-medium text-principal">SQL Editor</span> lipești fișierul{" "}
          <span className="font-medium text-principal">baza-de-date.sql</span> din proiect
          și apeși Run.
        </li>
        <li>
          <span className="font-semibold text-principal">3.</span> În{" "}
          <span className="font-medium text-principal">Authentication → Users</span> adaugi
          cele trei e-mailuri de admin.
        </li>
        <li>
          <span className="font-semibold text-principal">4.</span> Din{" "}
          <span className="font-medium text-principal">Settings → API</span> trimiți
          {" „Project URL” și cheia „anon public”."}
        </li>
      </ol>
      <p className="mt-4 leading-relaxed">
        După pasul 4, butonul <span className="font-medium text-principal">Adaugă o haină</span>{" "}
        apare aici singur.
      </p>
    </div>
  );
}
