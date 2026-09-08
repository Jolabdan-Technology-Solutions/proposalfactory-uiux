import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/tech-cost")!;

export const Route = createFileRoute("/_app/tech-cost")({
  head: () => ({
    meta: [
      { title: "Technical / Cost Build — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Technical / Cost Build — First full draft." },
      { property: "og:title", content: "Technical / Cost Build — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Technical / Cost Build — First full draft." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
