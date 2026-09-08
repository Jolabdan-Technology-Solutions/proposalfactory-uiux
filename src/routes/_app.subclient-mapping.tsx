import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownUp,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Download,
  Flame,
  Globe,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Collapse } from "@/components/wireframe/collapse";
import { CompanionBubble } from "@/components/wireframe/primitives";

/* ---------------------------------------------------------------- data ---- */

type Vertical = "FEDERAL" | "STATE" | "LOCAL" | "TRIBAL" | "EDUCATION" | "HEALTH";

const VERTICALS: { id: Vertical; code: string; label: string }[] = [
  { id: "FEDERAL", code: "FED", label: "Federal" },
  { id: "STATE", code: "ST", label: "State" },
  { id: "LOCAL", code: "LOC", label: "Local / Municipal" },
  { id: "TRIBAL", code: "TRB", label: "Tribal" },
  { id: "EDUCATION", code: "EDU", label: "Education (SLED)" },
  { id: "HEALTH", code: "HLT", label: "Health & Human Svcs" },
];

const SET_ASIDES = [
  "None",
  "8(a)",
  "SDVOSB",
  "WOSB / EDWOSB",
  "HUBZone",
  "Small Business",
  "Tribal 8(a)",
];

const STATUSES = ["Mapped · scored", "Manual · unscored", "Pinned", "Unmatched", "Conflict"];

const SUB_CLIENTS = [
  "Mr. B2G Advisors (Prime & Consulting)",
  "Atlas Defense Group",
  "CivicPath Partners",
  "GreenLine Energy",
  "Northstar Health Solutions",
  "Riverside Civic Co.",
  "TribalWorks LLC",
  "Unassigned",
];

const INDUSTRIES = ["Defense", "Facilities", "IT / Cyber", "Health", "Civic Events", "Energy"];
const SOURCES = ["SAM.gov", "SLED feed", "Agency forecast", "Manual CSV", "Manual PDF", "Discovery"];

type Row = {
  id: string;
  name: string;
  code: string;
  agency: string;
  vertical: Vertical;
  due: string; // ISO-ish, sortable
  fit: number; // 0–100
  icp: number; // 0–100
  gng: "Go" | "No-Go" | "—";
  subClient: string;
  status: (typeof STATUSES)[number];
  setAside: (typeof SET_ASIDES)[number];
  industry: string;
  source: string;
  priority: "P1" | "P2" | "P3" | "—";
};

const ROWS: Row[] = [
  { id: "m1", name: "61–Distribution Box", code: "SPE7M126T328Y", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-17", fit: 0, icp: 0, gng: "—", subClient: "Mr. B2G Advisors (Prime & Consulting)", status: "Manual · unscored", setAside: "8(a)", industry: "Defense", source: "SAM.gov", priority: "P1" },
  { id: "m2", name: "Palletized Load Trainer", code: "SPE4A726T719J", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-14", fit: 0, icp: 0, gng: "—", subClient: "Atlas Defense Group", status: "Manual · unscored", setAside: "HUBZone", industry: "Defense", source: "SAM.gov", priority: "P2" },
  { id: "m3", name: "Airfield Lighting Retrofit", code: "SPE4A726T718Y", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-21", fit: 0, icp: 0, gng: "—", subClient: "Atlas Defense Group", status: "Manual · unscored", setAside: "Small Business", industry: "Facilities", source: "SAM.gov", priority: "P2" },
  { id: "m4", name: "Maintenance Repair Parts", code: "SPE7MC26T251J", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-12", fit: 0, icp: 0, gng: "—", subClient: "Mr. B2G Advisors (Prime & Consulting)", status: "Manual · unscored", setAside: "8(a)", industry: "Defense", source: "SAM.gov", priority: "P1" },
  { id: "m5", name: "Engine Overhaul Kit", code: "SPE8E626T4537", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-28", fit: 0, icp: 0, gng: "—", subClient: "Atlas Defense Group", status: "Manual · unscored", setAside: "SDVOSB", industry: "Defense", source: "SAM.gov", priority: "P3" },
  { id: "m6", name: "Motor Pool Spares", code: "SPE7M426T383W", agency: "DLA / Dept. of Defense", vertical: "FEDERAL", due: "2026-09-19", fit: 0, icp: 0, gng: "—", subClient: "Atlas Defense Group", status: "Manual · unscored", setAside: "8(a)", industry: "Defense", source: "SAM.gov", priority: "P2" },
  { id: "m7", name: "Office Supplies Bulk Buy", code: "SPE4A62U4067", agency: "GSA", vertical: "FEDERAL", due: "2026-09-30", fit: 0, icp: 0, gng: "—", subClient: "Unassigned", status: "Unmatched", setAside: "None", industry: "Facilities", source: "Agency forecast", priority: "—" },
  { id: "m8", name: "Navy IT Modernization", code: "N00178-25-R-0042", agency: "Dept. of the Navy", vertical: "FEDERAL", due: "2026-10-06", fit: 84, icp: 88, gng: "Go", subClient: "Northstar Health Solutions", status: "Mapped · scored", setAside: "8(a)", industry: "IT / Cyber", source: "Discovery", priority: "P1" },
  { id: "m9", name: "DHS Campus Security", code: "70RTAC-25-R-0011", agency: "Homeland Security", vertical: "FEDERAL", due: "2026-10-09", fit: 71, icp: 64, gng: "Go", subClient: "Atlas Defense Group", status: "Mapped · scored", setAside: "SDVOSB", industry: "IT / Cyber", source: "SAM.gov", priority: "P2" },
  { id: "m10", name: "GSA Facilities Support", code: "47QRAA-25-R-0088", agency: "GSA", vertical: "FEDERAL", due: "2026-10-14", fit: 58, icp: 49, gng: "No-Go", subClient: "CivicPath Partners", status: "Pinned", setAside: "Small Business", industry: "Facilities", source: "Discovery", priority: "P3" },
  { id: "m11", name: "State DOT Signage", code: "SLED-2025-114", agency: "State of Georgia DOT", vertical: "STATE", due: "2026-10-14", fit: 39, icp: 41, gng: "No-Go", subClient: "CivicPath Partners", status: "Conflict", setAside: "None", industry: "Civic Events", source: "SLED feed", priority: "—" },
  { id: "m12", name: "VA Clinic Staffing", code: "36C24825R0037", agency: "Veterans Affairs", vertical: "FEDERAL", due: "2026-10-20", fit: 77, icp: 80, gng: "Go", subClient: "Northstar Health Solutions", status: "Mapped · scored", setAside: "WOSB / EDWOSB", industry: "Health", source: "Manual PDF", priority: "P1" },
  { id: "m13", name: "City of Atlanta Events", code: "COA-2026-EV-07", agency: "City of Atlanta", vertical: "LOCAL", due: "2026-10-23", fit: 66, icp: 60, gng: "Go", subClient: "Riverside Civic Co.", status: "Mapped · scored", setAside: "None", industry: "Civic Events", source: "Manual CSV", priority: "P2" },
  { id: "m14", name: "Army Training Support", code: "W9124-26-R-0003", agency: "Dept. of the Army", vertical: "FEDERAL", due: "2026-10-28", fit: 81, icp: 76, gng: "Go", subClient: "Atlas Defense Group", status: "Mapped · scored", setAside: "8(a)", industry: "Defense", source: "Discovery", priority: "P1" },
  { id: "m15", name: "Tribal Utility Modernization", code: "TRB-2026-019", agency: "Mescalero Apache Nation", vertical: "TRIBAL", due: "2026-11-04", fit: 72, icp: 69, gng: "Go", subClient: "TribalWorks LLC", status: "Mapped · scored", setAside: "Tribal 8(a)", industry: "Energy", source: "SLED feed", priority: "P2" },
  { id: "m16", name: "Statewide School Wi-Fi", code: "GA-DOE-2026-44", agency: "Georgia Dept. of Education", vertical: "EDUCATION", due: "2026-11-11", fit: 0, icp: 0, gng: "—", subClient: "Unassigned", status: "Unmatched", setAside: "None", industry: "IT / Cyber", source: "SLED feed", priority: "—" },
];

/* -------------------------------------------------------------- filters ---- */

type SortKey = "name" | "code" | "agency" | "vertical" | "due" | "fit" | "subClient" | "priority";

const COLUMNS: { key: SortKey; label: string; className: string }[] = [
  { key: "name", label: "Pipeline opportunity", className: "min-w-[220px] flex-[2]" },
  { key: "agency", label: "Agency / vertical", className: "min-w-[180px] flex-1" },
  { key: "due", label: "Due", className: "w-28 shrink-0" },
  { key: "fit", label: "Fit / ICP / GNG", className: "w-32 shrink-0" },
  { key: "subClient", label: "Mapped sub-client", className: "min-w-[220px] flex-[1.5]" },
  { key: "priority", label: "Pri", className: "w-12 shrink-0" },
];

function prioTone(p: Row["priority"]) {
  switch (p) {
    case "P1": return "border-accent/60 bg-accent/15 text-accent";
    case "P2": return "border-border bg-secondary text-secondary-foreground";
    case "P3": return "border-dashed border-wireline text-muted-foreground";
    default: return "border-dashed border-wireline text-muted-foreground";
  }
}

function fitDot(v: number) {
  if (v >= 70) return "bg-accent";
  if (v >= 40) return "bg-amber-500";
  if (v > 0) return "bg-destructive/70";
  return "bg-secondary";
}

function Select({
  label,
  value,
  options,
  onChange,
  gold,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  gold?: boolean;
}) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          "w-full appearance-none rounded-md border bg-background/60 py-2 pl-[5.5rem] pr-7 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent " +
          (gold ? "border-accent text-accent" : "border-border")
        }
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

function VerticalSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // typeahead-ish: a text input that filters a dropdown of code · label.
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(value === "All verticals" ? "" : value);
  const opts = VERTICALS.filter(
    (v) =>
      v.label.toLowerCase().includes(typed.toLowerCase()) ||
      v.code.toLowerCase().includes(typed.toLowerCase()),
  );
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        Vertical
      </span>
      <input
        value={typed}
        onChange={(e) => {
          setTyped(e.target.value);
          setOpen(true);
          const match = VERTICALS.find(
            (v) => v.label.toLowerCase() === e.target.value.toLowerCase(),
          );
          onChange(match ? match.label : typed ? "All verticals" : "All verticals");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type code…"
        className="w-full rounded-md border border-accent bg-background/60 py-2 pl-[4.5rem] pr-7 font-mono text-[11px] text-accent placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setTyped("");
              onChange("All verticals");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-secondary/50"
          >
            <span>All verticals</span>
            <span className="font-mono text-[9px] text-muted-foreground">ALL</span>
          </button>
          {opts.map((v) => (
            <button
              key={v.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setTyped(v.label);
                onChange(v.label);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-secondary/50"
            >
              <span>{v.label}</span>
              <span className="font-mono text-[9px] text-muted-foreground">{v.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={() => {}}
        placeholder="—"
        className="w-full rounded-md border border-border bg-background/60 py-2 pl-[4.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

/* --------------------------------------------------------------- page ---- */

function SubClientMapping() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [q, setQ] = useState("");
  const [agency, setAgency] = useState("");
  const [naics, setNaics] = useState("");
  const [setAside, setSetAside] = useState("All set-asides");
  const [status, setStatus] = useState("All statuses");
  const [subClient, setSubClient] = useState("All sub-clients");
  const [vertical, setVertical] = useState("All verticals");
  const [industry, setIndustry] = useState("All industries");
  const [source, setSource] = useState("All sources");
  const [strongFit, setStrongFit] = useState(false);
  const [zoho, setZoho] = useState(false);

  const filtered = useMemo(() => {
    const vId = VERTICALS.find((v) => v.label === vertical)?.id;
    return ROWS.filter((r) => {
      if (q && !`${r.name} ${r.agency} ${r.code}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (agency && !r.agency.toLowerCase().includes(agency.toLowerCase())) return false;
      if (naics && !r.code.toLowerCase().includes(naics.toLowerCase())) return false;
      if (setAside !== "All set-asides" && r.setAside !== setAside) return false;
      if (status !== "All statuses" && r.status !== status) return false;
      if (subClient !== "All sub-clients" && r.subClient !== subClient) return false;
      if (vertical !== "All verticals" && r.vertical !== vId) return false;
      if (industry !== "All industries" && r.industry !== industry) return false;
      if (source !== "All sources" && r.source !== source) return false;
      if (strongFit && r.fit < 70) return false;
      if (zoho && r.source !== "Discovery") return false;
      return true;
    });
  }, [q, agency, naics, setAside, status, subClient, vertical, industry, source, strongFit, zoho]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "fit" || key === "due" ? "desc" : "asc");
    }
  }

  const hasFilters =
    q || agency || naics || setAside !== "All set-asides" || status !== "All statuses" ||
    subClient !== "All sub-clients" || vertical !== "All verticals" || industry !== "All industries" ||
    source !== "All sources" || strongFit || zoho;

  function clearFilters() {
    setQ(""); setAgency(""); setNaics("");
    setSetAside("All set-asides"); setStatus("All statuses"); setSubClient("All sub-clients");
    setVertical("All verticals"); setIndustry("All industries"); setSource("All sources");
    setStrongFit(false); setZoho(false);
  }

  return (
    <div>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-pod-3">Pod 3 · Back-Office Governance</span>
          <span aria-hidden>·</span>
          <span>Access & RBAC · Sub-client mapping</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
          Sub-Client Mapping Directory
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Agent: RBAC Manager · capability matches, pins and visibility scope per sub-client
        </p>
        <div className="mt-4 border-b border-dashed border-wireline" />
      </header>

      {/* ── Mapped sub-clients filter — collapsible on its own ── */}
      <details open className="group mb-4 rounded-xl border border-border bg-card/40">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          Mapped sub-clients filter
        </summary>
      <div className="p-3 pt-0">

        <div className="mb-2 flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Filters · {sorted.length} of {ROWS.length} mapped
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-dashed border-wireline px-2 py-1 font-mono text-[10px] text-muted-foreground hover:border-accent hover:text-accent"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, agency, solicitation…"
              className="w-full rounded-md border border-border bg-background/60 py-2 pl-8 pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <Select label="Set-aside" value={setAside} options={["All set-asides", ...SET_ASIDES]} onChange={setSetAside} />
          <Select label="Status" value={status} options={["All statuses", ...STATUSES]} onChange={setStatus} />
          <Select label="Sub-client" value={subClient} options={["All sub-clients", ...SUB_CLIENTS]} onChange={setSubClient} />
          <VerticalSelect value={vertical} onChange={setVertical} />
          <Select label="Industry" value={industry} options={["All industries", ...INDUSTRIES]} onChange={setIndustry} />
          <Select label="Source" value={source} options={["All sources", ...SOURCES]} onChange={setSource} />
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Agency
            </span>
            <input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="Type…"
              className="w-full rounded-md border border-border bg-background/60 py-2 pl-[4.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              NAICS / code
            </span>
            <input
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
              placeholder="Type…"
              className="w-full rounded-md border border-border bg-background/60 py-2 pl-[5.5rem] pr-3 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStrongFit((s) => !s)}
              className={
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 font-mono text-[10px] transition-colors " +
                (strongFit ? "border-accent bg-accent/15 text-accent" : "border-dashed border-wireline text-muted-foreground hover:border-accent/60")
              }
            >
              <Flame className="h-3.5 w-3.5" /> Strong fit only
            </button>
            <button
              type="button"
              onClick={() => setZoho((s) => !s)}
              className={
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 font-mono text-[10px] transition-colors " +
                (zoho ? "border-accent bg-accent/15 text-accent" : "border-dashed border-wireline text-muted-foreground hover:border-accent/60")
              }
            >
              <Globe className="h-3.5 w-3.5" /> Zoho Deals
            </button>
          </div>
        </div>
      </div>
      </details>

      {/* ── Pipeline Opportunities — collapsible on its own ── */}
      <h2 className="mb-2 text-sm font-bold">Pipeline Opportunities</h2>
      <details open className="group">
        <summary className="mb-2 flex cursor-pointer list-none items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          {sorted.length} of {ROWS.length} mapped opportunities
        </summary>
      <div className="overflow-hidden rounded-xl border border-border">

        <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
          {COLUMNS.map((c) => {
            const active = sortKey === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleSort(c.key)}
                className={
                  "flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest transition-colors " +
                  (active ? "text-accent" : "text-muted-foreground hover:text-foreground") +
                  " " + c.className
                }
              >
                {c.label}
                {active ? (
                  sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                ) : (
                  <ArrowDownUp className="h-3 w-3 opacity-40" />
                )}
              </button>
            );
          })}
          <span className="w-56 shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Actions
          </span>
        </div>


        {/* rows */}
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">No mappings match these filters.</p>
            <button onClick={clearFilters} className="mt-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          sorted.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 border-b border-border px-4 py-3 text-xs last:border-0 hover:bg-secondary/30"
            >
              {/* Pipeline opportunity */}
              <div className={"min-w-[220px] flex-[2]"}>
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-foreground">{r.name}</span>
                  <button title="Run research agent" className="shrink-0 rounded-md border border-dashed border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:border-accent hover:text-accent">
                    Run Research
                  </button>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{r.code}</span>
              </div>
              {/* Agency / vertical */}
              <div className={"min-w-[180px] flex-1"}>
                <p className="truncate">{r.agency}</p>
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                  {r.vertical}
                </span>
              </div>
              {/* Due */}
              <div className="w-28 shrink-0">
                <p>{new Date(r.due).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              {/* Fit / ICP / GNG */}
              <div className="flex w-32 shrink-0 items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className={`inline-block h-2 w-2 rounded-full ${fitDot(r.fit)}`} />
                  <span className="font-mono text-[10px] text-muted-foreground">{r.fit}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className={`inline-block h-2 w-2 rounded-full ${fitDot(r.icp)}`} />
                  <span className="font-mono text-[10px] text-muted-foreground">{r.icp}</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{r.gng}</span>
              </div>
              {/* Mapped sub-client */}
              <div className={"min-w-[220px] flex-[1.5]"}>
                <p className="truncate font-medium">{r.subClient}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="rounded-full border border-dashed border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {r.status}
                  </span>
                </div>
              </div>
              {/* Priority */}
              <div className="w-12 shrink-0">
                <span className={`inline-flex items-center justify-center rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold ${prioTone(r.priority)}`}>
                  {r.priority}
                </span>
              </div>
              {/* Actions — depend on where the opportunity stands */}
              <div className="flex w-56 shrink-0 flex-wrap items-center justify-end gap-1">
                <Link
                  to="/bulk-edit"
                  className="rounded-md border border-dashed border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:border-accent hover:text-accent"
                >
                  Bulk Edit
                </Link>
                {r.gng !== "Go" && (
                  <Link
                    to="/bid-decision"
                    className="rounded-md border border-dashed border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:border-accent hover:text-accent"
                  >
                    Go / No-Go
                  </Link>
                )}
                {r.gng === "Go" && (
                  <Link
                    to="/shaping"
                    className="rounded-md bg-primary px-1.5 py-0.5 font-mono text-[9px] font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Proceed to Stage 19
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </details>

      {/* ── Zoho Deals — its own collapsible table ── */}
      <h2 className="mb-2 mt-6 text-sm font-bold">Zoho Deals</h2>
      <details className="group">
        <summary className="mb-2 flex cursor-pointer list-none items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          Deals synced from Zoho CRM
        </summary>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="min-w-[220px] flex-[2]">Deal</span>
            <span className="min-w-[180px] flex-1">Account</span>
            <span className="w-28 shrink-0">Close date</span>
            <span className="w-28 shrink-0">Stage</span>
            <span className="w-24 shrink-0 text-right">Value</span>
          </div>
          {[
            { id: "z1", name: "Navy IT Modernization — Phase 2", account: "Northstar Health Solutions", close: "Oct 6, 2026", stage: "Proposal", value: "$1.4M" },
            { id: "z2", name: "Army Training Support renewal", account: "Atlas Defense Group", close: "Oct 28, 2026", stage: "Negotiation", value: "$820K" },
            { id: "z3", name: "City of Atlanta Events retainer", account: "Riverside Civic Co.", close: "Nov 12, 2026", stage: "Qualification", value: "$310K" },
            { id: "z4", name: "Tribal Utility Modernization", account: "TribalWorks LLC", close: "Nov 4, 2026", stage: "Proposal", value: "$960K" },
          ].map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-2 border-b border-border px-4 py-3 text-xs last:border-0 hover:bg-secondary/30"
            >
              <span className="min-w-[220px] flex-[2] truncate font-semibold">{d.name}</span>
              <span className="min-w-[180px] flex-1 truncate">{d.account}</span>
              <span className="w-28 shrink-0">{d.close}</span>
              <span className="w-28 shrink-0 font-mono text-[10px] text-muted-foreground">{d.stage}</span>
              <span className="w-24 shrink-0 text-right font-mono text-[10px]">{d.value}</span>
            </div>
          ))}
        </div>
      </details>


      {/* toolbar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-wireline px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:border-accent hover:text-accent">
          <Download className="h-3.5 w-3.5" /> Export mapping
        </button>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          Sorted by {COLUMNS.find((c) => c.key === sortKey)?.label} · {sortDir === "asc" ? "A→Z" : "Z→A"}
        </span>
      </div>

      <div className="mt-8 space-y-4">
        <CompanionBubble pod={3}>
          “Sub-clients only ever see their own pursuits. Capability matches, pipeline visibility, and
          dashboards are scoped — admin pins are logged and auditable. The mapping itself stays
          rule-driven; here you sort, filter and audit it, you don't hand-edit the integrations.”
        </CompanionBubble>
        <Collapse title="What you can and can't change here" summary="Sorting, filters and pins — not the integrations">
          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Sort</strong> — click any column header to sort
              A→Z or Z→A. Default is opportunity name A→Z. Fit / Due default to high/nearest first.
            </li>
            <li>
              <strong className="text-foreground">Filter</strong> — this page has its own filter set
              (set-aside, status, sub-client, vertical with code, industry, source, agency, NAICS,
              strong-fit, Zoho). They don't touch the global opportunity filters.
            </li>
            <li>
              <strong className="text-foreground">Vertical</strong> is a type-ahead: type a code
              (FED, ST, LOC, TRB, EDU, HLT) or a name to narrow.
            </li>
            <li>
              <strong className="text-foreground">Don't change the mapping rules</strong> — the
              capability match, pin and visibility logic is driven by the RBAC Manager and the
              integrations behind it. Here you review, sort, pin and escalate, not rewire.
            </li>
          </ul>
        </Collapse>
        <Link to="/access" className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
          ← Back to Access & RBAC
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/subclient-mapping")({
  head: () => ({
    meta: [
      { title: "Sub-Client Mapping — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back-Office Governance: sub-client mapping directory with A–Z sorting and per-page filters." },
      { property: "og:title", content: "Sub-Client Mapping — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Sub-client mapping directory with A–Z sorting and per-page filters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubClientMapping,
});
