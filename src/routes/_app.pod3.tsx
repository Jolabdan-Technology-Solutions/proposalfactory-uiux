import { createFileRoute } from "@tanstack/react-router";
import { PodHub } from "@/components/wireframe/pod-hub";

export const Route = createFileRoute("/_app/pod3")({
  head: () => ({
    meta: [
      { title: "Back-Office Governance Pod 3 — The Proposal Factory™" },
      { name: "description", content: "Pod 3 hub: approvals, audit, budget, documents, access and maturity." },
      { property: "og:title", content: "Back-Office Governance Pod 3 — The Proposal Factory™" },
      { property: "og:description", content: "Pod 3 hub: approvals, audit, budget, documents, access and maturity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <PodHub
      pod={3}
      name="Back-Office Governance"
      tagline="Approvals, audit, budget, documents, access, maturity"
      metrics={[
        { label: "Approvals pending", value: "5" },
        { label: "Audit events today", value: "214" },
        { label: "Budgets on baseline", value: "11" },
        { label: "Access reviews due", value: "2" },
      ]}
    />
  ),
});
