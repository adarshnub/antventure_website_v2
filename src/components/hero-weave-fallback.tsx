import { brainPoint } from "@/lib/brain-shape";

/** Deterministic folded-brain projection, visible without JavaScript or WebGL. */
export function HeroWeaveFallback() {
  return <svg className="hero-weave-fallback" viewBox="0 0 600 700" aria-hidden="true">
    {Array.from({ length: 54 }, (_, row) => {
      const side = row % 2;
      const points = Array.from({ length: 180 }, (_, column) => {
        const [x, y, z] = brainPoint(Math.floor(row / 2) * 360 + column * 2 + side, 9720);
        return `${(300 + x * 110 + z * 15).toFixed(2)},${(320 - y * 110 + z * 26).toFixed(2)}`;
      });
      return <polyline key={row} points={points.join(" ")} fill="none" stroke={row % 2 ? "#a1f6de" : "#a9caff"} strokeWidth="1.1" opacity=".65" />;
    })}
  </svg>;
}
