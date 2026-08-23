"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dinBrowser } from "@/lib/supabase-browser";

export function FormularIntrare() {
  const router = useRouter();
  const [eroare, setEroare] = useState<string | null>(null);
  const [inAsteptare, setInAsteptare] = useState(false);

  async function intra(date: FormData) {
    setEroare(null);
    setInAsteptare(true);

    const email = String(date.get("email") ?? "").trim();
    const parola = String(date.get("parola") ?? "");

    if (!email || !parola) {
      setEroare("Scrie și e-mailul, și parola.");
      setInAsteptare(false);
      return;
    }

    const { error } = await dinBrowser().auth.signInWithPassword({ email, password: parola });

    if (error) {
      // mesajele Supabase sunt in engleza; le traducem pe cele obisnuite
      const m = error.message.toLowerCase();
      setEroare(
        m.includes("invalid login")
          ? "E-mailul sau parola nu sunt bune."
          : m.includes("email not confirmed")
            ? "Contul nu e confirmat. Bifează „Auto Confirm User” în Supabase."
            : "Nu am putut intra: " + error.message,
      );
      setInAsteptare(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  const claseCamp =
    "mt-1.5 block min-h-12 w-full rounded-lg border border-linie bg-fundal px-3.5 text-base text-principal outline-none focus:border-accent";

  return (
    <form action={intra} className="mt-6 space-y-4">
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
          className={claseCamp}
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
          className={claseCamp}
        />
      </div>

      {eroare && (
        <p role="alert" className="rounded-lg bg-accent-slab px-3.5 py-3 text-sm text-pericol">
          {eroare}
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
