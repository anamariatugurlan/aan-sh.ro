// Poza unei haine: prima poza urcata de admin, daca exista.
// Daca haina n-are nicio poza, ramane dreptunghiul colorat de asezare —
// culoarea iese din numele produsului, ca fiecare haina sa arate diferit si constant.

import Image from "next/image";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Poza({
  slug,
  nume,
  poze,
  clasa = "",
}: {
  slug: string;
  nume: string;
  poze?: string[] | null;
  clasa?: string;
}) {
  const poza = poze?.[0];

  if (poza) {
    return (
      <div className={`relative overflow-hidden ${clasa}`}>
        <Image
          src={poza}
          alt={nume}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
    );
  }

  const h = hash(slug);
  const ton = h % 360;
  const initiale = nume
    .split(" ")
    .slice(0, 2)
    .map((c) => c[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${clasa}`}
      style={{
        background: `linear-gradient(135deg, hsl(${ton} 32% 82%), hsl(${(ton + 40) % 360} 28% 68%))`,
      }}
      aria-hidden
    >
      <span className="text-4xl font-semibold tracking-wide text-white/70 select-none">{initiale}</span>
    </div>
  );
}
