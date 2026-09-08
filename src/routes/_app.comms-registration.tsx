import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/comms-registration")!;

export const Route = createFileRoute("/_app/comms-registration")({
  head: () => ({
    meta: [
      { title: "Comms & Registration — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Comms & Registration — Audience launch." },
      { property: "og:title", content: "Comms & Registration — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Comms & Registration — Audience launch." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
