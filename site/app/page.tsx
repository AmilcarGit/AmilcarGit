"use client";

import { useEffect, useRef, useState } from "react";
import Universe from "@/components/Universe";
import AmilcarChat from "@/components/AmilcarChat";
import ProjectExplorer from "@/components/ProjectExplorer";
import LocalInsights from "@/components/LocalInsights";
import UniverseMap from "@/components/UniverseMap";
import ServiceContact from "@/components/ServiceContact";
import LocaleToggle from "@/components/LocaleToggle";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectGallery from "@/components/ProjectGallery";

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
  const terminalInputRef = useRef<HTMLInputElement>(null);

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

  const toggleTerminal = () => {
    if (terminalOpen) {
      setTerminalOpen(false);
      return;
    }
    setTerminalOpen(true);
    window.requestAnimationFrame(() => {
      document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => terminalInputRef.current?.focus({ preventScroll: true }), 450);
    });
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
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="AMILCARGIT, inicio"><span className="brand-mark">A<span>✦</span></span><span>AMILCAR<span className="brand-muted">GIT</span><small>DIGITAL UNIVERSE</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}><span/><span/><span/></button>
        <nav className={menuOpen ? "navigation nav-open" : "navigation"} aria-label="Navegación principal">
          <a href="#universo" onClick={() => setMenuOpen(false)}>Universo</a><a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#laboratorio" onClick={() => setMenuOpen(false)}>Laboratorio</a><a href="#amilcar-ai" onClick={() => setMenuOpen(false)}>AMILCAR AI</a><a href="#sobre-mi" onClick={() => setMenuOpen(false)}>Sobre mí</a><a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a><LocaleToggle /><ThemeToggle />
          <button className="sound-button" onClick={playTone} aria-pressed={soundOn}><span className={soundOn ? "sound-bars playing" : "sound-bars"}><i/><i/><i/><i/></span>{soundOn ? "SONIDO ON" : "SONIDO OFF"}</button>
        </nav>
      </header>

      <div id="contenido" />
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-dot"/> DESARROLLADOR INDEPENDIENTE <span className="pill-separator"/> PERÚ</div>
          <p className="eyebrow"><span>✳</span> CREADOR DIGITAL INDEPENDIENTE</p>
          <h1>El futuro no se<br/>espera. <span>Se construye.</span></h1>
          <p className="hero-description">Diseño y desarrollo bots, herramientas digitales y experiencias web. También experimento con motores de inteligencia artificial propios y proyectos de código abierto.</p>
          <div className="hero-actions"><a className="button button-primary" href="#proyectos">Explorar proyectos <span>↗</span></a><a className="button button-ghost" href="/chat">Hablar con AMILCAR AI <span>✳</span></a><a className="button button-ghost" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer"><span className="github-glyph">⌘</span> Abrir GitHub</a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>JS</span><span>AI</span><span>⌘</span></div><p><strong>Aprender construyendo.</strong><br/>Proyectos reales, mejoras constantes.</p></div>
        </div>
        <div className="hero-visual" id="universo">
          <div className="visual-label label-top"><span className="label-pulse"/> PLANETA // 001 <span>LIVE RENDER</span></div>
          <Universe />
          <div className="orbit-tag tag-left"><span>◉</span><div>CORE ENGINE<small>THREE.JS / REALTIME</small></div></div>
          <div className="orbit-tag tag-right"><span>⌁</span><div>CREATIVE MODE<small>ALWAYS EXPLORING</small></div></div>
          <div className="visual-coordinates">-12.0464° S<br/>-77.0428° W <span>PERÚ · EARTH</span></div>
          <div className="visual-label label-bottom"><span>ARRASTRA PARA EXPLORAR</span><span>✧</span><span>INTERACTIVE 3D</span></div>
        </div>
        <a className="scroll-cue" href="#proyectos"><span className="scroll-line"/> DESLIZA PARA EXPLORAR <span>↓</span></a>
      </section>

      <section className="ticker" aria-label="Áreas de trabajo"><div className="ticker-track">{Array.from({length:2}).map((_, index) => <span key={index}>OPEN SOURCE <b>✳</b> ARTIFICIAL INTELLIGENCE <b>✳</b> WEB EXPERIENCES <b>✳</b> BOT SYSTEMS <b>✳</b> ANDROID TOOLS <b>✳</b> CREATIVE CODE <b>✳</b></span>)}</div></section>

      <section className="section projects-section" id="proyectos">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01 /</span> EL MAPA ESTELAR</p><h2>Ideas convertidas<br/><span>en proyectos reales.</span></h2></div><p className="section-intro">Una selección de proyectos propios: herramientas, automatización e inteligencia artificial experimental. Entra, revisa el código y descubre qué puedes construir.</p></div>
        <ProjectExplorer />
        <div className="all-projects" data-reveal><span>¿Quieres ver todo el mapa?</span><a href="https://github.com/AmilcarGit?tab=repositories" target="_blank" rel="noreferrer">Todos los repositorios <span>↗</span></a></div>
      </section>

      <section className="section gallery-section" id="galeria">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01.2 /</span> GALERÍA DEL ECOSISTEMA</p><h2>Una mirada a <span>lo que construyo.</span></h2></div><p className="section-intro">Vistas gráficas de identidad y concepto. Las capturas reales de cada aplicación se irán incorporando cuando estén disponibles.</p></div>
        <ProjectGallery />
      </section>
      <section className="section stats-section" id="estadisticas">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>01.5 /</span> ACTIVIDAD DEL UNIVERSO</p><h2>Un vistazo al <span>ecosistema.</span></h2></div><p className="section-intro">Datos del catálogo y de este navegador. No consultamos una API externa ni enviamos estadísticas a terceros.</p></div>
        <LocalInsights />
      </section>

      <section className="feature-band" data-reveal><div className="feature-symbol">✳</div><div><p className="eyebrow">EXPERIMENTAR · APRENDER · COMPARTIR</p><h2>Construir es aprender.<br/><span>Compartir hace que avance.</span></h2></div><div className="feature-side"><span className="feature-line"/><p>INDEPENDIENTE<br/>POR NATURALEZA.</p></div></section>

      <section className="section technology-section" id="tecnologias">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>02 /</span> HERRAMIENTAS DE TRABAJO</p><h2>Tecnología para<br/><span>crear y experimentar.</span></h2></div><p className="section-intro">Trabajo con herramientas que me permiten crear desde el móvil o el ordenador, priorizando soluciones prácticas y código que pueda entenderse y mantenerse.</p></div>
        <div className="technology-grid" data-reveal>
          <article className="technology-card"><span>01 / WEB</span><h3>Desarrollo web</h3><p>Interfaces, experiencias interactivas y aplicaciones web.</p><div className="technology-tags"><b>JavaScript</b><b>React</b><b>Next.js</b><b>HTML · CSS</b></div></article>
          <article className="technology-card"><span>02 / AUTOMATION</span><h3>Bots y automatización</h3><p>Comandos, integraciones y herramientas para comunidades.</p><div className="technology-tags"><b>Node.js</b><b>Baileys</b><b>Telegram</b><b>CLI</b></div></article>
          <article className="technology-card"><span>03 / AI LAB</span><h3>IA experimental</h3><p>Motores propios, aprendizaje local y pruebas de generación.</p><div className="technology-tags"><b>AMILCAR-AI</b><b>Python</b><b>JavaScript</b><b>Local-first</b></div></article>
          <article className="technology-card"><span>04 / MOBILE</span><h3>Android y Termux</h3><p>Desarrollo y pruebas directamente desde entornos móviles.</p><div className="technology-tags"><b>Android</b><b>Termux</b><b>Git</b><b>Linux</b></div></article>
        </div>
      </section>

      <section className="section trajectory-section" id="trayectoria">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>02.5 /</span> MI RECORRIDO</p><h2>Aprender haciendo.<br/><span>Construir compartiendo.</span></h2></div><p className="section-intro">Un camino práctico: curiosidad, prototipos, pruebas y proyectos públicos.</p></div>
        <div className="journey-cards"><article><span>01 / EXPLORAR</span><h3>Curiosidad</h3><p>Investigar tecnologías y detectar ideas que merecen convertirse en proyectos.</p></article><article><span>02 / CONSTRUIR</span><h3>Experimentación</h3><p>Crear, probar y aprender desde el código, incluso desde Android y Termux.</p></article><article><span>03 / COMPARTIR</span><h3>Código abierto</h3><p>Documentar avances y abrir repositorios para que otras personas puedan explorar.</p></article></div>
        <a className="text-link" href="/trayectoria">Leer mi trayectoria completa ↗</a>
      </section>

      <section className="section ai-home-section" id="amilcar-ai">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>AI /</span> CONVERSACIÓN EXPERIMENTAL</p><h2>Habla con <span>AMILCAR AI.</span></h2></div><p className="section-intro">Un proyecto en desarrollo que explora generación de respuestas con un motor propio y apoyo neuronal local. No utiliza una API externa de IA; sus respuestas siguen siendo experimentales y pueden equivocarse.</p></div>
        <AmilcarChat compact />
        <div className="ai-open-link" data-reveal><span>✧ CONVERSACIÓN COMPLETA</span><a href="/chat">Abrir la página independiente del chat <span>↗</span></a></div>
      </section>

      <section className="section about-section" id="sobre-mi">
        <div className="about-orb" data-reveal><div className="orb-ring orb-ring-one"/><div className="orb-ring orb-ring-two"/><div className="orb-core">A<span>✦</span></div><span className="orb-caption">CREATOR NODE</span></div>
        <div className="about-copy" data-reveal><p className="eyebrow"><span>03 /</span> DETRÁS DEL CÓDIGO</p><h2>Hola, soy<br/><span>AmilcarGit.</span></h2><p>Soy desarrollador independiente y creador de proyectos digitales. Me interesa construir herramientas útiles, automatizar tareas y explorar nuevas formas de crear software.</p><p>Aprendo haciendo: pruebo ideas, reviso lo que no funciona y mejoro cada proyecto paso a paso. Este sitio reúne ese proceso y deja el código al alcance de quien quiera explorarlo.</p><div className="skill-cloud"><span>JavaScript</span><span>Node.js</span><span>Next.js</span><span>IA experimental</span><span>Termux</span><span>Open source</span></div><a className="text-link" href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">Conoce mi GitHub <span>↗</span></a></div>
      </section>

      <section className="section lab-section" id="laboratorio">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>04 /</span> LABORATORIO EXPERIMENTAL</p><h2>Un universo de <span>prototipos.</span></h2></div><p className="section-intro">Explora los nodos de proyectos y los experimentos que todavía están evolucionando.</p></div>
        <UniverseMap />
        <div className="lab-links"><a href="/laboratorio">Ver laboratorio completo ↗</a><a href="/novedades">Novedades y versiones ↗</a><a href="/preguntas">Preguntas frecuentes ↗</a></div>
      </section>
      <section className="section services-section" id="servicios">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>04.5 /</span> COLABORACIONES</p><h2>Ideas que podemos <span>construir.</span></h2></div><p className="section-intro">Áreas de trabajo y propuestas que podemos explorar juntos.</p></div>
        <div className="service-grid"><article><span>01</span><h3>Desarrollo web</h3><p>Experiencias y herramientas web adaptadas a cada idea.</p></article><article><span>02</span><h3>Bots y automatización</h3><p>Comandos, flujos y herramientas para comunidades.</p></article><article><span>03</span><h3>Herramientas digitales</h3><p>Utilidades centradas en resolver tareas concretas.</p></article><article><span>04</span><h3>Código abierto</h3><p>Documentación, pruebas y colaboración en repositorios.</p></article></div>
        <a className="text-link" href="/servicios">Conocer áreas de colaboración ↗</a>
      </section>
      <section className="section faq-preview" id="preguntas">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span>05 /</span> RESPUESTAS RÁPIDAS</p><h2>Preguntas <span>frecuentes.</span></h2></div><a className="text-link" href="/preguntas">Ver todas las preguntas ↗</a></div>
        <div className="faq-list"><details><summary>¿AMILCAR AI depende de una API externa?</summary><p>No. El sitio utiliza el paquete AMILCAR-AI integrado en el proyecto. Sus respuestas son experimentales y pueden equivocarse.</p></details><details><summary>¿Puedo revisar o reutilizar los proyectos?</summary><p>Sí, visita sus repositorios y consulta la licencia y documentación de cada uno.</p></details><details><summary>¿Se guardan mis preferencias y conversaciones?</summary><p>Los favoritos, preferencias y el historial del chat pueden guardarse localmente en tu navegador, no en una cuenta sincronizada.</p></details></div>
      </section>

      <section className="terminal-section" id="terminal">
        <div className="section-heading terminal-heading" data-reveal><div><p className="eyebrow"><span>04 /</span> UNA PEQUEÑA DEMOSTRACIÓN</p><h2>Explora la <span>terminal demo.</span></h2></div><button className="terminal-open" onClick={toggleTerminal}>{terminalOpen ? "Cerrar terminal −" : "Abrir terminal +"} </button></div>
        <div className={terminalOpen ? "terminal-window terminal-expanded" : "terminal-window"} data-reveal><div className="terminal-titlebar"><div className="window-dots"><i/><i/><i/></div><span>amilcar@universe:~</span><span className="terminal-lock">◈ SAFE MODE</span></div><div className="terminal-content" aria-live="polite">{terminalLines.map((line,index)=><p className={line.startsWith("visitor@") ? "command-line" : "response-line"} key={`${index}-${line}`}>{line}</p>)}<form className="terminal-form" onSubmit={(event)=>{event.preventDefault();runCommand();}}><label htmlFor="terminal-input">visitor@amilcar:~$</label><input id="terminal-input" ref={terminalInputRef} autoComplete="off" spellCheck={false} value={terminalInput} onChange={(event)=>setTerminalInput(event.target.value)} placeholder="escribe help..." /><button type="submit" aria-label="Ejecutar comando">↵</button></form></div><div className="terminal-bottom"><span><i/> DEMO LOCAL · SIN ACCESO AL SISTEMA</span><span>INTERACTIVE SHELL v1.0</span></div></div>
      </section>

      <section className="contact-section" id="contacto" data-reveal><div className="contact-grid"><div><p className="eyebrow"><span>06 /</span> HABLEMOS</p><h2>¿Tienes una idea?<br/><span>Hagámosla realidad.</span></h2><p className="contact-note">Cuéntame qué te gustaría construir o en qué proyecto te gustaría colaborar.</p><div className="social-links"><a href="https://github.com/AmilcarGit" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.tiktok.com/@amilkargit1" target="_blank" rel="noreferrer">TikTok ↗</a><a href="https://whatsapp.com/channel/0029VbELVHt47XeHAIlbHu03" target="_blank" rel="noreferrer">Canal WhatsApp ↗</a></div></div><div className="contact-right"><ServiceContact /></div></div></section>

      <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">A<span>✦</span></span><span>AMILCAR<span className="brand-muted">GIT</span><small>DIGITAL UNIVERSE</small></span></a><p>HECHO CON CURIOSIDAD EN LA TIERRA · PERÚ <span>✳</span> © {new Date().getFullYear()} AMILCARGIT</p><div className="footer-links"><a href="/cv">Perfil / CV</a><a href="/privacidad">Privacidad</a><a href="/condiciones">Condiciones</a><a href="/preguntas">FAQ</a><a href="/novedades">Novedades</a></div><a href="#inicio" className="back-top">VOLVER ARRIBA ↑</a></footer>

      <button className="floating-terminal" onClick={toggleTerminal} aria-label={terminalOpen ? "Cerrar terminal interactiva" : "Abrir terminal interactiva"} aria-expanded={terminalOpen}><span>⌘</span><small>TERMINAL</small></button>
      {secret && <div className="secret-overlay" role="dialog" aria-modal="true" aria-label="Mensaje secreto"><div className="secret-card"><button className="secret-close" onClick={()=>setSecret(false)} aria-label="Cerrar">×</button><span className="secret-star">✦</span><p className="eyebrow">EASTER EGG DESCUBIERTO</p><h2>Bienvenido al<br/><span>lado oculto.</span></h2><p>Las mejores ideas empiezan con curiosidad. Sigue explorando, sigue creando.</p><button className="button button-primary" onClick={()=>setSecret(false)}>Continuar explorando ↗</button></div></div>}
    </main>
  );
}
