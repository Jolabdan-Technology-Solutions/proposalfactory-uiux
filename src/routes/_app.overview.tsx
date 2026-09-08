import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/overview")!;

export const Route = createFileRoute("/_app/overview")({
  head: () => ({
    meta: [
      { title: "Executive Overview — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: Executive Overview — Two layers, one philosophy." },
      { property: "og:title", content: "Executive Overview — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: Executive Overview — Two layers, one philosophy." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
