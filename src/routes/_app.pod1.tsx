import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PlusCircle,
  ListChecks,
  Users,
  FolderOpen,
  ChevronRight,
  Sparkles,
  Pencil,
  FileUp,
  FileText,
  Globe2,
  Satellite,
  Gauge,
  Layers,
  Trash2,
  X,
} from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/workflow";
import { CompanionBubble, GateBadge } from "@/components/wireframe/primitives";
import { Collapse } from "@/components/wireframe/collapse";
import { StepJump } from "@/components/wireframe/step-jump";

const PHASES = WORKFLOW_STEPS.filter((s) => s.pod === 1);

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
  { title: "Sales Engine Command Center", desc: "Fit scores, win probability and the four Go/No-Go bands.", to: "/sales-engine", icon: Gauge },
  { title: "View opportunities", desc: "Board, calendar, list or your uploads directory.", to: "/opportunities", icon: ListChecks },
  { title: "Mapped sub-clients", desc: "Which capabilities match which buyers.", to: "/subclient-mapping", icon: Users },
  { title: "Document library", desc: "Drafts, boilerplate and past performance.", to: "/documents", icon: FolderOpen },
];

type DialogKind = "analyze" | "add" | null;
type RunKind = "new" | "all";

const RUN_STAGES = [
  "Loading opportunities…",
  "Running deterministic scoring…",
  "Matching against sub-client NAICS + keywords…",
  "Writing Claude narratives (capped per run)…",
  "Refreshing pipeline results…",
];

function AnalysisRun({ kind, onDone }: { kind: RunKind; onDone: () => void }) {
  const total = kind === "new" ? 48 : 32644;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPct((p) => {
        const next = p + (kind === "new" ? 7 : 4);
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 220);
    return () => clearInterval(timer);
  }, [kind]);

  const stage = RUN_STAGES[Math.min(Math.floor((pct / 100) * RUN_STAGES.length), RUN_STAGES.length - 1)];
  const done = pct >= 100;

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {kind === "new" ? "Analyzing new opportunities" : "Analyzing entire pipeline"}
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {done ? "Complete" : `${pct}%`}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-200 ${done ? "bg-pod-1" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {done ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">
            {total.toLocaleString()} opportunities analyzed and scored. Sample run — no live feeds
            connected.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/pipeline"
              className="rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20"
            >
              View results in pipeline
            </Link>
            <button
              type="button"
              onClick={onDone}
              className="rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
            >
              Run again
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">{stage}</p>
      )}
    </div>
  );
}

/** Pipeline housekeeping: preview, confirm, then show the sample outcome. */
function MaintenanceAction({
  icon: Icon,
  title,
  desc,
  confirm,
  done,
  danger = false,
}: {
  icon: typeof Layers;
  title: string;
  desc: string;
  confirm: string;
  done: string;
  danger?: boolean;
}) {
  const [state, setState] = useState<"idle" | "confirm" | "done">("idle");

  return (
    <div className="rounded-lg border border-wireline bg-secondary/30 p-4">
      <div className="flex items-start gap-3">
        <Icon className={`h-4 w-4 shrink-0 ${danger ? "text-destructive" : "text-accent"}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-3">
        {state === "done" ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{done}</p>
        ) : state === "confirm" ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setState("done")}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                danger
                  ? "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
              }`}
            >
              {confirm}
            </button>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setState("confirm")}
            className="rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
          >
            {title}
          </button>
        )}
      </div>
    </div>
  );
}

function ActionDialog({ kind, onClose }: { kind: Exclude<DialogKind, null>; onClose: () => void }) {
  const [run, setRun] = useState<RunKind | null>(null);
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
            <button
              type="button"
              onClick={() => setRun("new")}
              className="block w-full rounded-lg border border-wireline bg-secondary/30 p-4 text-left transition-colors hover:border-accent"
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
            </button>
            <button
              type="button"
              onClick={() => setRun("all")}
              className="block w-full rounded-lg border border-wireline bg-secondary/30 p-4 text-left transition-colors hover:border-accent"
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
          </button>
          {run && <AnalysisRun kind={run} onDone={() => setRun(null)} />}
          <p className="pt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Matching is not scoring · analyze matches sub-clients (Step 4), the Go/No-Go scorecard
            sets the band (Step 15)
          </p>
          <Link
            to="/sales-engine"
            className="flex items-center gap-3 rounded-lg border border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
          >
            <Gauge className="h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Score in the Sales Engine</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Run the 10-factor Go/No-Go scorecard and see the four-band split.
              </p>
            </div>
          </Link>
          <Link
            to="/bulk-edit"

            className="flex items-center gap-3 rounded-lg border border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
          >
            <Pencil className="h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Bulk edit</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Update fields across many analyzed opportunities at once.
              </p>
            </div>
          </Link>
          <MaintenanceAction
            icon={Layers}
            title="Remove duplicates"
            desc="Soft-deactivates the extra rows in a duplicate group (same solicitation number, source link, or title + agency + deadline). Keeps one canonical row — it does not wipe the pipeline."
            confirm="Preview 12 duplicate groups, then confirm"
            done="12 duplicate groups collapsed · 1 canonical row kept in each. Sample run."
          />
          <MaintenanceAction
            icon={Trash2}
            title="Purge & re-pool"
            desc="Admin only. Archives every active opportunity and clears its mapping columns, so the next Discover + Analyze repopulates the board under the current formula. Use it when the scoring formula changes."
            confirm="Archive all active rows and clear mappings"
            done="Pipeline archived and re-pooled. Run Discover, then Analyze. Sample run."
            danger
          />
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
                className="flex items-center gap-3 rounded-lg border border-wireline bg-secondary/30 p-4 transition-colors hover:border-accent"
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
        <div className="mt-4 border-b border-wireline" />
      </header>

      {/* Pod sub-dashboard */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-wireline bg-card/40 p-4">
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
            className="group rounded-xl border border-wireline bg-card/40 p-4 text-left transition-colors hover:border-accent"
          >
            <Sparkles className="h-5 w-5 text-accent" />
            <p className="mt-3 text-sm font-semibold group-hover:text-accent">Analyze pipeline</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Match rows to sub-clients, bulk edit, remove duplicates or re-pool.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setDialog("add")}
            className="group rounded-xl border border-wireline bg-card/40 p-4 text-left transition-colors hover:border-accent"
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
              className="group rounded-xl border border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
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
          <ol className="mt-1 divide-y divide-border rounded-xl border border-border">

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
        <Collapse title="How this pod is organised" summary="Features first, sequence for reference">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Pod 1 is one continuous process from opportunity discovery to award and closeout. The
            cards above are the things people actually come here to do. The list above shows the
            same work as the {TOTAL} numbered steps grouped into {PHASES.length} phases, so the
            full sequence stays visible without forcing anyone to walk it end to end.
          </p>
        </Collapse>
        <CompanionBubble pod={1}>
          {"\u201C"}The steps run in order on paper. In practice you jump to the piece of work in
          front of you — I keep the trail consistent either way.{"\u201D"}
        </CompanionBubble>
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
