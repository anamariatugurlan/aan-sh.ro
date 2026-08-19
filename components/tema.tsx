"use client";

const CHEIE = "aan-sh-tema";

/** Se ruleaza inainte de afisare, ca sa nu palpaie alb la incarcare pe tema inchisa. */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  CHEIE
)});if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export function ComutatorTema() {
  function schimba() {
    const acum = document.documentElement.getAttribute("data-theme");
    const noua = acum === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", noua);
    try {
      localStorage.setItem(CHEIE, noua);
    } catch {
      // daca browserul nu lasa, tema tine doar cat sta pe pagina
    }
  }

  return (
    <button
      type="button"
      onClick={schimba}
      aria-label="Schimbă tema"
      title="Schimbă tema"
      className="inline-flex min-h-11 w-11 shrink-0 items-center justify-center rounded-lg text-secundar transition hover:bg-suprafata-slaba hover:text-principal"
    >
      {/* pe tema luminoasa se vede luna, pe cea inchisa soarele - alege CSS-ul, fara JavaScript */}
      <svg className="doar-luminos" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="doar-inchis" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
