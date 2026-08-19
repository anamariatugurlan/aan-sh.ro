import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "aan-sh.ro — haine second hand la kilogram",
    template: "%s — aan-sh.ro",
  },
  description:
    "Haine second hand alese bucată cu bucată, plătite la kilogram. Fiecare haină e cântărită, prețul iese din greutate.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        
          <Header />
          <main className="flex-1">{children}</main>

          <footer className="mt-16 border-t border-stone-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-stone-600">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <div className="text-lg font-bold text-stone-900">
                    aan<span className="text-orange-600">-sh</span>
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Haine second hand alese bucată cu bucată și plătite la kilogram.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-stone-900">Cum funcționează</div>
                  <p className="mt-2 leading-relaxed">
                    Alegi hainele care îți plac. Fiecare are greutatea ei trecută. Prețul se
                    calculează din greutate, la prețul pe kilogram al categoriei.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-stone-900">Legături</div>
                  <ul className="mt-2 space-y-1">
                    <li><Link href="/" className="hover:text-orange-700">Acasă</Link></li>
                    <li><Link href="/cos" className="hover:text-orange-700">Coșul meu</Link></li>
                  </ul>
                </div>
              </div>
              <p className="mt-8 border-t border-stone-100 pt-6 text-xs text-stone-400">
                aan-sh.ro — site în lucru. Datele afișate sunt de probă.
              </p>
            </div>
          </footer>
        
      </body>
    </html>
  );
}
