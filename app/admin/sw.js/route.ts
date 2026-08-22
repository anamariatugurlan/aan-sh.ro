// Fără acest fișier, telefonul și calculatorul nu oferă „instalează aplicația".
//
// Dinadins NU ține nimic în memorie: administrarea trebuie să arate mereu ce e
// acum în magazin, nu o copie veche. Doar lasă cererile să treacă mai departe.

export const dynamic = "force-static";

const COD = `self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
`;

export function GET() {
  return new Response(COD, {
    headers: {
      "content-type": "text/javascript; charset=utf-8",
      "cache-control": "no-cache",
      "service-worker-allowed": "/admin",
    },
  });
}
