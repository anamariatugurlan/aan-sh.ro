"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function Cautare({ initial = "", mare = false }: { initial?: string; mare?: boolean }) {
  const router = useRouter();
  const [text, setText] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = text.trim();
        if (q) router.push(`/cauta?q=${encodeURIComponent(q)}`);
      }}
      className={mare ? "w-full" : "w-full md:max-w-xs"}
    >
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Caută o haină…"
        aria-label="Caută o haină"
        className={`w-full rounded-lg border border-stone-300 bg-white px-4 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
          mare ? "min-h-12 text-base" : "min-h-10 text-sm"
        }`}
      />
    </form>
  );
}
