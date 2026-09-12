/**
 * Cross-Pod Master Workflow — implemented *inside* the workflow, not as a menu.
 *
 * Each entry marks a step where one pod hands work to another pod or to an
 * outside system (Zoho CRM, Asana, Drive, Finance). It follows the TPF lead-flow
 * build guide (Gate 1 = Step 6, Gate 2 = Step 18, Gate 3 = Step 24) and the
 * Pod 3 governance trigger map. Static wireframe content — nothing is connected.
 */

export type Handoff = {
  pod: 1 | 2 | 3;
  step: number;
  /** Short name of the handoff, e.g. "Gate 1 · TPF → Zoho CRM". */
  title: string;
  from: string;
  to: string;
  /** What fires automatically once the gate clears. */
  autoAction: string;
  /** The human condition that must be true first. */
  humanGate: string;
  connector: string;
  audit: string;
  dashboard: string;
  maturity: "Crawl" | "Walk" | "Run";
  /** Where the receiving side of this handoff can be seen in the app. */
  link?: { to: string; label: string };
};

export const HANDOFFS: Handoff[] = [
  // ---------- Pod 1 ----------
  {
    pod: 1,
    step: 4,
    title: "Fit score creates a CRM candidate",
    from: "Pod 1 · Capability Matcher",
    to: "The Proposal Factory (held, not pushed)",
    autoAction: "Opportunities scoring at or above the fit threshold (80% to start) become CRM candidates.",
    humanGate: "None yet — nothing leaves the platform until Step 6.",
    connector: "Pipeline MCP",
    audit: "Match and score record",
    dashboard: "Sub-client dashboard updated",
    maturity: "Crawl",
    link: { to: "/subclient-mapping", label: "Sub-client mapping" },
  },
  {
    pod: 1,
    step: 6,
    title: "Gate 1 · qualified opportunity goes to Zoho CRM",
    from: "Pod 1 · triage",
    to: "Zoho CRM",
    autoAction: "Creates or updates one CRM record and returns the Zoho ID against the same opportunity ID.",
    humanGate: "A person approves the triage decision. A discard keeps the record here with its reason.",
    connector: "Zoho CRM MCP",
    audit: "Qualification decision log",
    dashboard: "Pipeline counts and status updated",
    maturity: "Crawl",
    link: { to: "/pipeline", label: "Pipeline / Discovery" },
  },
  {
    pod: 1,
    step: 18,
    title: "Gate 2 · Go decision creates the deal and top opportunity",
    from: "Pod 1 · leadership Go / No-Go",
    to: "Zoho Deals + Top Opportunities",
    autoAction: "A Go raises the Zoho stage to active deal and flags the pursuit as a top opportunity here.",
    humanGate: "Leadership authorises the pursuit. Hold or No-Go keeps the history and clears the flag.",
    connector: "Work Mgmt + Finance MCP",
    audit: "Pursuit decision trail",
    dashboard: "Go / Hold / No-Go updated",
    maturity: "Crawl",
    link: { to: "/subclient-mapping", label: "Sub-client mapping" },
  },
  {
    pod: 1,
    step: 19,
    title: "Solicitation package under document control",
    from: "Pod 1 · user upload",
    to: "Drive / document control",
    autoAction: "Files are versioned and the source is logged against the opportunity.",
    humanGate: "Missing or incomplete packages stop here.",
    connector: "Document MCP",
    audit: "Immutable upload log",
    dashboard: "Intake status updated",
    maturity: "Crawl",
    link: { to: "/documents", label: "Document Library" },
  },
  {
    pod: 1,
    step: 24,
    title: "Gate 3 · approved intake creates the Asana proposal project",
    from: "Pod 1 · intake review",
    to: "Asana",
    autoAction: "Builds the proposal project from the template, with sections, owners, dates and review gates linked back here.",
    humanGate: "A person confirms the extraction matches the solicitation. Single tasks may exist earlier; the full project does not.",
    connector: "Asana / Work Mgmt MCP",
    audit: "Project creation record",
    dashboard: "Proposal readiness updated",
    maturity: "Walk",
    link: { to: "/proposals", label: "Proposals" },
  },
  {
    pod: 1,
    step: 45,
    title: "Event cost feeds the proposal price",
    from: "Pod 1 · cost build",
    to: "Pod 2 · event budget",
    autoAction: "Event scope and cost are compared against the proposal basis of estimate.",
    humanGate: "Any margin or threshold breach needs approval.",
    connector: "Finance MCP",
    audit: "Cross-pod cost log",
    dashboard: "Budget risk updated",
    maturity: "Walk",
    link: { to: "/budget", label: "Budget guardrails" },
  },
  {
    pod: 1,
    step: 70,
    title: "A win hands the work to Pod 2",
    from: "Pod 1 · award",
    to: "Pod 2 · Events & Experiential",
    autoAction: "Won proposals appear in Pod 2 automatically, with the proposal detail already attached.",
    humanGate: "Operational readiness is confirmed before kickoff.",
    connector: "Finance + Work Mgmt MCP",
    audit: "Award handoff log",
    dashboard: "Won status and kickoff dashboard",
    maturity: "Walk",
    link: { to: "/won-proposals", label: "Won proposals in Pod 2" },
  },

  // ---------- Pod 2 ----------
  {
    pod: 2,
    step: 1,
    title: "Event scope arrives from a won proposal",
    from: "Pod 1 · award",
    to: "Pod 2 · event intake",
    autoAction: "The event brief is pre-filled from the winning proposal instead of being retyped.",
    humanGate: "Missing brief documents or a client-facing issue stops intake.",
    connector: "Document MCP",
    audit: "Event created from proposal",
    dashboard: "Event status created",
    maturity: "Crawl",
    link: { to: "/won-proposals", label: "Won proposals" },
  },
  {
    pod: 2,
    step: 18,
    title: "Event budget checked against the proposal",
    from: "Pod 2 · budget",
    to: "Pod 3 · finance guardrails",
    autoAction: "The event baseline is compared with the priced proposal and any variance is flagged.",
    humanGate: "Spend above the approved threshold needs sign-off.",
    connector: "Finance MCP",
    audit: "Budget decision log",
    dashboard: "Budget risk updated",
    maturity: "Walk",
    link: { to: "/budget", label: "Budget guardrails" },
  },
  {
    pod: 2,
    step: 24,
    title: "Vendor and talent commitments become tasks",
    from: "Pod 2 · vendor coordination",
    to: "Asana + Pod 3 approvals",
    autoAction: "Contract drafts are locked and routed for approval, with owners and dates in the task system.",
    humanGate: "Always required for anything external or contractual.",
    connector: "Contract / Document MCP",
    audit: "Contract approval log",
    dashboard: "Committed spend updated",
    maturity: "Crawl",
    link: { to: "/approvals", label: "Approvals" },
  },
  {
    pod: 2,
    step: 48,
    title: "Lessons and proof points return to Pod 1",
    from: "Pod 2 · closeout",
    to: "Pod 1 · past performance",
    autoAction: "ROI, photos and lessons learned are written back as reusable proof points.",
    humanGate: "A person validates the client-facing final report.",
    connector: "Analytics / Document MCP",
    audit: "Closeout audit record",
    dashboard: "ROI and lessons learned",
    maturity: "Walk",
    link: { to: "/sub-clients", label: "Sub-client profiles" },
  },

  // ---------- Pod 3 ----------
  {
    pod: 3,
    step: 2,
    title: "Every pod event lands in the approval queue",
    from: "Pod 1 and Pod 2 gates",
    to: "Pod 3 · approvals",
    autoAction: "Each gate that needs a decision is routed to the right approver with its evidence attached.",
    humanGate: "This is the human gate — nothing advances without it.",
    connector: "Approval Router",
    audit: "Decision trail required",
    dashboard: "Approval queue updated",
    maturity: "Crawl",
    link: { to: "/approvals", label: "Approval queue" },
  },
  {
    pod: 3,
    step: 6,
    title: "Cross-pod handoffs are logged end to end",
    from: "All pods",
    to: "Pod 3 · audit trail",
    autoAction: "Source system, target system, time, result, retry and any human override are recorded.",
    humanGate: "Failed handoffs are surfaced for a person to resolve, never dropped silently.",
    connector: "Audit MCP",
    audit: "Cross-pod handoff log",
    dashboard: "Integration health",
    maturity: "Crawl",
    link: { to: "/audit", label: "Audit trail" },
  },
  {
    pod: 3,
    step: 4,
    title: "One opportunity, many entities, no cross-tenant leakage",
    from: "Pod 1 · matching",
    to: "Pod 3 · access rules",
    autoAction: "The same market record can serve several sub-clients while each only sees its own pursuit.",
    humanGate: "Cross-client concerns escalate to an admin.",
    connector: "RBAC Manager",
    audit: "Access decision log",
    dashboard: "Tenant scoping updated",
    maturity: "Crawl",
    link: { to: "/access", label: "Access & RBAC" },
  },
];

export function handoffFor(pod: number, step: number) {
  return HANDOFFS.find((h) => h.pod === pod && h.step === step);
}

export function handoffsForPod(pod: number) {
  return HANDOFFS.filter((h) => h.pod === pod);
}
