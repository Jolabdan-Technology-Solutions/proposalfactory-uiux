import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/reference")!;

export const Route = createFileRoute("/_app/reference")({
  head: () => ({
    meta: [
      { title: "Architecture Notes — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: Architecture Notes — Guiding principles + data dictionary." },
      { property: "og:title", content: "Architecture Notes — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: Architecture Notes — Guiding principles + data dictionary." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
