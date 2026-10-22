"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

type ChatMessage = { role: "assistant" | "user"; content: string; model?: string; error?: boolean };
type ChatResponse = { reply?: string; model?: string; engine?: string; usedNeural?: boolean; error?: string };

const starters = ["¿Quién eres?", "¿Qué puedes hacer?", "Ayúdame con JavaScript"];

export default function AmilcarChat({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "¡Hola! Soy AMILCAR AI. Estoy en fase experimental: puedo ayudarte con conocimientos locales, preguntas sencillas y programación. Pregúntame algo para probar el motor." }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("MOTOR PROPIO · APOYO LOCAL");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTo({ top: transcript.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const sendMessage = async (raw?: string) => {
    const message = (raw ?? input).trim();
    if (!message || pending || message.length > 2000) return;
    const history = messages.filter((item) => item.role === "user").slice(-4).map((item) => ({ role: "user", content: item.content }));
    setMessages((previous) => [...previous, { role: "user", content: message }]);
    setInput("");
    setPending(true);
    setStatus("PROCESANDO EN LOCAL");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history })
      });
      const data = await response.json() as ChatResponse;
      if (!response.ok) throw new Error(data.error || "No pude responder ahora. Inténtalo de nuevo en unos segundos.");
      const reply = typeof data.reply === "string" && data.reply.trim() ? data.reply.trim() : "El motor no devolvió una respuesta válida. Intenta reformular tu mensaje.";
      setMessages((previous) => [...previous, { role: "assistant", content: reply, model: data.usedNeural ? "AMI-Base · apoyo neuronal local" : "AMILCAR-AI · motor propio" }]);
      setStatus(data.usedNeural ? "APOYO NEURONAL ACTIVADO" : "MOTOR PROPIO · LISTO");
    } catch (error) {
      setMessages((previous) => [...previous, { role: "assistant", content: error instanceof Error ? error.message : "Error de conexión. Vuelve a intentarlo.", error: true }]);
      setStatus("CONEXIÓN TEMPORALMENTE NO DISPONIBLE");
    } finally {
      setPending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className={compact ? "ai-chat-wrap ai-chat-compact" : "ai-chat-wrap"}>
      <div className="ai-chat-head">
        <div className="ai-chat-identity">
          <div className="ai-chat-avatar" aria-hidden="true">✳</div>
          <div><div className="ai-chat-name">AMILCAR AI <span aria-hidden="true">✦</span></div><div className="ai-chat-subtitle">MOTOR EXPERIMENTAL · SIN API EXTERNA</div></div>
        </div>
        <span className="ai-chat-live"><i /> {pending ? "PENSANDO" : "ONLINE"}</span>
      </div>
      <div className="ai-chat-transcript" ref={transcriptRef} role="log" aria-live="polite" aria-label="Conversación con AMILCAR AI">
        {messages.map((message, index) => (
          <div className={"ai-chat-message " + message.role} key={index}>
            <span className="ai-chat-mini-avatar" aria-hidden="true">{message.role === "assistant" ? "✳" : "◉"}</span>
            <div className="ai-chat-bubble">
              {message.content}
              {message.model && <span className="ai-chat-meta">{message.model}</span>}
              {message.error && <span className="ai-chat-meta">No se guardó tu mensaje en una base de datos del chat.</span>}
            </div>
          </div>
        ))}
        {pending && <div className="ai-chat-message assistant"><span className="ai-chat-mini-avatar" aria-hidden="true">✳</span><div className="ai-chat-bubble"><span className="ai-chat-typing" aria-label="Generando respuesta"><i/><i/><i/></span><span className="ai-chat-meta">El motor está generando una respuesta…</span></div></div>}
      </div>
      <div className="ai-chat-composer">
        <div className="ai-chat-suggestions" aria-label="Preguntas sugeridas">
          {starters.map((starter) => <button type="button" key={starter} disabled={pending} onClick={() => void sendMessage(starter)}>{starter}</button>)}
        </div>
        <form className="ai-chat-input-row" onSubmit={submit}>
          <textarea ref={inputRef} className="ai-chat-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe tu mensaje a AMILCAR AI…" aria-label="Mensaje para AMILCAR AI" rows={1} maxLength={2000} disabled={pending} />
          <button className="ai-chat-send" type="submit" disabled={pending || !input.trim()} aria-label="Enviar mensaje">↑</button>
        </form>
        <div className="ai-chat-footnote"><span>ENTER PARA ENVIAR · SHIFT + ENTER PARA SALTO</span><strong>{input.length}/2000</strong></div>
      </div>
      <span className="ai-chat-status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{status}</span>
    </div>
  );
}
