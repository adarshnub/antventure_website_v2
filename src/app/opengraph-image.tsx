import { ImageResponse } from "next/og";

export const alt = "Ant Venture — Collective Intelligence, Engineered for Growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#fff", background: "#0b0b0b", fontFamily: "serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "monospace", fontSize: 18, letterSpacing: 4 }}><span>● ● ● &nbsp; ANT VENTURE</span><span>DUBAI · UAE</span></div>
      <div style={{ display: "flex", fontSize: 94, lineHeight: .9, letterSpacing: -5 }}>Collective Intelligence,<br />Engineered for Growth.</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 17, letterSpacing: 2, color: "#aaa" }}><span>AI · PEOPLE · PROCESS</span><span>ANTVENTURE.AI ↗</span></div>
    </div>, { ...size },
  );
}
