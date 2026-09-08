import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/qa-amendments")!;

export const Route = createFileRoute("/_app/qa-amendments")({
  head: () => ({
    meta: [
      { title: "Q&A / Amendments — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Q&A / Amendments — Clarifications & change control." },
      { property: "og:title", content: "Q&A / Amendments — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Q&A / Amendments — Clarifications & change control." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
