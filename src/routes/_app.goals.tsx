import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { GOALS, setActiveGoal } from "@/lib/goals";
import { useActiveRole } from "@/hooks/use-role";
import { WORKFLOW_STEPS, POD_NAMES, COMPANIONS } from "@/lib/workflow";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({
    meta: [
      { title: "Choose a pod — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Pick the pod you are working in — Proposal Factory, Events & Experiential, or Back Office Governance — then choose the task you want to accomplish.",
      },
      { property: "og:title", content: "Choose a pod, then a task" },
      {
        property: "og:description",
        content: "Work is grouped by pod so you only see the steps that task needs.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GoalChooser,
});

const labelFor = (path: string) =>
  WORKFLOW_STEPS.find((s) => s.path === path)?.label ?? path.replace("/", "");

const PODS: Array<{ pod: 1 | 2 | 3 | 4; name: string; blurb: string }> = [
  { pod: 1, name: "Pod 1 · Proposal Factory", blurb: "Capture to award — 12 phases, 70 steps." },
  { pod: 2, name: "Pod 2 · Events & Experiential", blurb: "Brief to close-out — 8 phases, 48 steps." },
  { pod: 3, name: "Pod 3 · Back Office Governance", blurb: "Approvals, audit, budget, access, maturity." },
  { pod: 4, name: "Reference & Roadmap", blurb: "How the platform fits together." },
];

const POD_DASHBOARDS = {
  1: "/pod1",
  2: "/pod2",
  3: "/pod3",
} as const;

function GoalChooser() {
  const navigate = useNavigate();
  const role = useActiveRole();
  const [pod, setPod] = useState<1 | 2 | 3 | 4 | null>(null);

  const pods = PODS.filter(
    (p) => (!role || role.pods.includes(p.pod)) && GOALS.some((g) => g.pods.includes(p.pod)),
  );
  const goals = pod ? GOALS.filter((g) => g.pods.includes(pod)) : [];

  return (
    <div>
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {role ? `${role.name} · start here` : "Start here"}
          {pod ? ` · ${POD_NAMES[pod]}` : ""}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          {pod ? "What do you want to do in this pod?" : "Which pod are you working in?"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {pod
            ? "Pick one task. You'll only see the steps that task needs, with a progress bar showing how far along you are."
            : "Everything is grouped under a pod. Choose the pod first, then the task inside it."}
        </p>
        <div className="mt-4 border-b border-wireline" />
      </header>

      {!pod && (
        <div className="grid gap-4 md:grid-cols-2">
          {pods.map((p) => (
            <button
              key={p.pod}
              type="button"
              onClick={() => {
                if (p.pod !== 4) {
                  navigate({ to: POD_DASHBOARDS[p.pod] });
                  return;
                }
                setPod(p.pod);
              }}
              className="group rounded-2xl border border-wireline bg-card/50 p-6 text-left transition-colors hover:border-accent"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{p.name}</p>
                {p.pod !== 4 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-wireline font-mono text-xs font-semibold text-accent">
                    {COMPANIONS[p.pod as 1 | 2 | 3].initial}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {GOALS.filter((g) => g.pods.includes(p.pod)).length} tasks
              </p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                Open{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      )}

      {pod && (
        <>
          <button
            type="button"
            onClick={() => setPod(null)}
            className="mb-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All pods
          </button>
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setActiveGoal(g.id);
                  navigate({ to: g.steps[0]! });
                }}
                className="group rounded-2xl border border-wireline bg-card/50 p-6 text-left transition-colors hover:border-accent"
              >
                <p className="text-lg font-bold">{g.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.blurb}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {g.steps.length} steps · starts at {labelFor(g.steps[0]!)}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Start{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
