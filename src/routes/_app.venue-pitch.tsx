import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/venue-pitch")!;

export const Route = createFileRoute("/_app/venue-pitch")({
  head: () => ({
    meta: [
      { title: "Venue & Pitch — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 2 · Events & Experiential: Venue & Pitch — Where + the pitch." },
      { property: "og:title", content: "Venue & Pitch — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 2 · Events & Experiential: Venue & Pitch — Where + the pitch." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
