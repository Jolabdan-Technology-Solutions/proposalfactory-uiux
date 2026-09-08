/**
 * Shared mock pipeline data for the wireframe.
 *
 * One dataset powers the Pipeline page, the Opportunities views and the global
 * filter bar on the pod dashboards, so every screen agrees on the same deals.
 * Nothing here is connected to a real system — it is static sample content.
 */

export type PodId = 1 | 2 | 3;

export type DealStage =
  // Pod 1 — proposal pipeline
  | "research"
  | "proposal"
  | "investment"
  | "clientele"
  | "closed"
  // Pod 2 — events
  | "brief"
  | "concept"
  | "planning"
  | "live"
  | "recap"
  // Pod 3 — governance
  | "intake"
  | "review"
  | "approved"
  | "monitoring"
  | "archived";

export const STAGE_LABELS: Record<DealStage, string> = {
  research: "Programs to be researched",
  proposal: "Proposal phase",
  investment: "Investments",
  clientele: "Clientele",
  closed: "Closed",
  brief: "Brief received",
  concept: "Concept & design",
  planning: "Planning & budget",
  live: "Live delivery",
  recap: "Closeout & recap",
  intake: "Request received",
  review: "Under review",
  approved: "Approved",
  monitoring: "Monitoring",
  archived: "Archived",
};

export const POD_STAGES: Record<PodId, DealStage[]> = {
  1: ["research", "proposal", "investment", "clientele", "closed"],
  2: ["brief", "concept", "planning", "live", "recap"],
  3: ["intake", "review", "approved", "monitoring", "archived"],
};

/** Per-pod wording so one dataset and one set of screens serve all three pods. */
export const POD_COPY: Record<
  PodId,
  {
    pod: string;
    pipelineTitle: string;
    pipelineBlurb: string;
    boardTitle: string;
    boardBlurb: string;
    item: string;
    items: string;
    counterparty: string;
    ref: string;
    fit: string;
    valueLabel: string;
    hub: "/pod1" | "/pod2" | "/pod3";
  }
> = {
  1: {
    pod: "Pod 1 · Proposal Factory",
    pipelineTitle: "Pipeline / Discovery",
    pipelineBlurb:
      "Everything sourced so far, in one list. Filter it down, sort it, then open an opportunity to score it and take it forward.",
    boardTitle: "Opportunities",
    boardBlurb:
      "One set of opportunities, four ways to look at it. Every view keeps the same per-item actions.",
    item: "opportunity",
    items: "opportunities",
    counterparty: "Agency",
    ref: "Solicitation",
    fit: "Fit",
    valueLabel: "Contract value",
    hub: "/pod1",
  },
  2: {
    pod: "Pod 2 · Events & Experiential",
    pipelineTitle: "Event Pipeline",
    pipelineBlurb:
      "Every event and activation in flight, from first brief to closeout. Filter by client, vertical or date, then open one to run its phase.",
    boardTitle: "Events",
    boardBlurb:
      "One set of events, four ways to look at it — by stage, by date, in full detail, plus the files people uploaded.",
    item: "event",
    items: "events",
    counterparty: "Client / host",
    ref: "Event code",
    fit: "Readiness",
    valueLabel: "Event budget",
    hub: "/pod2",
  },
  3: {
    pod: "Pod 3 · Back-Office Governance",
    pipelineTitle: "Governance Queue",
    pipelineBlurb:
      "Every approval, audit and budget item waiting on the back office. Filter it down, sort by due date or exposure, then act.",
    boardTitle: "Governance items",
    boardBlurb:
      "One queue, four ways to look at it — by state, by due date, in full detail, plus supporting uploads.",
    item: "item",
    items: "items",
    counterparty: "Requested by",
    ref: "Case ref",
    fit: "Confidence",
    valueLabel: "Exposure",
    hub: "/pod3",
  },
};

export type Deal = {
  id: string;
  pod: PodId;
  name: string;
  agency: string;
  rfp: string;
  /** Day of month, Oct 2026 — the wireframe calendar month. */
  due: number;
  score: number;
  value: number;
  owner: string;
  subClient: string;
  naics: string;
  setAside: string;
  vertical: string;
  industry: string;
  source: string;
  stage: DealStage;
  zoho: boolean;
};

export const DEALS: Deal[] = [
  { id: "o1", pod: 1, name: "Navy IT Modernization", agency: "Dept. of the Navy", rfp: "N00178-25-R-0042", due: 6, score: 84, value: 4200000, owner: "Reggie", subClient: "Atlas Defense Group", naics: "541512", setAside: "SDVOSB", vertical: "Federal", industry: "IT / Cyber", source: "Discover", stage: "proposal", zoho: true },
  { id: "o2", pod: 1, name: "DHS Campus Security", agency: "Homeland Security", rfp: "70RTAC-25-R-0011", due: 9, score: 71, value: 1850000, owner: "Julie", subClient: "CivicPath Partners", naics: "561210", setAside: "8(a)", vertical: "Federal", industry: "Facilities", source: "SLED feed", stage: "research", zoho: false },
  { id: "o3", pod: 1, name: "GSA Facilities Support", agency: "GSA", rfp: "47QRAA-25-R-0088", due: 14, score: 58, value: 960000, owner: "Unassigned", subClient: "Unassigned", naics: "561210", setAside: "Small Business", vertical: "Federal", industry: "Facilities", source: "Discover", stage: "research", zoho: false },
  { id: "o4", pod: 1, name: "State DOT Signage", agency: "State of Georgia DOT", rfp: "SLED-2025-114", due: 14, score: 39, value: 410000, owner: "Reggie", subClient: "Riverside Civic Co.", naics: "238990", setAside: "None", vertical: "State", industry: "Facilities", source: "Manual CSV", stage: "investment", zoho: false },
  { id: "o5", pod: 1, name: "VA Clinic Staffing", agency: "Veterans Affairs", rfp: "36C24825R0037", due: 20, score: 77, value: 2600000, owner: "Julie", subClient: "Northstar Health Solutions", naics: "621999", setAside: "WOSB / EDWOSB", vertical: "Federal", industry: "Health", source: "Manual PDF", stage: "proposal", zoho: true },
  { id: "o6", pod: 1, name: "City of Atlanta Events", agency: "City of Atlanta", rfp: "COA-2026-EV-07", due: 23, score: 66, value: 720000, owner: "Delano", subClient: "Riverside Civic Co.", naics: "561920", setAside: "Small Business", vertical: "Local / Municipal", industry: "Civic Events", source: "Manual CSV", stage: "clientele", zoho: true },
  { id: "o7", pod: 1, name: "Army Training Support", agency: "Dept. of the Army", rfp: "W9124-26-R-0003", due: 28, score: 81, value: 3350000, owner: "Reggie", subClient: "Atlas Defense Group", naics: "611430", setAside: "8(a)", vertical: "Federal", industry: "Defense", source: "Discover", stage: "closed", zoho: false },
  { id: "o8", pod: 1, name: "Tribal Health Records Migration", agency: "Indian Health Service", rfp: "IHS-26-R-0142", due: 2, score: 74, value: 1240000, owner: "Julie", subClient: "TribalWorks LLC", naics: "541511", setAside: "Tribal 8(a)", vertical: "Tribal", industry: "Health", source: "Agency forecast", stage: "proposal", zoho: false },
  { id: "o9", pod: 1, name: "DOE Grid Resilience Study", agency: "Dept. of Energy", rfp: "DE-SOL-0012987", due: 5, score: 62, value: 890000, owner: "Delano", subClient: "GreenLine Energy", naics: "541690", setAside: "None", vertical: "Federal", industry: "Energy", source: "Discover", stage: "research", zoho: false },
  { id: "o10", pod: 1, name: "County Emergency Comms Refresh", agency: "Fulton County", rfp: "FC-2026-EM-19", due: 8, score: 55, value: 640000, owner: "Reggie", subClient: "CivicPath Partners", naics: "541512", setAside: "Small Business", vertical: "Local / Municipal", industry: "IT / Cyber", source: "SLED feed", stage: "research", zoho: false },
  { id: "o11", pod: 1, name: "University Cyber Assessment", agency: "Georgia State University", rfp: "GSU-RFP-26-044", due: 12, score: 69, value: 380000, owner: "Julie", subClient: "Mr. B2G Advisors (Prime & Consulting)", naics: "541512", setAside: "HUBZone", vertical: "Education (SLED)", industry: "IT / Cyber", source: "SLED feed", stage: "proposal", zoho: true },
  { id: "o12", pod: 1, name: "USAF Base Grounds Maintenance", agency: "Dept. of the Air Force", rfp: "FA4830-26-R-0007", due: 16, score: 48, value: 1120000, owner: "Unassigned", subClient: "Unassigned", naics: "561730", setAside: "SDVOSB", vertical: "Federal", industry: "Facilities", source: "Discover", stage: "research", zoho: false },
  { id: "o13", pod: 1, name: "HHS Outreach Campaign", agency: "Health & Human Services", rfp: "75N98026R00021", due: 19, score: 79, value: 1550000, owner: "Delano", subClient: "Northstar Health Solutions", naics: "541613", setAside: "WOSB / EDWOSB", vertical: "Federal", industry: "Health", source: "Agency forecast", stage: "proposal", zoho: true },
  { id: "o14", pod: 1, name: "State Solar Procurement Advisory", agency: "State of Georgia GEFA", rfp: "GEFA-26-0031", due: 21, score: 64, value: 470000, owner: "Reggie", subClient: "GreenLine Energy", naics: "541690", setAside: "None", vertical: "State", industry: "Energy", source: "Manual CSV", stage: "investment", zoho: false },
  { id: "o15", pod: 1, name: "DoD Conference Production", agency: "Dept. of Defense", rfp: "HQ0034-26-R-0056", due: 26, score: 88, value: 2100000, owner: "Delano", subClient: "Mr. B2G Advisors (Prime & Consulting)", naics: "561920", setAside: "8(a)", vertical: "Federal", industry: "Civic Events", source: "Discover", stage: "clientele", zoho: true },
  { id: "o16", pod: 1, name: "Tribal Facilities Renovation", agency: "Bureau of Indian Affairs", rfp: "BIA-26-R-0088", due: 30, score: 52, value: 980000, owner: "Julie", subClient: "TribalWorks LLC", naics: "236220", setAside: "Tribal 8(a)", vertical: "Tribal", industry: "Facilities", source: "Manual PDF", stage: "research", zoho: false },
  { id: "o17", pod: 1, name: "School District IT Helpdesk", agency: "DeKalb County Schools", rfp: "DCSD-26-IT-004", due: 3, score: 43, value: 320000, owner: "Reggie", subClient: "CivicPath Partners", naics: "541512", setAside: "Small Business", vertical: "Education (SLED)", industry: "IT / Cyber", source: "SLED feed", stage: "closed", zoho: false },
  { id: "o18", pod: 1, name: "Navy Shipyard Safety Training", agency: "Dept. of the Navy", rfp: "N00024-26-R-0119", due: 27, score: 73, value: 1430000, owner: "Julie", subClient: "Atlas Defense Group", naics: "611430", setAside: "SDVOSB", vertical: "Federal", industry: "Defense", source: "Agency forecast", stage: "proposal", zoho: true },

  /* Pod 2 — events & experiential */
  { id: "e1", pod: 2, name: "Navy Innovation Summit", agency: "Dept. of the Navy", rfp: "EV-2026-011", due: 7, score: 82, value: 640000, owner: "Eve", subClient: "Atlas Defense Group", naics: "561920", setAside: "SDVOSB", vertical: "Federal", industry: "Civic Events", source: "Pod 1 handoff", stage: "planning", zoho: true },
  { id: "e2", pod: 2, name: "Atlanta Civic Awards Gala", agency: "City of Atlanta", rfp: "EV-2026-014", due: 11, score: 74, value: 210000, owner: "Delano", subClient: "Riverside Civic Co.", naics: "561920", setAside: "Small Business", vertical: "Local / Municipal", industry: "Civic Events", source: "Sponsor inbound", stage: "concept", zoho: true },
  { id: "e3", pod: 2, name: "Veterans Health Expo", agency: "Veterans Affairs", rfp: "EV-2026-019", due: 15, score: 68, value: 380000, owner: "Julie", subClient: "Northstar Health Solutions", naics: "561920", setAside: "WOSB / EDWOSB", vertical: "Federal", industry: "Health", source: "Pod 1 handoff", stage: "brief", zoho: false },
  { id: "e4", pod: 2, name: "DoD Leadership Conference", agency: "Dept. of Defense", rfp: "EV-2026-022", due: 18, score: 90, value: 720000, owner: "Eve", subClient: "Mr. B2G Advisors (Prime & Consulting)", naics: "561920", setAside: "8(a)", vertical: "Federal", industry: "Defense", source: "Pod 1 handoff", stage: "live", zoho: true },
  { id: "e5", pod: 2, name: "GreenLine Energy Roadshow", agency: "State of Georgia GEFA", rfp: "EV-2026-025", due: 22, score: 61, value: 145000, owner: "Reggie", subClient: "GreenLine Energy", naics: "561920", setAside: "None", vertical: "State", industry: "Energy", source: "Sponsor inbound", stage: "concept", zoho: false },
  { id: "e6", pod: 2, name: "Tribal Partners Forum", agency: "Bureau of Indian Affairs", rfp: "EV-2026-028", due: 25, score: 57, value: 96000, owner: "Julie", subClient: "TribalWorks LLC", naics: "561920", setAside: "Tribal 8(a)", vertical: "Tribal", industry: "Civic Events", source: "Manual CSV", stage: "brief", zoho: false },
  { id: "e7", pod: 2, name: "University Cyber Career Fair", agency: "Georgia State University", rfp: "EV-2026-031", due: 4, score: 71, value: 88000, owner: "Delano", subClient: "Mr. B2G Advisors (Prime & Consulting)", naics: "561920", setAside: "HUBZone", vertical: "Education (SLED)", industry: "IT / Cyber", source: "SLED feed", stage: "recap", zoho: false },
  { id: "e8", pod: 2, name: "County First Responder Day", agency: "Fulton County", rfp: "EV-2026-034", due: 29, score: 64, value: 74000, owner: "Reggie", subClient: "CivicPath Partners", naics: "561920", setAside: "Small Business", vertical: "Local / Municipal", industry: "Civic Events", source: "Manual PDF", stage: "planning", zoho: false },
  { id: "e9", pod: 2, name: "HHS Community Outreach Tour", agency: "Health & Human Services", rfp: "EV-2026-037", due: 13, score: 78, value: 265000, owner: "Eve", subClient: "Northstar Health Solutions", naics: "561920", setAside: "WOSB / EDWOSB", vertical: "Federal", industry: "Health", source: "Pod 1 handoff", stage: "live", zoho: true },
  { id: "e10", pod: 2, name: "Shipyard Safety Week", agency: "Dept. of the Navy", rfp: "EV-2026-040", due: 2, score: 55, value: 52000, owner: "Julie", subClient: "Atlas Defense Group", naics: "561920", setAside: "SDVOSB", vertical: "Federal", industry: "Defense", source: "Pod 1 handoff", stage: "recap", zoho: false },

  /* Pod 3 — back-office governance */
  { id: "g1", pod: 3, name: "Go / no-go approval — Navy IT Modernization", agency: "Reggie (Pod 1)", rfp: "GOV-2026-101", due: 5, score: 86, value: 4200000, owner: "Oscar", subClient: "Atlas Defense Group", naics: "541512", setAside: "SDVOSB", vertical: "Federal", industry: "IT / Cyber", source: "Internal request", stage: "review", zoho: false },
  { id: "g2", pod: 3, name: "Pricing sign-off — VA Clinic Staffing", agency: "Julie (Pod 1)", rfp: "GOV-2026-104", due: 9, score: 72, value: 2600000, owner: "Oscar", subClient: "Northstar Health Solutions", naics: "621999", setAside: "WOSB / EDWOSB", vertical: "Federal", industry: "Health", source: "Internal request", stage: "intake", zoho: false },
  { id: "g3", pod: 3, name: "Event budget variance — DoD Conference", agency: "Eve (Pod 2)", rfp: "GOV-2026-107", due: 12, score: 64, value: 720000, owner: "Oscar", subClient: "Mr. B2G Advisors (Prime & Consulting)", naics: "561920", setAside: "8(a)", vertical: "Federal", industry: "Defense", source: "Internal request", stage: "review", zoho: true },
  { id: "g4", pod: 3, name: "Quarterly access review — sub-client admins", agency: "Platform Owner", rfp: "GOV-2026-110", due: 16, score: 91, value: 0, owner: "Oscar", subClient: "Unassigned", naics: "541512", setAside: "None", vertical: "Federal", industry: "IT / Cyber", source: "Policy calendar", stage: "monitoring", zoho: false },
  { id: "g5", pod: 3, name: "Document lock — Army Training volumes", agency: "Reggie (Pod 1)", rfp: "GOV-2026-113", due: 19, score: 80, value: 3350000, owner: "Oscar", subClient: "Atlas Defense Group", naics: "611430", setAside: "8(a)", vertical: "Federal", industry: "Defense", source: "Internal request", stage: "approved", zoho: false },
  { id: "g6", pod: 3, name: "Audit trail export — Aug 2026", agency: "Super Administrator", rfp: "GOV-2026-116", due: 23, score: 88, value: 0, owner: "Oscar", subClient: "Unassigned", naics: "541512", setAside: "None", vertical: "Federal", industry: "IT / Cyber", source: "Policy calendar", stage: "archived", zoho: false },
  { id: "g7", pod: 3, name: "Sub-client mapping conflict — CivicPath", agency: "Tenant Admin", rfp: "GOV-2026-119", due: 26, score: 47, value: 640000, owner: "Oscar", subClient: "CivicPath Partners", naics: "541512", setAside: "Small Business", vertical: "Local / Municipal", industry: "IT / Cyber", source: "Internal request", stage: "intake", zoho: false },
  { id: "g8", pod: 3, name: "Spend guardrail breach — Tribal Facilities", agency: "Julie (Pod 1)", rfp: "GOV-2026-122", due: 3, score: 59, value: 980000, owner: "Oscar", subClient: "TribalWorks LLC", naics: "236220", setAside: "Tribal 8(a)", vertical: "Tribal", industry: "Facilities", source: "Policy calendar", stage: "monitoring", zoho: false },
  { id: "g9", pod: 3, name: "Sponsor contract review — Civic Awards Gala", agency: "Delano (Pod 2)", rfp: "GOV-2026-125", due: 28, score: 76, value: 210000, owner: "Oscar", subClient: "Riverside Civic Co.", naics: "561920", setAside: "Small Business", vertical: "Local / Municipal", industry: "Civic Events", source: "Internal request", stage: "review", zoho: true },
  { id: "g10", pod: 3, name: "Maturity dial change — Walk to Run", agency: "Platform Owner", rfp: "GOV-2026-128", due: 30, score: 69, value: 0, owner: "Oscar", subClient: "Unassigned", naics: "541512", setAside: "None", vertical: "Federal", industry: "IT / Cyber", source: "Policy calendar", stage: "approved", zoho: false },
];

export const dealsForPod = (pod: PodId): Deal[] => DEALS.filter((d) => d.pod === pod);


/* --------------------------------------------------------------- options -- */

export const ALL = {
  setAside: "All set-asides",
  status: "All statuses",
  subClient: "All sub-clients",
  vertical: "All verticals",
  industry: "All industries",
  source: "All sources",
} as const;

const uniq = (v: string[]) => Array.from(new Set(v)).sort();

export function optionsForPod(pod: PodId) {
  const rows = dealsForPod(pod);
  return {
    setAsides: uniq(rows.map((d) => d.setAside)),
    statuses: POD_STAGES[pod].map((s) => STAGE_LABELS[s]),
    subClients: uniq(rows.map((d) => d.subClient)),
    verticals: uniq(rows.map((d) => d.vertical)),
    industries: uniq(rows.map((d) => d.industry)),
    sources: uniq(rows.map((d) => d.source)),
    agencies: uniq(rows.map((d) => d.agency)),
    naics: uniq(rows.map((d) => d.naics)),
    owners: uniq(rows.map((d) => d.owner)),
  };
}

export const DEAL_OPTIONS = optionsForPod(1);


/* ---------------------------------------------------------------- filter -- */

export type DealFilters = {
  q: string;
  agency: string;
  naics: string;
  setAside: string;
  status: string;
  subClient: string;
  vertical: string;
  industry: string;
  source: string;
  strongFit: boolean;
  zoho: boolean;
  /** Day-of-month bounds within Oct 2026 (empty string = unbounded). */
  from: string;
  to: string;
};

export const EMPTY_FILTERS: DealFilters = {
  q: "",
  agency: "",
  naics: "",
  setAside: ALL.setAside,
  status: ALL.status,
  subClient: ALL.subClient,
  vertical: ALL.vertical,
  industry: ALL.industry,
  source: ALL.source,
  strongFit: false,
  zoho: false,
  from: "",
  to: "",
};

export function countActive(f: DealFilters): number {
  return (
    [f.q, f.agency, f.naics, f.from, f.to].filter(Boolean).length +
    [
      f.setAside !== ALL.setAside,
      f.status !== ALL.status,
      f.subClient !== ALL.subClient,
      f.vertical !== ALL.vertical,
      f.industry !== ALL.industry,
      f.source !== ALL.source,
      f.strongFit,
      f.zoho,
    ].filter(Boolean).length
  );
}

function dayOf(value: string): number | null {
  if (!value) return null;
  // Accepts a full date (yyyy-mm-dd) or a plain day number.
  const asDate = /^\d{4}-\d{2}-\d{2}$/.test(value) ? Number(value.slice(8)) : Number(value);
  return Number.isFinite(asDate) ? asDate : null;
}

export function filterDeals(deals: Deal[], f: DealFilters): Deal[] {
  const q = f.q.trim().toLowerCase();
  const from = dayOf(f.from);
  const to = dayOf(f.to);

  return deals.filter((d) => {
    if (
      q &&
      ![d.name, d.agency, d.rfp, d.subClient, d.owner, d.naics]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (f.agency && !d.agency.toLowerCase().includes(f.agency.trim().toLowerCase())) return false;
    if (f.naics && !d.naics.includes(f.naics.trim())) return false;
    if (f.setAside !== ALL.setAside && d.setAside !== f.setAside) return false;
    if (f.status !== ALL.status && STAGE_LABELS[d.stage] !== f.status) return false;
    if (f.subClient !== ALL.subClient && d.subClient !== f.subClient) return false;
    if (f.vertical !== ALL.vertical && d.vertical !== f.vertical) return false;
    if (f.industry !== ALL.industry && d.industry !== f.industry) return false;
    if (f.source !== ALL.source && d.source !== f.source) return false;
    if (f.strongFit && d.score < 70) return false;
    if (f.zoho && !d.zoho) return false;
    if (from !== null && d.due < from) return false;
    if (to !== null && d.due > to) return false;
    return true;
  });
}

export const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
