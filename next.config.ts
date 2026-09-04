import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/team", destination: "/about", permanent: true },
      { source: "/aibrain", destination: "/how-we-work", permanent: true },
      { source: "/roi-calculator", destination: "/#explore", permanent: true },
    ];
  },
};

export default nextConfig;
