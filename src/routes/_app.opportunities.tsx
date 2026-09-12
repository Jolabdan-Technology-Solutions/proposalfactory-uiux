import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Gauge,
  List,
  Search,
  UserCog,
  X,
} from "lucide-react";
import { Collapse } from "@/components/wireframe/collapse";
import { CompanionBubble } from "@/components/wireframe/primitives";
import {
  ALL,
  EMPTY_FILTERS,
  POD_COPY,
  POD_STAGES,
  STAGE_LABELS,
  countActive,
  dealsForPod,
  filterDeals,
  optionsForPod,
  type Deal,
  type DealFilters,
  type DealStage,
  type PodId,
} from "@/lib/deals";

/* ---------------------------------------------------------------- data ---- */

type Stage = DealStage;
type Opp = Deal;

const stagesFor = (pod: PodId): { id: Stage; label: string }[] =>
  POD_STAGES[pod].map((id) => ({ id, label: STAGE_LABELS[id] }));

const UPLOADS: Record<PodId, { file: string; kind: string; rows: string; by: string; when: string }[]> = {
  1: [
    { file: "sam-export-sept.csv", kind: "CSV", rows: "1,284 rows", by: "BD User", when: "3 Sep 2026" },
    { file: "gdot-forecast-q4.xlsx", kind: "Excel", rows: "312 rows", by: "Admin User", when: "1 Sep 2026" },
    { file: "N00178-25-R-0042.pdf", kind: "PDF", rows: "84 pages", by: "BD User", when: "28 Aug 2026" },
    { file: "city-atlanta-bid-list.csv", kind: "CSV", rows: "96 rows", by: "Platform Owner", when: "22 Aug 2026" },
  ],
  2: [
    { file: "gala-run-of-show-v3.xlsx", kind: "Excel", rows: "148 rows", by: "Eve", when: "4 Sep 2026" },
    { file: "summit-venue-quotes.pdf", kind: "PDF", rows: "22 pages", by: "Platform Owner", when: "2 Sep 2026" },
    { file: "sponsor-pipeline.csv", kind: "CSV", rows: "64 rows", by: "Admin User", when: "27 Aug 2026" },
    { file: "expo-registration-export.csv", kind: "CSV", rows: "1,902 rows", by: "Eve", when: "20 Aug 2026" },
  ],
  3: [
    { file: "approval-log-aug-2026.csv", kind: "CSV", rows: "512 rows", by: "Oscar", when: "1 Sep 2026" },
    { file: "budget-guardrails-policy.pdf", kind: "PDF", rows: "12 pages", by: "Oscar", when: "29 Aug 2026" },
    { file: "access-review-q3.xlsx", kind: "Excel", rows: "87 rows", by: "Super Admin", when: "24 Aug 2026" },
    { file: "audit-export-jul-2026.csv", kind: "CSV", rows: "1,340 rows", by: "Oscar", when: "3 Aug 2026" },
  ],
};

/* --------------------------------------------------------- filter panel ---- */

type Dropdown = { key: keyof DealFilters; label: string; placeholder: string; options: string[] };

const dropdownsFor = (pod: PodId): Dropdown[] => {
  const o = optionsForPod(pod);
  return [
    { key: "setAside", label: "Set-asides", placeholder: ALL.setAside, options: o.setAsides },
    { key: "status", label: "Status", placeholder: ALL.status, options: o.statuses },
    { key: "subClient", label: "Sub-client", placeholder: ALL.subClient, options: o.subClients },
    { key: "vertical", label: "Vertical", placeholder: ALL.vertical, options: o.verticals },
    { key: "industry", label: "Industry", placeholder: ALL.industry, options: o.industries },
    { key: "source", label: "Source", placeholder: ALL.source, options: o.sources },
  ];
};

/**
 * Collapsible filter panel — collapsed by default, expands on click to reveal
 * the full set of filter fields (search, dropdowns, toggles, date range).
 * Every field filters the opportunities shown in all four views.
 */
function FilterPanel({
  filters,
  onChange,
  resultCount,
  totalCount,
  pod,
}: {
  filters: DealFilters;
  onChange: (f: DealFilters) => void;
  resultCount: number;
  totalCount: number;
  pod: PodId;
}) {
  const copy = POD_COPY[pod];
  const options = optionsForPod(pod);
  const FILTER_DROPDOWNS = dropdownsFor(pod);
  const activeCount = countActive(filters);
  const set = <K extends keyof DealFilters>(k: K, v: DealFilters[K]) =>
    onChange({ ...filters, [k]: v });

  return (
    <details className="group rounded-xl border border-wireline bg-card/40">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal className="h-4 w-4 text-accent" />
        <span className="text-sm font-bold">Filters</span>
        {activeCount > 0 && (
          <span className="rounded-full border border-accent/50 bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent">
            {activeCount} active
          </span>
        )}
        <span className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {resultCount} of {totalCount} {copy.items}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {activeCount > 0 ? "Click to collapse" : "Click to expand"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <div className="border-t border-wireline px-4 py-4">
        {/* Search row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-2 min-w-[14rem]">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder={`Search ${copy.items}, ${copy.counterparty.toLowerCase()}, ${copy.ref.toLowerCase()}…`}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {filters.q && (
              <button
                type="button"
                onClick={() => set("q", "")}
                aria-label="Clear search"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown grid */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {copy.counterparty}
            </label>
            <div className="relative">
              <select
                value={filters.agency}
                onChange={(e) => set("agency", e.target.value)}
                className="w-full appearance-none rounded-md border border-border bg-background/60 px-3 py-2 pr-8 text-xs focus:outline-none focus:border-accent"
              >
                <option value="">All</option>
                {options.agencies.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              NAICS
            </label>
            <div className="relative">
              <select
                value={filters.naics}
                onChange={(e) => set("naics", e.target.value)}
                className="w-full appearance-none rounded-md border border-border bg-background/60 px-3 py-2 pr-8 text-xs focus:outline-none focus:border-accent"
              >
                <option value="">All NAICS</option>
                {options.naics.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          {FILTER_DROPDOWNS.map((d) => (
            <div key={d.label}>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {d.label}
              </label>
              <div className="relative">
                <select
                  value={filters[d.key] as string}
                  onChange={(e) => set(d.key, e.target.value as never)}
                  className="w-full appearance-none rounded-md border border-border bg-background/60 px-3 py-2 pr-8 text-xs focus:outline-none focus:border-accent"
                >
                  <option value={d.placeholder}>{d.placeholder}</option>
                  {d.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Toggles + date range row */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="accent-accent"
              checked={filters.strongFit}
              onChange={(e) => set("strongFit", e.target.checked)}
            />
            {copy.fit} 70+
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="accent-accent"
              checked={filters.zoho}
              onChange={(e) => set("zoho", e.target.checked)}
            />
            Zoho deals only
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Due between (Oct)
            </span>
            <input
              type="number"
              min={1}
              max={31}
              value={filters.from}
              onChange={(e) => set("from", e.target.value)}
              placeholder="1"
              className="w-16 rounded-md border border-border bg-background/60 px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
            />
            <span className="font-mono text-[10px] text-muted-foreground">–</span>
            <input
              type="number"
              min={1}
              max={31}
              value={filters.to}
              onChange={(e) => set("to", e.target.value)}
              placeholder="31"
              className="w-16 rounded-md border border-border bg-background/60 px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="ml-auto rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      </div>
    </details>
  );
}


/* -------------------------------------------------------------- pieces ---- */

const ROW_ACTIONS = [
  { label: "Go / No-go score", icon: Gauge },
  { label: "Run research agent", icon: Search },
  { label: "Assign / reassign", icon: UserCog },
];

function ActionIcons({ compact }: { compact?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {ROW_ACTIONS.map((a) => (
        <button
          key={a.label}
          type="button"
          title={a.label}
          aria-label={a.label}
          className="rounded-md border border-wireline p-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <a.icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </button>
      ))}
    </div>
  );
}

function BoardView({ opps, pod }: { opps: Opp[]; pod: PodId }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stagesFor(pod).map((st) => {
        const items = opps.filter((o) => o.stage === st.id);
        return (
          <div key={st.id} className="rounded-xl border border-wireline bg-card/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-bold">{st.label}</p>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {items.length}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {items.map((o) => (
                <div
                  key={o.id}
                  draggable
                  className="cursor-grab rounded-lg border border-border bg-background/60 p-3 active:cursor-grabbing"
                >
                  <p className="text-xs font-semibold leading-snug">{o.name}</p>
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{o.rfp}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-accent">Score {o.score}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">Due {o.due} Oct</span>
                  </div>
                  {o.stage === "won" && (
                    <Link
                      to="/won-proposals"
                      className="mt-2 flex items-center gap-1 rounded-md border border-pod-2/40 bg-pod-2/10 px-2 py-1 font-mono text-[10px] text-pod-2 hover:bg-pod-2/20"
                    >
                      Sent to Pod 2 · Won Proposals →
                    </Link>
                  )}
                  <div className="mt-2 border-t border-wireline pt-2">
                    <ActionIcons compact />
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-wireline py-6 text-center font-mono text-[10px] text-muted-foreground">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name === "Unassigned" ? "?" : name.slice(0, 2).toUpperCase();
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 font-mono text-[9px] text-accent">
      {initials}
    </span>
  );
}

function CalendarView({ opps }: { opps: Opp[] }) {
  // October 2026 starts on a Thursday.
  const offset = 4;
  const days = 31;
  const cells = Array.from({ length: offset + days }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50">
            Today
          </button>
          <button type="button" aria-label="Previous month" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-2 text-xs font-semibold">Oct 2026</span>
          <button type="button" aria-label="Next month" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            Month <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const items = d ? opps.filter((o) => o.due === d) : [];
            return (
              <div
                key={i}
                className="min-h-28 border-b border-r border-border p-1.5 last:border-r-0"
              >
                {d && (
                  <p className="mb-1 font-mono text-[10px] text-muted-foreground">{d}</p>
                )}
                <div className="space-y-1">
                  {items.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      title={`${o.name} · ${o.agency} · ${o.rfp} · owner ${o.owner}`}
                      className="w-full truncate rounded-md border-l-2 border-accent bg-accent/10 px-1.5 py-1 text-left text-[10px] leading-tight text-accent hover:bg-accent/20"
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PRIORITY: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function ListView({ opps, pod, totalCount }: { opps: Opp[]; pod: PodId; totalCount: number }) {
  const copy = POD_COPY[pod];
  const STAGES = stagesFor(pod);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {opps.length} of {totalCount}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <div className="min-w-[60rem]">
          <div className="grid grid-cols-[auto_1.7fr_1.1fr_1fr_0.7fr_0.7fr_0.9fr_auto] items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="w-4" />
            <span>{copy.item === "opportunity" ? "Opportunity" : copy.item === "event" ? "Event" : "Item"}</span>
            <span>{copy.counterparty}</span>
            <span>{copy.ref}</span>
            <span>Due</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {opps.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[auto_1.7fr_1.1fr_1fr_0.7fr_0.7fr_0.9fr_auto] items-center gap-2 border-b border-border px-4 py-2.5 text-xs last:border-0 hover:bg-secondary/30"
            >
              <span className="h-3.5 w-3.5 rounded-[3px] border border-wireline" />
              <span className="flex min-w-0 items-center gap-2">
                <Avatar name={o.owner} />
                <span className="truncate font-medium">{o.name}</span>
              </span>
              <span className="truncate text-muted-foreground">{o.agency}</span>
              <span className="truncate font-mono text-[10px] text-muted-foreground">{o.rfp}</span>
              <span className="font-mono text-[10px]">{o.due} Oct</span>
              <span className="text-muted-foreground">
                {PRIORITY[o.score >= 75 ? "high" : o.score >= 55 ? "medium" : "low"]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                {STAGES.find((s) => s.id === o.stage)?.label.split(" ")[0]}
                <ChevronDown className="h-3 w-3" />
              </span>
              <ActionIcons />
            </div>
          ))}
          {opps.length === 0 && (
            <div className="px-4 py-8 text-center font-mono text-[10px] text-muted-foreground">
              No {copy.items} match your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DirectoryView({ pod }: { pod: PodId }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Everything you uploaded yourself — CSV, Excel and PDF files that did not come from Discover
        or the SLED feeds. Open or download the original file at any time.
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        {UPLOADS[pod].map((u) => (
          <div key={u.file} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/30">
            {u.kind === "PDF" ? (
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{u.file}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {u.rows} · uploaded by {u.by} · {u.when}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- page ---- */

type View = "board" | "calendar" | "list" | "directory";

const VIEWS: { id: View; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
  { id: "board", label: "Board", icon: Columns3, hint: "Snapshot by stage — drag a card to move it." },
  { id: "calendar", label: "Calendar", icon: CalendarDays, hint: "Real month grid — opportunities sit on their due date." },
  { id: "list", label: "List", icon: List, hint: "Full detail: agency, RFP number, due date, score, owner." },
  { id: "directory", label: "Uploads directory", icon: FolderOpen, hint: "Your manual CSV / Excel / PDF imports, downloadable." },
];

const POD_TEXT: Record<PodId, string> = { 1: "text-pod-1", 2: "text-pod-2", 3: "text-pod-3" };

function Opportunities() {
  const { pod = 1 } = Route.useSearch();
  const copy = POD_COPY[pod];
  const opps = dealsForPod(pod);

  const [view, setView] = useState<View>("board");
  const [filters, setFilters] = useState<DealFilters>(EMPTY_FILTERS);
  const active = VIEWS.find((v) => v.id === view)!;

  const filtered = filterDeals(opps, filters);

  return (
    <div>
      <header className="mb-6">
        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${POD_TEXT[pod]}`}>
          {copy.pod}
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{copy.boardTitle}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{copy.boardBlurb}</p>
        <div className="mt-4 border-b border-wireline" />
      </header>


      {/* Collapsible filter panel — starts collapsed, expand to filter */}
      <div className="mb-4">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          totalCount={opps.length}
          pod={pod}
        />
      </div>

      {/* View tabs sit directly above the table */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors " +
              (view === v.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            <v.icon className="h-3.5 w-3.5" />
            {v.label}
          </button>
        ))}
      </div>

      {/* Table title sits directly above its own table, not inside the filters */}
      <h2 className="mt-3 mb-1 text-sm font-bold">
        {view === "board"
          ? `${copy.boardTitle} · board`
          : view === "calendar"
            ? `${copy.boardTitle} · calendar`
            : view === "list"
              ? `${copy.boardTitle} · list`
              : "Uploaded files"}
        <span className="ml-2 font-mono text-[10px] font-normal text-muted-foreground">
          {view === "directory" ? "" : `${filtered.length} of ${opps.length}`}
        </span>
      </h2>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {active.hint}
      </p>



      {view === "board" && <BoardView opps={filtered} pod={pod} />}
      {view === "calendar" && <CalendarView opps={filtered} />}
      {view === "list" && <ListView opps={filtered} pod={pod} totalCount={opps.length} />}
      {view === "directory" && <DirectoryView pod={pod} />}

      <div className="mt-8 space-y-4">
        <CompanionBubble pod={pod}>
          {"\u201C"}Same {copy.items}, different lens. The board is for the shape of the work, the
          calendar for what is due next, the list for the detail, the directory for what you
          uploaded.{"\u201D"}
        </CompanionBubble>
        <Collapse title="Why four views and not one" summary="What each one answers">
          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Board</strong> — how many {copy.items} sit in each
              stage. Drag a card to move it; each card keeps its own actions.
            </li>
            <li>
              <strong className="text-foreground">Calendar</strong> — a real month grid so due dates
              lead. Nothing is hidden behind a list.
            </li>
            <li>
              <strong className="text-foreground">List</strong> — the detail view: {copy.counterparty.toLowerCase()},{" "}
              {copy.ref.toLowerCase()}, due date, priority and owner side by side.
            </li>
            <li>
              <strong className="text-foreground">Uploads directory</strong> — only what a person
              imported by hand, so those files can be found and downloaded again.
            </li>
          </ul>
        </Collapse>
        <div className="flex flex-wrap gap-3">
          <Link to="/pipeline" search={{ pod }} className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
            Open the {copy.pipelineTitle.toLowerCase()} →
          </Link>
          <Link to={copy.hub} className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
            {"\u2190"} Back to {copy.pod.split(" · ")[0]}
          </Link>
        </div>
      </div>
    </div>
  );
}

function podFromSearch(raw: unknown): PodId {
  const n = Number(raw);
  return n === 2 ? 2 : n === 3 ? 3 : 1;
}

export const Route = createFileRoute("/_app/opportunities")({
  validateSearch: (search: Record<string, unknown>): { pod?: PodId } => ({
    pod: podFromSearch(search["pod"]),
  }),
  head: () => ({
    meta: [
      { title: "Opportunities, Events & Governance Queue — The Proposal Factory™" },
      { name: "description", content: "Board, calendar, list and uploads directory views for each pod — proposal opportunities, events and governance items — with actions on every item." },
      { property: "og:title", content: "Opportunities, Events & Governance Queue — The Proposal Factory™" },
      { property: "og:description", content: "Board, calendar, list and uploads directory views for each pod." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Opportunities,

});
