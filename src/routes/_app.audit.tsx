import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/audit")!;

export const Route = createFileRoute("/_app/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back Office Governance: Audit Trail — Immutable record." },
      { property: "og:title", content: "Audit Trail — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 3 · Back Office Governance: Audit Trail — Immutable record." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
