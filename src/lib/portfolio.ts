export type Product = {
  slug: string; name: string; category: string; summary: string; audience: string;
  color: string; inputs: string[]; outputs: string[]; steps: string[];
  features: { title: string; copy: string }[]; faqs: { q: string; a: string }[];
  source: string; flagship?: boolean;
};

export const products: Product[] = [
  {
    slug: "role-x", name: "ROLE:X", category: "Workflow automation", flagship: true, color: "#9bf1d9",
    summary: "Automate tasks inside email, WhatsApp, spreadsheets and your existing business systems.",
    audience: "Operations, finance and service teams handling repeatable work.",
    inputs: ["Email & WhatsApp", "Documents & forms", "ERP & spreadsheets"], outputs: ["Prepared replies", "System updates", "Assigned tasks"],
    steps: ["Read inputs", "Apply your rules", "Prepare the work", "Human approval", "Update systems"],
    features: [{ title: "Existing-tool integration", copy: "Read from and write back to the tools your team already uses." }, { title: "Human decisions", copy: "AI prepares the work. Your team approves the decisions defined in the workflow." }, { title: "Focused deployment", copy: "Start with one workflow, such as BOQ pricing, invoice matching or request routing. Private and on-premise options are scoped during discovery." }],
    faqs: [{ q: "What can we automate first?", a: "A repeatable workflow with accessible inputs and clear rules: enquiry-to-quote, document validation, invoice matching or task routing." }, { q: "How quickly can a workflow go live?", a: "A focused first workflow can be ready in approximately seven days, depending on integrations, data access and approvals." }],
    source: "https://role-x.surge.sh/",
  },
  {
    slug: "influence", name: "Influence", category: "Outbound sales", color: "#aebaff",
    summary: "Find relevant prospects, personalize outreach and pass engaged leads to your sales workflow.",
    audience: "Sales and business-development teams building a prospect pipeline.",
    inputs: ["Ideal customer profile", "Campaign brief", "Company knowledge"], outputs: ["Personalized outreach", "Engagement scores", "Lead handover"],
    steps: ["Identify prospects", "Expand network", "Send contextual outreach", "Score engagement", "Hand over leads"],
    features: [{ title: "Targeted prospecting", copy: "Build a professional network around your ideal customer profile." }, { title: "Campaign management", copy: "Prepare channel-specific messages, templates, schedules and follow-ups for WhatsApp, email and SMS." }, { title: "Connected lead handling", copy: "Track engagement and hand interested prospects to Interact or your sales team." }],
    faqs: [{ q: "Which channels does Influence cover?", a: "The product covers WhatsApp, email and SMS outreach. Channel access and campaign rules are configured during setup." }, { q: "How are messages personalized?", a: "Campaign instructions, prospect context and approved company knowledge guide the message." }, { q: "Can it connect to our CRM?", a: "Lead handover and CRM integration are scoped around your existing systems." }],
    source: "https://antventure.ai/influence",
  },
  {
    slug: "interact", name: "Interact", category: "Inbound sales & support", color: "#78d8ff",
    summary: "Answer customer enquiries, qualify leads and keep conversation context connected to your CRM.",
    audience: "Customer-facing teams receiving enquiries across multiple channels.",
    inputs: ["WhatsApp enquiries", "Website & app chat", "Campaign leads"], outputs: ["Contextual answers", "Qualified leads", "CRM records"],
    steps: ["Receive enquiry", "Ask relevant questions", "Qualify the lead", "Sync CRM", "Review insights"],
    features: [{ title: "Multi-channel conversations", copy: "Handle enquiries from WhatsApp, websites and apps using the same company knowledge." }, { title: "Lead qualification", copy: "Classify leads as qualified, unqualified, call later or priority. Filter by channel, status and your own criteria." }, { title: "Customer insights", copy: "Review intent, objections and drop-offs to improve sales responses and marketing campaigns." }],
    faqs: [{ q: "How does Interact qualify a lead?", a: "You define the qualification criteria. Interact asks contextual questions and records intent, urgency and readiness." }, { q: "What is the AI Brain?", a: "The shared company knowledge layer supplies approved product information and brand context for answers." }, { q: "Can it be customized for a campaign?", a: "Yes. Conversation instructions and qualification criteria can be configured for a specific offer or campaign." }],
    source: "https://antventure.ai/interact",
  },
  {
    slug: "in-house", name: "In-House", category: "Internal operations", color: "#f0d491",
    summary: "Give employees access to internal knowledge, onboarding guidance and policy answers.",
    audience: "HR, operations and leadership teams working with private company information.",
    inputs: ["Policies & procedures", "Training materials", "Internal documents"], outputs: ["Employee answers", "Onboarding support", "Management insights"],
    steps: ["Connect private knowledge", "Set access rules", "Answer employees", "Support onboarding", "Review feedback"],
    features: [{ title: "Document and policy search", copy: "Retrieve relevant answers from your internal documents and procedures." }, { title: "Employee onboarding", copy: "Guide new joiners through training materials and common questions." }, { title: "Internal intelligence", copy: "Support HR communication, leadership dashboards and process improvement using company context." }],
    faqs: [{ q: "Is internal knowledge separate from customer-facing content?", a: "In-House uses the private AI Brain. Public and private sources are separated during setup, with access rules agreed for your deployment." }, { q: "What should we provide?", a: "Start with current policies, onboarding documents, training material and the internal questions employees ask most often." }],
    source: "https://antventure.ai/",
  },
  {
    slug: "inspire", name: "Inspire", category: "Brand & content", color: "#efa7bf",
    summary: "Plan and produce brand-aligned content using your positioning, guidelines and company knowledge.",
    audience: "Marketing and content teams managing brand communication.",
    inputs: ["Brand guidelines", "Content brief", "Company knowledge"], outputs: ["Content drafts", "Magazine content", "Podcast content"],
    steps: ["Define brand direction", "Plan content", "Create drafts", "Review content", "Prepare publishing"],
    features: [{ title: "Branding Director", copy: "Keep content direction aligned with your positioning and brand guidelines." }, { title: "Content Intelligence", copy: "Turn approved company knowledge into useful, consistent communication." }, { title: "Publishing agents", copy: "Support magazine publishing and podcast creation alongside your editorial team." }],
    faqs: [{ q: "What guides the content?", a: "Your brand guidelines, product information, campaign brief and the public AI Brain." }, { q: "Which agents are included?", a: "The product brings together Branding Director, Content Intelligence, Magazine Publishing and Podcast Creation agents. The deployment is scoped to your content needs." }],
    source: "https://antventure.ai/",
  },
  {
    slug: "organization-brain", name: "Organization AI Brain", category: "Shared company knowledge", color: "#91d9c8",
    summary: "Connect public and private company knowledge so your AI agents can work with the right context.",
    audience: "Organizations that need consistent answers across customer-facing and internal teams.",
    inputs: ["Websites & brand assets", "Documents & policies", "Training & feedback"], outputs: ["Relevant answers", "Reusable content", "Agent context"],
    steps: ["Collect sources", "Structure knowledge", "Separate access", "Connect agents", "Refresh knowledge"],
    features: [{ title: "Public Brain", copy: "Website content, brand guidelines and product information support Influence, Interact and Inspire." }, { title: "Private Brain", copy: "Internal policies, HR documents and training material support In-House with separate access controls." }, { title: "Knowledge tools", copy: "Ask questions, retrieve information, reformat content, convert formats, extract insights and respond in multiple languages." }],
    faqs: [{ q: "How is the Brain set up?", a: "Collect approved sources, structure them into public and private knowledge, then connect the relevant agents." }, { q: "Can knowledge stay up to date?", a: "Source synchronization, APIs and workflow triggers can refresh the knowledge layer. Integration and access requirements are agreed during setup." }, { q: "Which governance options are available?", a: "Discuss administration, SSO, provisioning, audit logging and private deployment requirements with our team. Availability depends on the agreed implementation." }],
    source: "https://antventure.ai/aibrain",
  },
];

export const setupSteps = [
  ["Set up the AI Brain", "Connect approved documents, websites and company information."],
  ["Select an agent", "Choose the product for your sales, content or internal workflow."],
  ["Add instructions", "Define goals, rules, access and approval points."],
  ["Run the workflow", "Connect your tools and test with real inputs."],
  ["Review insights", "Check results and refine instructions before expanding."],
];

export const academyModules = [
  ["AI Approach Methodology", "Tailored outputs, prompt engineering and AI communication protocols."],
  ["Rapid Deployment", "Rapid prototyping, shorter delivery cycles and lean operating models."],
  ["Agentic Architecture", "Parallel agents, system design and coordinated AI operations."],
  ["Workflow Revolution", "Automation frameworks, workflow design and modern development practices."],
  ["Revenue Models 2.0", "AI-enabled revenue opportunities and modern sales approaches."],
  ["Hyper Data Intelligence", "Predictive analytics, anomaly detection and intellectual-property development."],
];

export const otherProjects = [
  { name: "Pashyanti", category: "Project", copy: "Explore Pashyanti on its dedicated website.", href: "https://pashyanti.com/" },
  { name: "PDFX.pro", category: "Document tools", copy: "Compress PDFs with adjustable quality and resolution settings.", href: "https://pdfx.pro/" },
  { name: "Manimate", category: "Educational media", copy: "Create mathematical animation videos.", href: "https://manimate.co/" },
  { name: "Opod", category: "Audio", copy: "An AI-powered radio station project.", href: "https://opod.ai/" },
  { name: "Managed Service", category: "Services", copy: "Explore Ant Venture's managed-service offering.", href: "https://www.antventureconsults.com/" },
  { name: "T-Shaped People", category: "People & technology", copy: "A collective focused on human and machine collaboration.", href: "https://tshaped.in/" },
];
