"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Telefonul anunță singur, printr-un semnal, că aplicația se poate instala.
// Îl prindem și arătăm un buton, ca să nu fie nevoie de umblat prin meniuri.
type SemnalInstalare = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const faraAbonare = () => () => {};

/** E deschisă chiar acum ca aplicație, nu în browser? */
function deschisaCaAplicatie() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

/** iPhone-ul nu dă semnalul de instalare: acolo se face din butonul de partajare. */
function esteIphone() {
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

export function ButonInstalare() {
  const [semnal, setSemnal] = useState<SemnalInstalare | null>(null);
  const [tocmaiInstalata, setTocmaiInstalata] = useState(false);

  // pe server nu se știe nimic despre telefon, de aceea a treia funcție dă „nu"
  const caAplicatie = useSyncExternalStore(faraAbonare, deschisaCaAplicatie, () => false);
  const peIphone = useSyncExternalStore(faraAbonare, esteIphone, () => false);

  useEffect(() => {
    const prinde = (e: Event) => {
      e.preventDefault();
      setSemnal(e as SemnalInstalare);
    };
    const gata = () => {
      setTocmaiInstalata(true);
      setSemnal(null);
    };

    window.addEventListener("beforeinstallprompt", prinde);
    window.addEventListener("appinstalled", gata);
    return () => {
      window.removeEventListener("beforeinstallprompt", prinde);
      window.removeEventListener("appinstalled", gata);
    };
  }, []);

  if (caAplicatie || tocmaiInstalata) return null;

  const cutie = "mt-8 rounded-lg border border-linie bg-suprafata p-4";

  if (semnal) {
    return (
      <div className={cutie}>
        <p className="text-sm font-semibold text-principal">Pune-o ca aplicație</p>
        <p className="mt-1 text-sm text-secundar">
          Ai apoi o iconiță pe ecran și intri direct, fără să mai scrii adresa.
        </p>
        <button
          type="button"
          onClick={async () => {
            await semnal.prompt();
            const alegere = await semnal.userChoice;
            if (alegere.outcome === "accepted") setTocmaiInstalata(true);
            setSemnal(null);
          }}
          className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-contrast px-4 text-sm font-semibold text-pe-contrast transition hover:bg-contrast/85"
        >
          Instalează aplicația
        </button>
      </div>
    );
  }

  if (peIphone) {
    return (
      <div className={cutie}>
        <p className="text-sm font-semibold text-principal">Pune-o ca aplicație</p>
        <p className="mt-1 text-sm leading-relaxed text-secundar">
          Apeși butonul de partajare (pătratul cu săgeata în sus, jos în mijloc), dai în jos
          până la <span className="font-medium text-principal">{"„Add to Home Screen”"}</span>{" "}
          și confirmi.
        </p>
      </div>
    );
  }

  return null;
}
