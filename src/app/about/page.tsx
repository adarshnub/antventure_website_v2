import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { team } from "@/lib/content";

export const metadata: Metadata = { title: "About", description: "A Dubai-based company building AI products, workflow automation and implementation services.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero index="03" eyebrow="About Ant Venture" title={<>About<br /><em>Ant Venture.</em></>} intro="We build AI products and implement business workflows for companies, enterprises and governments. Our team combines business strategy, AI engineering and operational support." />
      <section className="logo-story section-pad"><div className="shell logo-story-grid"><div className="dot-composition" aria-label="Three dots representing collective intelligence"><span /><span /><span /></div><div><p className="eyebrow">Our company</p><h2>AI products.<br /><em>Implementation services.</em></h2><p>Based in Dubai, Ant Venture develops products for sales, customer communication, content and internal operations. We also design integrations, deploy private AI systems and train corporate teams.</p></div></div></section>
      <section className="principles section-pad"><div className="shell"><p className="eyebrow light">How we deliver</p><div className="principle-grid">{[["01","Hard work & collaboration","Human and AI teams working in tandem."],["02","Simplicity & elegance","Clean implementation without a bloated stack."],["03","Unity & structure","Roadmaps and systems designed to scale coherently."],["04","Strength & professionalism","Enterprise-grade rigor, trust and accountability."]].map(([n,t,c]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div></div></section>
      <section className="team-section section-pad"><div className="shell"><div className="section-heading"><div><p className="eyebrow">The team · Dubai and beyond</p><h2>Meet our<br /><em>team.</em></h2></div><p>Strategists, architects and engineers building domain-specific AI for the way organizations actually operate.</p></div><div className="team-grid">{team.map((person, index) => <article key={person.name}><div className="team-image"><Image src={person.image} alt={person.name} width={420} height={520} /></div><span>{String(index + 1).padStart(2,"0")}</span><h3>{person.name}</h3><p>{person.role}</p></article>)}</div></div></section>
      <section className="dubai-section"><div className="shell dubai-grid"><p className="eyebrow light">Built in Dubai</p><h2>Dubai,<br /><em>United Arab Emirates.</em></h2><p>#901, 9th Level, Al Saqr Business Tower, Sheikh Zayed Road, Dubai. Contact support@antventure.ai to discuss a product, project or training program.</p></div></section>
      <CtaBand title="Discuss your requirements." />
    </main>
  );
}
