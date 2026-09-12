import { useMemo, useState } from "react";
import { Flame, Globe, Search, SlidersHorizontal, X } from "lucide-react";
import {
  ALL,
  EMPTY_FILTERS,
  POD_COPY,
  countActive,
  dealsForPod,
  filterDeals,
  money,
  optionsForPod,
  type DealFilters,
  type PodId,
} from "@/lib/deals";
import { DealTable } from "@/components/wireframe/deal-table";

/**
 * Global filter bar — the same set of filters the whole platform is filtered by.
 * Collapsed by default; opening it reveals the filters and the matching deals.
 */

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative flex items-center rounded-md border border-border bg-background/60">
      <span className="pointer-events-none absolute left-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent py-2 pl-[4.5rem] pr-6 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function GlobalFilters({ className = "", pod = 1 }: { className?: string; pod?: PodId }) {
  const [open, setOpen] = useState(false);
  const copy = POD_COPY[pod];
  const deals = useMemo(() => dealsForPod(pod), [pod]);
  const DEAL_OPTIONS = useMemo(() => optionsForPod(pod), [pod]);
  const [f, setF] = useState<DealFilters>(EMPTY_FILTERS);
  const set = <K extends keyof DealFilters>(k: K, v: DealFilters[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const active = countActive(f);
  const results = useMemo(() => filterDeals(deals, f), [deals, f]);
  const total = results.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={`rounded-xl border border-border bg-card/40 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-secondary/40"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Global filters
        </span>
        {active > 0 && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] text-accent">
            {active} active
          </span>
        )}
        <span className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
          {results.length} {copy.items} · {money(total)}
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div className="border-t border-wireline p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={f.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Search title, agency, solicitation…"
                className="w-full rounded-md border border-border bg-background/60 py-2 pl-8 pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <Select label="Set-aside" value={f.setAside} options={[ALL.setAside, ...DEAL_OPTIONS.setAsides]} onChange={(v) => set("setAside", v)} />
            <Select label="Status" value={f.status} options={[ALL.status, ...DEAL_OPTIONS.statuses]} onChange={(v) => set("status", v)} />
            <Select label="Sub-client" value={f.subClient} options={[ALL.subClient, ...DEAL_OPTIONS.subClients]} onChange={(v) => set("subClient", v)} />
            <Select label="Vertical" value={f.vertical} options={[ALL.vertical, ...DEAL_OPTIONS.verticals]} onChange={(v) => set("vertical", v)} />
            <Select label="Industry" value={f.industry} options={[ALL.industry, ...DEAL_OPTIONS.industries]} onChange={(v) => set("industry", v)} />
            <Select label="Source" value={f.source} options={[ALL.source, ...DEAL_OPTIONS.sources]} onChange={(v) => set("source", v)} />
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Agency
              </span>
              <input
                value={f.agency}
                onChange={(e) => set("agency", e.target.value)}
                placeholder="Type…"
                className="w-full rounded-md border border-border bg-background/60 py-2 pl-[4.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                NAICS
              </span>
              <input
                value={f.naics}
                onChange={(e) => set("naics", e.target.value)}
                placeholder="Type…"
                className="w-full rounded-md border border-border bg-background/60 py-2 pl-[4.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Due from
              </span>
              <input
                type="date"
                value={f.from}
                onChange={(e) => set("from", e.target.value)}
                className="w-full rounded-md border border-border bg-background/60 py-2 pl-[5.2rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Due to
              </span>
              <input
                type="date"
                value={f.to}
                onChange={(e) => set("to", e.target.value)}
                className="w-full rounded-md border border-border bg-background/60 py-2 pl-[4.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => set("strongFit", !f.strongFit)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
                f.strongFit ? "border-accent bg-accent/10 text-accent" : "border-wireline text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="h-3 w-3" /> Strong fit only
            </button>
            <button
              type="button"
              onClick={() => set("zoho", !f.zoho)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
                f.zoho ? "border-accent bg-accent/10 text-accent" : "border-wireline text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-3 w-3" /> Zoho Deals
            </button>
            {active > 0 && (
              <button
                type="button"
                onClick={() => setF(EMPTY_FILTERS)}
                className="ml-auto inline-flex items-center gap-1 rounded-md border border-wireline px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Matching deals
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {results.length} of {deals.length} · {money(total)} total value
              </span>
            </div>
            <DealTable deals={results} limit={6} pod={pod} />
          </div>
        </div>
      )}
    </div>
  );
}
