/**
 * Mr. B2G's Go/No-Go scorecard and the Sales Engine scoring funnel.
 *
 * Mirrors the reference model:
 *   - a 10-factor scorecard produces a win probability for an opportunity
 *   - the 4-band recommendation is derived from that number
 *   - every opportunity sits in one of five scoring states, each state
 *     implying the states before it
 *
 * Static wireframe content — nothing here is scored by a live system.
 */

import { DEALS, type Deal } from "@/lib/deals";

/* ------------------------------------------------------------- 4 bands -- */

export type BandId = "strong_go" | "conditional_go" | "hold_shape" | "no_go";

export type Band = {
  id: BandId;
  label: string;
  code: string;
  min: number;
  max: number;
  meaning: string;
  action: string;
  /** Semantic token class pair for chips. */
  tone: string;
};

export const BANDS: Band[] = [
  {
    id: "strong_go",
    label: "Strong Go",
    code: "STRONG_GO",
    min: 80,
    max: 100,
    meaning: "Clear fit, credible past performance and a winnable competitive picture.",
    action: "Bid on this — spawns the proposal and starts Step 19.",
    tone: "border-pod-2/50 bg-pod-2/10 text-pod-2",
  },
  {
    id: "conditional_go",
    label: "Conditional Go",
    code: "CONDITIONAL_GO",
    min: 75,
    max: 79,
    meaning: "Worth pursuing once one or two named conditions are satisfied.",
    action: "Bid on this, with the conditions recorded against the pursuit.",
    tone: "border-accent/50 bg-accent/10 text-accent",
  },
  {
    id: "hold_shape",
    label: "Hold / Shape",
    code: "HOLD_SHAPE",
    min: 60,
    max: 74,
    meaning: "Not ready. Shaping actions could move it into a Go band.",
    action: "Work the conditions for go before any bid decision.",
    tone: "border-pod-1/50 bg-pod-1/10 text-pod-1",
  },
  {
    id: "no_go",
    label: "No Go",
    code: "NO_GO",
    min: 0,
    max: 59,
    meaning: "Ineligible, uncompetitive or outside the profile.",
    action: "Record the reason and leave it out of the pursuit list.",
    tone: "border-wireline bg-secondary/40 text-muted-foreground",
  },
];

export const bandFor = (score: number): Band =>
  BANDS.find((b) => score >= b.min && score <= b.max) ?? BANDS[BANDS.length - 1]!;

/* ------------------------------------------------- the 10-factor sheet -- */

export type Factor = { n: number; name: string; weight: number; asks: string };

export const SCORECARD_FACTORS: Factor[] = [
  { n: 1, name: "Mission fit", weight: 15, asks: "Does the scope sit inside what this sub-client actually delivers?" },
  { n: 2, name: "NAICS / PSC alignment", weight: 10, asks: "Is the code one we hold real qualifications against?" },
  { n: 3, name: "Set-aside eligibility", weight: 10, asks: "Do the certifications on file qualify us to bid at all?" },
  { n: 4, name: "Past performance", weight: 12, asks: "Can we cite comparable work at comparable size?" },
  { n: 5, name: "Customer relationship", weight: 10, asks: "Do we know the buyer before the solicitation dropped?" },
  { n: 6, name: "Incumbent strength", weight: 10, asks: "How entrenched is whoever holds it today?" },
  { n: 7, name: "Competitive field", weight: 8, asks: "How many credible bidders are expected?" },
  { n: 8, name: "Price competitiveness", weight: 10, asks: "Can our cost structure win without eroding margin?" },
  { n: 9, name: "Staffing readiness", weight: 8, asks: "Can we put named, cleared people against it on day one?" },
  { n: 10, name: "Timing & capacity", weight: 7, asks: "Is there room in the calendar to produce a winning volume?" },
];

/* ------------------------------------------------ 5-state scoring flow -- */

export type ScoreState = "profiled" | "matched" | "fit_scored" | "gng_scored" | "decision_ready";

export const SCORE_STATES: { id: ScoreState; label: string; note: string }[] = [
  { id: "profiled", label: "Profiled", note: "Row exists" },
  { id: "matched", label: "Matched", note: "Sub-client candidates" },
  { id: "fit_scored", label: "Fit-Scored", note: "Strategic + ICP" },
  { id: "gng_scored", label: "GNG-Scored", note: "Win probability" },
  { id: "decision_ready", label: "Decision-Ready", note: "Bid on this →" },
];

/** Each state implies the ones before it, so this is the furthest state reached. */
export function stateOf(d: Deal): ScoreState {
  if (["proposal", "investment", "clientele", "won", "closed", "lost"].includes(d.stage))
    return "decision_ready";
  if (d.score >= 75) return "gng_scored";
  if (d.subClient !== "Unassigned") return "fit_scored";
  if (d.score > 0) return "matched";
  return "profiled";
}

const ORDER: ScoreState[] = ["profiled", "matched", "fit_scored", "gng_scored", "decision_ready"];

/** Cumulative counts — a Decision-Ready row also counts as Profiled. */
export function funnelCounts(deals: Deal[]): Record<ScoreState, number> {
  const out = { profiled: 0, matched: 0, fit_scored: 0, gng_scored: 0, decision_ready: 0 };
  for (const d of deals) {
    const reached = ORDER.indexOf(stateOf(d));
    ORDER.slice(0, reached + 1).forEach((s) => (out[s] += 1));
  }
  return out;
}

export function bandCounts(deals: Deal[]): Record<BandId, number> {
  const out: Record<BandId, number> = { strong_go: 0, conditional_go: 0, hold_shape: 0, no_go: 0 };
  for (const d of deals) out[bandFor(d.score).id] += 1;
  return out;
}

/* ------------------------------------------------------ pipeline value -- */

/** Baselines used when the scorecard has not run on an opportunity yet. */
export const VERTICAL_BASELINE: { match: (v: string) => boolean; label: string; prob: number }[] = [
  { match: (v) => v === "Federal" || v === "Tribal", label: "Federal", prob: 0.15 },
  { match: (v) => v !== "Federal" && v !== "Tribal", label: "SLED (State / Local / Edu)", prob: 0.25 },
];

/** Certifications on file decide how much of a set-aside value is addressable. */
function addressableShare(d: Deal): number {
  if (d.setAside === "None" || d.setAside === "Small Business") return 1;
  return d.subClient === "Unassigned" ? 0 : 0.85;
}

function winProbability(d: Deal): number {
  const state = stateOf(d);
  if (state === "gng_scored" || state === "decision_ready") return d.score / 100;
  return d.vertical === "Federal" || d.vertical === "Tribal" ? 0.15 : 0.25;
}

export function pipelineMath(deals: Deal[]) {
  const totalPossible = deals.reduce((s, d) => s + d.value, 0);
  const qualified = deals.reduce((s, d) => s + d.value * addressableShare(d), 0);
  const expected = deals.reduce((s, d) => s + d.value * addressableShare(d) * winProbability(d), 0);
  const scored = deals.filter((d) => ["gng_scored", "decision_ready"].includes(stateOf(d))).length;
  return {
    totalPossible,
    qualified,
    expected,
    scored,
    baseline: deals.length - scored,
    coverage: deals.length ? Math.round((scored / deals.length) * 100) : 0,
    avgProb: qualified ? expected / qualified : 0,
  };
}

/** Six tiers, each row strictly implying the next. */
export function valueCascade(deals: Deal[]) {
  const sum = (rows: Deal[]) => rows.reduce((s, d) => s + d.value, 0);
  const matched = deals.filter((d) => d.subClient !== "Unassigned");
  const qualifiedRows = deals.filter((d) => bandFor(d.score).id !== "no_go");
  const approved = deals.filter((d) =>
    ["proposal", "investment", "clientele", "won", "closed"].includes(d.stage),
  );
  const submitted = deals.filter((d) => ["won", "closed", "lost"].includes(d.stage));
  return [
    { label: "Raw discovered", rows: deals.length, value: sum(deals) },
    { label: "Addressable", rows: matched.length, value: sum(matched) },
    { label: "Matched", rows: matched.length, value: sum(matched) },
    { label: "Decision-qualified", rows: qualifiedRows.length, value: sum(qualifiedRows) },
    { label: "Approved pursuits", rows: approved.length, value: sum(approved) },
    { label: "Submitted", rows: submitted.length, value: sum(submitted) },
  ];
}

export function byVertical(deals: Deal[]) {
  const groups = new Map<string, Deal[]>();
  for (const d of deals) groups.set(d.vertical, [...(groups.get(d.vertical) ?? []), d]);
  return Array.from(groups.entries())
    .map(([vertical, rows]) => {
      const m = pipelineMath(rows);
      return { vertical, opps: rows.length, ...m };
    })
    .sort((a, b) => b.opps - a.opps);
}

export const POD1_DEALS = DEALS.filter((d) => d.pod === 1);
