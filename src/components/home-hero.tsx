import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";
import { HeroWeaveFallback } from "@/components/hero-weave-fallback";

/** One opening statement. The shared galaxy moves; the content never cycles. */
export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="hero-sculpture" role="img" aria-label="Three independent streams representing people, process and AI assemble into a collective AI brain with two folded hemispheres."><HeroWeaveFallback /></div>
      <div className="shell home-hero-shell">
        <p className="eyebrow">Ant Venture / AI transformation</p>
        <h1 id="home-hero-title">Collective Intelligence,<br /><em>Engineered for Growth</em></h1>
        <p className="hero-system-caption"><span>People</span><span>Process</span><span>AI</span><i aria-hidden="true">↗</i> Collective intelligence.</p>
        <div className="home-hero-actions">
          <Link className="hero-action primary" href="#system">Explore our products <span aria-hidden="true">↓</span></Link>
          <TrackedLink className="hero-action secondary" href="/contact-sales" eventName="request_demo_clicked" eventData={{ placement: "home_hero" }}>Request a demo <span aria-hidden="true">↗</span></TrackedLink>
        </div>
        <div className="home-hero-foot"><span>Dubai · UAE</span><Link href="#system">View our products <span aria-hidden="true">↓</span></Link></div>
      </div>
    </section>
  );
}
