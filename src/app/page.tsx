import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { RoleXDemo } from "@/components/role-x-demo";
import { ClientStrip } from "@/components/client-strip";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { TrackedLink } from "@/components/tracked-link";
import { audiences, capabilities, caseStudies, deliverySteps } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main id="main" className="galaxy-home">
      <HomeHero />

      <ClientStrip />

      <section className="system section-pad" id="system" data-galaxy-stop>
        <div className="shell">
          <Reveal className="section-heading">
            <div><p className="eyebrow">The operating idea · 00</p><h2>AI transformation<br />is a <em>system.</em></h2></div>
            <p>Useful intelligence is not a chatbot added at the edge. It is a clear structure in which people, process and AI understand their role.</p>
          </Reveal>
          <div className="system-diagram">
            {[
              ["People", "Judgement, trust and the relationship"],
              ["Process", "Rules, context and accountable movement"],
              ["Intelligence", "Reading, reasoning and repeatable action"],
            ].map(([title, copy], i) => <Reveal className="system-node" delay={i * .1} key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}
            <div className="system-outcome"><span>Coordinated outcome</span><i aria-hidden="true">● ● ●</i></div>
          </div>
        </div>
      </section>

      <section className="galaxy-passage section-pad" data-galaxy-stop aria-labelledby="galaxy-passage-title">
        <div className="shell galaxy-passage-grid">
          <div className="galaxy-observation" aria-hidden="true"><span>01 / Independent signals</span><i /><span>02 / Shared intelligence</span><i /><span>03 / Coordinated action</span></div>
          <Reveal className="galaxy-passage-copy"><p className="eyebrow">Connected by design</p><h2 id="galaxy-passage-title">A thousand inputs.<br /><em>One clear direction.</em></h2><p>Every message, document and decision carries a piece of the picture. We connect those pieces, give them context and turn understanding into action.</p><Link className="text-link light" href="#explore">Find your first workflow <span aria-hidden="true">↓</span></Link></Reveal>
        </div>
      </section>

      <RoleXDemo />

      <section className="rolex-section section-pad" data-galaxy-stop>
        <div className="shell rolex-grid">
          <div className="rolex-mark" aria-hidden="true"><span>ROLE</span><i>:</i><span>X</span><small>Flagship product / 01</small></div>
          <Reveal className="rolex-copy">
            <p className="eyebrow light">Flagship product</p>
            <h2>A silent AI,<br /><em>inside the tools<br />you already use.</em></h2>
            <p>ROLE:X takes one step of the work your team already does—or the whole flow—and performs it inside email, WhatsApp, spreadsheets and existing systems.</p>
            <div className="rolex-facts"><span>Plug-and-play</span><span>Live in ~7 days</span><span>Human approval</span><span>On-premise option</span></div>
            <div className="button-row"><TrackedLink className="button light" href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "flagship" }}>Experience ROLE:X <span aria-hidden="true">↗</span></TrackedLink><TrackedLink className="text-link light" href="/contact-sales?reason=rolex" eventName="request_demo_clicked" eventData={{ placement: "flagship" }}>Request a ROLE:X demo</TrackedLink></div>
          </Reveal>
          <div className="human-loop">
            <p className="eyebrow light">A common operating pattern</p>
            <div className="loop-number">5<span>/6</span></div>
            <p>steps handled by AI</p>
            <div className="loop-rule" />
            <strong>1 decision stays human.</strong>
          </div>
        </div>
      </section>

      <section className="capabilities section-pad" id="capabilities" data-galaxy-stop>
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">What we build · 02</p><h2>One principle.<br /><em>Many forms.</em></h2></div><p>We find the smallest useful system that can change the work—then connect it to the larger organization.</p></div>
          <div className="capability-list">{capabilities.map((item) => <Reveal className="capability-row" key={item.index}><span>{item.index}</span><h3>{item.title}</h3><p>{item.copy}</p><i aria-hidden="true">↗</i></Reveal>)}</div>
        </div>
      </section>

      <section className="audience-section section-pad" data-galaxy-stop>
        <div className="shell">
          <p className="eyebrow">Who we work with · 03</p>
          <div className="audience-grid">{audiences.map((audience, i) => <Reveal className="audience-card" delay={i * .08} key={audience.id}><span>0{i + 1}</span><p>{audience.label}</p><h3>{audience.headline}</h3><p>{audience.copy}</p><Link href={`/contact-sales?reason=${audience.id}`}>Discuss your organization <span aria-hidden="true">↗</span></Link></Reveal>)}</div>
        </div>
      </section>

      <section className="method section-pad" data-galaxy-stop>
        <div className="shell method-grid">
          <div className="method-title"><p className="eyebrow light">How work changes · 04</p><h2>Start with one.<br /><em>Prove it.<br />Then expand.</em></h2><Link className="text-link light" href="/how-we-work">See how we work <span aria-hidden="true">↗</span></Link></div>
          <ol className="method-list">{deliverySteps.map((step) => <li key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="proof-preview section-pad" data-galaxy-stop>
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Proof, not theatre · 05</p><h2>Built around<br /><em>real work.</em></h2></div><p>Every case starts with an operating problem, a clear human decision and an outcome people can verify.</p></div>
          <div className="proof-grid">{caseStudies.slice(0, 3).map((study, i) => <article className="proof-card" key={study.slug}><div className="proof-top"><span>{String(i + 1).padStart(2, "0")}</span><span>{study.status}</span></div><p>{study.client}</p><h3>{study.title}</h3><p>{study.challenge}</p><Link href="/work">Read the workflow <span aria-hidden="true">↗</span></Link></article>)}</div>
        </div>
      </section>

      <div data-galaxy-stop><CtaBand /></div>
    </main>
  );
}
