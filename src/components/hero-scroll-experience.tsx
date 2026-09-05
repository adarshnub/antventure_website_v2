"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/tracked-link";

const chapters = [
  {
    id: "collective",
    number: "01",
    eyebrow: "Ant Venture / AI transformation",
    title: <h1>Collective Intelligence<br /><em>Engineered for Growth.</em></h1>,
    copy: "We coordinate AI, people and process into one operating system—so intelligence produces movement, not another dashboard.",
    actions: <><Link className="hero-action primary" href="#capabilities">See what we build <span>↓</span></Link><TrackedLink className="hero-action secondary" href="/contact-sales" eventName="request_demo_clicked" eventData={{ placement: "scroll_hero_intro" }}>Talk to us <span>↗</span></TrackedLink></>,
  },
  {
    id: "products",
    number: "02",
    eyebrow: "What we engineer",
    title: <h2>AI that moves work.<br /><em>Not just words.</em></h2>,
    copy: "From one repeatable task to an organization-wide intelligence layer, each system connects directly to the work already happening.",
    tags: ["Workflow transformation", "Organization Brain", "Revenue intelligence", "Sovereign AI"],
    actions: <><Link className="hero-action primary" href="#explore">Try a workflow <span>↘</span></Link><Link className="hero-action secondary" href="/work">View proof <span>↗</span></Link></>,
  },
  {
    id: "rolex",
    number: "03",
    eyebrow: "Flagship product / ROLE:X",
    title: <h2>A silent AI inside<br /><em>the tools you use.</em></h2>,
    copy: "ROLE:X reads the work, performs five repeatable actions and returns the consequential decision to a person.",
    metrics: [{ value: "5", label: "AI actions" }, { value: "1", label: "Human decision" }, { value: "~7d", label: "First workflow" }],
    actions: <><TrackedLink className="hero-action primary" href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "scroll_hero" }}>Experience ROLE:X <span>↗</span></TrackedLink><TrackedLink className="hero-action secondary" href="/contact-sales?reason=rolex" eventName="request_demo_clicked" eventData={{ placement: "scroll_hero_rolex" }}>Request demo <span>↗</span></TrackedLink></>,
  },
  {
    id: "contact",
    number: "04",
    eyebrow: "Your first move",
    title: <h2>Bring us one<br /><em>real workflow.</em></h2>,
    copy: "Show us the repeated work slowing your team down. We’ll map what AI handles, what remains human and where value becomes visible.",
    actions: <><TrackedLink className="hero-action primary" href="/contact-sales?reason=workflow" eventName="request_demo_clicked" eventData={{ placement: "scroll_hero_final" }}>Start the conversation <span>↗</span></TrackedLink><TrackedLink className="hero-action secondary" href="https://wa.me/971562903901" target="_blank" rel="noreferrer" eventName="whatsapp_clicked" eventData={{ placement: "scroll_hero" }}>WhatsApp <span>↗</span></TrackedLink></>,
  },
] as const;

export function HeroScrollExperience() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let target = 0;
    let active = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--hero-scroll-progress", target.toFixed(4));
      const next = Math.min(chapters.length - 1, Math.floor(target * chapters.length));
      if (next !== active) {
        active = next;
        setActiveIndex(next);
      }
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const active = chapters[activeIndex];
  return (
    <section ref={root} className={`hero-scroll hero-scene-${active.id}`} aria-label="Discover Ant Venture">
      <div className="hero-scroll-stage">
        <div className="hero-scroll-shade" />
        <div className="shell hero-scroll-shell">
          <div className="hero-scroll-meta"><span>Dubai · UAE</span><span>Move cursor · scroll to organize</span></div>
          <AnimatePresence mode="wait">
            <motion.div className="hero-chapter" key={active.id} initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -18 }} transition={{ duration: reducedMotion ? 0 : .38, ease: [.22, 1, .36, 1] }}>
              <p className="hero-chapter-label"><span>{active.number}</span>{active.eyebrow}</p>
              {active.title}
              <p className="hero-chapter-copy">{active.copy}</p>
              {"tags" in active && <div className="hero-product-tags">{active.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
              {"metrics" in active && <div className="hero-product-metrics">{active.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
              <div className="hero-chapter-actions">{active.actions}</div>
            </motion.div>
          </AnimatePresence>
          <div className="hero-scroll-progress" aria-hidden="true"><i /></div>
        </div>
        <nav className="hero-quick-nav" aria-label="Hero shortcuts">
          <Link href="#capabilities">Products</Link>
          <TrackedLink href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "hero_shortcut" }}>ROLE:X</TrackedLink>
          <TrackedLink href="/contact-sales" eventName="request_demo_clicked" eventData={{ placement: "hero_shortcut" }}>Contact</TrackedLink>
        </nav>
        <nav className="hero-scene-index" aria-label="Explore hero chapters">{chapters.map((chapter, index) => <button type="button" aria-label={`Show ${chapter.eyebrow}`} aria-current={index === activeIndex ? "step" : undefined} className={index === activeIndex ? "active" : ""} key={chapter.id} onClick={() => {
          const section = root.current;
          if (!section) return;
          const top = section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top + (section.offsetHeight - window.innerHeight) * (index === 0 ? 0 : (index + .25) / chapters.length), behavior: reducedMotion ? "instant" : "smooth" });
        }}><span>{chapter.number}</span>{["Discover", "Products", "ROLE:X", "Connect"][index]}</button>)}</nav>
      </div>
    </section>
  );
}
