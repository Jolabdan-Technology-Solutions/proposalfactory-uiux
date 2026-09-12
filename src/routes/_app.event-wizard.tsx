import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { DEALS, money } from "@/lib/deals";
import { WORKFLOW_STEPS } from "@/lib/workflow";

type Search = {
  name?: string;
  client?: string;
  proposal?: string;
  type?: string;
  date?: string;
  location?: string;
  attendees?: string;
  budget?: string;
  objectives?: string;
  files?: string;
};

const KEYS = [
  "name",
  "client",
  "proposal",
  "type",
  "date",
  "location",
  "attendees",
  "budget",
  "objectives",
  "files",
] as const;

export const Route = createFileRoute("/_app/event-wizard")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const out: Search = {};
    for (const k of KEYS) {
      const v = search[k];
      if (typeof v === "string" && v !== "") out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Event Creation Wizard — The Proposal Factory™" },
      { name: "description", content: "Build the event across the 48-step Pod 2 workflow from the brief and uploads." },
      { property: "og:title", content: "Event Creation Wizard — The Proposal Factory™" },
      { property: "og:description", content: "Build the event across the 48-step Pod 2 workflow from the brief and uploads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventWizard,
});

const STAGES = [
  "Reading the event details form",
  "Pulling in the won proposal and uploads",
  "Drafting the event concept and run-of-show",
  "Laying out budget, timeline and vendors",
  "Building the 48-step plan",
];

function EventWizard() {
  const s = Route.useSearch();
  const source = DEALS.find((d) => d.id === s.proposal);
  const phases = WORKFLOW_STEPS.filter((p) => p.pod === 2);

  /** Flatten the Pod 2 phases into one ordered 48-step plan. */
  const plan = useMemo(
    () =>
      phases.flatMap((p, pi) =>
        (p.steps ?? []).map((st) => ({
          n: st.n,
          name: st.name,
          agent: st.agent,
          gate: st.gate,
          phaseIndex: pi,
          phaseLabel: p.label,
          path: p.path,
        })),
      ),
    [phases],
  );
  const total = plan.length;

  const [stage, setStage] = useState(-1);
  const generated = stage >= STAGES.length;
  const [current, setCurrent] = useState(0);
  const finished = current >= total;

  function run() {
    setStage(0);
    STAGES.forEach((_, i) => setTimeout(() => setStage(i + 1), (i + 1) * 700));
  }

  /** Clicking the active step completes it and moves the plan on by itself. */
  function advance() {
    setCurrent((c) => {
      const next = c + 1;
      const el = typeof document !== "undefined" ? document.getElementById(`plan-step-${next}`) : null;
      if (el) setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
      return next;
    });
  }

  const facts: [string, string][] = [
    ["Event type", s.type || "—"],
    ["Target date", s.date || "—"],
    ["Location", s.location || "—"],
    ["Expected attendees", s.attendees || "—"],
    ["Budget", s.budget ? money(Number(s.budget)) : "—"],
    ["Attachments", s.files ?? "0"],
  ];

  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-2">
          Pod 2 · Events &amp; Experiential
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="h-5 w-5 text-pod-2" /> Event Creation Wizard
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Eve turns this brief into a full event plan across the {total}-step Pod 2 workflow.
        </p>
      </header>

      <section className="rounded-xl border border-wireline bg-card/40 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Building from</p>
        <p className="mt-1 text-sm font-medium">{s.name ?? "Untitled event"}</p>
        <p className="font-mono text-[10px] text-muted-foreground">Client: {s.client ?? "Unassigned"}</p>

        {source ? (
          <div className="mt-3 rounded-lg border border-wireline p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-pod-2">Won proposal carried over</p>
            <p className="mt-1 text-sm font-medium">{source.name}</p>
            <dl className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {(
                [
                  ["Solicitation", source.rfp],
                  ["Agency", source.agency],
                  ["Award value", money(source.value)],
                  ["Owner", source.owner],
                  ["Sub-client", source.subClient],
                  ["NAICS", source.naics],
                  ["Set-aside", source.setAside],
                  ["Due", source.due],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 font-mono text-[10px]">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            New event · no proposal attached
          </p>
        )}

        <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 font-mono text-[10px]">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>
        {s.objectives && (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-mono text-[10px] uppercase tracking-widest">Objectives · </span>
            {s.objectives}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-wireline p-5">
        {stage < 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={run}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Generate the event
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">
              Sample result · no live systems connected
            </span>
          </div>
        ) : (
          <ol className="space-y-2">
            {STAGES.map((st, i) => (
              <li key={st} className="flex items-center gap-2 text-sm">
                {i < stage ? (
                  <CheckCircle2 className="h-4 w-4 text-pod-2" />
                ) : i === stage ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-wireline" />
                )}
                <span className={i <= stage ? "" : "text-muted-foreground"}>{st}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {generated && (
        <section className="space-y-4 rounded-xl border border-wireline p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Event plan — {total} steps across {phases.length} phases
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click the highlighted step to complete it. The plan moves to the next step on its own, and rolls into
                the next phase automatically. Approval steps ask you to approve before anything continues.
              </p>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {Math.min(current, total)} / {total} done
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-pod-2 transition-all duration-300"
              style={{ width: `${(Math.min(current, total) / total) * 100}%` }}
            />
          </div>

          <ol className="divide-y divide-dashed divide-wireline rounded-lg border border-wireline">
            {plan.map((step, i) => {
              const done = i < current;
              const active = i === current;
              const startsPhase = i === 0 || plan[i - 1]!.phaseIndex !== step.phaseIndex;
              return (
                <li key={step.n} id={`plan-step-${i}`}>
                  {startsPhase && (
                    <div className="flex items-center justify-between gap-3 bg-secondary/40 px-4 py-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-pod-2">
                        Phase {step.phaseIndex + 1} · {step.phaseLabel}
                      </span>
                      <Link
                        to={step.path}
                        className="font-mono text-[10px] text-muted-foreground hover:text-accent"
                      >
                        Open phase screen
                      </Link>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={!active}
                    onClick={advance}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      active
                        ? "cursor-pointer bg-accent/10 hover:bg-accent/20"
                        : done
                          ? "opacity-70"
                          : "cursor-default"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-pod-2" />
                    ) : active ? (
                      <span className="h-4 w-4 shrink-0 rounded-full border-2 border-accent" />
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border border-wireline" />
                    )}
                    <span className="w-10 shrink-0 font-mono text-[10px] text-muted-foreground">
                      {String(step.n).padStart(2, "0")}
                    </span>
                    <span className={`min-w-0 flex-1 truncate text-sm ${done ? "line-through" : ""}`}>
                      {step.name}
                    </span>
                    {step.gate && (
                      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-wireline px-2 py-0.5 font-mono text-[9px] text-accent sm:inline-flex">
                        <ShieldCheck className="h-3 w-3" /> {step.gate}
                      </span>
                    )}
                    <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground md:inline">
                      {step.agent}
                    </span>
                    {active && (
                      <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold text-primary-foreground">
                        {step.gate ? "Approve" : "Complete"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          {finished && (
            <p className="rounded-lg border border-wireline bg-card/40 p-4 text-sm">
              All {total} steps complete — the event is delivered and closed out. Proof points flow back to Sylvia&apos;s
              past-performance library.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              to="/event-intake"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Open the {total}-step workflow
            </Link>
            <button
              type="button"
              onClick={() => setCurrent(0)}
              className="rounded-md border border-wireline px-4 py-2 text-sm text-muted-foreground hover:border-accent hover:text-foreground"
            >
              Restart the plan
            </button>
            <Link
              to="/pod2"
              className="rounded-md border border-wireline px-4 py-2 text-sm text-muted-foreground hover:border-accent hover:text-foreground"
            >
              Back to Pod 2
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
