"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlegeCategoria } from "./alege-categoria";
import { dinBrowser } from "@/lib/supabase-browser";

export type HainaDeSchimbat = {
  slug: string;
  nume: string;
  categorie: string;
  pret: number;
  marime: string;
  stare: string;
  marca?: string | null;
  descriere?: string | null;
  poze?: string[] | null;
  vandut?: boolean;
};

const STARI = ["ca nou", "foarte buna", "buna"];

/** Din numele hainei face adresa ei: "Rochie de vară" -> "rochie-de-vara". */
function slugDinNume(nume: string): string {
  return nume
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function FormularHaina({ haina }: { haina?: HainaDeSchimbat }) {
  const router = useRouter();
  const db = dinBrowser();
  const eNoua = !haina;

  const [nume, setNume] = useState(haina?.nume ?? "");
  const [categorie, setCategorie] = useState(haina?.categorie ?? "");
  const [pret, setPret] = useState(haina ? String(haina.pret) : "");
  const [marime, setMarime] = useState(haina?.marime ?? "");
  const [stare, setStare] = useState(haina?.stare ?? "foarte buna");
  const [marca, setMarca] = useState(haina?.marca ?? "");
  const [descriere, setDescriere] = useState(haina?.descriere ?? "");
  const [poze, setPoze] = useState<string[]>(haina?.poze ?? []);
  const [vandut, setVandut] = useState(haina?.vandut ?? false);

  const [seIncarca, setSeIncarca] = useState(false);
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function incarcaPoze(fisiere: FileList | null) {
    if (!fisiere || fisiere.length === 0) return;
    setEroare(null);
    setSeIncarca(true);

    const adaugate: string[] = [];
    for (const f of Array.from(fisiere)) {
      const extensie = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const cale = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensie}`;

      const { error } = await db.storage.from("poze").upload(cale, f, { upsert: false });
      if (error) {
        setEroare("Nu am putut încărca poza: " + error.message);
        break;
      }
      adaugate.push(db.storage.from("poze").getPublicUrl(cale).data.publicUrl);
    }

    setPoze((vechi) => [...vechi, ...adaugate]);
    setSeIncarca(false);
  }

  async function salveaza(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);

    if (!nume.trim()) return setEroare("Scrie numele hainei.");
    if (!categorie) return setEroare("Alege unde intră haina.");
    const pretNumar = Number(pret);
    if (!Number.isFinite(pretNumar) || pretNumar <= 0) return setEroare("Scrie un preț în lei.");
    if (!marime.trim()) return setEroare("Scrie mărimea.");

    setSeSalveaza(true);

    const date = {
      nume: nume.trim(),
      categorie,
      pret: Math.round(pretNumar),
      marime: marime.trim(),
      stare,
      marca: marca.trim() || null,
      descriere: descriere.trim() || null,
      poze,
      vandut,
    };

    const { error } = eNoua
      ? await db.from("produse").insert({ ...date, slug: slugDinNume(nume) })
      : await db.from("produse").update(date).eq("slug", haina.slug);

    if (error) {
      const m = error.message.toLowerCase();
      setEroare(
        m.includes("duplicate") || m.includes("unique")
          ? "Mai există o haină cu același nume. Schimbă puțin numele."
          : m.includes("row-level security")
            ? "Nu ai voie. Ieși și intră din nou în cont."
            : "Nu a mers: " + error.message,
      );
      setSeSalveaza(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function sterge() {
    if (!haina) return;
    if (!confirm(`Ștergi „${haina.nume}" definitiv?`)) return;

    setSeSalveaza(true);
    const { error } = await db.from("produse").delete().eq("slug", haina.slug);
    if (error) {
      setEroare("Nu am putut șterge: " + error.message);
      setSeSalveaza(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const claseCamp =
    "mt-1.5 block min-h-12 w-full rounded-lg border border-linie bg-fundal px-3.5 text-base text-principal outline-none focus:border-accent";

  return (
    <form onSubmit={salveaza} className="mt-8 space-y-6">
      <div>
        <label htmlFor="nume" className="block text-sm font-medium text-principal">
          Ce e haina
        </label>
        <input
          id="nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          placeholder="Rochie de vară cu flori"
          className={claseCamp}
        />
      </div>

      <AlegeCategoria initial={haina?.categorie} laSchimbare={setCategorie} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="pret" className="block text-sm font-medium text-principal">
            Preț (lei)
          </label>
          <input
            id="pret"
            inputMode="numeric"
            value={pret}
            onChange={(e) => setPret(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="45"
            className={claseCamp}
          />
        </div>
        <div>
          <label htmlFor="marime" className="block text-sm font-medium text-principal">
            Mărime
          </label>
          <input
            id="marime"
            value={marime}
            onChange={(e) => setMarime(e.target.value)}
            placeholder="M, 38, unică…"
            className={claseCamp}
          />
        </div>
        <div>
          <label htmlFor="stare" className="block text-sm font-medium text-principal">
            Stare
          </label>
          <select
            id="stare"
            value={stare}
            onChange={(e) => setStare(e.target.value)}
            className={claseCamp}
          >
            {STARI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-principal">
          Marca <span className="font-normal text-sters">(dacă are)</span>
        </label>
        <input
          id="marca"
          value={marca ?? ""}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Zara, Levi's…"
          className={claseCamp}
        />
      </div>

      <div>
        <label htmlFor="descriere" className="block text-sm font-medium text-principal">
          Alte amănunte <span className="font-normal text-sters">(dacă vrei)</span>
        </label>
        <textarea
          id="descriere"
          rows={3}
          value={descriere ?? ""}
          onChange={(e) => setDescriere(e.target.value)}
          placeholder="Bumbac, purtată de câteva ori, fără defecte."
          className={`${claseCamp} py-3`}
        />
      </div>

      {/* ---- pozele ---- */}
      <div>
        <span className="block text-sm font-medium text-principal">Poze</span>

        {poze.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {poze.map((adresa) => (
              <div key={adresa} className="relative">
                <Image
                  src={adresa}
                  alt=""
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-lg border border-linie object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPoze((v) => v.filter((a) => a !== adresa))}
                  aria-label="Scoate poza"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-contrast text-sm font-bold text-pe-contrast"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-linie bg-suprafata px-4 text-sm font-medium text-principal transition hover:border-accent">
          {seIncarca ? "Se încarcă…" : poze.length ? "Mai adaugă poze" : "Alege poze"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={seIncarca}
            onChange={(e) => {
              incarcaPoze(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <p className="mt-2 text-xs text-sters">
          De pe telefon poți face poza pe loc. Prima poză e cea care se vede în magazin.
        </p>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={vandut}
          onChange={(e) => setVandut(e.target.checked)}
          className="h-5 w-5 rounded border-linie"
        />
        <span className="text-sm text-principal">
          Vândută <span className="text-sters">(nu mai apare în magazin)</span>
        </span>
      </label>

      {eroare && (
        <p role="alert" className="rounded-lg bg-accent-slab px-3.5 py-3 text-sm text-pericol">
          {eroare}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-linie pt-6">
        <button
          type="submit"
          disabled={seSalveaza || seIncarca}
          className="inline-flex min-h-12 items-center rounded-lg bg-accent px-6 font-semibold text-pe-accent transition hover:bg-accent-tare disabled:opacity-60"
        >
          {seSalveaza ? "Se salvează…" : eNoua ? "Pune haina în magazin" : "Salvează schimbările"}
        </button>

        {!eNoua && (
          <button
            type="button"
            onClick={sterge}
            disabled={seSalveaza}
            className="inline-flex min-h-12 items-center rounded-lg border border-linie px-5 text-sm font-medium text-pericol transition hover:border-pericol disabled:opacity-60"
          >
            Șterge haina
          </button>
        )}
      </div>
    </form>
  );
}
