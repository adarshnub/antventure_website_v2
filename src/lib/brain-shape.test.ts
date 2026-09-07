import { describe, expect, it } from "vitest";
import { brainPoint, brainNormal } from "./brain-shape";

describe("anatomical brain particle geometry", () => {
  it.each([6000, 10000, 30000])("retains valid surface points and normals at %i samples", (count) => {
    for (let i = 0; i < count; i++) {
      const p = brainPoint(i, count), n = brainNormal(i, count);
      expect(p.every(Number.isFinite)).toBe(true);
      expect(p.every(v => Math.abs(v) < 2.3)).toBe(true);
      expect(Math.hypot(...n)).toBeCloseTo(1, 3);
    }
  });
  it("has genuine depth and repeatable geometry, not flat mirrored paths", () => {
    const points = Array.from({length: 1000}, (_,i) => brainPoint(i,1000));
    const z = points.map(p=>p[2]);
    expect(Math.max(...z)-Math.min(...z)).toBeGreaterThan(1);
    expect(brainPoint(512,10000)).toEqual(brainPoint(512,10000));
  });
});
