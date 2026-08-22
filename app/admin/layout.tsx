import { PregatesteAplicatia } from "@/components/aplicatie";

// Tot ce ține de administrare: se poate instala ca aplicație, și nu ajunge
// niciodată în Google. Paza pe cont e mai jos, în dosarul (panou).
export const metadata = {
  manifest: "/admin/manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "aan-sh admin",
    statusBarStyle: "black-translucent" as const,
  },
  icons: {
    icon: "/admin/icon-192.png",
    apple: "/admin/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#1c1917",
};

export default function Layout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <PregatesteAplicatia />
      {children}
    </>
  );
}
