"use client";

import { useSyncExternalStore } from "react";
import * as store from "@/lib/cos-store";

export function useCos() {
  const articole = useSyncExternalStore(store.aboneaza, store.citeste, store.citesteDeLaServer);
  const incarcat = useSyncExternalStore(store.aboneaza, store.esteIncarcat, () => false);

  return {
    articole,
    incarcat,
    adauga: store.adauga,
    scoate: store.scoate,
    goleste: store.goleste,
    contine: (slug: string) => articole.includes(slug),
  };
}
