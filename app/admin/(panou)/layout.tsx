import Link from "next/link";
import { redirect } from "next/navigation";
import { adminulCurent } from "@/lib/supabase";
import { iesi } from "../actiuni";

export const metadata = {
  robots: { index: false, follow: false },
};

// Paza adevărată e aici, pe server, nu în proxy: orice pagină pusă în acest
// dosar e închisă automat pentru cine nu e conectat.
export default async function Layout({ children }: LayoutProps<"/admin">) {
  const admin = await adminulCurent();
  if (!admin) redirect("/admin/intrare");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-linie bg-suprafata px-4 py-3">
        <div className="text-sm text-secundar">
          Administrare — conectat ca <span className="font-semibold text-principal">{admin.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-secundar hover:text-accent-text">
            Vezi magazinul
          </Link>
          <form action={iesi}>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center rounded-md bg-suprafata-slaba px-3.5 text-sm font-medium text-principal transition hover:bg-linie"
            >
              Ieși
            </button>
          </form>
        </div>
      </div>

      {children}
    </div>
  );
}
