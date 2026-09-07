import points from "./brain-points.json";

// BodyParts3D surface sampled offline; see /brain-attribution.txt.
// Prefix sampling keeps the same anatomy at desktop and mobile particle counts.
export function brainPoint(index: number, count: number): [number, number, number] {
  const offset = Math.floor(index * 30000 / count) * 6;
  return [points[offset] / 10000, points[offset + 1] / 10000, points[offset + 2] / 10000];
}

export function brainNormal(index: number, count: number): [number, number, number] {
  const offset = Math.floor(index * 30000 / count) * 6 + 3;
  return [points[offset] / 10000, points[offset + 1] / 10000, points[offset + 2] / 10000];
}
