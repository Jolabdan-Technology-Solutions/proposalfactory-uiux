import { createFileRoute } from "@tanstack/react-router";
import { PhaseScreen } from "@/components/wireframe/phase-screen";
import { WORKFLOW_STEPS } from "@/lib/workflow";
import { LeadFlowStrip } from "@/components/wireframe/lead-flow-strip";
import { IntegrationStrip } from "@/components/wireframe/integration-strip";

const step = WORKFLOW_STEPS.find((s) => s.path === "/connectors")!;

export const Route = createFileRoute("/_app/connectors")({
  head: () => ({
    meta: [
      { title: "MCP / Integration Gateway — The Proposal Factory™ Wireframe" },
      { name: "description", content: "Platform · Reference & Roadmap: MCP / Integration Gateway — 16 connector families." },
      { property: "og:title", content: "MCP / Integration Gateway — The Proposal Factory™ Wireframe" },
      { property: "og:description", content: "Platform · Reference & Roadmap: MCP / Integration Gateway — 16 connector families." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ConnectorsPage,
});

function ConnectorsPage() {
  return (
    <div>
      <PhaseScreen step={step} />
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-bold">How the outside tools are actually used</h2>
        <p className="max-w-2xl text-xs text-muted-foreground">
          Zoho CRM holds the buyer relationship, Asana holds the human work, QuickBooks holds the
          money and the platform holds the opportunity itself. The same opportunity ID travels
          across all of them — records are created at three gates, never re-created.
        </p>
        <LeadFlowStrip />
        <IntegrationStrip pod={1} />
        <IntegrationStrip pod={2} />
        <IntegrationStrip pod={3} />
      </section>
    </div>
  );
}
