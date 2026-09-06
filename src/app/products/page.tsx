import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProductPortfolio } from "@/components/product-portfolio";
import { CtaBand } from "@/components/cta-band";
import { RoleXDemo } from "@/components/role-x-demo";

export const metadata: Metadata = { title: "AI Products", description: "Explore ROLE:X, Influence, Interact, In-House, Inspire and Organization AI Brain.", alternates: { canonical: "/products" } };
export default function ProductsPage() {
  return <main id="main"><PageHero index="01" eyebrow="Our products" title={<>AI for your<br /><em>business workflows.</em></>} intro="Products for outbound sales, customer conversations, content and internal operations. ROLE:X is our flagship workflow automation product." /><RoleXDemo /><section className="section-pad" id="products"><div className="shell"><div className="section-heading"><div><p className="eyebrow">More from Ant Venture</p><h2>Our other products</h2></div></div><ProductPortfolio includeFlagship={false} /></div></section><CtaBand /></main>;
}
