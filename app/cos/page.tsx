"use client";

import Link from "next/link";
import { useState } from "react";
import { Poza } from "@/components/poza";
import { useCos } from "@/components/cos-context";
import {
  TRANSPORT_GRATUIT_DE_LA,
  costTransport,
  formatLei,
  getProdus,
} from "@/lib/shop";

export default function Page() {
  const { articole, scoate, goleste, incarcat } = useCos();
  const [trimisa, setTrimisa] = useState(false);

  const produseInCos = articole.map(getProdus).filter((p) => p !== undefined);
  const subtotal = produseInCos.reduce((s, p) => s + p.pret, 0);
  const transport = costTransport(subtotal);
  const total = subtotal + transport;

  if (!incarcat) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-sters">Se încarcă coșul…</div>;
  }

  if (trimisa) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-slab text-3xl">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-principal">Comanda a fost trimisă</h1>
        <p className="mt-3 leading-relaxed text-secundar">
          Te sunăm în cel mai scurt timp ca să confirmăm comanda și adresa de livrare.
          Plata se face ramburs, la curier.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-contrast px-6 py-3 font-semibold text-pe-contrast transition hover:bg-contrast/85"
        >
          Înapoi la magazin
        </Link>
      </div>
    );
  }

  if (produseInCos.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-principal">Coșul e gol</h1>
        <p className="mt-3 text-secundar">Alege câteva haine și revino aici.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-pe-accent transition hover:bg-accent-tare"
        >
          Vezi hainele
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-principal">Coșul meu</h1>
      <p className="mt-1 text-secundar">
        {produseInCos.length} {produseInCos.length === 1 ? "haină" : "haine"}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {produseInCos.map((p) => (
            <div key={p.slug} className="flex gap-4 rounded-xl border border-linie bg-suprafata p-3">
              <Link href={`/produs/${p.slug}`} className="shrink-0">
                <Poza slug={p.slug} nume={p.nume} clasa="h-24 w-20 rounded-lg" />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link href={`/produs/${p.slug}`} className="font-medium text-principal hover:text-accent-text">
                  {p.nume}
                </Link>
                <div className="mt-1 text-sm text-sters">
                  mărimea {p.marime} · {p.stare}
                </div>
                <button
                  type="button"
                  onClick={() => scoate(p.slug)}
                  className="mt-auto self-start text-sm text-sters underline underline-offset-2 transition hover:text-pericol"
                >
                  Scoate
                </button>
              </div>

              <div className="shrink-0 text-right text-lg font-bold text-principal">
                {formatLei(p.pret)}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={goleste}
            className="text-sm text-sters underline underline-offset-2 transition hover:text-pericol"
          >
            Golește coșul
          </button>
        </div>

        <div className="h-fit rounded-2xl border border-linie bg-suprafata p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-principal">Totalul comenzii</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-secundar">Haine</dt>
              <dd className="font-medium text-principal">{formatLei(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secundar">Transport</dt>
              <dd className="font-medium text-principal">
                {transport === 0 ? "gratuit" : formatLei(transport)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-linie pt-3 text-lg">
              <dt className="font-bold text-principal">Total</dt>
              <dd className="font-bold text-principal">{formatLei(total)}</dd>
            </div>
          </dl>

          {subtotal < TRANSPORT_GRATUIT_DE_LA && (
            <p className="mt-3 rounded-lg bg-accent-slab px-3 py-2 text-xs text-accent-text">
              Mai ai {formatLei(TRANSPORT_GRATUIT_DE_LA - subtotal)} până la transport gratuit.
            </p>
          )}

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setTrimisa(true);
              goleste();
            }}
          >
            <Camp nume="nume" eticheta="Nume și prenume" />
            <Camp nume="telefon" eticheta="Telefon" tip="tel" />
            <Camp nume="localitate" eticheta="Localitate" />
            <Camp nume="adresa" eticheta="Adresa" />

            <button
              type="submit"
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-5 font-semibold text-pe-accent transition hover:bg-accent-tare"
            >
              Trimite comanda
            </button>
            <p className="text-center text-xs text-sters">Plata ramburs, la primirea coletului.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Camp({ nume, eticheta, tip = "text" }: { nume: string; eticheta: string; tip?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-secundar">{eticheta}</span>
      <input
        name={nume}
        type={tip}
        required
        className="mt-1 min-h-11 w-full rounded-lg border border-linie px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-slab"
      />
    </label>
  );
}
