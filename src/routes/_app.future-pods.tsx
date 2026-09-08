import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/future-pods")!;

export const Route = createFileRoute("/_app/future-pods")({
  head: () => ({
    meta: [
      { title: "Future Pods — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: Future Pods — 9 marketing + 8 industry families." },
      { property: "og:title", content: "Future Pods — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: Future Pods — 9 marketing + 8 industry families." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
