import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/maturity")!;

export const Route = createFileRoute("/_app/maturity")({
  head: () => ({
    meta: [
      { title: "Maturity Model — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back Office Governance: Maturity Model — Crawl → Walk → Run → Autonomous." },
      { property: "og:title", content: "Maturity Model — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 3 · Back Office Governance: Maturity Model — Crawl → Walk → Run → Autonomous." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
