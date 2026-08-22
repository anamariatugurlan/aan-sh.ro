import { formatLei, produse } from "@/lib/shop";

export const metadata = { title: "Administrare" };

export default function Page() {
  const deVanzare = produse.filter((p) => !p.vandut).length;

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold tracking-tight text-principal">Panou de administrare</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-linie bg-suprafata p-4">
          <div className="text-3xl font-bold text-principal">{produse.length}</div>
          <div className="mt-1 text-sm text-secundar">haine în total</div>
        </div>
        <div className="rounded-lg border border-linie bg-suprafata p-4">
          <div className="text-3xl font-bold text-principal">{deVanzare}</div>
          <div className="mt-1 text-sm text-secundar">de vânzare acum</div>
        </div>
        <div className="rounded-lg border border-linie bg-suprafata p-4">
          <div className="text-3xl font-bold text-principal">{produse.length - deVanzare}</div>
          <div className="mt-1 text-sm text-secundar">vândute</div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-linie bg-accent-slab p-4 text-sm text-secundar">
        <p className="font-semibold text-principal">Ce urmează</p>
        <p className="mt-1.5 leading-relaxed">
          Deocamdată hainele se văd doar, nu se pot adăuga sau șterge de aici: sunt scrise
          în cod, nu într-o bază de date. Adăugarea, pozele și ștergerea vin odată cu baza
          de date. Contul și intrarea în administrare merg deja — pe ele se sprijină restul.
        </p>
      </div>

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
            {produse.map((p) => (
              <tr key={p.slug} className="border-b border-linie-slaba last:border-0">
                <td className="px-4 py-3 text-principal">{p.nume}</td>
                <td className="px-4 py-3 text-secundar">{p.categorie}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
