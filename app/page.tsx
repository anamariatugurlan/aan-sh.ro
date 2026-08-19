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
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-600">
            Haine second hand
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            Fiecare haină, una singură.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
            Alese bucată cu bucată, cu prețul scris pe ele. Ce vezi în poză e exact haina
            care ajunge la tine — nu mai există a doua la fel.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#categorii"
              className="inline-flex min-h-12 items-center rounded-lg bg-orange-600 px-6 font-semibold text-white transition hover:bg-orange-700"
            >
              Vezi categoriile
            </Link>
            <Link
              href="/cauta"
              className="inline-flex min-h-12 items-center rounded-lg border border-stone-300 bg-white px-6 font-semibold text-stone-800 transition hover:border-stone-400"
            >
              Caută o haină
            </Link>
          </div>

          <p className="mt-6 text-sm text-stone-500">
            Plata ramburs · Transport gratuit peste {formatLei(TRANSPORT_GRATUIT_DE_LA)}
          </p>
        </div>
      </section>

      <section id="categorii" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Categorii</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorii.map((c) => {
            const minim = pretMinimCategorie(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-stone-900 group-hover:text-orange-700">{c.nume}</h3>
                  {minim !== null && (
                    <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
                      de la {minim} lei
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-stone-600">{c.descriere}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Adăugate recent</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {produseDeVanzare().slice(0, 8).map((p) => (
            <CardProdus key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
