"use client";
import {useEffect,useState} from "react";
export default function LocaleToggle(){const [english,setEnglish]=useState(false);
 useEffect(()=>{const saved=localStorage.getItem("amilcargit:locale");setEnglish(saved==="en");},[]);
 const toggle=()=>{const next=!english;setEnglish(next);localStorage.setItem("amilcargit:locale",next?"en":"es");document.documentElement.lang=next?"en":"es";document.documentElement.dataset.locale=next?"en":"es";};
 return <button className="locale-toggle" onClick={toggle} aria-label={english?"Cambiar idioma a español":"Switch language to English"} aria-pressed={english}>{english?"EN":"ES"} <span>⌄</span></button>;
}
