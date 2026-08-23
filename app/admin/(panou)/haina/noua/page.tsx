import Link from "next/link";
import { FormularHaina } from "@/components/formular-haina";

export const metadata = { title: "Adaugă o haină" };

export default function Page() {
  return (
    <div className="mt-8 max-w-3xl">
      <Link href="/admin" className="text-sm text-secundar hover:text-accent-text">
        ← Înapoi la haine
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-principal">Adaugă o haină</h1>
      <p className="mt-2 text-secundar">
        Apare în magazin imediat ce salvezi, în categoria pe care o alegi.
      </p>

      <FormularHaina />
    </div>
  );
}
