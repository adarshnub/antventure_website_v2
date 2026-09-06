import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "./tracked-link";
import { products } from "@/lib/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/brand/antventure-logo.png" alt="Ant Venture" width={200} height={75} />
          <p>AI products and services.<br />Dubai, UAE.</p>
        </div>
        <div>
          <p className="eyebrow light">Navigate</p>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/how-we-work">How we work</Link>
            <Link href="/products">Products</Link>
            <Link href="/work">Projects</Link>
            <Link href="/academy">Ant AI Academy</Link>
            <Link href="/about">About</Link>
            <Link href="/contact-sales">Contact sales</Link>
          </nav>
        </div>
        <div>
          <p className="eyebrow light">Flagship</p>
          <div className="footer-links">
            <TrackedLink href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "footer" }}>ROLE:X ↗</TrackedLink>
            <a href="mailto:support@antventure.ai">support@antventure.ai</a>
            <TrackedLink href="https://wa.me/971562903901" target="_blank" rel="noreferrer" eventName="whatsapp_clicked" eventData={{ placement: "footer" }}>WhatsApp ↗</TrackedLink>
          </div>
        </div>
        <address>
          <p className="eyebrow light">Registered office</p>
          <p>#901, 9th Level<br />Al Saqr Business Tower<br />Sheikh Zayed Road, Dubai</p>
        </address>
      </div>
      <nav className="shell portfolio-footer-products" aria-label="Products">{products.map((product) => <Link key={product.slug} href={`/products/${product.slug}`}>{product.name}{product.flagship ? " · Flagship" : ""}</Link>)}</nav>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} AntVenture Consults LLC</span>
        <span className="footer-legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span>
      </div>
    </footer>
  );
}
