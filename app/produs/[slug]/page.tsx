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
  produseDinCategorie,
} from "@/lib/shop";
import { produsDupaSlug, toateProdusele } from "@/lib/depozit";

export async function generateMetadata(props: PageProps<"/produs/[slug]">) {
  const { slug } = await props.params;
  const p = await produsDupaSlug(slug);
  if (!p) return {};
  return {
    title: p.nume,
    description: `${p.nume}, mărimea ${p.marime}, stare ${p.stare} — ${formatLei(p.pret)}.`,
  };
}

export default async function Page(props: PageProps<"/produs/[slug]">) {
  const { slug } = await props.params;
  const p = await produsDupaSlug(slug);
  if (!p) notFound();

  const cat = getCategorie(p.categorie);
  const altele = produseDinCategorie(await toateProdusele(), p.categorie).filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-sters">
        <Link href="/" className="hover:text-accent-text">Acasă</Link>
        <span className="mx-2">/</span>
        <Link href={`/categorie/${p.categorie}`} className="hover:text-accent-text">{cat?.nume}</Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <Poza slug={p.slug} nume={p.nume} poze={p.poze} clasa="aspect-[4/5] w-full rounded-2xl" />
          {(p.poze?.length ?? 0) > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {p.poze!.slice(1).map((adresa, i) => (
                <Poza
                  key={adresa}
                  slug={p.slug}
                  nume={`${p.nume} — poza ${i + 2}`}
                  poze={[adresa]}
                  clasa="aspect-square w-full rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-principal">{p.nume}</h1>

          <div className="mt-5 text-4xl font-bold text-principal">{formatLei(p.pret)}</div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-suprafata-slaba px-3 py-1.5 text-secundar">mărimea {p.marime}</span>
            <span className="rounded-lg bg-suprafata-slaba px-3 py-1.5 text-secundar">stare {p.stare}</span>
            {p.marca && <span className="rounded-lg bg-suprafata-slaba px-3 py-1.5 text-secundar">{p.marca}</span>}
          </div>

          <div className="mt-6">
            <AdaugaInCos slug={p.slug} mare />
          </div>

          <ul className="mt-6 space-y-2 border-t border-linie pt-5 text-sm text-secundar">
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
          <h2 className="text-xl font-bold tracking-tight text-principal">
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
