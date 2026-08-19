import Link from "next/link";
import { notFound } from "next/navigation";
import { Poza } from "@/components/poza";
import { AdaugaInCos } from "@/components/adauga-in-cos";
import { CardProdus } from "@/components/card-produs";
import {
  COST_TRANSPORT,
  TRANSPORT_GRATUIT_DE_LA,
  formatLei,
  getCategorie,
  getProdus,
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
    description: `${p.nume}, mărimea ${p.marime}, stare ${p.stare} — ${formatLei(p.pret)}.`,
  };
}

export default async function Page(props: PageProps<"/produs/[slug]">) {
  const { slug } = await props.params;
  const p = getProdus(slug);
  if (!p) notFound();

  const cat = getCategorie(p.categorie);
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

          <div className="mt-5 text-4xl font-bold text-stone-900">{formatLei(p.pret)}</div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">mărimea {p.marime}</span>
            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">stare {p.stare}</span>
            {p.marca && <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-stone-700">{p.marca}</span>}
          </div>

          <div className="mt-6">
            <AdaugaInCos slug={p.slug} mare />
          </div>

          <ul className="mt-6 space-y-2 border-t border-stone-200 pt-5 text-sm text-stone-600">
            <li>Bucată unică — odată vândută, dispare de pe site.</li>
            <li>Plata ramburs, la primirea coletului.</li>
            <li>
              Transport {formatLei(COST_TRANSPORT)}, gratuit peste {formatLei(TRANSPORT_GRATUIT_DE_LA)}.
            </li>
          </ul>
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
