import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, ListTree, Lock } from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/workflow";
import { POD_COPY, dealsForPod, money } from "@/lib/deals";
import { CompanionBubble, GateBadge } from "@/components/wireframe/primitives";
import { Collapse } from "@/components/wireframe/collapse";

type PodHubProps = {
  pod: 2 | 3;
  name: string;
  tagline: string;
  metrics: { label: string; value: string }[];
};

/** Dashboard hub for a pod: metrics, feature cards per phase, collapsible step list. */
export function PodHub({ pod, name, tagline, metrics }: PodHubProps) {
  const phases = WORKFLOW_STEPS.filter((s) => s.pod === pod);
  const total = phases.reduce((n, p) => n + (p.steps?.length ?? 0), 0);
  const [open, setOpen] = useState(false);
  const podColor = pod === 2 ? "text-pod-2" : "text-pod-3";
  const copy = POD_COPY[pod];
  const rows = dealsForPod(pod);
  const rowsValue = rows.reduce((n, d) => n + d.value, 0);

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${podColor}`}>
              Pod {pod} · {name}
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {tagline} — {total} steps across {phases.length} phases.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-wireline bg-card/60 px-3 py-2 text-xs font-semibold transition-colors hover:border-accent"
          >
            <ListTree className="h-4 w-4 text-accent" />
            {total}-Step Workflow
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <div className="mt-4 border-b border-dashed border-wireline" />
      </header>

      {/* Metrics */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-dashed border-wireline bg-card/40 p-4">
            <p className="text-2xl font-extrabold tracking-tight">{m.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {m.label}
            </p>
          </div>
        ))}
      </section>

      {/* Live work — pipeline + board, same as Pod 1 */}
      <section className="mb-8">
        <h2 className="text-sm font-bold">The work itself</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            to="/pipeline"
            search={{ pod }}
            className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
          >
            <p className="text-sm font-semibold group-hover:text-accent">{copy.pipelineTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.pipelineBlurb}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              {rows.length} {copy.items} · {money(rowsValue)} total
            </p>
          </Link>
          <Link
            to="/opportunities"
            search={{ pod }}
            className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
          >
            <p className="text-sm font-semibold group-hover:text-accent">{copy.boardTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.boardBlurb}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Board · calendar · list · uploads
            </p>
          </Link>
        </div>
      </section>

      {/* Feature cards — one per phase */}
      <section className="mb-8">
        <h2 className="text-sm font-bold">What do you want to do?</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p) => (
            <Link
              key={p.path}
              to={p.path}
              className="group rounded-xl border border-dashed border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
            >
              <p className="text-sm font-semibold group-hover:text-accent">{p.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.phase}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                {p.steps?.length ?? 0} steps
                {(p.steps?.some((s) => s.gate) ?? false) && " · has gates"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Collapsible full step list */}
      <section id="process" className="mb-8">
        <Collapse title={`The ${total}-step process`} summary={`${phases.length} phases · click any phase to open it`}>
          <ol className="divide-y divide-border rounded-xl border border-border">
            {phases.map((p, i) => {
              const gates = p.steps?.filter((s) => s.gate).length ?? 0;
              return (
                <li key={p.path}>
                  <Link
                    to={p.path}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Phase {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium group-hover:text-accent group-hover:underline">
                        {p.label}
                      </p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">{p.phase}</p>
                    </div>
                    {gates > 0 && <GateBadge label={`${gates} gate${gates > 1 ? "s" : ""}`} />}
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {p.steps?.length ?? 0} steps
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </Collapse>
      </section>

      <div className="mt-8">
        <CompanionBubble pod={pod}>
          {pod === 2
            ? "“Brief to closeout — I keep the run-of-show moving, and every public-facing gate lands on a human.”"
            : "“Approvals, audit, budget, documents, access and maturity — I keep the records clean and the gates honest.”"}
        </CompanionBubble>
      </div>
    </div>
  );
}
