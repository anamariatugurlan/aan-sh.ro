"use client";

import { useActionState } from "react";
import { intra, type StareIntrare } from "@/app/admin/actiuni";

const gol: StareIntrare = {};

export function FormularIntrare() {
  const [stare, actiune, inAsteptare] = useActionState(intra, gol);

  return (
    <form action={actiune} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-principal">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          defaultValue={stare.email ?? ""}
          className="mt-1.5 block min-h-12 w-full rounded-lg border border-linie bg-fundal px-3.5 text-base text-principal outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="parola" className="block text-sm font-medium text-principal">
          Parolă
        </label>
        <input
          id="parola"
          name="parola"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 block min-h-12 w-full rounded-lg border border-linie bg-fundal px-3.5 text-base text-principal outline-none focus:border-accent"
        />
      </div>

      {stare.eroare && (
        <p role="alert" className="rounded-lg bg-accent-slab px-3.5 py-3 text-sm text-pericol">
          {stare.eroare}
        </p>
      )}

      <button
        type="submit"
        disabled={inAsteptare}
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-5 text-base font-semibold text-pe-accent transition hover:bg-accent-tare disabled:opacity-60"
      >
        {inAsteptare ? "Se verifică…" : "Intră"}
      </button>
    </form>
  );
}
