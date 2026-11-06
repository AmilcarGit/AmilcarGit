import type {MetadataRoute} from "next";
import {projects} from "@/data/projects";
export default function sitemap():MetadataRoute.Sitemap{const base="https://amilcargit.vercel.app";return["","/chat","/laboratorio","/novedades","/servicios","/trayectoria","/privacidad","/condiciones","/preguntas","/cv",...projects.map(p=>"/proyectos/"+p.slug)].map(path=>({url:base+path,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:0.7}));}
