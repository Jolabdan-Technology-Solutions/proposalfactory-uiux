/**
 * Pod 2 back-office screens.
 *
 * Same light layout as the Platform analytics screens, so Pod 2's governance
 * pages match Pod 3's queue structure. Static sample content only.
 */

import type { PlatformScreenData } from "@/lib/platform-analytics";

const SECTION = "Pod 2 · Events Back Office";

export const EVENT_OPS_SCREENS: Record<string, PlatformScreenData> = {
  "approval-queue": {
    section: SECTION,
    title: "Event Approval Queue",
    blurb:
      "Every event gate waiting on a person: concept sign-off, venue contracts, budget releases and go-live checks.",
    kpis: [
      { label: "Waiting on approval", value: "9", sub: "Across 4 active events" },
      { label: "Approved this week", value: "14", sub: "Eve pre-checked each one" },
      { label: "Sent back", value: "3", sub: "Missing budget or venue detail" },
      { label: "Average wait", value: "1.4 days", sub: "Target is under 2 days" },
    ],
    trend: {
      label: "Gate decisions per week",
      unit: "decisions",
      points: [
        { x: "W1", v: 8 },
        { x: "W2", v: 11 },
        { x: "W3", v: 9 },
        { x: "W4", v: 15 },
        { x: "W5", v: 12 },
        { x: "W6", v: 17 },
        { x: "W7", v: 14 },
        { x: "W8", v: 16 },
      ],
    },
    table: {
      title: "Open gates",
      columns: ["Event", "Gate", "Requested by", "Waiting"],
      rows: [
        { cells: ["City of Atlanta Summit", "Concept sign-off", "Eve", "4 hours"], status: { label: "Waiting", tone: "warn" } },
        { cells: ["Army Training Expo", "Venue contract", "Platform Owner", "1 day"], status: { label: "Waiting", tone: "warn" } },
        { cells: ["Navy Modernization Day", "Budget release", "Admin User", "2 days"], status: { label: "Overdue", tone: "risk" } },
        { cells: ["Riverside Civic Fair", "Go-live check", "BD User", "Approved"], status: { label: "Approved", tone: "ok" } },
        { cells: ["Northstar Health Forum", "Talent contracts", "Eve", "Returned"], status: { label: "Sent back", tone: "muted" } },
      ],
    },
    notes: [
      "Eve prepares the pack; a person still makes every call.",
      "Sent-back items return to the event team with a reason attached.",
      "Approved gates release the next phase of the 48-step event plan.",
    ],
  },

  "audit-trail": {
    section: SECTION,
    title: "Event Audit Trail",
    blurb: "A plain record of who did what on each event, including everything handed over from Pod 1.",
    kpis: [
      { label: "Entries this month", value: "486", sub: "All events" },
      { label: "Handovers logged", value: "7", sub: "Won proposals from Pod 1" },
      { label: "Manual overrides", value: "5", sub: "Each one has a reason" },
      { label: "Gaps found", value: "0", sub: "Nothing unexplained" },
    ],
    trend: {
      label: "Recorded actions per week",
      unit: "entries",
      points: [
        { x: "W1", v: 42 },
        { x: "W2", v: 55 },
        { x: "W3", v: 61 },
        { x: "W4", v: 48 },
        { x: "W5", v: 74 },
        { x: "W6", v: 66 },
        { x: "W7", v: 71 },
        { x: "W8", v: 69 },
      ],
    },
    table: {
      title: "Recent entries",
      columns: ["When", "Event", "Action", "Person"],
      rows: [
        { cells: ["Today 09:12", "City of Atlanta Summit", "Concept pack generated", "Eve"], status: { label: "Logged", tone: "ok" } },
        { cells: ["Today 08:40", "Army Training Expo", "Handed over from Pod 1", "System"], status: { label: "Logged", tone: "ok" } },
        { cells: ["Yesterday", "Navy Modernization Day", "Budget raised to $312k", "Platform Owner"], status: { label: "Override", tone: "warn" } },
        { cells: ["Yesterday", "Riverside Civic Fair", "Venue confirmed", "Admin User"], status: { label: "Logged", tone: "ok" } },
        { cells: ["2 days ago", "Northstar Health Forum", "Registration opened", "BD User"], status: { label: "Logged", tone: "ok" } },
      ],
    },
    notes: [
      "Every handover from Pod 1 writes an entry here automatically.",
      "Overrides are allowed but always named and dated.",
      "Pod 3 reads the same records for its governance reporting.",
    ],
  },

  budget: {
    section: SECTION,
    title: "Event Budget Guardrails",
    blurb: "Approved spend per event, what has been committed, and where a limit is close to being passed.",
    kpis: [
      { label: "Approved budget", value: "$1.86M", sub: "5 active events" },
      { label: "Committed", value: "$1.21M", sub: "65% of approved" },
      { label: "Awaiting release", value: "$240k", sub: "Blocked on approval" },
      { label: "Over guardrail", value: "1", sub: "Navy Modernization Day" },
    ],
    trend: {
      label: "Committed spend per week",
      unit: "$k",
      points: [
        { x: "W1", v: 90 },
        { x: "W2", v: 120 },
        { x: "W3", v: 145 },
        { x: "W4", v: 130 },
        { x: "W5", v: 180 },
        { x: "W6", v: 210 },
        { x: "W7", v: 175 },
        { x: "W8", v: 160 },
      ],
    },
    table: {
      title: "Budget by event",
      columns: ["Event", "Approved", "Committed", "Remaining"],
      rows: [
        { cells: ["City of Atlanta Summit", "$420k", "$268k", "$152k"], status: { label: "Healthy", tone: "ok" } },
        { cells: ["Army Training Expo", "$610k", "$395k", "$215k"], status: { label: "Healthy", tone: "ok" } },
        { cells: ["Navy Modernization Day", "$312k", "$318k", "-$6k"], status: { label: "Over", tone: "risk" } },
        { cells: ["Riverside Civic Fair", "$284k", "$150k", "$134k"], status: { label: "Healthy", tone: "ok" } },
        { cells: ["Northstar Health Forum", "$234k", "$79k", "$155k"], status: { label: "Early", tone: "muted" } },
      ],
    },
    notes: [
      "A guardrail breach blocks the next spend gate until someone approves it.",
      "Budgets carry over from the winning proposal in Pod 1.",
      "Pod 3 sees the same numbers in its budget view.",
    ],
  },

  vendors: {
    section: SECTION,
    title: "Vendors & Contracts",
    blurb: "Venues, production partners, talent and caterers with contract status and insurance checks.",
    kpis: [
      { label: "Active vendors", value: "23", sub: "Across all events" },
      { label: "Contracts signed", value: "17", sub: "6 still in review" },
      { label: "Insurance expiring", value: "2", sub: "Within 30 days" },
      { label: "New this month", value: "4", sub: "Pending onboarding" },
    ],
    trend: {
      label: "Contracts signed per week",
      unit: "contracts",
      points: [
        { x: "W1", v: 2 },
        { x: "W2", v: 3 },
        { x: "W3", v: 1 },
        { x: "W4", v: 4 },
        { x: "W5", v: 2 },
        { x: "W6", v: 5 },
        { x: "W7", v: 3 },
        { x: "W8", v: 4 },
      ],
    },
    table: {
      title: "Vendor list",
      columns: ["Vendor", "Type", "Event", "Contract"],
      rows: [
        { cells: ["Peachtree Convention Hall", "Venue", "City of Atlanta Summit", "Signed"], status: { label: "Signed", tone: "ok" } },
        { cells: ["Northline AV", "Production", "Army Training Expo", "In review"], status: { label: "In review", tone: "warn" } },
        { cells: ["Harbor Catering Co.", "Catering", "Navy Modernization Day", "Signed"], status: { label: "Signed", tone: "ok" } },
        { cells: ["Bright Stage Talent", "Talent", "Riverside Civic Fair", "Insurance expiring"], status: { label: "Action needed", tone: "risk" } },
        { cells: ["Civic Print Works", "Collateral", "Northstar Health Forum", "Onboarding"], status: { label: "New", tone: "muted" } },
      ],
    },
    notes: [
      "A vendor cannot be booked until the contract and insurance are clear.",
      "Contract approvals appear in the event approval queue.",
      "Sample vendors only — nothing is connected to a real supplier system.",
    ],
  },

  documents: {
    section: SECTION,
    title: "Event Documents",
    blurb: "Briefs, run-of-show packs, contracts and closeout reports gathered per event.",
    kpis: [
      { label: "Documents stored", value: "138", sub: "All events" },
      { label: "Awaiting review", value: "11", sub: "Mostly run-of-show packs" },
      { label: "Signed off", value: "104", sub: "Locked versions" },
      { label: "Carried from Pod 1", value: "23", sub: "Winning proposal files" },
    ],
    trend: {
      label: "Documents added per week",
      unit: "files",
      points: [
        { x: "W1", v: 9 },
        { x: "W2", v: 14 },
        { x: "W3", v: 12 },
        { x: "W4", v: 18 },
        { x: "W5", v: 21 },
        { x: "W6", v: 16 },
        { x: "W7", v: 24 },
        { x: "W8", v: 19 },
      ],
    },
    table: {
      title: "Latest documents",
      columns: ["Document", "Event", "Type", "Updated"],
      rows: [
        { cells: ["Concept deck v3", "City of Atlanta Summit", "Concept", "Today"], status: { label: "In review", tone: "warn" } },
        { cells: ["Run of show", "Army Training Expo", "Production", "Yesterday"], status: { label: "In review", tone: "warn" } },
        { cells: ["Venue contract", "Navy Modernization Day", "Contract", "2 days ago"], status: { label: "Signed off", tone: "ok" } },
        { cells: ["Winning proposal", "Riverside Civic Fair", "From Pod 1", "Last week"], status: { label: "Locked", tone: "muted" } },
        { cells: ["Closeout report", "Northstar Health Forum", "Closeout", "Last week"], status: { label: "Signed off", tone: "ok" } },
      ],
    },
    notes: [
      "Documents attached to a winning proposal travel with it into the event.",
      "A signed-off version is locked; changes create a new version.",
      "The wider document library in Pod 3 holds everything across pods.",
    ],
  },
};
