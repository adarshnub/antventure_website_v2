import Link from "next/link";
import type { CSSProperties } from "react";
import { products, type Product } from "@/lib/portfolio";

/** HTML labels remain readable at every size; SVG is decorative, never a screenshot. */
export function ProductVisual({ product }: { product: Product }) {
  return <div className="product-visual" style={{ "--product-color": product.color } as CSSProperties}>
    <div className="product-visual-label"><span>INPUTS</span><span>OUTPUTS</span></div>
    <div className="product-flow">
      <div>{product.inputs.map((input) => <span key={input}>{input}</span>)}</div>
      <div className="product-flow-core"><svg viewBox="0 0 160 160" fill="none" aria-hidden="true"><circle cx="80" cy="80" r="65" /><path d="M80 15 136 112 24 112Z M80 145 24 48 136 48Z" /><circle cx="80" cy="80" r="38" /><circle className="product-orbit" cx="80" cy="15" r="4" /></svg><strong>{product.name === "Organization AI Brain" ? "AI BRAIN" : product.name}</strong></div>
      <div>{product.outputs.map((output) => <span key={output}>{output}</span>)}</div>
    </div>
  </div>;
}

export function ProductPortfolio({ includeFlagship = true }: { includeFlagship?: boolean }) {
  return <div className="product-grid">{products.filter((product) => includeFlagship || !product.flagship).map((product, i) => <article key={product.slug} className={`product-card${product.flagship ? " product-card-flagship" : ""}`} style={{ "--product-color": product.color } as CSSProperties}>
    <div className="product-card-top"><span>{String(i + 1).padStart(2, "0")} / {product.category}</span>{product.flagship && <span className="flagship-badge">Flagship product</span>}</div>
    <div className="product-card-content"><div><h3>{product.name}</h3><p>{product.summary}</p><Link className="text-link light" href={`/products/${product.slug}`}>Explore {product.name} <span aria-hidden="true">↗</span></Link></div><ProductVisual product={product} /></div>
  </article>)}</div>;
}
