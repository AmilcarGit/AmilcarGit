"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Universe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);

    const planet = new THREE.Group();
    scene.add(planet);
    const geometry = new THREE.SphereGeometry(1.35, mobile ? 48 : 80, mobile ? 48 : 80);
    const material = new THREE.MeshStandardMaterial({ color: 0x5d43a7, roughness: 0.72, metalness: 0.12, emissive: 0x190c3c, emissiveIntensity: 0.45 });
    const globe = new THREE.Mesh(geometry, material);
    planet.add(globe);

    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
      gradient.addColorStop(0, "#211344"); gradient.addColorStop(0.45, "#7045a8"); gradient.addColorStop(0.72, "#182b66"); gradient.addColorStop(1, "#120a2c");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 24; i++) {
        const x = (i * 173 + 37) % 1024; const y = (i * 97 + 29) % 512;
        ctx.beginPath(); ctx.ellipse(x, y, 30 + (i % 5) * 18, 8 + (i % 4) * 5, i * 0.23, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 ? "rgba(255,113,220,0.20)" : "rgba(72,196,255,0.16)"; ctx.fill();
      }
      ctx.strokeStyle = "rgba(190,177,255,0.22)"; ctx.lineWidth = 1;
      for (let y = 24; y < 512; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke(); }
      for (let x = 24; x < 1024; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke(); }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    material.map = texture; material.needsUpdate = true;

    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.43, 48, 48), new THREE.MeshBasicMaterial({ color: 0x9d76ff, transparent: true, opacity: 0.13, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
    planet.add(atmosphere);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.012, 6, 180), new THREE.MeshBasicMaterial({ color: 0x9f7bff, transparent: true, opacity: 0.72 }));
    ring.rotation.x = 1.18; ring.rotation.y = -0.24; planet.add(ring);
    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.004, 4, 180), new THREE.MeshBasicMaterial({ color: 0x52d8ff, transparent: true, opacity: 0.45 }));
    ringTwo.rotation.x = 1.1; ringTwo.rotation.y = 0.4; planet.add(ringTwo);

    scene.add(new THREE.AmbientLight(0x8f87c9, 1.5));
    const keyLight = new THREE.PointLight(0x9f73ff, 65, 18); keyLight.position.set(3, 3, 5); scene.add(keyLight);
    const cyanLight = new THREE.PointLight(0x31caff, 28, 14); cyanLight.position.set(-4, -1, 2); scene.add(cyanLight);

    const starCount = mobile ? 650 : 1250;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const cyan = Math.random() > 0.82;
      colors[i * 3] = cyan ? 0.32 : 0.68; colors[i * 3 + 1] = cyan ? 0.82 : 0.55; colors[i * 3 + 2] = 1;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: mobile ? 0.025 : 0.018, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true }));
    scene.add(stars);

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(220 * 3);
    for (let i = 0; i < dustPositions.length; i++) dustPositions[i] = (Math.random() - 0.5) * 6.5;
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xe1caff, size: 0.035, transparent: true, opacity: 0.65 }));
    scene.add(dust);

    let targetX = 0; let targetY = 0; let pointerX = 0; let pointerY = 0; let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.35;
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; };
    const resize = () => {
      const width = host.clientWidth || 1; const height = host.clientHeight || 1;
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
    };
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    const observer = new ResizeObserver(resize); observer.observe(host);
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      if (!reducedMotion) {
        planet.rotation.y += 0.0018; stars.rotation.y -= 0.00012; dust.rotation.z += 0.00025;
        pointerX += (targetX - pointerX) * 0.035; pointerY += (targetY - pointerY) * 0.035;
        planet.rotation.x = pointerX; planet.rotation.z = pointerY * 0.3;
        ring.rotation.z += 0.00035; ringTwo.rotation.z -= 0.0002;
      }
      renderer.render(scene, camera);
    };
    animate();
    setReady(true);
    return () => {
      window.cancelAnimationFrame(frame); observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove); host.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose(); material.map?.dispose(); material.dispose(); atmosphere.geometry.dispose(); (atmosphere.material as THREE.Material).dispose();
      ring.geometry.dispose(); (ring.material as THREE.Material).dispose(); ringTwo.geometry.dispose(); (ringTwo.material as THREE.Material).dispose();
      starGeometry.dispose(); (stars.material as THREE.Material).dispose(); dustGeometry.dispose(); (dust.material as THREE.Material).dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="universe-canvas" ref={mountRef} aria-label="Planeta 3D interactivo con estrellas y anillos" role="img"><div className={ready ? "canvas-loading hidden" : "canvas-loading"}><span className="loading-orbit"/> INICIALIZANDO UNIVERSO...</div><div className="planet-crosshair" aria-hidden="true">+</div></div>;
}
