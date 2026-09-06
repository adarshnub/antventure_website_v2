import type { MetadataRoute } from "next";
import { products } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://antventure.ai";
  return ["", "/products", "/academy", ...products.map((product) => `/products/${product.slug}`), "/how-we-work", "/work", "/about", "/contact-sales", "/privacy", "/terms"].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" as const : "monthly" as const,
    priority: index === 0 ? 1 : path === "/contact-sales" ? 0.9 : path.startsWith("/privacy") || path.startsWith("/terms") ? 0.2 : 0.8,
  }));
}
