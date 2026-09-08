import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/closeout")!;

export const Route = createFileRoute("/_app/closeout")({
  head: () => ({
    meta: [
      { title: "Closeout — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Closeout — Impact & feedback loop." },
      { property: "og:title", content: "Closeout — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Closeout — Impact & feedback loop." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
