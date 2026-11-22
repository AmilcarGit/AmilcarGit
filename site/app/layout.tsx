import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://amilcargit.vercel.app"),
  title: "AmilcarGit — Desarrollo independiente",
  description: "Proyectos, bots y herramientas digitales creados por AmilcarGit.",
  applicationName: "AmilcarGit",
  openGraph: {
    title: "AmilcarGit — Desarrollo independiente",
    description: "Proyectos, bots y herramientas digitales.",
    url: "https://amilcargit.vercel.app",
    siteName: "AmilcarGit",
    locale: "es_PE",
    type: "website",
  },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], shortcut: ["/icon.svg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10110f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><ServiceWorkerRegister />{children}</body>
    </html>
  );
}
