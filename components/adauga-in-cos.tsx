"use client";

import { useCos } from "./cos-context";

export function AdaugaInCos({ slug, mare = false }: { slug: string; mare?: boolean }) {
  const { adauga, scoate, contine, incarcat } = useCos();
  const inCos = incarcat && contine(slug);

  const clase = mare
    ? "flex min-h-12 w-full items-center justify-center rounded-lg px-5 py-3 text-base font-semibold"
    : "flex min-h-11 w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-medium";

  return (
    <button
      type="button"
      onClick={() => (inCos ? scoate(slug) : adauga(slug))}
      className={`${clase} transition ${
        inCos
          ? "bg-linie text-secundar hover:bg-linie"
          : "bg-accent text-pe-accent hover:bg-accent-tare"
      }`}
    >
      {inCos ? "Scoate din coș" : "Adaugă în coș"}
    </button>
  );
}
