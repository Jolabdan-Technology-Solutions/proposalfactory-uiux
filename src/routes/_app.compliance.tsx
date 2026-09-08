import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/compliance")!;

export const Route = createFileRoute("/_app/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance / Strategy — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Compliance / Strategy — Matrix + win themes." },
      { property: "og:title", content: "Compliance / Strategy — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Compliance / Strategy — Matrix + win themes." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
