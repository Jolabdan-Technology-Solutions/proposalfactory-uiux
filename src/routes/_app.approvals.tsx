import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/approvals")!;

export const Route = createFileRoute("/_app/approvals")({
  head: () => ({
    meta: [
      { title: "Approval Queue — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back Office Governance: Approval Queue — Every gate, one queue." },
      { property: "og:title", content: "Approval Queue — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 3 · Back Office Governance: Approval Queue — Every gate, one queue." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
