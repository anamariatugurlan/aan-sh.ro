import Link from "next/link";
import { Poza } from "./poza";
import { AdaugaInCos } from "./adauga-in-cos";
import { formatLei, type Produs } from "@/lib/shop";

export function CardProdus({ p }: { p: Produs }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-linie bg-suprafata transition hover:border-linie hover:shadow-sm">
      <Link href={`/produs/${p.slug}`} className="block">
        <Poza slug={p.slug} nume={p.nume} poze={p.poze} clasa="aspect-[4/5] w-full" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/produs/${p.slug}`} className="block">
          <h3 className="text-sm font-medium leading-snug text-principal group-hover:text-accent-text">
            {p.nume}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 text-xs text-sters">
          <span className="rounded bg-suprafata-slaba px-1.5 py-0.5">mărimea {p.marime}</span>
          <span className="rounded bg-suprafata-slaba px-1.5 py-0.5">{p.stare}</span>
        </div>

        <div className="mt-auto pt-1">
          <span className="text-lg font-bold text-principal">{formatLei(p.pret)}</span>
        </div>

        <AdaugaInCos slug={p.slug} />
      </div>
    </div>
  );
}
