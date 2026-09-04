import { describe, expect, it } from "vitest";
import { getScenario, workflowScenarios } from "./content";
import type { Audience, BusinessFunction } from "./types";

describe("transformation explorer scenarios", () => {
  const audiences: Audience[] = ["business", "enterprise", "government"];
  const functions: BusinessFunction[] = ["sales", "operations", "finance", "people", "service"];

  it("covers every audience and function combination", () => {
    expect(workflowScenarios).toHaveLength(15);
    audiences.forEach((audience) => functions.forEach((fn) => {
      const scenario = getScenario(audience, fn);
      expect(scenario.audience).toBe(audience);
      expect(scenario.function).toBe(fn);
      expect(scenario.aiSteps.length).toBeGreaterThanOrEqual(4);
      expect(scenario.humanDecision.length).toBeGreaterThan(10);
    }));
  });

  it("keeps every outcome human-verifiable", () => {
    workflowScenarios.forEach((scenario) => {
      expect(scenario.humanDecision).toBeTruthy();
      expect(scenario.systemsUpdated.length).toBeGreaterThan(0);
      expect(scenario.benefits.length).toBeGreaterThan(0);
    });
  });
});
