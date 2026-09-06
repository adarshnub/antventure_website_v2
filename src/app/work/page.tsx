import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { caseStudies, clientLogos } from "@/lib/content";
import Image from "next/image";
import { otherProjects } from "@/lib/portfolio";

export const metadata: Metadata = { title: "Projects & Client Work", description: "AI transformation grounded in specific workflows and human-verifiable outcomes.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return (
    <main id="main">
      <PageHero index="02" eyebrow="Projects & client work" title={<>Projects and<br /><em>applications.</em></>} intro="Explore client workflows and projects across document processing, sales intelligence, internal knowledge and content tools." />
      <section className="case-list section-pad"><div className="shell">{caseStudies.map((study, index) => <article className="case-study" key={study.slug} id={study.slug}><header><div><span>{String(index + 1).padStart(2,"0")}</span><span>{study.status}</span></div><p>{study.client}</p><h2>{study.title}</h2></header><div className="case-body"><div><p className="case-label">Challenge</p><p>{study.challenge}</p><p className="case-label">Workflow</p><p>{study.workflow}</p></div><div><p className="case-label">AI actions</p><ol>{study.aiActions.map((action, i) => <li key={action}><span>0{i+1}</span>{action}</li>)}</ol></div><div><p className="case-label">Human decision</p><p>{study.humanRole}</p><p className="case-label">Outcome</p><p>{study.outcome}</p></div></div></article>)}</div></section>
      <section className="section-pad"><div className="shell"><p className="eyebrow">More from Ant Venture</p><h2>Other projects</h2><div className="project-directory">{otherProjects.map((project) => <article key={project.name}><span className="eyebrow">{project.category}</span><h3>{project.name}</h3><p>{project.copy}</p><a href={project.href} target="_blank" rel="noreferrer">Visit {project.name} ↗</a></article>)}</div></div></section>
      <section className="logo-wall section-pad"><div className="shell"><p className="eyebrow">Client references</p><div className="logo-wall-grid">{clientLogos.map((logo) => <div key={logo.name}><Image src={logo.src} alt={logo.name} width={140} height={52} /></div>)}</div><p className="proof-note">Customer references and project status are published only after internal approval. Proof-of-concept work is labelled as such.</p></div></section>
      <CtaBand />
    </main>
  );
}
