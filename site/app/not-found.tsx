import Link from "next/link";
export default function NotFound(){return <main className="simple-page not-found-page"><span className="eyebrow">404 / NODO NO ENCONTRADO</span><h1>Esta ruta se perdió <span>en el universo.</span></h1><p>La página que buscas no existe o cambió de ubicación.</p><Link className="button button-primary" href="/">Volver al inicio ↗</Link></main>}
