"use client";

import Link from "next/link";
import { useState } from "react";
import { Poza } from "@/components/poza";
import { useCos } from "@/components/cos-context";
import {
  costTransport,
  formatKg,
  formatLei,
  getProdus,
  leiPeKgPentru,
  pretProdus,
} from "@/lib/shop";

export default function Page() {
  const { articole, scoate, goleste, incarcat } = useCos();
  const [trimisa, setTrimisa] = useState(false);

  const produseInCos = articole.map(getProdus).filter((p) => p !== undefined);
  const grameTotal = produseInCos.reduce((s, p) => s + p.grame, 0);
  const subtotal = produseInCos.reduce((s, p) => s + pretProdus(p), 0);
  const transport = costTransport(grameTotal, subtotal);
  const total = subtotal + transport;

  if (!incarcat) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-stone-500">Se încarcă coșul…</div>;
  }

  if (trimisa) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-stone-900">Comanda a fost trimisă</h1>
        <p className="mt-3 leading-relaxed text-stone-600">
          Te sunăm în cel mai scurt timp ca să confirmăm comanda și adresa de livrare.
          Plata se face ramburs, la curier.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-700"
        >
          Înapoi la magazin
        </Link>
      </div>
    );
  }

  if (produseInCos.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Coșul e gol</h1>
        <p className="mt-3 text-stone-600">Alege câteva haine și revino aici.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Vezi hainele
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Coșul meu</h1>
      <p className="mt-1 text-stone-600">
        {produseInCos.length} {produseInCos.length === 1 ? "haină" : "haine"} — {formatKg(grameTotal)} în total
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {produseInCos.map((p) => (
            <div key={p.slug} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-3">
              <Link href={`/produs/${p.slug}`} className="shrink-0">
                <Poza slug={p.slug} nume={p.nume} clasa="h-24 w-20 rounded-lg" />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link href={`/produs/${p.slug}`} className="font-medium text-stone-900 hover:text-orange-700">
                  {p.nume}
                </Link>
                <div className="mt-1 text-sm text-stone-500">
                  mărimea {p.marime} · {formatKg(p.grame)} × {leiPeKgPentru(p)} lei/kg
                </div>
                <button
                  type="button"
                  onClick={() => scoate(p.slug)}
                  className="mt-auto self-start text-sm text-stone-400 underline underline-offset-2 transition hover:text-red-600"
                >
                  Scoate
                </button>
              </div>

              <div className="shrink-0 text-right text-lg font-bold text-stone-900">
                {formatLei(pretProdus(p))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={goleste}
            className="text-sm text-stone-400 underline underline-offset-2 transition hover:text-red-600"
          >
            Golește coșul
          </button>
        </div>

        <div className="h-fit rounded-2xl border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-stone-900">Totalul comenzii</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Greutate totală</dt>
              <dd className="font-medium text-stone-900">{formatKg(grameTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Haine</dt>
              <dd className="font-medium text-stone-900">{formatLei(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Transport</dt>
              <dd className="font-medium text-stone-900">
                {transport === 0 ? "gratuit" : formatLei(transport)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-lg">
              <dt className="font-bold text-stone-900">Total</dt>
              <dd className="font-bold text-stone-900">{formatLei(total)}</dd>
            </div>
          </dl>

          {subtotal < 300 && (
            <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-800">
              Mai ai {formatLei(300 - subtotal)} până la transport gratuit.
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
              className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Trimite comanda
            </button>
            <p className="text-center text-xs text-stone-500">Plata ramburs, la primirea coletului.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Camp({ nume, eticheta, tip = "text" }: { nume: string; eticheta: string; tip?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-stone-600">{eticheta}</span>
      <input
        name={nume}
        type={tip}
        required
        className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}
