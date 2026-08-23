import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularHaina } from "@/components/formular-haina";
import { produsDupaSlug } from "@/lib/depozit";

export async function generateMetadata(props: PageProps<"/admin/haina/[slug]">) {
  const { slug } = await props.params;
  const haina = await produsDupaSlug(slug);
  return { title: haina ? haina.nume : "Haină" };
}

export default async function Page(props: PageProps<"/admin/haina/[slug]">) {
  const { slug } = await props.params;
  const haina = await produsDupaSlug(slug);
  if (!haina) notFound();

  return (
    <div className="mt-8 max-w-3xl">
      <Link href="/admin" className="text-sm text-secundar hover:text-accent-text">
        ← Înapoi la haine
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-principal">{haina.nume}</h1>
      <p className="mt-2 text-secundar">Schimbă ce vrei și salvează. Se vede pe site pe loc.</p>

      <FormularHaina
        haina={{
          slug: haina.slug,
          nume: haina.nume,
          categorie: haina.categorie,
          pret: haina.pret,
          marime: haina.marime,
          stare: haina.stare,
          marca: haina.marca ?? null,
          descriere: haina.descriere ?? null,
          poze: haina.poze ?? [],
          vandut: haina.vandut ?? false,
        }}
      />
    </div>
  );
}
