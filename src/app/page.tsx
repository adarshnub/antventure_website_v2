import type { Metadata } from "next";
import Link from "next/link";
import { homepageCopy } from "@/lib/homepage-copy";
import { HomeHero } from "@/components/home-hero";
import { RoleXDemo } from "@/components/role-x-demo";
import { ClientStrip } from "@/components/client-strip";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { ProductPortfolio } from "@/components/product-portfolio";
import { academyModules, setupSteps } from "@/lib/portfolio";
import { audiences, capabilities, caseStudies, deliverySteps } from "@/lib/content";

export const metadata: Metadata = { title: { absolute: `Ant Venture — ${homepageCopy.primary}` }, description: homepageCopy.supporting, alternates: { canonical: "/" }, openGraph: { title: homepageCopy.alternate, description: homepageCopy.supporting, images: [{ url: "/opengraph-image", alt: homepageCopy.alternate }] }, twitter: { title: homepageCopy.alternate, description: homepageCopy.supporting } };

export default function Home() {
  return (
    <main id="main" className="galaxy-home">
      <HomeHero />

      <ClientStrip />

      <div id="system" className="flagship-introduction"><RoleXDemo /></div>

      <section className="system section-pad" id="products" data-galaxy-stop>
        <div className="shell"><div className="section-heading"><div><p className="eyebrow">More from Ant Venture</p><h2>Explore our<br /><em>other products.</em></h2></div><p>AI for outbound sales, customer conversations, content and internal operations.</p></div><ProductPortfolio includeFlagship={false} /></div>
      </section>

      <section className="galaxy-passage section-pad" data-galaxy-stop>
        <div className="shell portfolio-academy"><div><p className="eyebrow">Organization AI Brain</p><h2>Your company knowledge.<br /><em>Available to your agents.</em></h2><p>Connect approved websites, documents, product information and policies. Keep customer-facing content separate from private employee knowledge.</p><Link className="text-link light" href="/products/organization-brain">Explore the AI Brain ↗</Link></div><div className="academy-tags"><span>Public knowledge</span><span>Private knowledge</span><span>Access controls</span><span>Connected agents</span><span>Source updates</span><span>Multilingual answers</span></div></div>
      </section>

      <section className="capabilities section-pad" id="capabilities" data-galaxy-stop>
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">What we build · 02</p><h2>AI implementation<br /><em>services.</em></h2></div><p>Workflow design, system integration, private AI deployment and ongoing support.</p></div>
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
          <div className="method-title"><p className="eyebrow light">How work changes · 04</p><h2>Implementation<br /><em>and support.</em></h2><Link className="text-link light" href="/how-we-work">See how we work <span aria-hidden="true">↗</span></Link></div>
          <ol className="method-list">{deliverySteps.map((step) => <li key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="proof-preview section-pad" data-galaxy-stop>
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Selected projects</p><h2>Projects and<br /><em>client workflows.</em></h2></div><p>See how our products are applied to pricing, document validation, lead management and internal knowledge.</p></div>
          <div className="proof-grid">{caseStudies.slice(0, 3).map((study, i) => <article className="proof-card" key={study.slug}><div className="proof-top"><span>{String(i + 1).padStart(2, "0")}</span><span>{study.status}</span></div><p>{study.client}</p><h3>{study.title}</h3><p>{study.challenge}</p><Link href={`/work#${study.slug}`}>Read the workflow <span aria-hidden="true">↗</span></Link></article>)}</div>
        </div>
      </section>

      <section className="section-pad" data-galaxy-stop><div className="shell"><p className="eyebrow">Getting started</p><h2>Set up your AI in five steps.</h2><ol className="setup-flow">{setupSteps.map(([title, copy], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
      <section className="section-pad" data-galaxy-stop><div className="shell portfolio-academy"><div><p className="eyebrow">Ant AI Academy</p><h2>AI training for<br /><em>corporate teams.</em></h2><p>Four hours. Six modules. Learn to assess AI opportunities, design workflows and implement agent-based systems.</p><Link className="text-link light" href="/academy">Explore the program ↗</Link></div><div className="academy-tags">{academyModules.map(([title]) => <span key={title}>{title}</span>)}</div></div></section>
      <div data-galaxy-stop><CtaBand /></div>
    </main>
  );
}
