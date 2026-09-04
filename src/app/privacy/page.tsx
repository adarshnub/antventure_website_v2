import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

export default function PrivacyPage() { return <main id="main"><PageHero index="L1" eyebrow="Legal" title={<>Privacy<br /><em>principles.</em></>} intro="This launch copy describes how the website handles enquiries. It must be reviewed against Ant Venture’s approved legal policy before production." /><article className="legal shell section-pad"><h2>Information submitted</h2><p>When you contact Ant Venture, we use the information you provide to respond to your enquiry and, where you consent, send relevant communications.</p><h2>Website analytics</h2><p>Aggregate analytics help us understand site performance and conversion. The transformation explorer stores no personal information.</p><h2>Your choices</h2><p>You may request access, correction or deletion by emailing support@antventure.ai.</p><p><strong>Pre-launch requirement:</strong> replace this interim notice with counsel-approved policy text.</p></article></main>; }
