"use client";

import Link from "next/link";
import { useCos } from "./cos-context";
import { categorii } from "@/lib/shop";

export function Header() {
  const { articole, incarcat } = useCos();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-stone-900">
          aan<span className="text-orange-600">-sh</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {categorii.map((c) => (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}`}
              className="rounded-md px-2.5 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              {c.nume}
            </Link>
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        <Link
          href="/cos"
          className="relative shrink-0 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          Coș
          {incarcat && articole.length > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-bold text-white">
              {articole.length}
            </span>
          )}
        </Link>
      </div>

      <div className="border-t border-stone-100 md:hidden">
        <div className="flex gap-1 overflow-x-auto px-4 py-2">
          {categorii.map((c) => (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}`}
              className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
            >
              {c.nume}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
