import Link from "next/link";

export function CtaBand({ eyebrow = "A useful place to begin", title = "Bring us one workflow.", copy = "We’ll map it, identify the first valuable step and show you what practical AI looks like on your real work." }: { eyebrow?: string; title?: string; copy?: string }) {
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
