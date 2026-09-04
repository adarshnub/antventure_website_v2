"use client";

import { useEffect, useRef, useState } from "react";

type Particle = { sx: number; sy: number; tx: number; ty: number; size: number; phase: number };

const NODE_POINTS = [
  [0.5, 0.17], [0.31, 0.31], [0.69, 0.31], [0.19, 0.51], [0.5, 0.49], [0.81, 0.51],
  [0.31, 0.7], [0.69, 0.7], [0.5, 0.84],
] as const;
const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7],[6,8],[7,8],[1,2],[6,7]] as const;

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || videoReady) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let particles: Particle[] = [];

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = window.innerWidth < 768 ? 76 : 150;
      particles = Array.from({ length: count }, (_, index) => {
        const target = NODE_POINTS[index % NODE_POINTS.length];
        const angle = (index / count) * Math.PI * 2;
        const radius = 11 + ((index * 17) % 45);
        return {
          sx: ((index * 73) % 101) / 100 * width,
          sy: ((index * 47) % 97) / 96 * height,
          tx: target[0] * width + Math.cos(angle) * radius,
          ty: target[1] * height + Math.sin(angle) * radius,
          size: 0.7 + (index % 4) * 0.42,
          phase: (index % 13) / 13,
        };
      });
    };

    const ease = (value: number) => 1 - Math.pow(1 - value, 4);
    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      const cycle = reduced ? 1 : (time % 8000) / 8000;
      const settle = reduced ? 1 : cycle < 0.62 ? ease(cycle / 0.62) : cycle < 0.9 ? 1 : 1 - ease((cycle - 0.9) / 0.1);

      context.strokeStyle = `rgba(255,255,255,${0.08 * settle})`;
      context.lineWidth = 1;
      EDGES.forEach(([a, b]) => {
        context.beginPath();
        context.moveTo(NODE_POINTS[a][0] * width, NODE_POINTS[a][1] * height);
        context.lineTo(NODE_POINTS[b][0] * width, NODE_POINTS[b][1] * height);
        context.stroke();
      });

      particles.forEach((p) => {
        const driftX = Math.sin(time * 0.00028 + p.phase * 18) * 18;
        const driftY = Math.cos(time * 0.00021 + p.phase * 22) * 13;
        const x = p.sx + (p.tx - p.sx) * settle + driftX * (1 - settle);
        const y = p.sy + (p.ty - p.sy) * settle + driftY * (1 - settle);
        context.fillStyle = `rgba(255,255,255,${0.16 + settle * 0.46})`;
        context.beginPath();
        context.arc(x, y, p.size + settle * 0.4, 0, Math.PI * 2);
        context.fill();
      });
      if (!reduced) frame = requestAnimationFrame(render);
    };

    rebuild();
    render(5600);
    window.addEventListener("resize", rebuild);
    if (!reduced) frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", rebuild);
    };
  }, [videoReady]);

  return (
    <div className="hero-media" aria-hidden="true">
      <video className={videoReady ? "hero-video is-ready" : "hero-video"} autoPlay muted loop playsInline poster="/media/collective-growth-hero-poster.webp" onCanPlay={() => setVideoReady(true)}>
        <source src="/media/collective-growth-hero.webm" type="video/webm" />
        <source src="/media/collective-growth-hero.mp4" type="video/mp4" />
      </video>
      <canvas ref={canvasRef} className={videoReady ? "hero-network is-hidden" : "hero-network"} />
    </div>
  );
}
