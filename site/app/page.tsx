"use client";

import { useEffect, useRef, useState } from "react";
import Universe from "@/components/Universe";
import AmilcarChat from "@/components/AmilcarChat";

const projects = [
  { number: "01", name: "AMILCAR-AI", type: "INTELIGENCIA ARTIFICIAL", description: "Un proyecto experimental para explorar motores propios, SDKs y nuevas formas de integrar IA.", tags: ["AI LAB", "NODE.JS"], href: "https://github.com/AmilcarGit/AMILCAR-AI", icon: "✳", tone: "violet" },
  { number: "02", name: "AmilcarTools", type: "WEB TOOLKIT", description: "Un laboratorio de herramientas web para texto, código, datos, imágenes y productividad.", tags: ["WEB", "UTILIDADES"], href: "https://amilcartools.vercel.app", icon: "⌘", tone: "cyan" },
  { number: "03", name: "YuiBot-MD", type: "WHATSAPP AUTOMATION", description: "Bot modular de WhatsApp Multi-Device, creado para experimentar y personalizar comandos.", tags: ["NODE.JS", "BOT"], href: "https://github.com/AmilcarGit/YuiBot-MD", icon: "✿", tone: "pink" },
  { number: "04", name: "S7-Bot-OFC", type: "SECTOR 7 SYSTEMS", description: "Un bot de WhatsApp con comandos, vinculación y funciones de administración.", tags: ["WHATSAPP", "AUTOMATION"], href: "https://github.com/AmilcarGit/S7-Bot-OFC", icon: "✦", tone: "blue" },
  { number: "05", name: "YuiBoost", type: "ANDROID / TERMUX", description: "Utilidades y diagnósticos para Termux, con límites claros según permisos disponibles.", tags: ["ANDROID", "CLI"], href: "https://github.com/AmilcarGit/YuiBoost", icon: "⌁", tone: "green" },
  { number: "06", name: "FamilyBot-MD1", type: "TELEGRAM SYSTEMS", description: "Proyecto de bot para Telegram con comandos, ayuda y herramientas para comunidades.", tags: ["TELEGRAM", "NODE.JS"], href: "https://github.com/AmilcarGit/FamilyBot-MD1", icon: "◈", tone: "orange" },
];

const commands: Record<string, string> = {
  help: "Comandos disponibles: help, about, projects, ai, tools, socials, clear",
  about: "AMILCARGIT // creador independiente. Construyendo bots, herramientas, experiencias web e IA experimental.",
  projects: "6 nodos destacados encontrados. Desplázate hasta [ PROYECTOS ] para explorar el mapa completo.",
  ai: "AMILCAR-AI :: proyecto experimental en evolución. Sin promesas falsas ni capacidades inventadas.",
  tools: "AMILCARTOOLS :: laboratorio web disponible en https://amilcartools.vercel.app",
  socials: "GITHUB :: github.com/AmilcarGit | TIKTOK :: @amilkargit1",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>(["AMILCAR OS [web terminal]", "Escribe help para explorar comandos de demostración."]);
  const [secret, setSecret] = useState(false);
  const [booted, setBooted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioMasterRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 350);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    let keySequence = "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key.length === 1) keySequence = (keySequence + event.key.toLowerCase()).slice(-12);
      if (keySequence.includes("amilcar")) setSecret(true);
      if (event.key === "Escape") { setMenuOpen(false); setTerminalOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    const cursor = cursorRef.current;
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerMove = (event: PointerEvent) => {
      if (cursor) cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };
    if (supportsFinePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => { window.clearTimeout(timer); observer.disconnect(); window.removeEventListener("keydown", onKey); if (supportsFinePointer) window.removeEventListener("pointermove", onPointerMove); oscillatorsRef.current.forEach((oscillator) => { try { oscillator.stop(); } catch {} }); void audioContextRef.current?.close(); audioContextRef.current = null; audioMasterRef.current = null; oscillatorsRef.current = []; };
  }, []);

  const playTone = () => {
    if (soundOn) {
      oscillatorsRef.current.forEach((oscillator) => { try { oscillator.stop(); } catch {} });
      oscillatorsRef.current = [];
      audioMasterRef.current?.disconnect();
      audioMasterRef.current = null;
      void audioContextRef.current?.close();
      audioContextRef.current = null;
      setSoundOn(false);
      return;
    }
    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.value = 0.018;
      master.connect(context.destination);
      audioContextRef.current = context;
      audioMasterRef.current = master;
      oscillatorsRef.current = [];
      [110, 164.81, 220].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 1 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.22 : 0.1;
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start();
        oscillatorsRef.current.push(oscillator);
      });
      setSoundOn(true);
    } catch { setSoundOn(false); }
  };

  const runCommand = () => {
    const input = terminalInput.trim().toLowerCase();
    if (!input) return;
    const output = input === "clear" ? [] : [`visitor@amilcar:~$ ${terminalInput}`, commands[input] || "Comando no reconocido. Escribe help para ver los comandos disponibles."];
    setTerminalLines((previous) => input === "clear" ? ["Terminal limpia. Escribe help para comenzar."] : [...previous, ...output].slice(-12));
    setTerminalInput("");
    if (input === "amilcar") setSecret(true);
  };

  return (
    <main className={booted ? "site booted" : "site"}>
      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="AMILCARGIT, inicio"><span className="brand-mark">A<span>✦</span></span><span>AMILCAR<span className="brand-muted">GIT</span><small>DIGITAL UNIVERSE</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}><span/><span/><span/></button>
        <nav className={menuOpen ? "navigation nav-open" : "navigation"} aria-label="Navegación principal">
          <a href="#universo" onClick={() => setMenuOpen(false)}>Universo</a><a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#amilcar-ai" onClick={() => setMenuOpen(false)}>AMILCAR AI</a><a href="#terminal" onClick={() => { setTerminalOpen(true); setMenuOpen(false); }}>Terminal</a><a href="#sobre-mi" onClick={() => setMenuOpen(false)}>Sobre mí</a>
          <button className="sound-button" onClick={playTone} aria-pressed={soundOn}><span className={soundOn ? "sound-bars playing" : "sound-bars"}><i/><i/><i/><i/></span>{soundOn ? "SONIDO ON" : "SONIDO OFF"}</button>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-dot"/> SISTEMA EN LÍNEA <span className="pill-separator"/> BUILDING THE FUTURE</div>
          <p className="eyebrow"><span>✳</span> CREADOR DIGITAL INDEPENDIENTE</p>
          <h1>El futuro no se<br/>espera. <span>Se construye.</span></h1>
          <p className="hero-description">Un universo de código, ideas y experimentos. Explora mis proyectos, herramientas y sistemas creados para convertir la imaginación en tecnología.</p>
          <div className="hero-actions"><a className="button button-primary" href="#proyectos">Explorar proyectos <span>↗</span></a><a className="button button-ghost" href="/chat">Hablar con AMILCAR AI <span>✳</span></a><a className="button button-ghost" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer"><span className="github-glyph">⌘</span> Abrir GitHub</a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>A</span><span>AI</span><span>⌘</span></div><p><strong>Ideas en evolución.</strong><br/>Código abierto, curiosidad infinita.</p></div>
        </div>
        <div className="hero-visual" id="universo">
          <div className="visual-label label-top"><span className="label-pulse"/> PLANETA // 001 <span>LIVE RENDER</span></div>
          <Universe />
          <div className="orbit-tag tag-left"><span>◉</span><div>CORE ENGINE<small>THREE.JS / REALTIME</small></div></div>
          <div className="orbit-tag tag-right"><span>⌁</span><div>CREATIVE MODE<small>ALWAYS EXPLORING</small></div></div>
          <div className="visual-coordinates">-12.0464° S<br/>-77.0428° W <span>PERÚ · EARTH</span></div>
          <div className="visual-label label-bottom"><span>DRAG TO EXPLORE</span><span>✧</span><span>INTERACTIVE 3D</span></div>
        </div>
        <a className="scroll-cue" href="#proyectos"><span className="scroll-line"/> DESLIZA PARA EXPLORAR <span>↓</span></a>
      </section>

      <section className="ticker" aria-label="Áreas de trabajo"><div className="ticker-track">{Array.from({length:2}).map((_, index) => <span key={index}>OPEN SOURCE <b>✳</b> ARTIFICIAL INTELLIGENCE <b>✳</b> WEB EXPERIENCES <b>✳</b> BOT SYSTEMS <b>✳</b> ANDROID TOOLS <b>✳</b> CREATIVE CODE <b>✳</b></span>)}</div></section>

      <section className="section projects-section" id="proyectos">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01 /</span> EL MAPA ESTELAR</p><h2>Proyectos que<br/><span>están tomando forma.</span></h2></div><p className="section-intro">Cada repositorio es un pequeño universo. Explora el código, conoce su propósito y mira cómo evoluciona.</p></div>
        <div className="project-grid">{projects.map((project) => <a className={`project-card tone-${project.tone}`} href={project.href} key={project.name} target="_blank" rel="noreferrer" data-reveal><div className="card-top"><span className="project-number">{project.number} / NODE</span><span className="card-arrow">↗</span></div><div className="project-icon">{project.icon}</div><p className="project-type">{project.type}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="card-footer"><span>EXPLORAR PROYECTO</span><span>↗</span></div></a>)}</div>
        <div className="all-projects" data-reveal><span>¿Quieres ver todo el mapa?</span><a href="https://github.com/AmilcarGit?tab=repositories" target="_blank" rel="noreferrer">Todos los repositorios <span>↗</span></a></div>
      </section>

      <section className="feature-band" data-reveal><div className="feature-symbol">✳</div><div><p className="eyebrow">EXPERIMENTAR · APRENDER · COMPARTIR</p><h2>No se trata solo de escribir código.<br/><span>Se trata de abrir posibilidades.</span></h2></div><div className="feature-side"><span className="feature-line"/><p>INDEPENDIENTE<br/>POR NATURALEZA.</p></div></section>

      <section className="section ai-home-section" id="amilcar-ai">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>05 /</span> CONVERSACIÓN EXPERIMENTAL</p><h2>Habla con <span>AMILCAR AI.</span></h2></div><p className="section-intro">Prueba el motor propio con apoyo neuronal local. Las respuestas se generan en el servidor del sitio, sin enviar tus mensajes a una API externa de IA.</p></div>
        <AmilcarChat compact />
        <div className="ai-open-link" data-reveal><span>✧ CONVERSACIÓN COMPLETA</span><a href="/chat">Abrir la página independiente del chat <span>↗</span></a></div>
      </section>

      <section className="section about-section" id="sobre-mi">
        <div className="about-orb" data-reveal><div className="orb-ring orb-ring-one"/><div className="orb-ring orb-ring-two"/><div className="orb-core">A<span>✦</span></div><span className="orb-caption">CREATOR NODE</span></div>
        <div className="about-copy" data-reveal><p className="eyebrow"><span>02 /</span> DETRÁS DEL CÓDIGO</p><h2>Hola, soy<br/><span>AmilcarGit.</span></h2><p>Desarrollador independiente y creador digital. Me gusta construir bots, experimentar con inteligencia artificial, diseñar herramientas útiles y transformar ideas en proyectos reales.</p><p>Este espacio es mi laboratorio abierto: aquí comparto lo que construyo, lo que aprendo y lo que todavía estoy explorando.</p><div className="skill-cloud"><span>JavaScript</span><span>Node.js</span><span>Next.js</span><span>IA experimental</span><span>Termux</span><span>Open source</span></div><a className="text-link" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">Conoce mi GitHub <span>↗</span></a></div>
      </section>

      <section className="terminal-section" id="terminal">
        <div className="section-heading terminal-heading" data-reveal><div><p className="eyebrow"><span>03 /</span> ACCESO EXPERIMENTAL</p><h2>Un poco de <span>terminal.</span></h2></div><button className="terminal-open" onClick={() => setTerminalOpen(!terminalOpen)}>{terminalOpen ? "Cerrar terminal −" : "Abrir terminal +"} </button></div>
        <div className={terminalOpen ? "terminal-window terminal-expanded" : "terminal-window"} data-reveal><div className="terminal-titlebar"><div className="window-dots"><i/><i/><i/></div><span>amilcar@universe:~</span><span className="terminal-lock">◈ SAFE MODE</span></div><div className="terminal-content" aria-live="polite">{terminalLines.map((line,index)=><p className={line.startsWith("visitor@") ? "command-line" : "response-line"} key={`${index}-${line}`}>{line}</p>)}<form className="terminal-form" onSubmit={(event)=>{event.preventDefault();runCommand();}}><label htmlFor="terminal-input">visitor@amilcar:~$</label><input id="terminal-input" autoComplete="off" spellCheck={false} value={terminalInput} onChange={(event)=>setTerminalInput(event.target.value)} placeholder="escribe help..." /><button type="submit" aria-label="Ejecutar comando">↵</button></form></div><div className="terminal-bottom"><span><i/> DEMO LOCAL · SIN ACCESO AL SISTEMA</span><span>INTERACTIVE SHELL v1.0</span></div></div>
      </section>

      <section className="contact-section" data-reveal><div className="contact-grid"><div><p className="eyebrow"><span>04 /</span> SIGUIENTE TRANSMISIÓN</p><h2>Las buenas ideas<br/>no se quedan <span>en órbita.</span></h2></div><div className="contact-right"><p>¿Tienes una idea, encontraste un proyecto útil o quieres colaborar? Conectemos y hagamos algo interesante.</p><a className="button button-primary" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">Conectar en GitHub <span>↗</span></a><div className="social-links"><a href="https://www.tiktok.com/@amilkargit1" target="_blank" rel="noreferrer">TikTok ↗</a><a href="https://github.com/AmilcarGit?tab=repositories" target="_blank" rel="noreferrer">Repositorios ↗</a><a href="https://whatsapp.com/channel/0029VbELVHt47XeHAIlbHu03" target="_blank" rel="noreferrer">Canal WhatsApp ↗</a></div></div></div></section>

      <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">A<span>✦</span></span><span>AMILCAR<span className="brand-muted">GIT</span><small>DIGITAL UNIVERSE</small></span></a><p>HECHO CON CURIOSIDAD EN LA TIERRA · PERÚ <span>✳</span> © {new Date().getFullYear()} AMILCARGIT</p><a href="#inicio" className="back-top">VOLVER ARRIBA ↑</a></footer>

      <button className="floating-terminal" onClick={()=>setTerminalOpen(!terminalOpen)} aria-label="Abrir terminal interactiva"><span>⌘</span><small>TERMINAL</small></button>
      {secret && <div className="secret-overlay" role="dialog" aria-modal="true" aria-label="Mensaje secreto"><div className="secret-card"><button className="secret-close" onClick={()=>setSecret(false)} aria-label="Cerrar">×</button><span className="secret-star">✦</span><p className="eyebrow">EASTER EGG DESCUBIERTO</p><h2>Bienvenido al<br/><span>lado oculto.</span></h2><p>Las mejores ideas empiezan con curiosidad. Sigue explorando, sigue creando.</p><button className="button button-primary" onClick={()=>setSecret(false)}>Continuar explorando ↗</button></div></div>}
    </main>
  );
}
