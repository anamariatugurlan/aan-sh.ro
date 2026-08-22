// Fișa aplicației: de aici află telefonul și calculatorul cum se cheamă, ce iconiță
// are și de unde pornește, când o instalezi cu „Adaugă pe ecranul principal".

export const dynamic = "force-static";

export function GET() {
  const fisa = {
    name: "Administrare aan-sh",
    short_name: "aan-sh admin",
    description: "Intrarea în administrarea magazinului aan-sh.ro.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#1c1917",
    theme_color: "#1c1917",
    lang: "ro",
    icons: [
      { src: "/admin/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/admin/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/admin/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(fisa, null, 2), {
    headers: {
      "content-type": "application/manifest+json; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
