import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarPlus, ChevronDown, Search, Trophy } from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/workflow";
import { POD_COPY, STAGE_LABELS, dealsForPod, money } from "@/lib/deals";
import { CompanionBubble } from "@/components/wireframe/primitives";
import { PodHandoffStrip } from "@/components/wireframe/handoff-card";

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
  const podColor = pod === 2 ? "text-pod-2" : "text-pod-3";
  const copy = POD_COPY[pod];
  const rows = dealsForPod(pod);
  const rowsValue = rows.reduce((n, d) => n + d.value, 0);
  const isEvents = pod === 2;

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
              {tagline}{isEvents ? ` — ${total} steps across ${phases.length} phases.` : ""}
            </p>
          </div>
        </div>
        <div className="mt-4 border-b border-wireline" />
      </header>

      {/* Metrics */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-wireline bg-card/40 p-4">
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
            className="group rounded-xl border border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
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
            className="group rounded-xl border border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
          >
            <p className="text-sm font-semibold group-hover:text-accent">{copy.boardTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.boardBlurb}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Board · calendar · list · uploads
            </p>
          </Link>
        </div>
      </section>

      {isEvents ? (
        <>
          {/* Two ways into an event */}
          <section className="mb-8">
            <h2 className="text-sm font-bold">What do you want to work on?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link
                to="/won-proposals"
                className="group rounded-xl border border-wireline bg-card/40 p-5 transition-colors hover:border-accent"
              >
                <Trophy className="h-5 w-5 text-pod-2" />
                <p className="mt-3 text-base font-semibold group-hover:text-accent">Won Proposals</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every proposal won in Pod 1. Pick one and turn it into an event — the proposal details carry over
                  into the event form and the 48-step workflow.
                </p>
              </Link>
              <Link
                to="/event-details"
                className="group rounded-xl border border-wireline bg-card/40 p-5 transition-colors hover:border-accent"
              >
                <CalendarPlus className="h-5 w-5 text-pod-2" />
                <p className="mt-3 text-base font-semibold group-hover:text-accent">New Events</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start from a blank event details form, add any files you already have, then run the Event Creation
                  Wizard to build out the 48-step workflow.
                </p>
              </Link>
            </div>
          </section>

          {/* Phases — read-only single-line scroller */}
          <section className="mb-8">
            <h2 className="text-sm font-bold">Phases</h2>
            <div className="mt-3 overflow-x-auto pb-2">
              <div className="flex w-max items-center gap-2">
                {phases.map((p, i) => (
                  <span
                    key={p.path}
                    className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-wireline bg-card/40 px-3 py-1.5 font-mono text-[10px] text-muted-foreground"
                  >
                    <span className="text-pod-2">Phase {i + 1}</span>
                    {p.label}
                    <span className="text-muted-foreground/70">{p.steps?.length ?? 0} steps</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Scroll sideways to see all {phases.length} phases · reference only
            </p>
          </section>

          <ActiveEvents />
        </>
      ) : (
        <>
          {/* Feature cards — one per phase */}
          <section className="mb-8">
            <h2 className="text-sm font-bold">What do you want to do?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {phases.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className="group rounded-xl border border-wireline bg-card/40 p-4 transition-colors hover:border-accent"
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

          <div className="mb-8">
            <PodHandoffStrip pod={pod} />
          </div>

        </>
      )}


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

/** Collapsible search + table of every active event (sample data). */
function ActiveEvents() {
  const events = dealsForPod(2);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return events;
    return events.filter((e) =>
      [e.name, e.agency, e.subClient, e.owner, e.rfp].some((v) => v.toLowerCase().includes(needle)),
    );
  }, [events, q]);

  return (
    <section className="mb-8 rounded-xl border border-wireline bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:text-accent"
      >
        <span>
          <span className="text-sm font-bold">All Active Events</span>
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">
            {events.length} events · sample data
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-wireline p-4">
          <div className="mb-3 flex items-center gap-2 rounded-md border border-wireline px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, clients, owners…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4">Owner</th>
                  <th className="py-2 pr-4">Due (Oct)</th>
                  <th className="py-2">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-wireline">
                {rows.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-secondary/40">
                    <td className="py-2 pr-4 font-medium">{e.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{e.subClient}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full border border-pod-2/50 px-2 py-0.5 font-mono text-[10px] text-pod-2">
                        {STAGE_LABELS[e.stage]}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{e.owner}</td>
                    <td className="py-2 pr-4 font-mono text-[10px] text-muted-foreground">Oct {e.due}</td>
                    <td className="py-2 font-mono text-[10px]">{money(e.value)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center font-mono text-[11px] text-muted-foreground">
                      No events match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
