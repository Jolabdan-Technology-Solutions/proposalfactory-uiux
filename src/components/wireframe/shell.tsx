import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WORKFLOW_STEPS, stepIndex } from "@/lib/workflow";
import { useActiveRole } from "@/hooks/use-role";
import { clearActiveRole } from "@/lib/roles";
import { clearActiveAccount } from "@/lib/accounts";
import { useActiveAccount } from "@/hooks/use-account";
import { useActiveGoal } from "@/hooks/use-goal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/wireframe/app-sidebar";
import { JourneyBreadcrumb, partForStep } from "@/components/wireframe/journey-header";
import { GlobalFilters } from "@/components/wireframe/global-filters";
import { PageCrumbs } from "@/components/wireframe/page-crumbs";


const POD_TABS = [
  { label: "Dashboard", path: "/dashboard", pod: 0 },
  { label: "Pod 1 · Proposal", path: "/pod1", pod: 1 },
  { label: "Pod 2 · Events", path: "/event-intake", pod: 2 },
  { label: "Pod 3 · Governance", path: "/approvals", pod: 3 },
  { label: "Reference", path: "/overview", pod: 4 },
];

export function WireframeShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role = useActiveRole();
  const account = useActiveAccount();
  const navigate = useNavigate();
  const tabs = role ? POD_TABS.filter((t) => t.pod === 0 || role.pods.includes(t.pod as 1)) : POD_TABS;
  const goal = useActiveGoal();
  const idx = stepIndex(pathname);
  const current = idx >= 0 ? WORKFLOW_STEPS[idx] : null;

  // Inside a chosen task, navigation and progress follow that task only.
  const gPos = goal ? goal.steps.indexOf(pathname) : -1;
  const gNextPath = goal && gPos >= 0 ? goal.steps[gPos + 1] : undefined;

  const next = gPos >= 0
    ? (gNextPath ? WORKFLOW_STEPS.find((s) => s.path === gNextPath) ?? null : null)
    : idx >= 0 && idx < WORKFLOW_STEPS.length - 1
      ? WORKFLOW_STEPS[idx + 1]
      : null;


  // No sidebar on the landing screens after login — pod selection only.
  const showSidebar = pathname !== "/dashboard" && pathname !== "/goals";

  // Title shown in the top bar reflects the pod the user is actually working in.
  const podOfPath =
    pathname.startsWith("/pod1") ? 1 : pathname.startsWith("/pod2") ? 2 : pathname.startsWith("/pod3") ? 3 : undefined;
  const activePod = podOfPath ?? current?.pod;
  const POD_TITLES: Record<number, string> = {
    1: "Pod 1 · Proposal Factory",
    2: "Pod 2 · Events & Experiential",
    3: "Pod 3 · Back-Office Governance",
    4: "Reference",
  };
  const pageTitle = activePod ? POD_TITLES[activePod] : "The Proposal Factory™";


  // The global filter bar lives on the pod dashboards. The main dashboard has
  // nothing to filter, and directory pages ship their own scoped filter panel.
  const showGlobalFilters =
    pathname === "/pod1" || pathname === "/pod2" || pathname === "/pod3";

  // Plain library/directory pages: no step numbering, no prev/next step nav.
  const hideStepNav =
    pathname === "/documents" ||
    pathname === "/subclient-mapping" ||
    pathname === "/won-proposals" ||
    pathname === "/event-details" ||
    pathname === "/event-wizard" ||
    pathname.startsWith("/sub-clients");

  // Pod 1 pages that are not phase screens still get the numbered journey breadcrumb.
  // Directory pages that belong to other pods (e.g. /subclient-mapping is Pod 3) must not
  // inherit the Pod 1 journey numbering.
  const POD1_SATELLITES: Record<string, number | undefined> = {
    "/pod1": undefined,
    "/opportunities": 1,
    "/intake": 2,
  };
  const isPod1Phase = current?.pod === 1 && (current.steps?.length ?? 0) > 0;
  const showBreadcrumb =
    !isPod1Phase && Object.prototype.hasOwnProperty.call(POD1_SATELLITES, pathname);
  const breadcrumbPart = showBreadcrumb
    ? POD1_SATELLITES[pathname] ?? partForStep(current?.steps?.[0]?.n)?.n
    : undefined;

  const body = (
    <div className="min-h-screen flex-1 bg-background text-foreground">
      <div className="sticky top-0 z-10 border-b border-wireline bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
          {showSidebar && <SidebarTrigger className="shrink-0" />}
          <Link to="/dashboard" className="shrink-0 text-sm font-extrabold tracking-tight">
            {pageTitle}
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto rounded-lg bg-secondary/40 p-1">
            {tabs.map((t) => (
              <Link
                key={t.path}
                to={t.path}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  (current?.pod === t.pod && t.pod !== 0) || pathname === t.path
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {role && (
              <span className="flex items-center gap-2 rounded-full border border-wireline px-3 py-1 font-mono text-[10px] text-muted-foreground">
                <span className="text-accent">{role.name}</span>
                {account && account.roles.length > 1 && (
                  <Link to="/roles" className="hover:text-foreground">
                    switch role
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    clearActiveRole();
                    clearActiveAccount();
                    navigate({ to: "/" });
                  }}
                  className="hover:text-foreground"
                >
                  sign out
                </button>
              </span>
            )}
            {!hideStepNav && gPos < 0 && current && idx > 0 && (
              <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                {idx + 1}/{WORKFLOW_STEPS.length}
              </span>
            )}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>


            {!hideStepNav && !isPod1Phase && next && (
              <Link
                to={next.path}
                className="rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90"
              >
                Next → {next.label}
              </Link>
            )}
          </div>
        </div>

        {goal && gPos >= 0 && (
          <div className="border-t border-wireline">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {goal.title}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {current ? current.label : ""}
              </span>
              <div
                className="h-1.5 min-w-[140px] flex-1 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuenow={gPos + 1}
                aria-valuemin={1}
                aria-valuemax={goal.steps.length}
                aria-label={`${goal.title} progress`}
              >
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${((gPos + 1) / goal.steps.length) * 100}%` }}
                />
              </div>
              <Link
                to="/goals"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Change task
              </Link>
            </div>
          </div>
        )}
      </div>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {pathname !== "/dashboard" && <PageCrumbs className="mb-5" />}
        {showBreadcrumb && <JourneyBreadcrumb activePart={breadcrumbPart} className="mb-6" />}

        {showGlobalFilters && (
          <GlobalFilters className="mb-6" pod={pathname === "/pod2" ? 2 : pathname === "/pod3" ? 3 : 1} />
        )}
        {children}
      </main>
    </div>
  );

  if (!showSidebar) return body;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        {body}
      </div>
    </SidebarProvider>
  );
}
