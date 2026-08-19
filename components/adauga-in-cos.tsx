"use client";

import { useCos } from "./cos-context";

export function AdaugaInCos({ slug, mare = false }: { slug: string; mare?: boolean }) {
  const { adauga, scoate, contine, incarcat } = useCos();
  const inCos = incarcat && contine(slug);

  const clase = mare
    ? "w-full rounded-lg px-5 py-3 text-base font-semibold"
    : "w-full rounded-md px-3 py-2 text-sm font-medium";

  return (
    <button
      type="button"
      onClick={() => (inCos ? scoate(slug) : adauga(slug))}
      className={`${clase} transition ${
        inCos
          ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
          : "bg-orange-600 text-white hover:bg-orange-700"
      }`}
    >
      {inCos ? "Scoate din coș" : "Adaugă în coș"}
    </button>
  );
}
