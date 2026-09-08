import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/shaping")!;

export const Route = createFileRoute("/_app/shaping")({
  head: () => ({
    meta: [
      { title: "Pre-Solicitation Shaping — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Pre-Solicitation Shaping — Capture research." },
      { property: "og:title", content: "Pre-Solicitation Shaping — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Pre-Solicitation Shaping — Capture research." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
