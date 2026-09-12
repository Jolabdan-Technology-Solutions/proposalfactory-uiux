import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Annotation,
  GateBadge,
  SkeletonBlock,
  TriggerChip,
} from "@/components/wireframe/primitives";
import { ScreenHeader } from "@/components/wireframe/screen-header";
import { COMPANIONS, WORKFLOW_STEPS } from "@/lib/workflow";
import { useActiveRole } from "@/hooks/use-role";
import { Collapse } from "@/components/wireframe/collapse";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — The Proposal Factory™ Wireframe" },
      {
        name: "description",
        content: "System at a glance: three pods, three companions, and today's human gates.",
      },
      { property: "og:title", content: "Dashboard — The Proposal Factory™ Wireframe" },
      {
        property: "og:description",
        content: "System at a glance: three pods, three companions, and today's human gates.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Dashboard,
});

const PODS = [
  {
    pod: 1 as const,
    name: "Proposal Factory",
    line: "12 phases · 70 steps · capture to award.",
    to: "/pod1",
    stat: "12 active pursuits",
  },
  {
    pod: 2 as const,
    name: "Events & Experiential",
    line: "8 phases · 48 steps · brief to closeout.",
    to: "/pod2",
    stat: "3 events in flight",
  },
  {
    pod: 3 as const,
    name: "Back Office Governance",
    line: "Approvals, audit, budget, documents, access, maturity.",
    to: "/pod3",
    stat: "5 approvals pending",
  },
];

const GATES = [
  { gate: "Go/No-Go decision", where: "Navy IT Modernization", to: "/bid-decision" },
  { gate: "Final cost lock", where: "DHS Campus Security", to: "/finalization" },
  { gate: "Concept approval", where: "MTM Launch Summit", to: "/event-intake" },
];

function Dashboard() {
  const step = WORKFLOW_STEPS[1]!;
  const role = useActiveRole();
  const pods = PODS.filter((p) => !role || role.pods.includes(p.pod));
  return (
    <div>
      <ScreenHeader step={step} />

      {role && (
        <Collapse
          className="mb-8 border-accent/50 bg-accent/5"
          title={`${role.name} environment`}
          summary={`${role.who} · ${role.scope}`}
        >
          {role.status === "planned" && (
            <span className="mb-3 inline-block rounded-full border border-wireline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              switches on at go-live
            </span>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Sees
              </p>
              <ul className="mt-2 space-y-1">
                {role.sees.map((s) => (
                  <li key={s} className="flex gap-2 text-xs text-secondary-foreground">
                    <span className="text-accent">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Hidden here
              </p>
              <ul className="mt-2 space-y-1">
                {role.hidden.map((s) => (
                  <li key={s} className="flex gap-2 text-xs text-muted-foreground">
                    <span>−</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Collapse>
      )}

      {/* Pod journey breadcrumb — the overall path, not every step */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Journey
        </span>
        <TriggerChip to="/pod1">Pod 1 · Proposal</TriggerChip>
        <span className="font-mono text-xs text-muted-foreground">→</span>
<TriggerChip to="/pod2">Pod 2 · Events</TriggerChip>
        <span className="font-mono text-xs text-muted-foreground">→</span>
        <TriggerChip to="/pod3">Pod 3 · Governance</TriggerChip>
        <Link
          to="/goals"
          className="ml-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
        >
          Choose a task
        </Link>
      </div>

      {/* Pod cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {pods.map((p) => (
          <Link
            key={p.pod}
            to={p.to}
            className="group rounded-xl border border-wireline bg-card/40 p-5 transition-colors hover:border-accent/60"
          >
            <div className="flex items-center justify-between">
              <p
                className={
                  p.pod === 1 ? "font-mono text-[10px] uppercase tracking-widest text-pod-1"
                  : p.pod === 2 ? "font-mono text-[10px] uppercase tracking-widest text-pod-2"
                  : "font-mono text-[10px] uppercase tracking-widest text-pod-3"
                }
              >
                Pod {p.pod}
              </p>
              <span
                className={
                  "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-semibold " +
                  (p.pod === 1 ? "border-pod-1 text-pod-1"
                  : p.pod === 2 ? "border-pod-2 text-pod-2"
                  : "border-pod-3 text-pod-3")
                }
              >
                {COMPANIONS[p.pod].initial}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold group-hover:text-accent">{p.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{p.line}</p>
            <SkeletonBlock label={COMPANIONS[p.pod].name} className="mt-4 py-2">
              <span className="text-[11px] text-muted-foreground">{p.stat}</span>
            </SkeletonBlock>
          </Link>
        ))}
      </div>

      {/* Gates + activity */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-wireline bg-card/40 p-5">
          <h3 className="text-sm font-bold">
            {role && !role.canDecide ? "Decisions raised by you (awaiting an admin)" : "Decisions waiting on you"}
          </h3>
          <ul className="mt-3 space-y-3">
            {GATES.map((g) => (
              <li key={g.gate} className="flex items-center justify-between gap-3">
                <div>
                  <GateBadge />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.gate} · {g.where}
                  </p>
                </div>
                <TriggerChip to={g.to}>Open</TriggerChip>
              </li>
            ))}
          </ul>
        </div>
        <SkeletonBlock label="Activity / audit snapshot" className="p-5">
          <p className="font-mono text-[10px] leading-loose text-muted-foreground">
            09:12 Sylvia reran Step 25 after Amendment 3
            <br />
            08:47 Oscar locked final cost · DHS
            <br />
            08:05 Eve opened event brief · MTM
          </p>
        </SkeletonBlock>
      </div>

      {/* Reference & roadmap */}
      <div
        className={
          "mt-6 rounded-xl border border-wireline bg-card/40 p-5 " +
          (role && !role.pods.includes(4) ? "hidden" : "")
        }
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-pod-4">Platform · Reference &amp; Roadmap</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {WORKFLOW_STEPS.filter((s) => s.pod === 4).map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="whitespace-nowrap rounded-full border border-wireline px-3 py-1 font-mono text-[11px] text-pod-4 hover:border-pod-4"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Annotation n={1}>One row shows the Pod 1 journey as linked steps — this replaces the old page’s prose architecture map.</Annotation>
        <Annotation n={2}>Companions are visible everywhere; gates always land on a human, never autopilot.</Annotation>
      </div>
    </div>
  );
}
