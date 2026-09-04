import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { team } from "@/lib/content";

export const metadata: Metadata = { title: "About", description: "A Dubai-based AI transformation company built around collective intelligence.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero index="03" eyebrow="About Ant Venture" title={<>One mark.<br /><em>One operating belief.</em></>} intro="The three dots in our identity express disciplined effort becoming a unified system. That same idea now defines how we approach AI transformation." />
      <section className="logo-story section-pad"><div className="shell logo-story-grid"><div className="dot-composition" aria-label="Three dots representing collective intelligence"><span /><span /><span /></div><div><p className="eyebrow">Why three dots?</p><h2>Individual effort.<br />Organized into<br /><em>collective strength.</em></h2><p>An ant succeeds through disciplined work. A colony succeeds through structure. Ant Venture applies that logic to organizations—coordinating people, process and AI without wasted motion.</p></div></div></section>
      <section className="principles section-pad"><div className="shell"><p className="eyebrow light">What the mark commits us to</p><div className="principle-grid">{[["01","Hard work & collaboration","Human and AI teams working in tandem."],["02","Simplicity & elegance","Clean implementation without a bloated stack."],["03","Unity & structure","Roadmaps and systems designed to scale coherently."],["04","Strength & professionalism","Enterprise-grade rigor, trust and accountability."]].map(([n,t,c]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div></div></section>
      <section className="team-section section-pad"><div className="shell"><div className="section-heading"><div><p className="eyebrow">The team · Dubai and beyond</p><h2>Business context.<br /><em>Technical depth.</em></h2></div><p>Strategists, architects and engineers building domain-specific AI for the way organizations actually operate.</p></div><div className="team-grid">{team.map((person, index) => <article key={person.name}><div className="team-image"><Image src={person.image} alt={person.name} width={420} height={520} /></div><span>{String(index + 1).padStart(2,"0")}</span><h3>{person.name}</h3><p>{person.role}</p></article>)}</div></div></section>
      <section className="dubai-section"><div className="shell dubai-grid"><p className="eyebrow light">Built in Dubai</p><h2>Local context.<br /><em>Global ambition.</em></h2><p>From Sheikh Zayed Road, Ant Venture works with businesses, enterprises and governments that want practical intelligence with clear control.</p></div></section>
      <CtaBand title="Let’s make intelligence useful." />
    </main>
  );
}
