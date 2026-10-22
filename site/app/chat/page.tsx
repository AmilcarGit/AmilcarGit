import type { Metadata } from "next";
import Link from "next/link";
import AmilcarChat from "@/components/AmilcarChat";

export const metadata: Metadata = {
  title: "Chat AMILCAR AI | AMILCARGIT",
  description: "Prueba AMILCAR AI, un motor experimental con apoyo neuronal local y sin API externa.",
  robots: { index: true, follow: true }
};

export default function ChatPage() {
  return (
    <main className="chat-page">
      <header className="chat-page-topbar">
        <Link className="brand" href="/" aria-label="AMILCARGIT, inicio"><span className="brand-mark">A<span>✦</span></span><span>AMILCAR<span className="brand-muted">GIT</span><small>DIGITAL UNIVERSE</small></span></Link>
        <Link className="chat-back-link" href="/">← Volver al universo</Link>
      </header>
      <section className="chat-page-intro">
        <p className="eyebrow"><span>✳</span> LABORATORIO DE CONVERSACIÓN</p>
        <h1>Habla con <span>AMILCAR AI.</span></h1>
        <p>Motor propio con apoyo neuronal local. Sin API externa de IA; las respuestas son experimentales y pueden contener errores.</p>
      </section>
      <AmilcarChat />
      <footer className="chat-page-footer"><span>AMILCAR AI · EXPERIMENTAL</span><span>NO SE GUARDA EL HISTORIAL EN EL SERVIDOR</span><Link href="https://github.com/AmilcarGit/AMILCAR-AI">CÓDIGO FUENTE ↗</Link></footer>
    </main>
  );
}
