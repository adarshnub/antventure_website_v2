import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { deliverySteps, faqs } from "@/lib/content";

export const metadata: Metadata = { title: "How We Work", description: "A staged, accountable way to turn a real workflow into a useful AI system.", alternates: { canonical: "/how-we-work" } };

export default function HowWeWorkPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return (
    <main id="main">
      <PageHero index="01" eyebrow="How we work" title={<>Structure before<br /><em>scale.</em></>} intro="AI becomes useful when the workflow is understood, the human decision is explicit and every action has somewhere accountable to go." />

      <section className="manifesto section-pad"><div className="shell manifesto-grid"><p className="eyebrow">Collective intelligence</p><Reveal><blockquote>“The goal is not to add AI. It is to make people, process and intelligence move as one.”</blockquote></Reveal><p>We begin with the work as it exists—not a platform demo. Then we design the smallest coordinated system that can improve it.</p></div></section>

      <section className="process-detail section-pad"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Four stages · one accountable path</p><h2>From one bottleneck<br />to a <em>working system.</em></h2></div><p>Each stage produces something your team can inspect before the next stage begins.</p></div><ol className="process-cards">{deliverySteps.map((step) => <li key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.copy}</p><small>{step.n === "01" ? "Output · opportunity map" : step.n === "02" ? "Output · approved workflow spec" : step.n === "03" ? "Output · verifiable pilot" : "Output · measured live workflow"}</small></li>)}</ol></div></section>

      <section className="before-after section-pad"><div className="shell"><p className="eyebrow light">A workflow, reorganized</p><div className="compare-grid"><div><span>Before</span><h2>Messages.<br />Spreadsheets.<br />Chasing.</h2><ul><li>Context sits in separate tools</li><li>People repeat the same checks</li><li>Exceptions look like ordinary work</li><li>Progress depends on memory</li></ul></div><div className="compare-arrow" aria-hidden="true">→</div><div><span>With Ant Venture</span><h2>Read.<br />Reason.<br />Route.</h2><ul><li>Inputs arrive in one workflow</li><li>AI prepares repeatable work</li><li>Humans see the decisions that matter</li><li>Every action is recorded</li></ul></div></div></div></section>

      <section className="control-section section-pad"><div className="shell control-grid"><div><p className="eyebrow">Human control · by design</p><h2>Automation with<br /><em>an accountable edge.</em></h2></div><div className="control-list">{[["01","Approval points","Nothing consequential is final until the defined human owner approves it."],["02","Two-AI validation","A checking layer can review the first output and explain discrepancies."],["03","Audit trails","Inputs, actions, decisions and system updates remain traceable."],["04","Escalation","Low-confidence, sensitive or exceptional work is routed to a person."]].map(([n,t,c]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div></article>)}</div></div></section>

      <section className="deployment section-pad"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Deployment choices</p><h2>Meet the organization<br /><em>where it operates.</em></h2></div><p>The same workflow logic can live beside existing tools, inside an approved tenant or entirely on premises.</p></div><div className="deployment-grid">{["Existing tools","APIs & systems","Customer cloud","On premises"].map((item, i) => <div key={item}><span>0{i+1}</span><h3>{item}</h3></div>)}</div></div></section>

      <section className="faq-section section-pad"><div className="shell faq-grid"><div><p className="eyebrow">Common questions</p><h2>Clear answers.<br /><em>No theatre.</em></h2></div><div>{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div></div></section>
      <CtaBand eyebrow="Start small" title="One workflow is enough." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
