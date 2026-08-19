import Link from "next/link";
import { CardProdus } from "@/components/card-produs";
import {
  TRANSPORT_GRATUIT_DE_LA,
  categorii,
  formatLei,
  pretMinimCategorie,
  produseDeVanzare,
} from "@/lib/shop";

export default function Page() {
  return (
    <>
      <section className="border-b border-linie bg-suprafata">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-accent-text">
            Haine second hand
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-principal sm:text-5xl">
            Fiecare haină, una singură.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-secundar">
            Alese bucată cu bucată, cu prețul scris pe ele. Ce vezi în poză e exact haina
            care ajunge la tine — nu mai există a doua la fel.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#categorii"
              className="inline-flex min-h-12 items-center rounded-lg bg-accent px-6 font-semibold text-pe-accent transition hover:bg-accent-tare"
            >
              Vezi categoriile
            </Link>
            <Link
              href="/cauta"
              className="inline-flex min-h-12 items-center rounded-lg border border-linie bg-suprafata px-6 font-semibold text-principal transition hover:border-sters"
            >
              Caută o haină
            </Link>
          </div>

          <p className="mt-6 text-sm text-sters">
            Plata ramburs · Transport gratuit peste {formatLei(TRANSPORT_GRATUIT_DE_LA)}
          </p>
        </div>
      </section>

      <section id="categorii" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-principal">Categorii</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorii.map((c) => {
            const minim = pretMinimCategorie(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="group rounded-xl border border-linie bg-suprafata p-5 transition hover:border-accent hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-principal group-hover:text-accent-text">{c.nume}</h3>
                  {minim !== null && (
                    <span className="shrink-0 rounded-full bg-accent-slab px-3 py-1 text-sm font-bold text-accent-text">
                      de la {minim} lei
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-secundar">{c.descriere}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold tracking-tight text-principal">Adăugate recent</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {produseDeVanzare().slice(0, 8).map((p) => (
            <CardProdus key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
