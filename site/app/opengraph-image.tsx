import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AMILCARGIT — Un universo de ideas, código e inteligencia artificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", alignItems: "center", background: "linear-gradient(125deg, #070711 0%, #100b26 54%, #17102e 100%)", color: "white", fontFamily: "Arial, sans-serif" }}>
        <div style={{ position: "absolute", width: 640, height: 640, right: -90, top: -170, borderRadius: 320, border: "2px solid rgba(139,130,255,.24)", display: "flex" }} />
        <div style={{ position: "absolute", width: 490, height: 490, right: -10, top: -95, borderRadius: 245, border: "1px solid rgba(117,244,255,.28)", display: "flex" }} />
        <div style={{ position: "absolute", width: 550, height: 185, right: -15, top: 205, borderRadius: "50%", border: "2px solid rgba(117,244,255,.72)", transform: "rotate(-32deg)", display: "flex" }} />
        <div style={{ position: "absolute", width: 10, height: 10, right: 190, top: 125, borderRadius: 10, background: "#8efcff", boxShadow: "0 0 28px #8efcff", display: "flex" }} />
        <div style={{ position: "absolute", width: 7, height: 7, right: 125, bottom: 155, borderRadius: 10, background: "#ff8fe8", display: "flex" }} />
        <div style={{ position: "absolute", right: 125, top: 100, width: 320, height: 320, borderRadius: 180, background: "radial-gradient(circle, rgba(120,95,255,.23), rgba(120,95,255,0) 70%)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "70px 78px", width: "78%", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 45 }}>
            <div style={{ display: "flex", width: 62, height: 62, borderRadius: 18, alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #17102e, #090a18)", border: "1px solid rgba(142,252,255,.65)", color: "#aefbff", fontSize: 43, fontWeight: 800 }}>A</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 23, fontWeight: 800, letterSpacing: 4 }}>AMILCAR<span style={{ color: "#8efcff" }}>GIT</span></div>
              <div style={{ display: "flex", color: "#a8a4c8", fontSize: 12, letterSpacing: 4, marginTop: 5 }}>DIGITAL UNIVERSE</div>
            </div>
          </div>
          <div style={{ display: "flex", color: "#8efcff", fontSize: 17, letterSpacing: 4, marginBottom: 20 }}>✦ CÓDIGO · CREATIVIDAD · FUTURO</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            <span>El futuro no se</span>
            <span style={{ color: "#b5a5ff" }}>espera. Se construye.</span>
          </div>
          <div style={{ display: "flex", color: "#c6c3dc", fontSize: 22, marginTop: 28 }}>Proyectos, herramientas web, bots y AMILCAR AI.</div>
          <div style={{ display: "flex", color: "#8efcff", fontSize: 18, marginTop: 38 }}>amilcargit.vercel.app ↗</div>
        </div>
        <div style={{ position: "absolute", right: 125, top: 175, fontSize: 210, fontWeight: 800, color: "rgba(172,159,255,.9)", textShadow: "0 0 45px rgba(142,252,255,.25)", display: "flex" }}>A</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #8efcff, #a78bfa, #ff8fe8)", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}