import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mentenanta: cat timp MENTENANTA=1, vizitatorii vad o pagina "revenim in curand".
// Cine are cheia (CHEIE_ACCES) intra normal: adauga ?cheie=... o data si ramane cu un cookie.

const COOKIE = "aan-sh-acces";

function paginaMentenanta(): string {
  return `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>aan-sh.ro — revenim în curând</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
       background:#faf9f7;color:#1c1917;
       font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
  .cutie{max-width:520px;text-align:center}
  .logo{font-size:34px;font-weight:800;letter-spacing:-.02em}
  .logo span{color:#ea580c}
  h1{margin-top:28px;font-size:28px;line-height:1.25;font-weight:700}
  p{margin-top:14px;font-size:17px;line-height:1.6;color:#57534e}
  .linie{margin-top:32px;padding-top:24px;border-top:1px solid #e7e5e4;font-size:14px;color:#a8a29e}
  @media (prefers-color-scheme: dark){
    body{background:#1c1917;color:#f5f5f4}
    p{color:#d6d3d1}
    .linie{border-color:#44403c;color:#78716c}
  }
</style>
</head>
<body>
  <div class="cutie">
    <div class="logo">aan<span>-sh</span></div>
    <h1>Pregătim magazinul</h1>
    <p>Lucrăm la site chiar acum. Revenim în curând cu haine second hand alese bucată cu bucată, plătite la kilogram.</p>
    <p class="linie">Până atunci ne găsești pe Facebook, TikTok și Instagram.</p>
  </div>
</body>
</html>`;
}

export function proxy(request: NextRequest) {
  if (process.env.MENTENANTA !== "1") return NextResponse.next();

  const cheie = process.env.CHEIE_ACCES;
  const url = request.nextUrl;

  // cineva a intrat cu ?cheie=... : ii punem cookie si il trimitem pe adresa curata
  const dinLink = url.searchParams.get("cheie");
  if (cheie && dinLink && dinLink === cheie) {
    const curat = new URL(url);
    curat.searchParams.delete("cheie");
    const raspuns = NextResponse.redirect(curat);
    raspuns.cookies.set({
      name: COOKIE,
      value: cheie,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return raspuns;
  }

  // are deja cookie-ul : vede site-ul normal
  if (cheie && request.cookies.get(COOKIE)?.value === cheie) {
    return NextResponse.next();
  }

  return new NextResponse(paginaMentenanta(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "retry-after": "3600",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
