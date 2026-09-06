import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { academyModules } from "@/lib/portfolio";
import { team } from "@/lib/content";

export const metadata: Metadata = { title: "Ant AI Academy", description: "AI Native Transformation: a four-hour corporate program covering AI strategy, agents, workflows and data intelligence.", alternates: { canonical: "/academy" } };
export default function AcademyPage() {
  const instructor = team.find((person) => person.name === "Sajith Amma");
  return <main id="main"><PageHero index="Academy" eyebrow="Corporate training" title={<>AI Native<br /><em>Transformation.</em></>} intro="A four-hour corporate program for leaders and teams adopting AI across their organization. Delivered over two to four sessions." aside={<Link className="button light" href="/contact-sales?reason=training&scenario=Ant%20AI%20Academy">Book a corporate session ↗</Link>} />
    <section className="section-pad"><div className="shell"><p className="eyebrow">Six course modules</p><h2>Strategy, implementation<br />and business applications.</h2><div className="academy-modules">{academyModules.map(([title, copy], i) => <article key={title}><span className="academy-index">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="section-pad"><div className="shell academy-instructor">{instructor && <Image src={instructor.image} alt="Sajith Amma" width={420} height={520} />}<div><p className="eyebrow">Your instructor</p><h2>Sajith Amma</h2><p>Ant Venture co-founder and AI leader, with more than 20 years of technology experience.</p><p>His work includes Zaper.ai, DevBlink and Startup Village, with international experience at Vodafone UK and Shopper.com.</p><h3>For corporate leaders and teams</h3><p>Discuss your operating challenges, assess AI applications and learn how to design agent-based workflows.</p><div className="button-row"><Link className="button light" href="/contact-sales?reason=training&scenario=Ant%20AI%20Academy">Discuss team training ↗</Link><a className="text-link light" href="https://ant.sajithamma.com/" target="_blank" rel="noreferrer">Academy booking site ↗</a></div></div></div></section>
  </main>;
}
