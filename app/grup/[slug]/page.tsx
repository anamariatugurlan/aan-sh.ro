import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoriiDinGrup,
  getGrup,
  grupuri,
  pretMinimCategorie,
  produseDinCategorie,
  subcategorii,
} from "@/lib/shop";

export function generateStaticParams() {
  return grupuri.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/grup/[slug]">) {
  const { slug } = await props.params;
  const g = getGrup(slug);
  if (!g) return {};
  return { title: g.nume, description: g.descriere };
}

export default async function Page(props: PageProps<"/grup/[slug]">) {
  const { slug } = await props.params;
  const grup = getGrup(slug);
  if (!grup) notFound();

  const mari = categoriiDinGrup(grup.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-sters">
        <Link href="/" className="hover:text-accent-text">Acasă</Link>
        <span className="mx-2">/</span>
        <span className="text-secundar">{grup.nume}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-principal">{grup.nume}</h1>
      <p className="mt-2 text-secundar">{grup.descriere}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mari.map((c) => {
          const copii = subcategorii(c.slug);
          const minim = pretMinimCategorie(c.slug);
          const cate = produseDinCategorie(c.slug).length;

          return (
            <div
              key={c.slug}
              className="rounded-xl border border-linie bg-suprafata p-5 transition hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/categorie/${c.slug}`}
                  className="font-semibold text-principal hover:text-accent-text"
                >
                  {c.nume}
                </Link>
                {minim !== null && (
                  <span className="shrink-0 rounded-full bg-accent-slab px-3 py-1 text-sm font-bold text-accent-text">
                    de la {minim} lei
                  </span>
                )}
              </div>

              {copii.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {copii.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/categorie/${s.slug}`}
                        className="text-sm text-secundar hover:text-accent-text"
                      >
                        {s.nume}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-sters">
                  {cate === 0 ? "Încă nicio haină aici." : `${cate} ${cate === 1 ? "haină" : "haine"}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {mari.length === 0 && (
        <p className="mt-8 text-secundar">Categoriile pentru grupul ăsta urmează.</p>
      )}
    </div>
  );
}
