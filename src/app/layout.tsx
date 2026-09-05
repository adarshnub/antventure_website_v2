import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GalaxyBackdrop } from "@/components/galaxy-backdrop";
import "./globals.css";
import "./galaxy.css";
import "./role-demo.css";

const display = Newsreader({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

function resolveSiteUrl(value: string | undefined) {
  const fallback = "https://antventure.ai";
  const candidate = value?.trim();

  try {
    const url = new URL(candidate || fallback);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ant Venture — Collective Intelligence", template: "%s · Ant Venture" },
  description: "Ant Venture architects how AI, people and process work together as one coordinated system.",
  applicationName: "Ant Venture",
  openGraph: { title: "Collective Intelligence, Engineered for Growth", description: "Practical AI transformation for businesses, enterprises and governments.", url: siteUrl, siteName: "Ant Venture", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Ant Venture — Collective Intelligence", description: "Practical AI transformation, structured for real work.", images: ["/opengraph-image"] },
};

export const viewport: Viewport = { themeColor: "#020610", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AntVenture Consults LLC",
    url: siteUrl,
    logo: `${siteUrl}/brand/antventure-logo.png`,
    email: "support@antventure.ai",
    address: { "@type": "PostalAddress", streetAddress: "#901, 9th Level, Al Saqr Business Tower, Sheikh Zayed Road", addressLocality: "Dubai", addressCountry: "AE" },
  };
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="galaxy-site">
        <GalaxyBackdrop />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
