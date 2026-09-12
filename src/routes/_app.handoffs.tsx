import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Circle, Clock, Link2, ShieldCheck } from "lucide-react";
import { HANDOFFS, type Handoff } from "@/lib/cross-pod";
import { Collapse } from "@/components/wireframe/collapse";

export const Route = createFileRoute("/_app/handoffs")({
  head: () => ({
    meta: [
      { title: "Pod 3 Handoff Checklist — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Every point where Pod 3 governance connects to Pod 1 proposals and Pod 2 events, with a status for each handoff.",
      },
      { property: "og:title", content: "Pod 3 Handoff Checklist — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Track the governance handoffs between Pod 1, Pod 2 and Pod 3 back-office.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HandoffChecklist,
});

type Status = "open" | "progress" | "verified";

const STATUS: Record<Status, { label: string; icon: typeof Circle; cls: string; next: Status }> = {
  open: {
    label: "Not started",
    icon: Circle,
    cls: "border-wireline text-muted-foreground",
    next: "progress",
  },
  progress: {
    label: "In progress",
    icon: Clock,
    cls: "border-accent/60 text-accent",
    next: "verified",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    cls: "border-pod-3/60 text-pod-3",
    next: "open",
  },
};

const GROUPS: { pod: 1 | 2 | 3; title: string; blurb: string; accent: string }[] = [
  {
    pod: 1,
    title: "Pod 1 · Proposal Factory",
    blurb: "Where proposal work needs a decision, a record or a budget check from back-office.",
    accent: "text-pod-1",
  },
  {
    pod: 2,
    title: "Pod 2 · Events & Experiential",
    blurb: "Where event delivery needs approval, spend control or a closeout record.",
    accent: "text-pod-2",
  },
  {
    pod: 3,
    title: "Pod 3 · Back-Office Governance",
    blurb: "The rules back-office applies to everything arriving from the other two pods.",
    accent: "text-pod-3",
  },
];

const key = (h: Handoff) => `${h.pod}-${h.step}`;

function HandoffChecklist() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const get = (h: Handoff): Status => statuses[key(h)] ?? "open";
  const cycle = (h: Handoff) =>
    setStatuses((s) => ({ ...s, [key(h)]: STATUS[s[key(h)] ?? "open"].next }));

  const counts = useMemo(() => {
    const c = { open: 0, progress: 0, verified: 0 };
    for (const h of HANDOFFS) c[statuses[key(h)] ?? "open"] += 1;
    return c;
  }, [statuses]);

  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-3">
          Pod 3 · Back-Office Governance
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <ShieldCheck className="h-6 w-6 text-accent" />
          Handoff checklist
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every place the three pods pass work to each other. Tick each one off as it is set up and
          checked. Click a status to move it on: not started → in progress → verified.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sample data · no live systems connected
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Handoff points", value: HANDOFFS.length },
          { label: "Not started", value: counts.open },
          { label: "In progress", value: counts.progress },
          { label: "Verified", value: counts.verified },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-wireline p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-1 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      {GROUPS.map((g) => {
        const rows = HANDOFFS.filter((h) => h.pod === g.pod);
        return (
          <Collapse
            key={g.pod}
            title={<span className={g.accent}>{g.title}</span>}
            summary={`${rows.length} handoffs · ${g.blurb}`}
          >
            <div className="space-y-3">
              {rows.map((h) => {
                const st = get(h);
                const Icon = STATUS[st].icon;
                return (
                  <article
                    key={key(h)}
                    className="rounded-lg border border-wireline p-4 transition-colors hover:border-accent/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          Step {h.step} · {h.connector} · {h.maturity}
                        </div>
                        <h3 className="mt-1 text-sm font-semibold">{h.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{h.from}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{h.to}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => cycle(h)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors hover:bg-sidebar-accent ${STATUS[st].cls}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {STATUS[st].label}
                      </button>
                    </div>

                    <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        ["Happens automatically", h.autoAction],
                        ["Human condition", h.humanGate],
                        ["Record kept", h.audit],
                        ["Dashboard effect", h.dashboard],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {label}
                          </dt>
                          <dd className="mt-1 text-muted-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>

                    {h.link && (
                      <Link
                        to={h.link.to}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        {h.link.label}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </Collapse>
        );
      })}
    </div>
  );
}
