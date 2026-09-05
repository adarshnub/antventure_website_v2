"use client";

import { type RefObject, useEffect, useRef } from "react";

type HeroParticleFieldProps = { scrollRef: RefObject<HTMLElement | null> };
type GalaxyStar = { radius: number; angle: number; arm: number; drift: number; thickness: number; size: number; color: string; twinkle: number };
type DustStar = { x: number; y: number; depth: number; size: number; color: string; twinkle: number };

const colors = ["117,232,255", "116,159,255", "143,245,223", "255,186,113", "255,125,109"];
const smooth = (value: number) => value * value * (3 - 2 * value);

export function HeroParticleField({ scrollRef }: HeroParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = scrollRef.current;
    if (!canvas || !section) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const galaxy: GalaxyStar[] = Array.from({ length: mobile ? 190 : 540 }, (_, index) => ({
      radius: 18 + Math.pow(Math.random(), .58) * 510,
      angle: Math.random() * Math.PI * 2,
      arm: index % 3,
      drift: .32 + Math.random() * .85,
      thickness: (Math.random() - .5) * 1.25,
      size: .32 + Math.pow(Math.random(), 4) * 2.25,
      color: colors[index % colors.length],
      twinkle: Math.random() * Math.PI * 2,
    }));
    const dust: DustStar[] = Array.from({ length: mobile ? 190 : 760 }, (_, index) => ({
      x: Math.random(), y: Math.random(), depth: .12 + Math.random() * .88,
      size: .25 + Math.pow(Math.random(), 5) * 1.8, color: colors[(index * 3) % colors.length], twinkle: Math.random() * Math.PI * 2,
    }));
    const pointer = { x: -1000, y: -1000, active: false };
    const pulse = { x: 0, y: 0, strength: 0 };
    let width = 1;
    let height = 1;
    let progress = 0;
    let frame = 0;
    let isVisible = true;
    let redraw = () => {};

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      progress = Math.min(1, Math.max(0, -rect.top / distance));
      if (reduceMotion) redraw();
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
    };
    const onPointerDown = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pulse.x = event.clientX - bounds.left;
      pulse.y = event.clientY - bounds.top;
      pulse.strength = 1;
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onVisibility = () => { isVisible = document.visibilityState === "visible"; };

    const lens = (x: number, y: number) => {
      if (!pointer.active || reduceMotion) return { x, y, proximity: 0 };
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - distance / 260);
      if (!proximity) return { x, y, proximity: 0 };
      const bend = proximity * proximity * 30;
      return { x: x + (dx / (distance || 1)) * bend, y: y + (dy / (distance || 1)) * bend, proximity };
    };
    const drawGlow = (x: number, y: number, radius: number, color: string, alpha: number) => {
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(${color}, ${alpha})`);
      glow.addColorStop(.22, `rgba(${color}, ${alpha * .34})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      context.fillStyle = glow;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const draw = (time: number) => {
      if (!isVisible) { frame = requestAnimationFrame(draw); return; }
      context.clearRect(0, 0, width, height);
      const turn = progress * Math.PI * 1.55 + time * .000035;
      const formation = smooth(Math.min(1, progress * 1.1));
      const centerX = width * (mobile ? .63 : .76) - formation * width * .055;
      const centerY = height * (.51 + Math.sin(turn * .5) * .018);
      const galaxyScale = Math.min(width, height) / 760;
      const zoom = 1.14 - formation * .27;

      const background = context.createRadialGradient(centerX, centerY, 15, centerX, centerY, Math.max(width, height) * .8);
      background.addColorStop(0, "rgba(9, 80, 124, .30)");
      background.addColorStop(.24, "rgba(5, 47, 87, .17)");
      background.addColorStop(.58, "rgba(2, 20, 41, .08)");
      background.addColorStop(1, "rgba(1, 9, 17, 0)");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const star of dust) {
        const x = ((star.x * width - progress * 95 * star.depth + width) % (width + 80)) - 40;
        const y = star.y * height + Math.sin(time * .00024 * star.depth + star.twinkle) * 4;
        const dot = lens(x, y);
        const alpha = (.2 + star.depth * .45) * (.7 + Math.sin(time * .0015 + star.twinkle) * .3);
        context.beginPath();
        context.arc(dot.x, dot.y, star.size + dot.proximity * 1.2, 0, Math.PI * 2);
        context.fillStyle = `rgba(${star.color}, ${alpha})`;
        context.fill();
      }

      context.save();
      context.translate(centerX, centerY);
      context.rotate(-.31 + turn * .17);
      for (let arm = 0; arm < 3; arm += 1) {
        context.save();
        context.rotate((Math.PI * 2 / 3) * arm);
        const haze = context.createRadialGradient(108 * galaxyScale, 0, 6, 108 * galaxyScale, 0, 360 * galaxyScale);
        haze.addColorStop(0, "rgba(83,210,255,.09)");
        haze.addColorStop(.42, arm === 1 ? "rgba(102,123,255,.06)" : "rgba(67,193,183,.045)");
        haze.addColorStop(1, "rgba(5,28,64,0)");
        context.fillStyle = haze;
        context.beginPath();
        context.ellipse(112 * galaxyScale, 0, 390 * galaxyScale, 55 * galaxyScale, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      context.restore();

      const anchors: { x: number; y: number }[] = [];
      for (let index = 0; index < galaxy.length; index += 1) {
        const star = galaxy[index];
        const radius = star.radius * galaxyScale * zoom;
        const angle = star.angle + star.arm * (Math.PI * 2 / 3) + radius * .0086 + turn * star.drift;
        const x = centerX + Math.cos(angle) * radius * 1.12;
        const y = centerY + Math.sin(angle) * radius * (.34 + formation * .1) + star.thickness * 42 * galaxyScale;
        const dot = lens(x, y);
        const coreWeight = Math.max(0, 1 - radius / (390 * galaxyScale));
        const shimmer = .65 + Math.sin(time * .0017 * star.drift + star.twinkle) * .35;
        const alpha = (.18 + coreWeight * .68) * shimmer;
        if (index % 13 === 0 && radius < 290 * galaxyScale) anchors.push({ x: dot.x, y: dot.y });
        if (star.size > 1.35) drawGlow(dot.x, dot.y, (8 + star.size * 7) * (1 + dot.proximity), star.color, alpha * .22);
        context.beginPath();
        context.arc(dot.x, dot.y, star.size * (1 + coreWeight * .34 + dot.proximity * 1.8), 0, Math.PI * 2);
        context.fillStyle = `rgba(${star.color}, ${alpha})`;
        context.fill();
      }

      context.lineWidth = .55;
      for (let index = 0; index < anchors.length; index += 1) {
        const star = anchors[index];
        for (let otherIndex = index + 1; otherIndex < anchors.length; otherIndex += 1) {
          const other = anchors[otherIndex];
          const distance = Math.hypot(star.x - other.x, star.y - other.y);
          if (distance > 110 || (index + otherIndex) % 3 === 0) continue;
          context.beginPath();
          context.moveTo(star.x, star.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(117,232,255, ${(1 - distance / 110) * (.08 + formation * .18)})`;
          context.stroke();
        }
      }

      drawGlow(centerX, centerY, (142 + formation * 100) * galaxyScale, "117,232,255", .19 + formation * .13);
      drawGlow(centerX, centerY, (35 + formation * 30) * galaxyScale, "204,255,247", .43);
      context.beginPath();
      context.arc(centerX, centerY, 2.8 + formation * 4, 0, Math.PI * 2);
      context.fillStyle = "rgba(223,255,249,.95)";
      context.fill();
      if (pointer.active) {
        drawGlow(pointer.x, pointer.y, 128, "143,245,223", .14);
        context.beginPath();
        context.arc(pointer.x, pointer.y, 18, 0, Math.PI * 2);
        context.strokeStyle = "rgba(159,244,223,.3)";
        context.stroke();
      }
      if (pulse.strength > .01) {
        context.beginPath();
        context.arc(pulse.x, pulse.y, (1 - pulse.strength) * 230, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255,203,124,${pulse.strength * .65})`;
        context.lineWidth = 1.2;
        context.stroke();
        pulse.strength *= .93;
      }
      context.globalCompositeOperation = "source-over";
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    redraw = () => draw(performance.now());
    resize();
    updateProgress();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (reduceMotion) redraw(); else frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} className="hero-particle-field" aria-hidden="true" />;
}
