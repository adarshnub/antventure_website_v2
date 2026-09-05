"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { createGalaxy } from "@/lib/galaxy-renderer";
import { ImmersiveSurfaces } from "@/components/immersive-surfaces";

const formations = [
  { name: "Spiral", description: "Independent signals, moving as one." },
  { name: "Orbit", description: "A continuous loop of intelligence and action." },
  { name: "Helix", description: "Human judgment and AI, working together." },
  { name: "Collective", description: "People. Process. Intelligence. Connected." },
];

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
  const observatory = useRef<HTMLDialogElement>(null);
  const launchButton = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);
  const [formation, setFormation] = useState(0);
  const [dispersion, setDispersion] = useState(0);

  function toggleMotion() {
    controller.current?.setPaused(!paused);
    setPaused(!paused);
  }
  function openObservatory() {
    observatory.current?.showModal();
    controller.current?.setFocus(true);
  }
  function closeObservatory() {
    controller.current?.setFocus(false);
    launchButton.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    let cancelled = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(reduced.matches);
    reduced.addEventListener("change", sync);
    // Import after hydration; no models, textures or videos need downloading.
    import("@/lib/galaxy-renderer").then(({ createGalaxy }) => {
      if (cancelled || !canvas.current) return;
      const main = document.querySelector("main");
      if (!main) return;
      try {
        controller.current = createGalaxy(canvas.current, main);
        setAvailable(true);
        sync();
      } catch { canvas.current.dataset.ready = "false"; }
    }).catch(() => { /* Keep the static galaxy and all content usable. */ });
    return () => { cancelled = true; reduced.removeEventListener("change", sync); controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) controller.current?.setPage(main);
  }, [pathname]);
  return <>
    <ImmersiveSurfaces paused={paused} />
    <div className="galaxy-backdrop" aria-hidden="true"><GalaxyFallback /><canvas ref={canvas} className="galaxy-canvas" /><div className="galaxy-vignette" /></div>
    {available && <div className="galaxy-tools">
      <button ref={launchButton} type="button" className="galaxy-observe" onClick={openObservatory} aria-haspopup="dialog"><span aria-hidden="true">✧</span> Explore the galaxy</button>
      <button type="button" className="galaxy-motion" aria-pressed={paused} onClick={toggleMotion}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Resume motion" : "Pause motion"}</button>
    </div>}
    <dialog ref={observatory} className="galaxy-observatory" aria-labelledby="observatory-title" aria-describedby="observatory-description" onClose={closeObservatory}>
      <div className="observatory-top">
        <div><p className="eyebrow">ANT VENTURE / OBSERVATORY</p><h2 id="observatory-title">One universe.<br /><em>Infinite connections.</em></h2></div>
        <button type="button" className="observatory-close" autoFocus onClick={() => observatory.current?.close()}>Back to website <span aria-hidden="true">×</span></button>
      </div>
      <p className="observatory-hint" id="observatory-description"><span className="observatory-cursor-hint">Move your cursor through the stars. </span>Choose a formation, then pull it apart.</p>
      <div className="observatory-console">
        <div className="observatory-formations" role="group" aria-label="Galaxy formation">
          {formations.map((item, index) => <button type="button" key={item.name} aria-pressed={formation === index} onClick={() => { setFormation(index); controller.current?.setFormation(index, dispersion); }}><span aria-hidden="true">0{index + 1}</span>{item.name}</button>)}
        </div>
        <p className="observatory-caption" aria-live="polite">{formations[formation].description}</p>
        <div className="observatory-adjustments">
          <label htmlFor="galaxy-dispersion">Disperse the stars <input id="galaxy-dispersion" type="range" min="0" max="1.5" step=".05" value={dispersion} aria-valuetext={`${Math.round(dispersion / 1.5 * 100)} percent dispersed`} onChange={(event) => { const value = Number(event.target.value); setDispersion(value); controller.current?.setFormation(formation, value); }} /></label>
          <button type="button" aria-pressed={paused} onClick={toggleMotion}>{paused ? "Resume motion" : "Pause motion"}</button>
        </div>
      </div>
    </dialog>
  </>;
}
