import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  PlusCircle,
  ListChecks,
  Users,
  FileCheck2,
  FolderOpen,
  ListTree,
  ChevronDown,
  ChevronRight,
  Lock,
  Sparkles,
  Pencil,
  FileUp,
  FileText,
  Globe2,
  Satellite,
  X,
} from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/workflow";
import { CompanionBubble, GateBadge } from "@/components/wireframe/primitives";
import { Collapse } from "@/components/wireframe/collapse";

const PHASES = WORKFLOW_STEPS.filter((s) => s.pod === 1);

/** Steps 1–70 across Pod 1, flattened with their phase for the jump menu. */
const ALL_STEPS = PHASES.flatMap((p) =>
  (p.steps ?? []).map((s) => ({
    n: s.n,
    name: s.name,
    gate: s.gate,
    phaseLabel: p.label,
    path: p.path,
  })),
);

/** Sub-clients the workflow can be run for. Work always runs for one at a time. */
const SUB_CLIENTS = [
  "Mr. B2G Advisors (Prime & Consulting)",
  "Atlas Defense Group",
  "CivicPath Partners",
  "GreenLine Energy",
  "Northstar Health Solutions",
  "Riverside Civic Co.",
  "TribalWorks LLC",
];

/** Dropdown that lets the user jump straight to any of the 70 steps. */
function StepJump() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [subClient, setSubClient] = useState<string>(SUB_CLIENTS[0]!);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-dashed border-wireline bg-card/60 px-3 py-2 text-xs font-semibold transition-colors hover:border-accent"
      >
        <ListTree className="h-4 w-4 text-accent" />
        70-Step Workflow
        <span className="hidden max-w-[10rem] truncate font-mono text-[10px] font-normal text-accent sm:inline">
          · {subClient}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-xl">
          {/* Active sub-client — the workflow runs for this one only */}
          <div className="border-b border-border px-4 py-3">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Active sub-client
            </label>
            <select
              value={subClient}
              onChange={(e) => setSubClient(e.target.value)}
              className="mt-1 w-full cursor-pointer rounded-md border border-border bg-background/60 px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {SUB_CLIENTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-muted-foreground">
              Every step you open runs for {subClient} only — not the whole 32,000+ opportunity pool.
            </p>
          </div>
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {ALL_STEPS.length} steps · {PHASES.length} phases
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              View all
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {PHASES.map((p) => {
              const isOpen = expanded === p.path;
              return (
                <div key={p.path} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : p.path)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-secondary/50"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : "-rotate-90"}`} />
                    <span className="flex-1 truncate text-xs font-semibold">{p.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {p.steps?.length ?? 0} steps
                    </span>
                  </button>
                  {isOpen && (
                    <ol className="ml-4 border-l border-dashed border-wireline pl-2">
                      {(p.steps ?? []).map((s) => (
                        <li key={s.n}>
                          <Link
                            to={p.path}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/50"
                          >
                            <span className="w-7 shrink-0 font-mono text-[10px] text-muted-foreground">
                              {String(s.n).padStart(2, "0")}
                            </span>
                            <span className="flex-1 truncate text-xs">{s.name}</span>
                            {s.gate && <Lock className="h-3 w-3 shrink-0 text-accent" />}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Running step numbers across the 70-step Pod 1 process. */
const RANGES = (() => {
  let cursor = 0;
  return PHASES.map((p) => {
    const count = p.steps?.length ?? 0;
    const from = cursor + 1;
    cursor += count;
    return { path: p.path, label: p.label, phase: p.phase, from, to: cursor, count, gates: p.steps?.filter((s) => s.gate).length ?? 0 };
  });
})();

const TOTAL = RANGES.reduce((n, r) => n + r.count, 0);

const SIMPLE_ACTIONS = [
  { title: "View opportunities", desc: "Board, calendar, list or your uploads directory.", to: "/opportunities", icon: ListChecks },
  { title: "Mapped sub-clients", desc: "Which capabilities match which buyers.", to: "/subclient-mapping", icon: Users },
  { title: "Compliance check", desc: "Run the shred and compliance matrix.", to: "/compliance", icon: FileCheck2 },
  { title: "Document library", desc: "Drafts, boilerplate and past performance.", to: "/documents", icon: FolderOpen },
];

type DialogKind = "analyze" | "add" | null;

function ActionDialog({ kind, onClose }: { kind: Exclude<DialogKind, null>; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            {kind === "analyze" ? (
              <>
                <Sparkles className="h-5 w-5 text-accent" /> Analyze Pipeline
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 text-accent" /> Add Opportunity
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {kind === "analyze" ? (
          <div className="mt-4 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              32,596 of 32,644 opportunities analyzed · last run 9/7/2026, 2:56 PM
            </p>
            <Link
              to="/pipeline"
              className="block rounded-lg border border-dashed border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">Analyze new opportunities</p>
                <span className="rounded-md border border-accent/50 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                  Recommended · lowest spend · 48 to analyze
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Only rows never analyzed (usually the latest import). Deterministic scoring is free;
                Claude narratives are capped per run (≤25).
              </p>
            </Link>
            <Link
              to="/pipeline"
              className="block rounded-lg border border-dashed border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">Analyze entire pipeline</p>
                <span className="rounded-md border border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Expensive · rematch + cap ≤15 · 32,644 opportunities
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Rematches every opportunity against current sub-client NAICS + keyword overrides. Use
                after NAICS/keyword cleanup — not the everyday path.
              </p>
            </Link>
            <Link
              to="/bulk-edit"

              className="flex items-center gap-3 rounded-lg border border-dashed border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
            >
              <Pencil className="h-4 w-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold">Bulk edit</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Update fields across many analyzed opportunities at once.
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {[
              { icon: PlusCircle, title: "Enter manually", desc: "Type in one opportunity yourself.", to: "/rfp-intake" },
              { icon: FileUp, title: "Import CSV / Excel", desc: "Upload a spreadsheet of opportunities.", to: "/rfp-intake" },
              { icon: FileText, title: "Import PDF", desc: "Pull opportunities out of a PDF attachment.", to: "/rfp-intake" },
              { icon: Globe2, title: "Discover (all government levels)", desc: "Scan federal, state and local forecasts.", to: "/rfp-intake" },
              { icon: Satellite, title: "Run SLED ingestion", desc: "Pull the latest state & local feed.", to: "/rfp-intake" },
            ].map((o) => (
              <Link
                key={o.title}
                to={o.to}
                className="flex items-center gap-3 rounded-lg border border-dashed border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
              >
                <o.icon className="h-4 w-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-semibold">{o.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const METRICS = [
  { label: "Opportunities captured", value: "128" },
  { label: "Analyzed & scored", value: "94" },
  { label: "Mapped to sub-clients", value: "37" },
  { label: "Awaiting a human gate", value: "6" },
];

function Pod1Hub() {
  const [dialog, setDialog] = useState<DialogKind>(null);

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
              Pod 1 · Proposal Factory
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Proposal Factory</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              One process of {TOTAL} steps across {PHASES.length} phases — pre-award, in-process
              and post-award. The order is shown for reference; you can start at whichever phase
              your work is actually at.
            </p>
          </div>
          <div className="shrink-0 pt-1">
            <StepJump />
          </div>
        </div>
        <div className="mt-4 border-b border-dashed border-wireline" />
      </header>

      {/* Pod sub-dashboard */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-dashed border-wireline bg-card/40 p-4">
            <p className="text-2xl font-extrabold tracking-tight">{m.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {m.label}
            </p>
          </div>
        ))}
      </section>

      {/* Feature / functionality entry points */}
      <section className="mb-8">
        <h2 className="text-sm font-bold">What do you want to do?</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setDialog("analyze")}
            className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 text-left transition-colors hover:border-accent"
          >
            <Sparkles className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-semibold group-hover:text-accent">Analyze pipeline</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Score new rows, rematch the whole pipeline, or bulk edit.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setDialog("add")}
            className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 text-left transition-colors hover:border-accent"
          >
            <PlusCircle className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-semibold group-hover:text-accent">Add opportunity</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Manual entry, CSV/Excel, PDF, Discover, or SLED ingestion.
            </p>
          </button>
          {SIMPLE_ACTIONS.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
            >
              <a.icon className="h-5 w-5 text-accent" />
              <p className="mt-3 text-sm font-semibold group-hover:text-accent">{a.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* The 70-step process — collapsible, click any phase to open it */}
      <section id="process" className="mb-8">
        <Collapse
          title={`The ${TOTAL}-step process`}
          summary={`${PHASES.length} phases · click any phase to open it`}
        >
          <ol className="divide-y divide-border rounded-xl border border-border">
            {RANGES.map((r, i) => (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Phase {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium group-hover:text-accent group-hover:underline">
                      {r.label}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">{r.phase}</p>
                  </div>
                  {r.gates > 0 && <GateBadge label={`${r.gates} gate${r.gates > 1 ? "s" : ""}`} />}
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    Steps {r.from}–{r.to}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ol>
        </Collapse>
      </section>

      <div className="mt-8 space-y-4">
        <CompanionBubble pod={1}>
          {"\u201C"}The steps run in order on paper. In practice you jump to the piece of work in
          front of you — I keep the trail consistent either way.{"\u201D"}
        </CompanionBubble>
        <Collapse title="How this pod is organised" summary="Features first, sequence for reference">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Pod 1 is one continuous process from opportunity discovery to award and closeout. The
            cards above are the things people actually come here to do. The list above shows the
            same work as the {TOTAL} numbered steps grouped into {PHASES.length} phases, so the
            full sequence stays visible without forcing anyone to walk it end to end.
          </p>
        </Collapse>
      </div>

      {dialog && <ActionDialog kind={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

export const Route = createFileRoute("/_app/pod1")({
  head: () => ({
    meta: [
      { title: "Proposal Factory Pod 1 — The Proposal Factory™" },
      { name: "description", content: "Pod 1 hub: analyze the pipeline, add opportunities, map sub-clients, and jump into any of the 70 proposal steps." },
      { property: "og:title", content: "Proposal Factory Pod 1 — The Proposal Factory™" },
      { property: "og:description", content: "Pod 1 hub: analyze the pipeline, add opportunities, map sub-clients, and jump into any of the 70 proposal steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pod1Hub,
});
