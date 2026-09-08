import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/post-submit")!;

export const Route = createFileRoute("/_app/post-submit")({
  head: () => ({
    meta: [
      { title: "Post-Submit — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 1 · Proposal Factory: Post-Submit — Track, orals, negotiate." },
      { property: "og:title", content: "Post-Submit — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 1 · Proposal Factory: Post-Submit — Track, orals, negotiate." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PhaseScreen step={step} />,
});
