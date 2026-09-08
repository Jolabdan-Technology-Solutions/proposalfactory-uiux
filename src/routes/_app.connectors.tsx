import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/connectors")!;

export const Route = createFileRoute("/_app/connectors")({
  head: () => ({
    meta: [
      { title: "MCP / Integration Gateway — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: MCP / Integration Gateway — 16 connector families." },
      { property: "og:title", content: "MCP / Integration Gateway — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: MCP / Integration Gateway — 16 connector families." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
