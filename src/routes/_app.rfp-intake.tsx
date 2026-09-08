import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/rfp-intake")!;

export const Route = createFileRoute("/_app/rfp-intake")({
  head: () => ({
    meta: [
      { title: "RFP Intake — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: RFP Intake — Parse the solicitation." },
      { property: "og:title", content: "RFP Intake — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: RFP Intake — Parse the solicitation." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
