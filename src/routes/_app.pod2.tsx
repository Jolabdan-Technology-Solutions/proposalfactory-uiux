import { createFileRoute } from "@tanstack/react-router";
import { PodHub } from "@/components/wireframe/pod-hub";

export const Route = createFileRoute("/_app/pod2")({
  head: () => ({
    meta: [
      { title: "Events & Experiential Pod 2 — The Proposal Factory™" },
      { name: "description", content: "Pod 2 hub: event intake, venue, production, comms, talent, execution and closeout." },
      { property: "og:title", content: "Events & Experiential Pod 2 — The Proposal Factory™" },
      { property: "og:description", content: "Pod 2 hub: event intake, venue, production, comms, talent, execution and closeout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PodHub
      pod={2}
      name="Events & Experiential"
      tagline="Brief to closeout"
      metrics={[
        { label: "Events in flight", value: "3" },
        { label: "Concepts awaiting approval", value: "1" },
        { label: "Sponsors signed", value: "7" },
        { label: "Gates pending", value: "2" },
      ]}
    />
  ),
});
