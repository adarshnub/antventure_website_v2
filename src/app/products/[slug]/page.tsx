import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProductVisual } from "@/components/product-portfolio";
import { products } from "@/lib/portfolio";
import { TrackedLink } from "@/components/tracked-link";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return { title: product.name, description: product.summary, alternates: { canonical: `/products/${slug}` } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <main id="main" className="product-detail">
    <PageHero index={product.flagship ? "Flagship" : "Product"} eyebrow={product.category} title={product.name} intro={product.summary} aside={<Link className="text-link light" href="/products">All products ↗</Link>} />
    <section className="section-pad product-overview"><div className="shell product-overview-grid"><div><p className="eyebrow">Who it is for</p><h2>{product.audience}</h2><div className="button-row"><Link className="button light" href={`/contact-sales?reason=${product.flagship ? "rolex" : "product"}&scenario=${encodeURIComponent(product.name)}`}>Request a {product.name} demo ↗</Link>{product.flagship && <TrackedLink className="text-link light" href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "product_page" }}>Visit ROLE:X ↗</TrackedLink>}</div></div><ProductVisual product={product} /></div></section>
    <section className="section-pad"><div className="shell"><p className="eyebrow">Capabilities</p><h2>What {product.name} does</h2><div className="portfolio-feature-grid">{product.features.map((feature, index) => <article key={feature.title}><span className="eyebrow">0{index + 1}</span><h3>{feature.title}</h3><p>{feature.copy}</p></article>)}</div></div></section>
    <section className="section-pad"><div className="shell"><p className="eyebrow">Workflow</p><h2>How it works</h2><ol className="setup-flow">{product.steps.map((step, i) => <li key={step}><span>0{i + 1}</span><h3>{step}</h3></li>)}</ol>{slug !== "organization-brain" && slug !== "role-x" && <p className="portfolio-note">Company context comes from the <Link href="/products/organization-brain">Organization AI Brain ↗</Link>. Access, integrations and review requirements are agreed during setup.</p>}</div></section>
    <section className="faq-section section-pad"><div className="shell faq-grid"><h2>Product questions</h2><div>{product.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.summary, brand: { "@type": "Brand", name: "Ant Venture" } }).replace(/</g, "\\u003c") }} />
  </main>;
}
