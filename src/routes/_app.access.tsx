import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const step = WORKFLOW_STEPS.find((s) => s.path === "/access")!;

export const Route = createFileRoute("/_app/access")({
  head: () => ({
    meta: [
      { title: "Access & RBAC — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Pod 3 · Back Office Governance: Access & RBAC — Tenant isolation." },
      { property: "og:title", content: "Access & RBAC — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Pod 3 · Back Office Governance: Access & RBAC — Tenant isolation." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <div>
      <Link
        to="/subclient-mapping"
        className="mb-5 inline-flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm font-bold text-accent transition-opacity hover:opacity-80"
      >
        View sub-client mapping
        <ArrowRight className="h-4 w-4" />
      </Link>
      <PhaseScreen step={step} showGuidance={false} />
    </div>
  ),
});
