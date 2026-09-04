"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const chapters = [
  { n: "01", kicker: "Observe", title: "Every signal enters the system.", copy: "Email. Documents. Calls. WhatsApp. The work stops disappearing between tools." },
  { n: "02", kicker: "Understand", title: "Context becomes structure.", copy: "The system reads what arrived, retrieves what matters and recognizes the workflow around it." },
  { n: "03", kicker: "Act", title: "ROLE:X moves inside the tools you use.", copy: "It prepares the repeatable work without asking your team to move into another platform." },
  { n: "04", kicker: "Decide", title: "Five AI actions. One human decision.", copy: "Automation handles the movement. Judgement, trust and accountability stay human." },
  { n: "05", kicker: "Expand", title: "One workflow becomes organizational intelligence.", copy: "Prove one useful system, then connect the next—without losing control." },
];

function scrub(video: HTMLVideoElement, progress: number) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  const desired = progress * Math.max(.01, video.duration - .04);
  if (Math.abs(video.currentTime - desired) > .024) video.currentTime = desired;
}

export function CinematicJourney() {
  const section = useRef<HTMLElement>(null);
  const firstVideo = useRef<HTMLVideoElement>(null);
  const secondVideo = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const root = section.current;
    const first = firstVideo.current;
    const second = secondVideo.current;
    if (!root || !first || !second) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let request = 0;
    let target = 0;
    let current = 0;
    let active = 0;
    const measure = () => {
      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, -rect.top / distance));
      const next = Math.min(chapters.length - 1, Math.floor(target * chapters.length));
      if (next !== active) {
        active = next;
        setChapter(next);
      }
    };
    const render = () => {
      current += (target - current) * .13;
      root.style.setProperty("--journey-progress", current.toFixed(4));
      const split = .53;
      scrub(first, Math.min(1, current / split));
      scrub(second, Math.max(0, (current - split) / (1 - split)));
      const blend = Math.min(1, Math.max(0, (current - .46) / .14));
      first.style.opacity = String(1 - blend);
      second.style.opacity = String(blend);
      request = requestAnimationFrame(render);
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    measure();
    request = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(request);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const active = chapters[chapter];
  return (
    <section ref={section} className="cinematic-journey" aria-labelledby="journey-title">
      <div className="journey-stage">
        <div className="journey-media" aria-hidden="true">
          <video ref={firstVideo} muted playsInline preload="auto" poster="/media/ai-system-journey-poster.webp">
            <source src="/media/ai-system-journey.webm" type="video/webm" />
            <source src="/media/ai-system-journey.mp4" type="video/mp4" />
          </video>
          <video ref={secondVideo} muted playsInline preload="auto" poster="/media/role-x-invisible-layer-poster.webp">
            <source src="/media/role-x-invisible-layer.webm" type="video/webm" />
            <source src="/media/role-x-invisible-layer.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="journey-overlay" />
        <div className="shell journey-shell">
          <div className="journey-topline"><span>ANT VENTURE / SYSTEM FILM</span><span>{active.n} — 05</span></div>
          <AnimatePresence mode="wait">
            <motion.div className="journey-copy" key={active.n} initial={{ opacity: 0, y: 45, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -28, filter: "blur(10px)" }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
              <p>{active.kicker}</p>
              <h2 id="journey-title">{active.title}</h2>
              <span>{active.copy}</span>
            </motion.div>
          </AnimatePresence>
          <div className="journey-progress" aria-hidden="true"><i /></div>
        </div>
        <div className="journey-index" aria-hidden="true">{chapters.map((item, index) => <span className={index === chapter ? "active" : ""} key={item.n}>{item.n}</span>)}</div>
      </div>
    </section>
  );
}
