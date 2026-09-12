import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKFLOW_STEPS } from "@/lib/workflow";

/**
 * A consistent trail on every screen: Dashboard › Pod › This page,
 * plus a Back control, so nobody has to hunt for the browser buttons.
 */

type PodId = 0 | 1 | 2 | 3 | 4;

const POD_HOME: Record<number, { label: string; path: string }> = {
  1: { label: "Pod 1 · Proposal Factory", path: "/pod1" },
  2: { label: "Pod 2 · Events & Experiential", path: "/pod2" },
  3: { label: "Pod 3 · Back-Office Governance", path: "/pod3" },
  4: { label: "Reference", path: "/overview" },
};

/** Pages that are not workflow phase screens still need a name and a home pod. */
const EXTRA_PAGES: Record<string, { label: string; pod: PodId }> = {
  "/goals": { label: "What do you want to do?", pod: 0 },
  "/pod1": { label: "Pod 1 · Proposal Factory", pod: 1 },
  "/pod2": { label: "Pod 2 · Events & Experiential", pod: 2 },
  "/pod3": { label: "Pod 3 · Back-Office Governance", pod: 3 },
  "/opportunities": { label: "Opportunities", pod: 1 },
  "/won-proposals": { label: "Won Proposals", pod: 2 },
  "/event-handoffs": { label: "Handoff dashboard", pod: 2 },
  "/event-ops/approval-queue": { label: "Event Approval Queue", pod: 2 },
  "/event-ops/audit-trail": { label: "Event Audit Trail", pod: 2 },
  "/event-ops/budget": { label: "Event Budget", pod: 2 },
  "/event-ops/vendors": { label: "Vendors & Contracts", pod: 2 },
  "/event-ops/documents": { label: "Event Documents", pod: 2 },
  "/event-details": { label: "Event details", pod: 2 },
  "/event-wizard": { label: "Event Creation Wizard", pod: 2 },
  "/pipeline": { label: "Pipeline / Discovery", pod: 1 },
  "/sales-engine": { label: "Sales Engine Command Center", pod: 1 },
  "/activity": { label: "Activity by User", pod: 1 },
  "/discovery": { label: "Pipeline / Discovery · Steps 1–6", pod: 1 },
  "/bulk-edit": { label: "Bulk Edit / Remap", pod: 1 },
  "/proposals": { label: "Proposals", pod: 1 },
  "/intake": { label: "RFP Intake", pod: 1 },
  "/intake/review": { label: "Intake review", pod: 1 },
  "/sub-clients": { label: "Sub-Clients", pod: 3 },
  "/subclient-mapping": { label: "Sub-Client Mapping", pod: 3 },
  "/documents": { label: "Document Library", pod: 3 },
  "/approvals": { label: "Approvals", pod: 3 },
  "/audit": { label: "Audit Trail", pod: 3 },
  "/budget": { label: "Budget Guardrails", pod: 3 },
  "/access": { label: "Access & RBAC", pod: 3 },
  "/handoffs": { label: "Handoff Checklist", pod: 3 },
  "/maturity": { label: "Maturity Dial", pod: 3 },

  "/overview": { label: "Overview", pod: 4 },
  "/master-map": { label: "Master Map", pod: 4 },
  "/connectors": { label: "Connectors", pod: 4 },
  "/roadmap": { label: "Roadmap", pod: 4 },
  "/reference": { label: "Reference", pod: 4 },
  "/help": { label: "Ask Sylvia", pod: 0 },
  "/platform/ai-operations": { label: "AI Operations", pod: 4 },
  "/platform/agent-evaluation": { label: "Agent Evaluation", pod: 4 },
  "/platform/safety-dashboard": { label: "Safety Dashboard", pod: 4 },
  "/platform/red-team-queue": { label: "Red-Team Queue", pod: 4 },
  "/platform/ai-governance": { label: "AI Governance", pod: 4 },
  "/platform/analytics": { label: "Analytics", pod: 4 },
};

export function crumbsFor(pathname: string) {
  const step = WORKFLOW_STEPS.find((s) => s.path === pathname);
  const extra = EXTRA_PAGES[pathname]
    ?? (pathname.startsWith("/sub-clients/") ? { label: "Sub-Client Profile", pod: 3 as PodId } : undefined);
  const label = step?.label ?? extra?.label;
  if (!label) return null;

  const pod = (extra?.pod ?? step?.pod ?? 0) as PodId;
  const trail: { label: string; path: string }[] = [{ label: "Dashboard", path: "/dashboard" }];

  const home = POD_HOME[pod];
  if (home && home.path !== pathname) trail.push(home);

  return { trail, label };
}

export function PageCrumbs({ className }: { className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = crumbsFor(pathname);
  if (!crumbs) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1 rounded-md border border-wireline px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <ChevronLeft className="h-3 w-3" />
        Back
      </button>

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.trail.map((c) => (
          <span key={c.path} className="flex items-center gap-1.5">
            <Link
              to={c.path}
              className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-accent"
            >
              {c.path === "/dashboard" && <Home className="h-3 w-3" />}
              {c.label}
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          </span>
        ))}
        <span className="font-mono text-[10px] font-semibold text-foreground">{crumbs.label}</span>
      </nav>
    </div>
  );
}
