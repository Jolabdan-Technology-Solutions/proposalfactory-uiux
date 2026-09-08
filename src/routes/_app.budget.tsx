import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/budget")!;

export const Route = createFileRoute("/_app/budget")({
  head: () => ({
    meta: [
      { title: "Budget Guardrails — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back Office Governance: Budget Guardrails — Margin protection." },
      { property: "og:title", content: "Budget Guardrails — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 3 · Back Office Governance: Budget Guardrails — Margin protection." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
