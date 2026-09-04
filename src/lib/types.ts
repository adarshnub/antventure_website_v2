export type Audience = "business" | "enterprise" | "government";
export type BusinessFunction = "sales" | "operations" | "finance" | "people" | "service";

export type WorkflowScenario = {
  id: string;
  audience: Audience;
  function: BusinessFunction;
  painPoint: string;
  summary: string;
  inputs: string[];
  aiSteps: string[];
  humanDecision: string;
  systemsUpdated: string[];
  benefits: string[];
  relatedProof: string;
};

export type CaseStudy = {
  slug: string;
  status: "Live" | "Pilot" | "Proof of concept";
  client: string;
  title: string;
  challenge: string;
  workflow: string;
  aiActions: string[];
  humanRole: string;
  outcome: string;
  approvedAssets: string[];
};
