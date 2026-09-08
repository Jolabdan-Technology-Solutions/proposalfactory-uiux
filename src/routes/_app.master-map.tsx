import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/master-map")!;

export const Route = createFileRoute("/_app/master-map")({
  head: () => ({
    meta: [
      { title: "Cross-Pod Master Map — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: Cross-Pod Master Map — 17 orchestration moments." },
      { property: "og:title", content: "Cross-Pod Master Map — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: Cross-Pod Master Map — 17 orchestration moments." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
