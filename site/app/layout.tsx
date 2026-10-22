import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amilcargit.vercel.app"),
  title: "AMILCARGIT — Un universo de ideas y AMILCAR AI",
  description: "Explora el universo digital de AmilcarGit y conversa con AMILCAR AI, un motor experimental con apoyo neuronal local y sin API externa.",
  applicationName: "AMILCARGIT Universe",
  keywords: ["AmilcarGit", "AMILCAR AI", "chat IA local", "desarrollo", "bots", "JavaScript", "open source"],
  openGraph: {
    title: "AMILCARGIT — Un universo de ideas",
    description: "Explora proyectos, experimentos y herramientas en un universo digital interactivo.",
    url: "https://amilcargit.vercel.app",
    siteName: "AMILCARGIT",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AMILCARGIT — Un universo de ideas, código e inteligencia artificial" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMILCARGIT — Un universo de ideas",
    description: "Proyectos, herramientas web, bots y AMILCAR AI en un universo digital interactivo.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
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
