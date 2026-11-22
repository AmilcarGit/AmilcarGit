"use client";

import { useState, type FormEvent } from "react";
import BrandMark from "@/components/BrandMark";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || pending) return;

    const history = messages
      .filter((item) => item.role === "user")
      .slice(-4)
      .map((item) => ({ role: "user", content: item.content }));

    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, mode: "general" }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      if (!data.reply?.trim()) throw new Error("El bot no devolvió una respuesta.");
      setMessages((current) => [...current, { role: "assistant", content: data.reply!.trim() }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Error de conexión. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="AmilcarGit, inicio">
          <BrandMark className="brand-mark" />
          <span>AMILCARGIT</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#proyectos">Proyectos</a>
          <a href="#bot">Mi bot</a>
          <a href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> DESARROLLO INDEPENDIENTE · PERÚ</p>
          <h1>Construyo cosas<br /><span>que hacen.</span></h1>
          <p className="hero-description">
            Soy AmilcarGit. Desarrollo bots, herramientas y proyectos digitales.
            Este es mi espacio para compartir lo que estoy creando.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#proyectos">Ver proyectos <span>↘</span></a>
            <a className="button button-secondary" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">Explorar GitHub ↗</a>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <div className="mark-halo" />
          <BrandMark className="hero-logo" />
        </div>
      </section>

      <section className="section" id="proyectos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / LO QUE HAGO</p>
            <h2>Proyectos en<br /><span>construcción.</span></h2>
          </div>
          <p className="section-note">Código, automatización y herramientas útiles. Sin adornos: trabajo real y en evolución.</p>
        </div>
        <div className="project-grid">
          <a className="project-card" href="https://github.com/AmilcarGit?tab=repositories" target="_blank" rel="noreferrer">
            <span className="card-index">01</span>
            <div><h3>Repositorios</h3><p>Explora el código y los proyectos que desarrollo en GitHub.</p></div>
            <span className="card-arrow">↗</span>
          </a>
          <a className="project-card" href="https://amilcartools.vercel.app/" target="_blank" rel="noreferrer">
            <span className="card-index">02</span>
            <div><h3>AmilcarTools</h3><p>Un espacio de herramientas y utilidades digitales.</p></div>
            <span className="card-arrow">↗</span>
          </a>
        </div>
      </section>

      <section className="bot-section" id="bot">
        <div className="bot-intro">
          <p className="eyebrow">02 / CONVERSACIÓN</p>
          <h2>Habla con<br /><span>mi bot.</span></h2>
          <p>Escribe una pregunta. El chat conserva la conexión con el endpoint que ya utiliza el proyecto.</p>
          <span className="connection-note"><i /> CONEXIÓN DEL SERVIDOR ACTIVA</span>
        </div>
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-avatar"><BrandMark /></div>
            <div><strong>Bot de AmilcarGit</strong><small>Asistente del proyecto</small></div>
            <span className="chat-live">EN LÍNEA</span>
          </div>
          <div className="chat-messages" aria-live="polite" aria-label="Conversación">
            {messages.length === 0 && (
              <div className="chat-empty">
                <span>✳</span>
                <p>La conversación empieza aquí.</p>
                <small>Escribe tu primera pregunta.</small>
              </div>
            )}
            {messages.map((item, index) => (
              <div className={`message message-${item.role}`} key={index}>
                <span>{item.role === "user" ? "TÚ" : "BOT"}</span>
                <p>{item.content}</p>
              </div>
            ))}
            {pending && <div className="message message-assistant"><span>BOT</span><p className="typing">Escribiendo…</p></div>}
          </div>
          {error && <p className="chat-error" role="alert">{error}</p>}
          <form className="chat-form" onSubmit={sendMessage}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe un mensaje…" maxLength={2000} aria-label="Escribe un mensaje" disabled={pending} />
            <button type="submit" disabled={pending || !input.trim()} aria-label="Enviar mensaje">Enviar ↗</button>
          </form>
          <p className="chat-footnote">No compartas contraseñas ni datos privados.</p>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio"><BrandMark /> AMILCARGIT</a>
        <span>Hecho con código, desde Perú.</span>
        <a href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </main>
  );
}
