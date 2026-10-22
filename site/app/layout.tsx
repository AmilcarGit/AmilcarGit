import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amilcargit.vercel.app"),
  title: "AMILCARGIT — Un universo de ideas",
  description: "El universo digital de AmilcarGit: inteligencia artificial experimental, herramientas web, bots y proyectos de código abierto.",
  applicationName: "AMILCARGIT Universe",
  keywords: ["AmilcarGit", "desarrollo", "inteligencia artificial", "bots", "JavaScript", "open source"],
  openGraph: {
    title: "AMILCARGIT — Un universo de ideas",
    description: "Explora proyectos, experimentos y herramientas en un universo digital interactivo.",
    url: "https://amilcargit.vercel.app",
    siteName: "AMILCARGIT",
    locale: "es_PE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070711",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
