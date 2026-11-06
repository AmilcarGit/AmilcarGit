import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:"/api/"},sitemap:"https://amilcargit.vercel.app/sitemap.xml"};}
