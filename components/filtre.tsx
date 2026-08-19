"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SORTARI = [
  { valoare: "noi", eticheta: "Cele mai noi" },
  { valoare: "pret-crescator", eticheta: "Preț: de la mic la mare" },
  { valoare: "pret-descrescator", eticheta: "Preț: de la mare la mic" },
  { valoare: "usoare", eticheta: "Cele mai ușoare" },
];

export function Filtre({ marimi, gasite }: { marimi: string[]; gasite: number }) {
  const router = useRouter();
  const cale = usePathname();
  const parametri = useSearchParams();

  const marimeAleasa = parametri.get("marime");
  const sortareAleasa = parametri.get("sort") ?? "noi";

  const schimba = useCallback(
    (cheie: string, valoare: string | null) => {
      const noi = new URLSearchParams(parametri.toString());
      if (valoare === null) noi.delete(cheie);
      else noi.set(cheie, valoare);
      const sir = noi.toString();
      router.replace(sir ? `${cale}?${sir}` : cale, { scroll: false });
    },
    [parametri, cale, router]
  );

  const areFiltre = marimeAleasa !== null || sortareAleasa !== "noi";

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
      {marimi.length > 1 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">Mărimea</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => schimba("marime", null)}
              className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm transition ${
                marimeAleasa === null
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Toate
            </button>
            {marimi.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => schimba("marime", marimeAleasa === m ? null : m)}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm transition ${
                  marimeAleasa === m
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-stone-600">Aranjează:</span>
          <select
            value={sortareAleasa}
            onChange={(e) => schimba("sort", e.target.value === "noi" ? null : e.target.value)}
            className="min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 outline-none focus:border-orange-500"
          >
            {SORTARI.map((s) => (
              <option key={s.valoare} value={s.valoare}>
                {s.eticheta}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">
            {gasite} {gasite === 1 ? "haină" : "haine"}
          </span>
          {areFiltre && (
            <button
              type="button"
              onClick={() => router.replace(cale, { scroll: false })}
              className="text-sm text-stone-500 underline underline-offset-2 hover:text-orange-700"
            >
              Șterge filtrele
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
