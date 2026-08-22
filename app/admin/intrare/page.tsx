import { redirect } from "next/navigation";
import { FormularIntrare } from "@/components/formular-intrare";
import { ButonInstalare } from "@/components/instaleaza";
import { adminulCurent } from "@/lib/sesiune";

export const metadata = {
  title: "Intrare administrare",
  robots: { index: false, follow: false },
};

export default async function Page() {
  // Dacă e deja conectat, nu are ce căuta pe pagina de intrare.
  if (await adminulCurent()) redirect("/admin");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-principal">Administrare</h1>
      <p className="mt-2 text-sm text-secundar">
        Intră cu e-mailul și parola ta ca să poți schimba hainele din magazin.
      </p>

      <FormularIntrare />

      <ButonInstalare />

      <p className="mt-8 text-xs text-sters">
        Dacă ai uitat parola, ea nu se poate afla — se pune una nouă în setările site-ului.
      </p>
    </div>
  );
}
