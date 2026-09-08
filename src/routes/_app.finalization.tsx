import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/finalization")!;

export const Route = createFileRoute("/_app/finalization")({
  head: () => ({
    meta: [
      { title: "Finalization — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Finalization — Lock the volumes." },
      { property: "og:title", content: "Finalization — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Finalization — Lock the volumes." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
