import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/production")!;

export const Route = createFileRoute("/_app/production")({
  head: () => ({
    meta: [
      { title: "Production Planning — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Production Planning — Budget, timeline, vendors." },
      { property: "og:title", content: "Production Planning — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Production Planning — Budget, timeline, vendors." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
