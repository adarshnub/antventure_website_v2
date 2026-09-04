import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { TrackedLink } from "@/components/tracked-link";

export const metadata: Metadata = { title: "Contact Sales", description: "Bring Ant Venture one workflow. We’ll map the first useful AI transformation step.", alternates: { canonical: "/contact-sales" } };

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero index="04" eyebrow="Contact sales" title={<>Bring us<br /><em>one workflow.</em></>} intro="Tell us where the work slows down. We’ll map the bottleneck, identify what should stay human and propose the first useful step." />
      <section className="contact-section section-pad"><div className="shell contact-grid"><aside><p className="eyebrow">What happens next</p><ol><li><span>01</span><p>We read your note and find the right person.</p></li><li><span>02</span><p>A short discovery call maps the real workflow.</p></li><li><span>03</span><p>You see a practical next step before committing.</p></li></ol><div className="direct-contact"><p>Prefer a direct channel?</p><TrackedLink href="https://wa.me/971562903901" target="_blank" rel="noreferrer" eventName="whatsapp_clicked" eventData={{ placement: "contact" }}>WhatsApp ↗</TrackedLink><a href="mailto:support@antventure.ai">support@antventure.ai</a></div></aside><Suspense fallback={<div className="form-loading">Loading contact form…</div>}><ContactForm /></Suspense></div></section>
    </main>
  );
}
