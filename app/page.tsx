import Link from "next/link";
import { CardProdus } from "@/components/card-produs";
import { categorii, produse } from "@/lib/shop";

export default function Page() {
  return (
    <>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-600">
            Haine second hand
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            Alegi haina. Prețul îl spune cântarul.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
            Fiecare haină e unicat și are greutatea ei trecută pe site. Plătești la kilogram,
            exact ca în magazin — fără prețuri umflate pe etichetă.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#categorii"
              className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Vezi categoriile
            </Link>
            <Link
              href="/categorie/tricouri"
              className="rounded-lg border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 transition hover:border-stone-400"
            >
              Intră direct în magazin
            </Link>
          </div>
        </div>
      </section>

      <section id="categorii" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Categorii și preț pe kilogram</h2>
        <p className="mt-1 text-stone-600">Prețul pe kilogram e stabilit pe categorie.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorii.map((c) => (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}`}
              className="group rounded-xl border border-stone-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-stone-900 group-hover:text-orange-700">{c.nume}</h3>
                <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
                  {c.leiPeKg} lei/kg
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-600">{c.descriere}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">Adăugate recent</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {produse.slice(0, 8).map((p) => (
            <CardProdus key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
