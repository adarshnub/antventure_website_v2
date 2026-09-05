import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";

/** One opening statement. The shared galaxy moves; the content never cycles. */
export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="shell home-hero-shell">
        <p className="eyebrow">Ant Venture / AI transformation</p>
        <h1 id="home-hero-title">Collective Intelligence,<br /><em>Engineered for Growth.</em></h1>
        <p className="home-hero-copy">An ant colony turns thousands of small, disciplined actions into collective strength. We bring that same principle to AI—designing how intelligence, people and process work together as one coordinated system.</p>
        <div className="home-hero-actions">
          <Link className="hero-action primary" href="#explore">Explore what we can automate <span aria-hidden="true">↓</span></Link>
          <TrackedLink className="hero-action secondary" href="/contact-sales" eventName="request_demo_clicked" eventData={{ placement: "home_hero" }}>Request a demo <span aria-hidden="true">↗</span></TrackedLink>
        </div>
        <div className="home-hero-foot"><span>Dubai · UAE</span><Link href="#system">Discover collective intelligence <span aria-hidden="true">↓</span></Link></div>
      </div>
    </section>
  );
}
