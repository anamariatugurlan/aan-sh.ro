"use client";

import { useEffect } from "react";

/** Pregătește administrarea ca să poată fi instalată ca aplicație pe telefon și PC. */
export function PregatesteAplicatia() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin" }).catch(() => {
      // dacă nu merge (browser vechi, http fără lacăt), administrarea funcționează la fel
    });
  }, []);

  return null;
}
