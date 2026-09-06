import Link from "next/link";

export function CtaBand({ eyebrow = "Contact Ant Venture", title = "Request a demo.", copy = "Tell us which product or workflow interests you. We’ll discuss integrations, deployment and next steps." }: { eyebrow?: string; title?: string; copy?: string }) {
  return (
    <section className="cta-band">
      <div className="shell cta-grid">
        <p className="eyebrow light">{eyebrow}</p>
        <div><h2>{title}</h2><p>{copy}</p></div>
        <Link className="circle-link" href="/contact-sales" aria-label="Contact sales"><span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
