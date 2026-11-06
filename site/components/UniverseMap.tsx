"use client";
import Link from "next/link";
import {projects} from "@/data/projects";
export default function UniverseMap(){return <div className="universe-map"><div className="map-nebula"/><div className="map-orbit map-orbit-one"/><div className="map-orbit map-orbit-two"/><div className="map-core"><span>✳</span><small>AMILCARGIT</small></div>{projects.map((p,i)=><Link key={p.slug} className={`map-node map-node-${i+1}`} href={`/proyectos/${p.slug}`}><i/><span>{p.name}</span></Link>)}<p className="map-caption">MAPA DE PROYECTOS · EXPLORA CADA NODO</p></div>}
