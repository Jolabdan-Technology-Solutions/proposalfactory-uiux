/**
 * Static sample data for the Platform screens (AI Operations, Agent Evaluation,
 * Safety, Red-Team, AI Governance, Analytics).
 *
 * Every Platform screen uses the SAME light layout: four headline numbers,
 * one 8-point trend, one table, one short note list. No live systems.
 */

export type Kpi = { label: string; value: string; sub: string };
export type Tone = "ok" | "warn" | "risk" | "muted";
export type Row = { cells: string[]; status?: { label: string; tone: Tone } };

export type PlatformScreenData = {
  section: string;
  title: string;
  blurb: string;
  kpis: Kpi[];
  trend: { label: string; unit: string; points: { x: string; v: number }[] };
  table: { title: string; columns: string[]; rows: Row[] };
  notes: string[];
};

const weeks = (vals: number[]) =>
  vals.map((v, i) => ({ x: `W${i + 1}`, v }));

export const PLATFORM_SCREENS: Record<string, PlatformScreenData> = {
  "ai-operations": {
    section: "Platform",
    title: "AI Operations",
    blurb: "What every agent is doing right now, across the three pods.",
    kpis: [
      { label: "Runs today", value: "184", sub: "Pod 1 · 121 · Pod 2 · 38 · Pod 3 · 25" },
      { label: "In queue", value: "7", sub: "Longest wait 2m 10s" },
      { label: "Success rate", value: "96%", sub: "7 retries in the last 24h" },
      { label: "Avg run time", value: "42s", sub: "Down from 51s last week" },
    ],
    trend: { label: "Agent runs per week", unit: "runs", points: weeks([96, 118, 132, 127, 149, 161, 172, 184]) },
    table: {
      title: "Live agent runs",
      columns: ["Agent", "Pod", "Task", "Started", "Duration"],
      rows: [
        { cells: ["Research Agent", "Pod 1", "Opportunity scan · DHS 24-118", "2m ago", "38s"], status: { label: "Running", tone: "ok" } },
        { cells: ["Compliance Agent", "Pod 1", "Section L/M matrix", "6m ago", "1m 04s"], status: { label: "Running", tone: "ok" } },
        { cells: ["Pricing Agent", "Pod 1", "Cost narrative draft", "12m ago", "52s"], status: { label: "Done", tone: "muted" } },
        { cells: ["Venue Agent", "Pod 2", "Venue shortlist · Atlanta", "18m ago", "1m 21s"], status: { label: "Done", tone: "muted" } },
        { cells: ["Budget Agent", "Pod 3", "Guardrail check · Q3", "26m ago", "12s"], status: { label: "Retried", tone: "warn" } },
        { cells: ["Audit Agent", "Pod 3", "Trail reconciliation", "41m ago", "2m 06s"], status: { label: "Done", tone: "muted" } },
      ],
    },
    notes: [
      "A run only starts after its human gate is cleared.",
      "Retries are automatic up to three attempts, then a person is paged.",
    ],
  },

  "agent-evaluation": {
    section: "Platform",
    title: "Agent Evaluation",
    blurb: "How good each agent actually is: accuracy, human edits and time saved.",
    kpis: [
      { label: "Agents scored", value: "9", sub: "Across all three pods" },
      { label: "Avg accuracy", value: "91%", sub: "Against reviewed samples" },
      { label: "Human-edit rate", value: "18%", sub: "Lower is better" },
      { label: "Time saved", value: "132h", sub: "Last 30 days" },
    ],
    trend: { label: "Average accuracy per week", unit: "%", points: weeks([83, 85, 86, 88, 88, 90, 90, 91]) },
    table: {
      title: "Agent scorecards",
      columns: ["Agent", "Pod", "Accuracy", "Human edits", "Time saved"],
      rows: [
        { cells: ["Research Agent", "Pod 1", "94%", "11%", "38h"], status: { label: "Strong", tone: "ok" } },
        { cells: ["Compliance Agent", "Pod 1", "96%", "8%", "27h"], status: { label: "Strong", tone: "ok" } },
        { cells: ["Writing Agent", "Pod 1", "87%", "29%", "31h"], status: { label: "Watch", tone: "warn" } },
        { cells: ["Pricing Agent", "Pod 1", "90%", "19%", "14h"], status: { label: "Steady", tone: "muted" } },
        { cells: ["Venue Agent", "Pod 2", "92%", "15%", "12h"], status: { label: "Steady", tone: "muted" } },
        { cells: ["Budget Agent", "Pod 3", "89%", "21%", "10h"], status: { label: "Watch", tone: "warn" } },
      ],
    },
    notes: [
      "Scores come from reviewed samples, not self-reporting.",
      "Anything under 85% accuracy stays behind a human gate.",
    ],
  },

  "safety-dashboard": {
    section: "Platform",
    title: "Safety Dashboard",
    blurb: "Guardrail hits, blocked outputs and anything escalated to a person.",
    kpis: [
      { label: "Guardrail hits", value: "23", sub: "Last 30 days" },
      { label: "Blocked outputs", value: "6", sub: "Never reached a client" },
      { label: "Escalated", value: "4", sub: "All resolved" },
      { label: "Open issues", value: "1", sub: "Owner: Super Admin" },
    ],
    trend: { label: "Guardrail hits per week", unit: "hits", points: weeks([9, 7, 6, 5, 4, 4, 3, 2]) },
    table: {
      title: "Recent guardrail events",
      columns: ["Event", "Pod", "Rule", "When", "Owner"],
      rows: [
        { cells: ["Blocked draft with unverified past performance", "Pod 1", "Claim evidence", "Today", "Proposal Manager"], status: { label: "Blocked", tone: "risk" } },
        { cells: ["Price below floor flagged", "Pod 1", "Pricing floor", "Yesterday", "Tenant Admin"], status: { label: "Escalated", tone: "warn" } },
        { cells: ["PII detected in uploaded file", "Pod 3", "Data handling", "2 days ago", "Super Admin"], status: { label: "Resolved", tone: "ok" } },
        { cells: ["Vendor contract clause mismatch", "Pod 2", "Contract terms", "4 days ago", "Tenant Admin"], status: { label: "Resolved", tone: "ok" } },
        { cells: ["Tone check on client comms", "Pod 2", "Brand voice", "5 days ago", "Reviewer"], status: { label: "Resolved", tone: "ok" } },
      ],
    },
    notes: [
      "Blocked means the output was stopped before anyone outside saw it.",
      "Every escalation names one owner and one due date.",
    ],
  },

  "red-team-queue": {
    section: "Platform",
    title: "Red-Team Queue",
    blurb: "Deliberately hard test cases lined up against the agents.",
    kpis: [
      { label: "Cases queued", value: "14", sub: "5 high severity" },
      { label: "Run this month", value: "38", sub: "31 passed" },
      { label: "Pass rate", value: "82%", sub: "Target 90%" },
      { label: "Fixes shipped", value: "5", sub: "Last 30 days" },
    ],
    trend: { label: "Pass rate per week", unit: "%", points: weeks([61, 66, 70, 71, 75, 78, 80, 82]) },
    table: {
      title: "Queued test cases",
      columns: ["Case", "Target agent", "Severity", "Added", "Owner"],
      rows: [
        { cells: ["Fabricated past performance prompt", "Writing Agent", "High", "Today", "Super Admin"], status: { label: "Queued", tone: "warn" } },
        { cells: ["Conflicting Section L instructions", "Compliance Agent", "High", "Yesterday", "Super Admin"], status: { label: "Queued", tone: "warn" } },
        { cells: ["Budget override attempt", "Budget Agent", "Medium", "2 days ago", "Tenant Admin"], status: { label: "Running", tone: "ok" } },
        { cells: ["Venue quote injection", "Venue Agent", "Medium", "3 days ago", "Tenant Admin"], status: { label: "Passed", tone: "ok" } },
        { cells: ["Cross-tenant data request", "Research Agent", "High", "6 days ago", "Super Admin"], status: { label: "Failed", tone: "risk" } },
      ],
    },
    notes: [
      "A failed case blocks the agent's next maturity stage.",
      "High severity cases are re-run after every model change.",
    ],
  },

  "ai-governance": {
    section: "Platform",
    title: "AI Governance",
    blurb: "The policies, model choices and the approval record behind each one.",
    kpis: [
      { label: "Active policies", value: "12", sub: "All reviewed this quarter" },
      { label: "Models in use", value: "4", sub: "2 pending review" },
      { label: "Approvals logged", value: "48", sub: "Last 90 days" },
      { label: "Next review", value: "Oct 1", sub: "Quarterly cycle" },
    ],
    trend: { label: "Policy approvals per week", unit: "approvals", points: weeks([3, 5, 4, 6, 5, 7, 6, 8]) },
    table: {
      title: "Policies and model decisions",
      columns: ["Policy / model", "Applies to", "Owner", "Last review", "Next review"],
      rows: [
        { cells: ["Human gate required before submission", "Pod 1", "Platform Owner", "Aug 12", "Nov 12"], status: { label: "Approved", tone: "ok" } },
        { cells: ["No client data in training", "All pods", "Super Admin", "Aug 20", "Nov 20"], status: { label: "Approved", tone: "ok" } },
        { cells: ["Model swap · drafting", "Pod 1", "Super Admin", "Sep 2", "Dec 2"], status: { label: "In review", tone: "warn" } },
        { cells: ["Vendor data retention · 90 days", "Pod 2", "Tenant Admin", "Jul 30", "Oct 30"], status: { label: "Approved", tone: "ok" } },
        { cells: ["Audit trail retention · 7 years", "Pod 3", "Platform Owner", "Aug 5", "Nov 5"], status: { label: "Approved", tone: "ok" } },
      ],
    },
    notes: [
      "Every policy has one named owner and a review date.",
      "Model changes go through the approval queue like any other gate.",
    ],
  },

  analytics: {
    section: "Platform",
    title: "Analytics",
    blurb: "One place for platform and pod reporting: pipeline, events, governance and usage.",
    kpis: [
      { label: "Pipeline value", value: "$48.2M", sub: "62 open opportunities" },
      { label: "Win rate", value: "34%", sub: "Last 12 months" },
      { label: "Events delivered", value: "18", sub: "6 from won proposals" },
      { label: "Active users", value: "127", sub: "Across 9 tenants" },
    ],
    trend: { label: "Submissions per week", unit: "submissions", points: weeks([4, 6, 5, 8, 7, 9, 11, 12]) },
    table: {
      title: "Activity by pod and tenant",
      columns: ["Tenant", "Pod 1 · proposals", "Pod 2 · events", "Pod 3 · approvals", "Users"],
      rows: [
        { cells: ["MTM Group", "22", "7", "34", "41"], status: { label: "Active", tone: "ok" } },
        { cells: ["Northline Partners", "14", "3", "19", "26"], status: { label: "Active", tone: "ok" } },
        { cells: ["Beacon Civic", "9", "4", "12", "18"], status: { label: "Active", tone: "ok" } },
        { cells: ["Harbor Logistics", "7", "1", "8", "14"], status: { label: "Steady", tone: "muted" } },
        { cells: ["Cardinal Health Svcs", "5", "2", "6", "11"], status: { label: "Steady", tone: "muted" } },
        { cells: ["Trailhead Studio", "3", "1", "4", "7"], status: { label: "New", tone: "warn" } },
      ],
    },
    notes: [
      "This is the single analytics view — platform usage and pod reporting together.",
      "Numbers follow the filters set on the pod dashboards.",
    ],
  },
};
