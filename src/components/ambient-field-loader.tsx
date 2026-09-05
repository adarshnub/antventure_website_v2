"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const AmbientField = dynamic(() => import("@/components/ambient-field"), {
  ssr: false,
});

export function AmbientFieldLoader() {
  const pathname = usePathname();
  return pathname === "/" ? null : <InnerPageAmbient />;
}

function InnerPageAmbient() {
  const aura = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = aura.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    let x = window.innerWidth * .5;
    let y = window.innerHeight * .5;
    let currentX = x;
    let currentY = y;
    let frame = 0;
    const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY; };
    const render = () => {
      currentX += (x - currentX) * .13;
      currentY += (y - currentY) * .13;
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return <><AmbientField /><div ref={aura} className="cursor-aura" aria-hidden="true" /></>;
}
