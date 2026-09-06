import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/team", destination: "/about", permanent: true },
      { source: "/aibrain", destination: "/products/organization-brain", permanent: true },
      ...[["influence", "influence"], ["interact", "interact"], ["inhouse", "in-house"], ["inspire", "inspire"]].map(([source, slug]) => ({ source: `/${source}`, destination: `/products/${slug}`, permanent: true })),
      { source: "/roi-calculator", destination: "/#explore", permanent: true },
    ];
  },
};

export default nextConfig;
