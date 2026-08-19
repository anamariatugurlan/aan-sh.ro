import Link from "next/link";
import { notFound } from "next/navigation";
import { Poza } from "@/components/poza";
import { AdaugaInCos } from "@/components/adauga-in-cos";
import { CardProdus } from "@/components/card-produs";
import {
  formatKg,
  formatLei,
  getCategorie,
  getProdus,
  leiPeKgPentru,
  pretProdus,
  produse,
  produseDinCategorie,
} from "@/lib/shop";

export function generateStaticParams() {
  return produse.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/produs/[slug]">) {
  const { slug } = await props.params;
  const p = getProdus(slug);
  if (!p) return {};
  return {
    title: p.nume,
    description: `${p.nume}, mărimea ${p.marime}, ${formatKg(p.grame)} — ${formatLei(pretProdus(p))}.`,
  };
}

export default async function Page(props: PageProps<"/produs/[slug]">) {
  const { slug } = await props.params;
  const p = getProdus(slug);
  if (!p) notFound();

  const cat = getCategorie(p.categorie);
  const pret = pretProdus(p);
  const altele = produseDinCategorie(p.categorie).filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">Acasă</Link>
        <span className="mx-2">/</span>
        <Link href={`/categorie/${p.categorie}`} className="hover:text-orange-700">{cat?.nume}</Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <Poza slug={p.slug} nume={p.nume} clasa="aspect-[4/5] w-full rounded-2xl" />

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">{p.nume}</h1>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">mărimea {p.marime}</span>
            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">stare {p.stare}</span>
            {p.marca && <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">{p.marca}</span>}
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="text-4xl font-bold text-stone-900">{formatLei(pret)}</div>

            <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Greutate cântărită</span>
                <span className="font-medium text-stone-900">{formatKg(p.grame)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Preț la {cat?.nume.toLowerCase()}</span>
                <span className="font-medium text-stone-900">{leiPeKgPentru(p)} lei/kg</span>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-2">
                <span className="text-stone-600">Calcul</span>
                <span className="font-medium text-stone-900">
                  {formatKg(p.grame)} × {leiPeKgPentru(p)} lei = {formatLei(pret)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <AdaugaInCos slug={p.slug} mare />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            Haina asta e bucată unică. Odată vândută, dispare de pe site — nu mai există a doua la fel.
          </p>
        </div>
      </div>

      {altele.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Alte {cat?.nume.toLowerCase()}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {altele.map((x) => (
              <CardProdus key={x.slug} p={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
