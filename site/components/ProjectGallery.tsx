import Image from "next/image";
import Link from "next/link";
const items=[
{name:"AMILCAR-AI",kind:"AI LAB",copy:"Motor experimental y herramientas locales",slug:"amilcar-ai",image:"/projects/amilcar-ai.svg"},
{name:"AmilcarTools",kind:"WEB TOOLKIT",copy:"Utilidades web para tareas diarias",slug:"amilcartools",image:"/projects/amilcartools.svg"},
{name:"YuiBot-MD",kind:"AUTOMATION",copy:"Arquitectura modular de comandos",slug:"yuibot-md",image:"/projects/yuibot-md.svg"},
{name:"S7-Bot-OFC",kind:"BOT SYSTEMS",copy:"Vinculación y herramientas de administración",slug:"s7-bot-ofc",image:"/projects/s7-bot.svg"}
];
export default function ProjectGallery(){return <div className="project-gallery">{items.map(item=><article className="gallery-item" key={item.name}><Link className="gallery-image-link" href={"/proyectos/"+item.slug} aria-label={"Ver "+item.name}><Image src={item.image} alt={"Ilustración de "+item.name} width={900} height={280} sizes="(max-width: 760px) 90vw, 25vw"/></Link><p>{item.kind} · ILUSTRACIÓN DE PROYECTO</p><h3>{item.name}</h3><span>{item.copy}</span><Link href={"/proyectos/"+item.slug}>Explorar proyecto ↗</Link></article>)}</div>}
