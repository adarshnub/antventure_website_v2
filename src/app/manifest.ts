import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Ant Venture", short_name: "Ant Venture", description: "Collective Intelligence, Engineered for Growth", start_url: "/", display: "standalone", background_color: "#f4f2ed", theme_color: "#0b0b0b", icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }] };
}
