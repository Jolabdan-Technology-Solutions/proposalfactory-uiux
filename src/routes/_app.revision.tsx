import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/revision")!;

export const Route = createFileRoute("/_app/revision")({
  head: () => ({
    meta: [
      { title: "Revision Cycle — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Revision Cycle — Color-team reviews." },
      { property: "og:title", content: "Revision Cycle — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Revision Cycle — Color-team reviews." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
