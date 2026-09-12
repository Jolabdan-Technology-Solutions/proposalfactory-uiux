import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpDown, Flame, Globe, Search, X } from "lucide-react";
import {
  ALL,
  EMPTY_FILTERS,
  POD_COPY,
  POD_STAGES,
  countActive,
  dealsForPod,
  filterDeals,
  money,
  optionsForPod,
  STAGE_LABELS,
  type Deal,
  type DealFilters,
  type PodId,
} from "@/lib/deals";
import { DealTable } from "@/components/wireframe/deal-table";
import { CompanionBubble } from "@/components/wireframe/primitives";
import { SystemRecordsStrip } from "@/components/wireframe/system-records";

function podFromSearch(raw: unknown): PodId {
  const n = Number(raw);
  return n === 2 ? 2 : n === 3 ? 3 : 1;
}

export const Route = createFileRoute("/_app/pipeline")({
  validateSearch: (search: Record<string, unknown>): { pod?: PodId } => ({
    pod: podFromSearch(search["pod"]),
  }),
  head: () => ({
    meta: [
      { title: "Pipeline / Discovery — The Proposal Factory™ Wireframe" },
      { name: "description", content: "The live pipeline for each pod — proposals, events and governance items — filtered by agency, set-aside, sub-client, vertical and fit." },
      { property: "og:title", content: "Pipeline / Discovery — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "The live pipeline for each pod — proposals, events and governance items — filtered by agency, set-aside, sub-client, vertical and fit." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PipelinePage,
});


type SortKey = "due" | "score" | "value" | "name";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "due", label: "Due date" },
  { id: "score", label: "Fit score" },
  { id: "value", label: "Value" },
  { id: "name", label: "A → Z" },
];

function sortDeals(deals: Deal[], key: SortKey): Deal[] {
  const copy = [...deals];
  copy.sort((a, b) =>
    key === "name"
      ? a.name.localeCompare(b.name)
      : key === "due"
        ? a.due - b.due
        : key === "score"
          ? b.score - a.score
          : b.value - a.value,
  );
  return copy;
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 font-mono text-[10px] transition-colors " +
        (active
          ? "border-accent bg-accent/15 text-accent"
          : "border-wireline text-muted-foreground hover:border-accent/60 hover:text-foreground")
      }
    >
      {label}
    </button>
  );
}

const POD_TEXT: Record<PodId, string> = { 1: "text-pod-1", 2: "text-pod-2", 3: "text-pod-3" };

function PipelinePage() {
  const { pod = 1 } = Route.useSearch();
  const copy = POD_COPY[pod];
  const deals = useMemo(() => dealsForPod(pod), [pod]);
  const options = useMemo(() => optionsForPod(pod), [pod]);

  const [f, setF] = useState<DealFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("due");
  const set = <K extends keyof DealFilters>(k: K, v: DealFilters[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const results = useMemo(() => sortDeals(filterDeals(deals, f), sort), [deals, f, sort]);
  const active = countActive(f);
  const total = results.reduce((s, d) => s + d.value, 0);
  const qualified = results.filter((d) => d.score >= 70);
  const expected = qualified.reduce((s, d) => s + d.value * (d.score / 100), 0);

  const byStage = POD_STAGES[pod].map((s) => ({
    stage: s,
    label: STAGE_LABELS[s],
    items: results.filter((d) => d.stage === s),
  }));

  return (
    <div>
      <header className="mb-6">
        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${POD_TEXT[pod]}`}>
          {copy.pod}
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{copy.pipelineTitle}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {copy.pipelineBlurb} Sample data — no live systems are connected yet.
        </p>
        <div className="mt-4 border-b border-wireline" />
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={`${copy.items} shown`} value={String(results.length)} hint={`of ${deals.length} in ${copy.pipelineTitle.toLowerCase()}`} />
        <Stat label="Total value" value={money(total)} hint={`Sum of shown ${copy.items}`} />
        <Stat label={`${copy.fit} ≥ 70`} value={String(qualified.length)} hint={money(qualified.reduce((s, d) => s + d.value, 0))} />

        <Stat label="Expected wins" value={money(expected)} hint="Value weighted by fit score" />
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-xl border border-border bg-card/40 p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search title, agency, solicitation, sub-client…"
              className="w-full rounded-md border border-border bg-background/60 py-2 pl-8 pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <select
            value={f.setAside}
            onChange={(e) => set("setAside", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.setAside, ...options.setAsides].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={f.status}
            onChange={(e) => set("status", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.status, ...options.statuses].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={f.subClient}
            onChange={(e) => set("subClient", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.subClient, ...options.subClients].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={f.vertical}
            onChange={(e) => set("vertical", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.vertical, ...options.verticals].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={f.industry}
            onChange={(e) => set("industry", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.industry, ...options.industries].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={f.source}
            onChange={(e) => set("source", e.target.value)}
            className="cursor-pointer rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[ALL.source, ...options.sources].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip label="Strong fit only" active={f.strongFit} onClick={() => set("strongFit", !f.strongFit)} />
          <Chip label="Zoho Deals" active={f.zoho} onClick={() => set("zoho", !f.zoho)} />
          <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <ArrowUpDown className="h-3 w-3" /> Sort
          </span>
          {SORTS.map((s) => (
            <Chip key={s.id} label={s.label} active={sort === s.id} onClick={() => setSort(s.id)} />
          ))}
          {active > 0 && (
            <button
              type="button"
              onClick={() => setF(EMPTY_FILTERS)}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-wireline px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent"
            >
              <X className="h-3 w-3" /> Clear {active}
            </button>
          )}
        </div>
      </div>

      {/* Stage cascade */}
      <div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {byStage.map((s) => (
          <button
            key={s.stage}
            type="button"
            onClick={() => set("status", f.status === s.label ? ALL.status : s.label)}
            className={
              "rounded-xl border p-3 text-left transition-colors " +
              (f.status === s.label
                ? "border-accent bg-accent/10"
                : "border-wireline hover:border-accent/60")
            }
          >
            <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-lg font-bold">{s.items.length}</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {money(s.items.reduce((t, d) => t + d.value, 0))}
            </p>
          </button>
        ))}
      </div>

      <DealTable deals={results} pod={pod} />

      <div className="mt-6">
        <SystemRecordsStrip deals={results} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          to="/opportunities"
          search={{ pod }}
          className="rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90"
        >
          Open board, calendar & list views →
        </Link>
        <Link
          to={pod === 1 ? "/bid-decision" : pod === 2 ? "/event-intake" : "/approvals"}
          className="inline-flex items-center gap-1.5 rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:border-accent hover:text-accent"
        >
          <Flame className="h-3 w-3" />
          {pod === 1
            ? "Take a deal to go / no-go"
            : pod === 2
              ? "Open an event brief"
              : "Open the approval queue"}
        </Link>
        <Link
          to={copy.hub}
          className="inline-flex items-center gap-1.5 rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:border-accent hover:text-accent"
        >
          ← Back to {copy.pod.split(" · ")[0]}
        </Link>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Globe className="h-3 w-3" /> Sample data · no live feeds connected
        </span>
      </div>

      <div className="mt-8">
        <CompanionBubble pod={pod}>
          {"\u201C"}
          {pod === 1
            ? "Filter to what you can actually win — set-aside you hold, agency you know, fit score above 70 — then walk those into go / no-go."
            : pod === 2
              ? "Filter to what is live this month first. Anything under 70 readiness needs a plan before it hits the floor."
              : "Sort by due date. Anything sitting in review past its date is the queue you clear first."}
          {"\u201D"}
        </CompanionBubble>
      </div>

    </div>
  );
}
