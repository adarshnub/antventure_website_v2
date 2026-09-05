"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { createGalaxy } from "@/lib/galaxy-renderer";
import { ImmersiveSurfaces } from "@/components/immersive-surfaces";

// Deterministic SVG is visible immediately, and remains if WebGL cannot start.
function GalaxyFallback() {
  return <svg className="galaxy-fallback" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="galaxy-haze"><stop stopColor="#6babc4" stopOpacity=".24" /><stop offset="1" stopColor="#071123" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="1200" cy="400" rx="470" ry="220" fill="url(#galaxy-haze)" transform="rotate(-24 1200 400)" />
    {Array.from({ length: 540 }, (_, i) => {
      const r = Math.pow((i + 1) / 540, 1.25) * 510;
      const angle = (i % 4) * Math.PI / 2 + r * .012 + Math.sin(i * 43.7) * .16;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * .46;
      // Round to avoid platform-specific trig precision differences during hydration.
      return <circle key={i} cx={(1160 + x * .91 - y * -.41).toFixed(3)} cy={(430 + x * -.41 + y * .91).toFixed(3)} r={i % 21 === 0 ? 1.8 : .8} fill={i < 140 ? "#ffe3ba" : "#95cfe8"} opacity={.35 + (i % 5) * .12} />;
    })}
  </svg>;
}

export function GalaxyBackdrop() {
  const pathname = usePathname();
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ReturnType<typeof createGalaxy> | null>(null);
  useEffect(() => {
    let cancelled = false;
    // Import after hydration; no models, textures or videos need downloading.
    import("@/lib/galaxy-renderer").then(({ createGalaxy }) => {
      if (cancelled || !canvas.current) return;
      const main = document.querySelector("main");
      if (!main) return;
      try {
        controller.current = createGalaxy(canvas.current, main);
      } catch { canvas.current.dataset.ready = "false"; }
    }).catch(() => { /* Keep the static galaxy and all content usable. */ });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) controller.current?.setPage(main);
  }, [pathname]);
  return <>
    <ImmersiveSurfaces />
    <div className="galaxy-backdrop" aria-hidden="true"><GalaxyFallback /><canvas ref={canvas} className="galaxy-canvas" /><div className="galaxy-vignette" /></div>
  </>;
}
