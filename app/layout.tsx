import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/header";
import { SCRIPT_TEMA } from "@/components/tema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "aan-sh.ro — haine second hand, bucatÄ cu bucatÄ",
    template: "%s — aan-sh.ro",
  },
  description:
    "Haine second hand alese bucată cu bucată. Fiecare piesă e unicat, cu prețul ei — ce vezi în poză e ce primești.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        
          <Header />
          <main className="flex-1">{children}</main>

          <footer className="mt-16 border-t border-linie bg-suprafata">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-secundar">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <div className="text-lg font-bold text-principal">
                    aan<span className="text-accent-text">-sh</span>
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Haine second hand alese bucată cu bucată. Fiecare piesă, una singură.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-principal">Cum funcționează</div>
                  <p className="mt-2 leading-relaxed">
                    Alegi hainele care îți plac și le comanzi. Plata se face ramburs, la primirea
                    coletului. Ce vezi în poză e exact haina care ajunge la tine.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-principal">Legături</div>
                  <ul className="mt-2 space-y-1">
                    <li><Link href="/" className="hover:text-accent-text">Acasă</Link></li>
                    <li><Link href="/cos" className="hover:text-accent-text">Coșul meu</Link></li>
                  </ul>
                </div>
              </div>
              <p className="mt-8 border-t border-linie-slaba pt-6 text-xs text-sters">
                aan-sh.ro — site în lucru. Datele afișate sunt de probă.
              </p>
            </div>
          </footer>
        
      </body>
    </html>
  );
}
