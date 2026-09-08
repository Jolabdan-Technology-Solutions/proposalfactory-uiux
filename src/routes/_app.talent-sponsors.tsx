import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/talent-sponsors")!;

export const Route = createFileRoute("/_app/talent-sponsors")({
  head: () => ({
    meta: [
      { title: "Talent / Sponsors / Activation — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Talent / Sponsors / Activation — Commercial layer." },
      { property: "og:title", content: "Talent / Sponsors / Activation — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Talent / Sponsors / Activation — Commercial layer." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
