import Link from "next/link";
import { CardProdus } from "@/components/card-produs";
import { Cautare } from "@/components/cautare";
import { cautaProduse, categorii } from "@/lib/shop";

export const metadata = { title: "Caută" };

export default async function Page(props: PageProps<"/cauta">) {
  const cautari = await props.searchParams;
  const q = typeof cautari.q === "string" ? cautari.q : "";
  const rezultate = q ? cautaProduse(q) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">Acasă</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">Căutare</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900">Caută o haină</h1>

      <div className="mt-5 max-w-xl">
        <Cautare initial={q} mare />
      </div>

      {q === "" ? (
        <div className="mt-10">
          <p className="text-stone-600">Scrie ce cauți — după nume, marcă, mărime sau categorie.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categorii.map((c) => (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full bg-stone-100 px-4 text-sm text-stone-700 transition hover:bg-stone-200"
              >
                {c.nume}
              </Link>
            ))}
          </div>
        </div>
      ) : rezultate.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-stone-700">Nicio haină pentru „{q}”.</p>
          <p className="mt-2 text-stone-500">Încearcă un cuvânt mai scurt, sau caută pe categorii.</p>
          <Link href="/" className="mt-6 inline-block text-orange-700 underline underline-offset-2">
            Înapoi la magazin
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-stone-500">
            {rezultate.length} {rezultate.length === 1 ? "haină găsită" : "haine găsite"} pentru „{q}”
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {rezultate.map((p) => (
              <CardProdus key={p.slug} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
