import type { Audience, BusinessFunction, CaseStudy, WorkflowScenario } from "./types";

export const navItems = [
  { href: "/products", label: "Products" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/work", label: "Projects" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
];

export const clientLogos = [
  { name: "Datacom", src: "/brand/clients/datacom.webp" },
  { name: "Al Adrak", src: "/brand/clients/aladrak.webp" },
  { name: "JTS", src: "/brand/clients/jts.webp" },
  { name: "Energen", src: "/brand/clients/energen.webp" },
  { name: "MSS", src: "/brand/clients/mss.webp" },
  { name: "Zaper", src: "/brand/clients/zaper.webp" },
  { name: "Galeno", src: "/brand/clients/galeno.webp" },
  { name: "Prime Global", src: "/brand/clients/prime.webp" },
];

export const audiences: { id: Audience; label: string; headline: string; copy: string }[] = [
  { id: "business", label: "Businesses", headline: "Sales, support and operations.", copy: "Automate repetitive work across sales, operations and support while your people stay focused on customers." },
  { id: "enterprise", label: "Enterprises", headline: "Integrations and governance.", copy: "Connect AI to existing systems, teams and governance without forcing a company-wide rebuild." },
  { id: "government", label: "Governments", headline: "Private and local deployment.", copy: "Deploy multilingual, privacy-conscious services with clear human control and in-country infrastructure options." },
];

export const capabilities = [
  { index: "01", title: "Workflow transformation", copy: "Give AI one repeatable step or an entire operating flow. ROLE:X reads the work, completes it and updates the systems your team already uses." },
  { index: "02", title: "Organizational intelligence", copy: "Turn public and private company knowledge into a governed brain that can answer, retrieve, reformat and act." },
  { index: "03", title: "Revenue intelligence", copy: "Join signals from conversations, channels and customer behaviour into one memory that helps teams act at the right time." },
  { index: "04", title: "Private AI deployment", copy: "Solve a specific operational problem with a small, verifiable system—deployed in your cloud or on your premises." },
];

export const deliverySteps = [
  { n: "01", title: "Discovery", copy: "We map how work actually moves and select the highest-value step to improve first." },
  { n: "02", title: "Workflow definition", copy: "Your rules, files and exceptions become a plain-language operating specification." },
  { n: "03", title: "Development", copy: "We build and tune on a small, real slice of work with human-verifiable outputs." },
  { n: "04", title: "Implementation & support", copy: "The workflow goes live, gets measured and expands only after it proves useful." },
];

export const functions: { id: BusinessFunction; label: string }[] = [
  { id: "sales", label: "Sales" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Finance" },
  { id: "people", label: "People" },
  { id: "service", label: "Service" },
];

const scenarioSeed: Record<BusinessFunction, Omit<WorkflowScenario, "id" | "audience">> = {
  sales: {
    function: "sales",
    painPoint: "Enquiries wait too long for a complete response",
    summary: "Turn an incoming enquiry into a prepared, contextual quote while commercial judgement stays human.",
    inputs: ["Email", "WhatsApp", "Past quotes", "Product catalogue"],
    aiSteps: ["Read the request", "Identify requirements", "Find comparable work", "Prepare the response", "Schedule follow-up"],
    humanDecision: "Approve pricing, margin and relationship context",
    systemsUpdated: ["CRM", "Email", "Quote register"],
    benefits: ["Faster response", "Consistent preparation", "Fewer missed follow-ups"],
    relatedProof: "ROLE:X enquiry-to-quote workflow",
  },
  operations: {
    function: "operations",
    painPoint: "Tasks are assigned manually and disappear between teams",
    summary: "Triage incoming work, route it to the right owner and keep following up until it is closed.",
    inputs: ["Forms", "Email", "Site reports", "Team messages"],
    aiSteps: ["Classify the job", "Set priority", "Assign an owner", "Track the deadline", "Log completion"],
    humanDecision: "Perform or approve the specialist work",
    systemsUpdated: ["ERP", "Task board", "Audit log"],
    benefits: ["Nothing dropped", "Clear ownership", "Better auditability"],
    relatedProof: "ROLE:X dispatch and follow-up workflow",
  },
  finance: {
    function: "finance",
    painPoint: "Invoices and purchase orders are checked line by line",
    summary: "Read financial documents, compare the right records and surface only the mismatches that need attention.",
    inputs: ["Invoices", "Purchase orders", "Supplier email", "Rate sheets"],
    aiSteps: ["Extract line items", "Match references", "Check totals", "Flag exceptions", "Prepare entry"],
    humanDecision: "Review exceptions and release payment",
    systemsUpdated: ["Finance system", "Exception queue", "Supplier record"],
    benefits: ["Less rework", "Faster checks", "Traceable exceptions"],
    relatedProof: "BOQ and document-matching proof of concept",
  },
  people: {
    function: "people",
    painPoint: "New joiners wait for documents, access and basic answers",
    summary: "Coordinate onboarding paperwork, system access and policy guidance without losing the human welcome.",
    inputs: ["Employee forms", "Policies", "Role checklist", "Training material"],
    aiSteps: ["Collect documents", "Check completeness", "Prepare access tasks", "Deliver induction", "Answer FAQs"],
    humanDecision: "Welcome, coach and confirm readiness",
    systemsUpdated: ["HR system", "Onboarding tracker", "Knowledge base"],
    benefits: ["Faster readiness", "Consistent induction", "More time for coaching"],
    relatedProof: "Organization Brain internal training",
  },
  service: {
    function: "service",
    painPoint: "Requests arrive across channels without one shared context",
    summary: "Unify incoming requests, prepare useful responses and escalate the moments that need a person.",
    inputs: ["Calls", "WhatsApp", "Web forms", "Service history"],
    aiSteps: ["Recognize the request", "Retrieve context", "Draft the answer", "Create a service task", "Monitor resolution"],
    humanDecision: "Handle judgement, trust or sensitive exceptions",
    systemsUpdated: ["Service desk", "Customer record", "Knowledge base"],
    benefits: ["Faster service", "Shared context", "Reliable escalation"],
    relatedProof: "Onion and cross-channel service intelligence",
  },
};

const audienceAdjustments: Record<Audience, { prefix: string; system: string }> = {
  business: { prefix: "Practical automation for a growing business", system: "Business dashboard" },
  enterprise: { prefix: "Governed automation across an enterprise", system: "Enterprise audit trail" },
  government: { prefix: "Sovereign automation for public service", system: "Service oversight dashboard" },
};

export const workflowScenarios: WorkflowScenario[] = (["business", "enterprise", "government"] as Audience[]).flatMap((audience) =>
  (Object.keys(scenarioSeed) as BusinessFunction[]).map((fn) => {
    const seed = scenarioSeed[fn];
    const adjustment = audienceAdjustments[audience];
    return {
      ...seed,
      id: `${audience}-${fn}`,
      audience,
      summary: `${adjustment.prefix}. ${seed.summary}`,
      systemsUpdated: [...seed.systemsUpdated, adjustment.system],
    };
  }),
);

export const caseStudies: CaseStudy[] = [
  {
    slug: "boq-pricing",
    status: "Proof of concept",
    client: "ROLE:X",
    title: "BOQ pricing automation",
    challenge: "Large MEP bills of quantities require slow catalogue matching and pricing across inconsistent item codes.",
    workflow: "PDF or spreadsheet to matched catalogue lines, proposed pricing and a completed output.",
    aiActions: ["Read every line", "Match items to catalogue and past work", "Price from historical invoices", "Flag uncertain rows"],
    humanRole: "Verify exceptions, margin and final submission.",
    outcome: "The full document is prepared; attention is directed to the rows that need judgement.",
    approvedAssets: [],
  },
  {
    slug: "care-cure",
    status: "Live",
    client: "Care & Cure",
    title: "Document and bill validation",
    challenge: "Healthcare billing teams need a dependable way to catch incomplete or inconsistent records.",
    workflow: "Uploaded documents to rule-based validation, a clear issue list and a verifiable review trail.",
    aiActions: ["Read the document set", "Apply approved checks", "Explain each flag", "Capture corrections"],
    humanRole: "Review clinical or policy-sensitive exceptions.",
    outcome: "Staff review flagged issues against a consistent set of document checks.",
    approvedAssets: [],
  },
  {
    slug: "lead-intelligence",
    status: "Pilot",
    client: "Lead Intelligence",
    title: "Cross-channel lead intelligence",
    challenge: "Web, WhatsApp, LinkedIn and voice conversations create fragmented lead context.",
    workflow: "Cross-channel signals to a consolidated timeline, fit indicators and clear next actions.",
    aiActions: ["Unify conversations", "Retrieve relationship context", "Organize intent signals", "Prepare the next action"],
    humanRole: "Choose the commercial approach and own the relationship.",
    outcome: "Teams see a known lead rather than another disconnected message.",
    approvedAssets: [],
  },
  {
    slug: "organization-brain",
    status: "Live",
    client: "Organization Brain",
    title: "Internal company knowledge access",
    challenge: "Policies, product knowledge and training material are scattered across files and teams.",
    workflow: "Approved public and private sources to searchable, answerable organizational knowledge.",
    aiActions: ["Organize approved sources", "Retrieve relevant passages", "Answer in context", "Record feedback"],
    humanRole: "Own source truth, access rules and sensitive decisions.",
    outcome: "A shared knowledge foundation for customer-facing and internal agents.",
    approvedAssets: [],
  },
];

export const team = [
  { name: "Merlin James", role: "Founder / CEO", image: "/brand/team/merlin-james.webp" },
  { name: "Sajith Amma", role: "Chief Visionary & AI", image: "/brand/team/sajith-amma.webp" },
  { name: "Aswanth CM", role: "Senior AI Architect", image: "/brand/team/aswanth.webp" },
  { name: "Anand J Nair", role: "AI Engineer", image: "/brand/team/anand-j-nair.webp" },
  { name: "Niyas Muhammed", role: "Lead — Backend", image: "/brand/team/niyas-muhammed.webp" },
  { name: "Abhay Sivasankaran", role: "Head of Operations", image: "/brand/team/abhay-sivasankaran.webp" },
];

export const faqs = [
  { q: "How quickly can the first workflow go live?", a: "ROLE:X is designed to put a well-defined first workflow live in about seven days. Wider transformation programmes are staged around validated milestones." },
  { q: "Do we need to replace our current software?", a: "No. Ant Venture can work with email, WhatsApp, spreadsheets, ERP systems, forms and APIs already used by your team." },
  { q: "Where does our data run?", a: "Deployment can use approved cloud infrastructure, your tenant or on-premise systems. The architecture is selected around your security and sovereignty requirements." },
  { q: "Does AI make the final decision?", a: "Not where judgement, trust or accountability is required. Workflows define explicit approval points, escalation paths and audit records." },
  { q: "Which workflows are a good starting point?", a: "Repeatable, rules-led work with clear inputs and outputs—such as quotes, document checks, onboarding, ticket routing and follow-up—is usually a strong first candidate." },
];

export function getScenario(audience: Audience, fn: BusinessFunction) {
  return workflowScenarios.find((scenario) => scenario.audience === audience && scenario.function === fn) ?? workflowScenarios[0];
}
