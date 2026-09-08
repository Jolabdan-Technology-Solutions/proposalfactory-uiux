import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/roadmap")!;

export const Route = createFileRoute("/_app/roadmap")({
  head: () => ({
    meta: [
      { title: "Implementation Roadmap — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: Implementation Roadmap — 7 build phases." },
      { property: "og:title", content: "Implementation Roadmap — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: Implementation Roadmap — 7 build phases." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
