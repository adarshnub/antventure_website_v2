"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const cards = ".proof-card, .team-grid article, .process-cards li, .principle-grid article, .page-hero-intro";

/** Delegated, event-driven polish: no per-card listeners or continuous RAF. */
export function ImmersiveSurfaces() {
  const pathname = usePathname();
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let active: HTMLElement | null = null;
    let entrance: Animation | undefined;
    const clear = () => {
      if (!active) return;
      active.style.removeProperty("--surface-rotation");
      active.removeAttribute("data-surface-active");
      active = null;
    };
    const sync = () => {
      clear();
      if (motion.matches) entrance?.cancel();
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType === "touch") return;
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>(cards) : null;
      if (card !== active) clear();
      if (!card) return;
      active = card;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--surface-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--surface-y", `${(y * 100).toFixed(1)}%`);
      card.style.setProperty("--surface-rotation", `${(.5 - y).toFixed(3)} ${(x - .5).toFixed(3)} 0 ${(Math.hypot(x - .5, y - .5) * 3).toFixed(2)}deg`);
      card.dataset.surfaceActive = "true";
    };
    // Animate only the entrance, never the persistent canvas or sticky shell.
    if (!motion.matches) {
      entrance = document.querySelector("main")?.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 360, easing: "ease-out" });
    }
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("blur", clear);
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", clear);
    return () => {
      clear(); entrance?.cancel();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", clear);
      window.removeEventListener("scroll", clear);
      window.removeEventListener("blur", clear);
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", clear);
    };
  }, [pathname]);
  return null;
}
