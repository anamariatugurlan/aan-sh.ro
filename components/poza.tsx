// Poza de asezare, pana primim pozele reale ale hainelor.
// Culoarea iese din numele produsului, ca fiecare haina sa arate diferit si constant.

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Poza({ slug, nume, clasa = "" }: { slug: string; nume: string; clasa?: string }) {
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
