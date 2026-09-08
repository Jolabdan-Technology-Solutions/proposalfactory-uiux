import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/execution")!;

export const Route = createFileRoute("/_app/execution")({
  head: () => ({
    meta: [
      { title: "Execution — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Execution — Live event." },
      { property: "og:title", content: "Execution — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Execution — Live event." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
