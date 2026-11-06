"use client";
import {useEffect,useState} from "react";
import {projects} from "@/data/projects";
export default function LocalInsights(){const [visits,setVisits]=useState<number|null>(null);const [returning,setReturning]=useState(false);
 useEffect(()=>{try{const key="amilcargit:local-analytics";const data=JSON.parse(localStorage.getItem(key)||'{"visits":0,"last":0}');const today=new Date().toDateString();const next={visits:(Number(data.visits)||0)+1,last:today};setVisits(next.visits);setReturning(data.last===today);localStorage.setItem(key,JSON.stringify(next));}catch{setVisits(null)}},[]);
 return <div className="insights-grid"><article><strong>{projects.length.toString().padStart(2,"0")}</strong><span>PROYECTOS EN CATÁLOGO</span></article><article><strong>04</strong><span>ÁREAS DE TRABAJO</span></article><article><strong>{visits===null?"—":visits.toString().padStart(2,"0")}</strong><span>VISITAS EN ESTE NAVEGADOR</span></article><article><strong>{returning?"↻":"✳"}</strong><span>{returning?"VISITA DE HOY":"ANALÍTICA LOCAL"}</span></article></div>;
}
