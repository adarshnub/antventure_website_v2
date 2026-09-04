import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() { return <main id="main"><PageHero index="L2" eyebrow="Legal" title={<>Website<br /><em>terms.</em></>} intro="These interim terms cover use of the public website and must be replaced with Ant Venture’s approved legal copy before production." /><article className="legal shell section-pad"><h2>Website information</h2><p>Material on this website is general information about Ant Venture’s capabilities and does not constitute a binding service commitment.</p><h2>Product claims</h2><p>Timelines, deployment models and outcomes depend on discovery, scope and customer systems. Project-specific commitments belong in written agreements.</p><h2>Ownership</h2><p>Ant Venture names, marks, designs and materials remain the property of their respective owners.</p><p><strong>Pre-launch requirement:</strong> replace this interim notice with counsel-approved terms.</p></article></main>; }
