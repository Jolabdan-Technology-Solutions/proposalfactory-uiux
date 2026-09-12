import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/discovery")!;

export const Route = createFileRoute("/_app/discovery")({
  head: () => ({
    meta: [
      { title: "Pipeline / Discovery Steps 1–6 — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: steps 1 to 6 of the 70-step process — scan, import, dedupe, match, summarise and triage opportunities." },
      { property: "og:title", content: "Pipeline / Discovery Steps 1–6 — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: steps 1 to 6 of the 70-step process — scan, import, dedupe, match, summarise and triage opportunities." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
