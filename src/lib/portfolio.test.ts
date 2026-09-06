import { describe, expect, it } from "vitest";
import { academyModules, otherProjects, products, setupSteps } from "./portfolio";

describe("portfolio content", () => {
  it("defines six unique products and one flagship", () => {
    expect(products).toHaveLength(6);
    expect(new Set(products.map((product) => product.slug)).size).toBe(6);
    expect(products.filter((product) => product.flagship).map((product) => product.name)).toEqual(["ROLE:X"]);
    for (const product of products) {
      expect(product.inputs).toHaveLength(3);
      expect(product.outputs).toHaveLength(3);
      expect(product.steps).toHaveLength(5);
      expect(product.features).toHaveLength(3);
      expect(product.faqs.length).toBeGreaterThan(0);
      expect(new URL(product.source).protocol).toBe("https:");
    }
  });
  it("includes the academy, setup method and linked projects", () => {
    expect(academyModules).toHaveLength(6);
    expect(setupSteps).toHaveLength(5);
    expect(otherProjects).toHaveLength(6);
    for (const project of otherProjects) expect(new URL(project.href).protocol).toBe("https:");
  });
});
