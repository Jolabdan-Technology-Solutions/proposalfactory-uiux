import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/event-intake")!;

export const Route = createFileRoute("/_app/event-intake")({
  head: () => ({
    meta: [
      { title: "Intake & Concept — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Intake & Concept — Brief to concept." },
      { property: "og:title", content: "Intake & Concept — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Intake & Concept — Brief to concept." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
