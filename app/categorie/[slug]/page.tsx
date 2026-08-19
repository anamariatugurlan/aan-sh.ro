import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardProdus } from "@/components/card-produs";
import { Filtre } from "@/components/filtre";
import {
  categorii,
  getCategorie,
  marimiDinCategorie,
  produseDinCategorie,
  sorteaza,
  type Sortare,
} from "@/lib/shop";

export function generateStaticParams() {
  return categorii.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/categorie/[slug]">) {
  const { slug } = await props.params;
  const cat = getCategorie(slug);
  if (!cat) return {};
  return {
    title: cat.nume,
    description: `${cat.nume} second hand, bucatÄ cu bucatÄ. ${cat.descriere}`,
  };
}

export default async function Page(props: PageProps<"/categorie/[slug]">) {
  const { slug } = await props.params;
  const cat = getCategorie(slug);
  if (!cat) notFound();

  const cautari = await props.searchParams;
  const marimeCeruta = typeof cautari.marime === "string" ? cautari.marime : null;
  const sortare = (typeof cautari.sort === "string" ? cautari.sort : "noi") as Sortare;

  const toate = produseDinCategorie(slug);
  const marimi = marimiDinCategorie(slug);
  const filtrate = marimeCeruta ? toate.filter((p) => p.marime === marimeCeruta) : toate;
  const lista = sorteaza(filtrate, sortare);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-sters">
        <Link href="/" className="hover:text-accent-text">Acasă</Link>
        <span className="mx-2">/</span>
        <span className="text-secundar">{cat.nume}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-linie pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-principal">{cat.nume}</h1>
          <p className="mt-1 text-secundar">{cat.descriere}</p>
        </div>
      </div>

      {toate.length === 0 ? (
        <p className="py-16 text-center text-sters">Nu sunt haine în această categorie deocamdată.</p>
      ) : (
        <>
          <Suspense fallback={<div className="mt-6 h-32 rounded-xl border border-linie bg-suprafata" />}>
            <Filtre marimi={marimi} gasite={lista.length} />
          </Suspense>

          {lista.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-secundar">Nicio haină pe mărimea asta.</p>
              <Link href={`/categorie/${slug}`} className="mt-2 inline-block text-accent-text underline underline-offset-2">
                Vezi toate mărimile
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {lista.map((p) => (
                <CardProdus key={p.slug} p={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
