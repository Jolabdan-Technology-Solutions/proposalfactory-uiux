/**
 * Lead flow, CRM and Asana integration model.
 *
 * Source: "TPF Lead Flow, CRM & Asana Integration Build Guide" (Aug 2026).
 * One opportunity, multiple specialised systems, three maturity gates:
 *   Gate 1 — Step 6  · qualified opportunity goes to Zoho CRM
 *   Gate 2 — Step 18 · leadership GO creates the Zoho Deal + TPF Top Opportunity
 *   Gate 3 — Step 24 · approved intake creates the full Asana proposal project
 *
 * Static wireframe reference content — nothing here is connected to a live system.
 */

export type LifecycleState = {
  state: string;
  volume: string;
  system: string;
  steps: string;
  meaning: string;
  exit: string;
};

export const LIFECYCLE: LifecycleState[] = [
  {
    state: "Market universe",
    volume: "30,000",
    system: "The Proposal Factory",
    steps: "Steps 1–3",
    meaning: "Raw, normalised and de-duplicated opportunities.",
    exit: "Ready for matching",
  },
  {
    state: "Entity matched",
    volume: "6,000",
    system: "The Proposal Factory",
    steps: "Step 4",
    meaning: "Mapped to one or more sub-clients with a fit score.",
    exit: "Fit threshold met",
  },
  {
    state: "CRM candidate",
    volume: "1,000",
    system: "The Proposal Factory",
    steps: "Steps 4–5",
    meaning: "High-fit lead worth a brief and a triage decision.",
    exit: "Triage approval",
  },
  {
    state: "CRM qualified",
    volume: "under 1,000",
    system: "Zoho CRM + TPF",
    steps: "Step 6",
    meaning: "Approved for relationship development and deeper research.",
    exit: "Pursuit decision",
  },
  {
    state: "Active deal / top opportunity",
    volume: "Priority subset",
    system: "Zoho CRM + TPF",
    steps: "Step 18",
    meaning: "Leadership has authorised pursuit investment.",
    exit: "Solicitation intake validated",
  },
  {
    state: "Active proposal",
    volume: "Final subset",
    system: "Asana + TPF",
    steps: "Steps 24–70",
    meaning: "Formal proposal production and human execution.",
    exit: "Submission / outcome",
  },
];

export type Gate = {
  id: 1 | 2 | 3;
  step: number;
  title: string;
  system: string;
  rule: string;
  before: string;
  after: string;
  /** What actually crosses the boundary. */
  payload: string[];
  guardrail: string;
};

export const GATES: Gate[] = [
  {
    id: 1,
    step: 6,
    title: "Gate 1 · qualified opportunity goes to Zoho CRM",
    system: "Zoho CRM",
    rule: "Fit score at or above the configured threshold (80% to start) makes a CRM candidate. Only a human triage approval at Step 6 creates or updates the Zoho record.",
    before: "Nothing leaves the platform. 30,000 raw opportunities never become 30,000 CRM records.",
    after: "One CRM record is created or updated and the Zoho ID is stored against the same opportunity ID.",
    payload: [
      "TPF opportunity ID",
      "Buyer / agency",
      "Matched sub-client",
      "Fit score + rationale",
      "Title and summary",
      "Source + reference link",
      "Estimated value",
      "Procurement dates",
      "NAICS / PSC / set-aside",
      "Known contacts",
      "Incumbent history",
      "Owner + current status",
      "Recommended next action",
    ],
    guardrail: "A discarded opportunity stays here with its reason. No CRM record is written.",
  },
  {
    id: 2,
    step: 18,
    title: "Gate 2 · leadership GO creates the deal and the top opportunity",
    system: "Zoho CRM (deal stage)",
    rule: "A GO at the Step 18 leadership gate moves the Zoho record to Active Deal / Pursuit and classifies the same opportunity as a TPF Top Opportunity.",
    before: "The opportunity is being evaluated and cultivated: agency, incumbent and competitor research, capture assumptions, pursuit economics, staffing.",
    after: "Owner, next action, capture status and buyer engagement stay in step across both systems.",
    payload: [
      "Deal stage = Active Deal / Pursuit",
      "Classification = Top Opportunity",
      "Commercial owner + next action",
      "Executive priority + capture status",
      "Buyer relationship summary",
      "Pursuit risks",
    ],
    guardrail: "A HOLD or NO-GO removes it from the active top opportunities and keeps the full history and rationale.",
  },
  {
    id: 3,
    step: 24,
    title: "Gate 3 · approved intake creates the Asana proposal project",
    system: "Asana",
    rule: "Only after the human intake review gate at Step 24 approves the parsed solicitation does the full Asana proposal project get created from the template.",
    before: "Single Asana tasks are allowed at any earlier step for real human work: partner outreach, a meeting, an approval, a blocker.",
    after: "Sections, compliance tasks, owners, dependencies, review gates and milestone dates are created and linked back to the opportunity, the deal and the document folder.",
    payload: [
      "Proposal project from template",
      "Compliance and section tasks",
      "Assignments and due dates",
      "Review and pricing gates",
      "Links to TPF, Zoho and Drive",
    ],
    guardrail: "A GO at Step 18 alone does not create a project — that would leave hundreds of dormant proposal projects.",
  },
];

export type OwnershipRule = {
  data: string;
  authority: string;
  visible: string;
  rule: string;
};

export const OWNERSHIP: OwnershipRule[] = [
  { data: "Market source, normalisation, de-dupe", authority: "TPF", visible: "Zoho summary if qualified", rule: "Never push the raw universe into the CRM." },
  { data: "Entity match + fit score", authority: "TPF", visible: "Zoho", rule: "The TPF calculation stays authoritative." },
  { data: "Buyer / contact relationship", authority: "Zoho CRM", visible: "TPF summary", rule: "Do not keep competing contact histories." },
  { data: "Nurture / engagement activity", authority: "Zoho CRM", visible: "TPF material events", rule: "Summaries and signals only, not full activity replication." },
  { data: "Pursuit intelligence, PWin, Go/No-Go pack", authority: "TPF", visible: "Zoho summary", rule: "TPF owns the pursuit judgement artefacts." },
  { data: "Deal stage", authority: "Zoho CRM", visible: "TPF top opportunities", rule: "Stage sync must be explicit." },
  { data: "Top opportunity classification", authority: "TPF", visible: "Zoho may receive a flag", rule: "TPF owns the executive pursuit view." },
  { data: "Human tasks, deadlines, dependencies", authority: "Asana", visible: "TPF summary", rule: "No competing task system." },
  { data: "Proposal content and compliance", authority: "TPF + controlled documents", visible: "Asana links and status", rule: "Do not duplicate content into task comments." },
  { data: "Pricing, invoices, event spend", authority: "QuickBooks", visible: "TPF budget guardrails", rule: "Finance figures are read into the platform, not re-keyed." },
  { data: "Submission outcome / award", authority: "TPF + Zoho by field", visible: "Both", rule: "Field-by-field authority is agreed before any write-back." },
];

export const ACCEPTANCE: string[] = [
  "30,000+ raw opportunities can exist here without creating 30,000 CRM records.",
  "Nothing reaches the CRM until the Step 6 triage gate is satisfied.",
  "Reprocessing the same opportunity updates the linked records instead of creating new ones.",
  "A Step 18 GO promotes the pursuit; a HOLD or NO-GO keeps the history.",
  "No full Asana proposal project exists before Step 24 approval.",
  "Capture-stage human tasks can still be created in Asana early.",
  "Material CRM and task events are visible here without manual reconciliation.",
  "Every cross-system action is traceable to source, target, person, time and outcome.",
  "Users only see the sub-client pursuits they are authorised for.",
  "Failed syncs queue for retry or a person, and never silently drop a handoff.",
];

/** One persistent identity, many linked system records. */
export type SystemRecord = { system: string; id: string; note: string };

export function systemRecords(opportunityId: string, stage: string): SystemRecord[] {
  const rows: SystemRecord[] = [
    { system: "TPF opportunity ID", id: opportunityId, note: "Master identity — never changes" },
  ];
  const past = (s: string) =>
    ["proposal", "investment", "clientele", "won", "closed", "lost"].includes(stage) || stage === s;
  if (past("research")) rows.push({ system: "Zoho CRM", id: `ZCRM-${opportunityId.slice(-4)}`, note: "Created at Gate 1 · Step 6" });
  if (past("proposal")) rows.push({ system: "Zoho deal", id: `ZDEAL-${opportunityId.slice(-4)}`, note: "Elevated at Gate 2 · Step 18" });
  if (past("proposal")) rows.push({ system: "Asana project", id: `ASN-${opportunityId.slice(-4)}`, note: "Created at Gate 3 · Step 24" });
  if (past("proposal")) rows.push({ system: "Drive folder", id: `DRV-${opportunityId.slice(-4)}`, note: "Controlled source package" });
  if (past("investment")) rows.push({ system: "QuickBooks", id: `QB-${opportunityId.slice(-4)}`, note: "Pricing and cost record" });
  return rows;
}

/** Where each outside tool actually shows up in each pod's work. */
export type IntegrationMoment = {
  pod: 1 | 2 | 3;
  step: string;
  system: string;
  action: string;
};

export const INTEGRATION_MOMENTS: IntegrationMoment[] = [
  // Pod 1
  { pod: 1, step: "Steps 1–3", system: "Research sources", action: "Federal and SLED forecasts are pulled in, normalised and de-duplicated here — nothing is pushed outward." },
  { pod: 1, step: "Step 6", system: "Zoho CRM", action: "Gate 1: an approved triage creates or updates one CRM record and returns the Zoho ID." },
  { pod: 1, step: "Steps 7–17", system: "Zoho CRM + Slack", action: "Zoho runs the nurture journey; only material buyer events (meeting, reply, date change) come back and post to Slack." },
  { pod: 1, step: "Any capture step", system: "Asana (single task)", action: "A real human commitment — outreach, a meeting, an approval — becomes one Asana task linked to the opportunity." },
  { pod: 1, step: "Step 18", system: "Zoho deal stage", action: "Gate 2: a leadership GO sets Active Deal / Pursuit and marks it a Top Opportunity here." },
  { pod: 1, step: "Steps 19–23", system: "Google Drive / SharePoint", action: "The solicitation package is stored as the controlled source folder for the opportunity." },
  { pod: 1, step: "Step 24", system: "Asana (proposal project)", action: "Gate 3: approved intake instantiates the proposal template with sections, owners, dependencies and review gates." },
  { pod: 1, step: "Steps 40–52", system: "QuickBooks", action: "Cost build and pricing pull rates and historical costs; margin changes flag before the pricing gate." },
  { pod: 1, step: "Steps 53–60", system: "Asana + Slack + Calendar", action: "Review gates, colour-team sessions and the submission deadline live as tasks, channel alerts and calendar holds." },
  { pod: 1, step: "Steps 61–70", system: "Zoho + QuickBooks", action: "Award or loss writes back the outcome field-by-field and opens the contract/invoice record." },
  // Pod 2
  { pod: 2, step: "Event intake", system: "Zoho + TPF handoff", action: "A won proposal in Pod 1 arrives as an event brief with the same opportunity ID attached." },
  { pod: 2, step: "Concept & planning", system: "Asana", action: "The event plan becomes an Asana project: run of show, vendors, dependencies and owners." },
  { pod: 2, step: "Budget", system: "QuickBooks", action: "Event budget lines, vendor invoices and spend against guardrails are read from finance, not re-keyed." },
  { pod: 2, step: "Comms & registration", system: "Eventbrite / Cvent + Slack + Gmail", action: "Registration opens, attendee counts sync, and the delivery channel gets the daily status post." },
  { pod: 2, step: "Execution", system: "Calendar + Slack", action: "Call times, rehearsals and on-site escalations run through calendar holds and one event channel." },
  { pod: 2, step: "Closeout", system: "Drive + QuickBooks + surveys", action: "Final assets are filed, invoices reconciled and the survey result feeds the recap." },
  // Pod 3
  { pod: 3, step: "Approvals", system: "Slack / Teams", action: "Every human gate in Pod 1 and Pod 2 raises an approval request in the channel with a link back to the step." },
  { pod: 3, step: "Audit trail", system: "All connectors", action: "Each create, update, retry, conflict and human override is logged with source, target, time and outcome." },
  { pod: 3, step: "Budget guardrails", system: "QuickBooks", action: "Spend and margin thresholds are checked against finance before a gate can clear." },
  { pod: 3, step: "Documents", system: "Drive / SharePoint", action: "Controlled folders, retention and version history for both pods." },
  { pod: 3, step: "Access", system: "Okta / Google Workspace", action: "Tenant and sub-tenant separation, so one market opportunity matched to several entities never leaks across them." },
  { pod: 3, step: "Sync health", system: "Integration audit", action: "Failed syncs queue for retry or a person; nothing silently drops." },
];

export function momentsForPod(pod: 1 | 2 | 3): IntegrationMoment[] {
  return INTEGRATION_MOMENTS.filter((m) => m.pod === pod);
}
