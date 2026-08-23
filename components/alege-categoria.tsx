"use client";

import { useState } from "react";
import { categorii, grupuri, type Categorie } from "@/lib/shop";

/**
 * Alegerea locului unde intra haina: intai grupul, apoi categoria, apoi — daca are —
 * subcategoria. Haina intra in subcategorie daca s-a ales una, altfel in categoria mare.
 */
export function AlegeCategoria({
  initial,
  laSchimbare,
}: {
  initial?: string;
  laSchimbare: (slug: string) => void;
}) {
  const initiala = initial ? categorii.find((c) => c.slug === initial) : undefined;
  const parintele = initiala?.parinte
    ? categorii.find((c) => c.slug === initiala.parinte)
    : initiala;

  const [grup, setGrup] = useState(parintele?.grup ?? "");
  const [mare, setMare] = useState(parintele?.slug ?? "");
  const [sub, setSub] = useState(initiala?.parinte ? initiala.slug : "");

  const mari: Categorie[] = categorii.filter((c) => c.grup === grup && !c.parinte);
  const subs: Categorie[] = categorii.filter((c) => c.parinte === mare);

  const claseSelect =
    "mt-1.5 block min-h-12 w-full rounded-lg border border-linie bg-fundal px-3 text-base text-principal outline-none focus:border-accent disabled:opacity-50";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor="grup" className="block text-sm font-medium text-principal">
          Grup
        </label>
        <select
          id="grup"
          value={grup}
          onChange={(e) => {
            setGrup(e.target.value);
            setMare("");
            setSub("");
            laSchimbare("");
          }}
          className={claseSelect}
        >
          <option value="">— alege —</option>
          {grupuri.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.nume}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="categorie-mare" className="block text-sm font-medium text-principal">
          Categorie
        </label>
        <select
          id="categorie-mare"
          value={mare}
          disabled={!grup}
          onChange={(e) => {
            setMare(e.target.value);
            setSub("");
            laSchimbare(e.target.value);
          }}
          className={claseSelect}
        >
          <option value="">— alege —</option>
          {mari.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nume}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subcategorie" className="block text-sm font-medium text-principal">
          Subcategorie{" "}
          <span className="font-normal text-sters">
            {mare && subs.length === 0 ? "(nu are)" : "(dacă e cazul)"}
          </span>
        </label>
        <select
          id="subcategorie"
          value={sub}
          disabled={subs.length === 0}
          onChange={(e) => {
            setSub(e.target.value);
            laSchimbare(e.target.value || mare);
          }}
          className={claseSelect}
        >
          <option value="">— toată categoria —</option>
          {subs.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nume}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
