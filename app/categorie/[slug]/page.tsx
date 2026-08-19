import Link from "next/link";
import { notFound } from "next/navigation";
import { CardProdus } from "@/components/card-produs";
import { categorii, getCategorie, produseDinCategorie } from "@/lib/shop";

export function generateStaticParams() {
  return categorii.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/categorie/[slug]">) {
  const { slug } = await props.params;
  const cat = getCategorie(slug);
  if (!cat) return {};
  return {
    title: cat.nume,
    description: `${cat.nume} second hand la ${cat.leiPeKg} lei/kg. ${cat.descriere}`,
  };
}

export default async function Page(props: PageProps<"/categorie/[slug]">) {
  const { slug } = await props.params;
  const cat = getCategorie(slug);
  if (!cat) notFound();

  const lista = produseDinCategorie(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">Acasă</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{cat.nume}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">{cat.nume}</h1>
          <p className="mt-1 text-stone-600">{cat.descriere}</p>
        </div>
        <div className="rounded-xl bg-orange-50 px-5 py-3 text-center">
          <div className="text-2xl font-bold text-orange-700">{cat.leiPeKg} lei</div>
          <div className="text-xs font-medium uppercase tracking-wide text-orange-600">pe kilogram</div>
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="py-16 text-center text-stone-500">Nu sunt haine în această categorie deocamdată.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-stone-500">
            {lista.length} {lista.length === 1 ? "haină" : "haine"} — fiecare bucată e unicat
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {lista.map((p) => (
              <CardProdus key={p.slug} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
