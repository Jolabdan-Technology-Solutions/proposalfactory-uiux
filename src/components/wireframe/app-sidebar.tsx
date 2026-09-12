import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Briefcase,
  Grid2X2,
  Users,
  BookOpen,
  Map,
  Plug,
  Rocket,
  ClipboardList,
  KeyRound,
  ScrollText,
  Sparkles,
  ChevronDown,
  FilePlus2,
  Archive,
  PencilLine,
  Search,
  Cpu,
  Gauge,
  TrendingUp,
  ShieldCheck,
  Bug,
  BarChart3,
  Scale,
  LineChart,
  Inbox,
  Settings,
  ArrowRightLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logo from "@/assets/tpf-logo.png";
import { useActiveRole } from "@/hooks/use-role";
import { WORKFLOW_STEPS } from "@/lib/workflow";

type Item = {
  title: string;
  url: string;
  icon: typeof FileText;
  badge?: string;
  pod?: 1 | 2 | 3 | 4;
  search?: Record<string, string>;
};

const MAIN: Item[] = [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }];

const PODS: Item[] = [
  { title: "Pod 1", url: "/pod1", icon: FileText, badge: "Proposal", pod: 1 },
  { title: "Pod 2", url: "/pod2", icon: CalendarDays, badge: "Events", pod: 2 },
  { title: "Pod 3", url: "/pod3", icon: Briefcase, badge: "Back-office", pod: 3 },
  { title: "All Pods", url: "/goals", icon: Grid2X2 },
];

// Work items shown only while the user is inside a given pod, so the
// sidebar always reflects where they are.
const POD_WORK: Record<1 | 2 | 3, Item[]> = {
  1: [
    { title: "Pod 1 Dashboard", url: "/pod1", icon: LayoutDashboard },
    { title: "Opportunities", url: "/opportunities", icon: Grid2X2 },
    { title: "Pipeline Discovery", url: "/pipeline", icon: Search },
    { title: "Sales Engine", url: "/sales-engine", icon: Gauge },
    { title: "Bulk Edit", url: "/bulk-edit", icon: PencilLine },
    { title: "Compliance Check", url: "/compliance", icon: ClipboardList },
    { title: "Awaiting Award", url: "/award", icon: Sparkles },
    { title: "Activity by User", url: "/activity", icon: ScrollText },
  ],
  2: [
    { title: "Pod 2 Dashboard", url: "/pod2", icon: LayoutDashboard },
    { title: "Won Proposals", url: "/won-proposals", icon: FileText },
    { title: "Handoff Dashboard", url: "/event-handoffs", icon: ArrowRightLeft },
    { title: "New Event", url: "/event-details", icon: FilePlus2 },
    { title: "Event Plan", url: "/event-wizard", icon: ClipboardList },
    { title: "Event Intake", url: "/event-intake", icon: Inbox },
    { title: "Venue & Pitch", url: "/venue-pitch", icon: Map },
    { title: "Production", url: "/production", icon: Cpu },
    { title: "Comms & Registration", url: "/comms-registration", icon: CalendarDays },
    { title: "Execution", url: "/execution", icon: Rocket },
    { title: "Closeout", url: "/closeout", icon: Archive },
  ],
  3: [
    { title: "Pod 3 Dashboard", url: "/pod3", icon: LayoutDashboard },
    { title: "Governance Queue", url: "/approvals", icon: ClipboardList },
    { title: "Audit Trail", url: "/audit", icon: ScrollText },
    { title: "Budget", url: "/budget", icon: BarChart3 },
    { title: "Documents", url: "/documents", icon: BookOpen },
    { title: "Access & RBAC", url: "/access", icon: KeyRound },
    { title: "Handoff Checklist", url: "/handoffs", icon: ScrollText },
    { title: "Agent Maturity", url: "/maturity", icon: TrendingUp },

  ],
};

const POD_LABEL: Record<1 | 2 | 3, string> = {
  1: "Pod 1 · Proposal",
  2: "Pod 2 · Events",
  3: "Pod 3 · Back Office",
};


const COMPANION: Record<1 | 2 | 3, { name: string; blurb: string }> = {
  1: { name: "Sylvia", blurb: "Proposal companion" },
  2: { name: "Eve", blurb: "Events companion" },
  3: { name: "Oscar", blurb: "Back-office companion" },
};

// Pages that belong to a pod but are not named /podN.
const PATH_POD: Record<string, 1 | 2 | 3> = {
  "/opportunities": 1,
  "/pipeline": 1,
  "/sales-engine": 1,
  "/activity": 1,
  "/bulk-edit": 1,
  "/proposals": 1,
  "/subclient-mapping": 3,
  "/handoffs": 3,

  "/won-proposals": 2,
  "/event-handoffs": 2,
  "/event-details": 2,
  "/event-wizard": 2,
};

/** Pod 2's own back office, mirroring Pod 3's governance queue structure. */
const POD2_BACK_OFFICE: Item[] = [
  { title: "Event Approval Queue", url: "/event-ops/approval-queue", icon: ClipboardList },
  { title: "Event Audit Trail", url: "/event-ops/audit-trail", icon: ScrollText },
  { title: "Event Budget", url: "/event-ops/budget", icon: BarChart3 },
  { title: "Vendors & Contracts", url: "/event-ops/vendors", icon: Users },
  { title: "Event Documents", url: "/event-ops/documents", icon: BookOpen },
];

function podForPath(pathname: string): 1 | 2 | 3 | undefined {
  if (pathname.startsWith("/pod1")) return 1;
  if (pathname.startsWith("/pod2")) return 2;
  if (pathname.startsWith("/pod3")) return 3;
  if (pathname.startsWith("/event-ops")) return 2;
  if (PATH_POD[pathname]) return PATH_POD[pathname];
  const step = WORKFLOW_STEPS.find((s) => s.path === pathname);
  if (step && (step.pod === 1 || step.pod === 2 || step.pod === 3)) return step.pod;
  return undefined;
}

const COMPANY: Item[] = [
  { title: "Pipeline Discovery", url: "/pipeline", icon: Search, pod: 1 },
  { title: "Sub-Clients", url: "/sub-clients", icon: Users },
  
  { title: "Capability Statement", url: "/reference", icon: BookOpen },
];

const PROPOSALS: Item[] = [
  { title: "Drafts", url: "/proposals", icon: PencilLine, search: { tab: "drafts" } },
  { title: "Archived", url: "/proposals", icon: Archive, search: { tab: "archived" } },
  { title: "New Proposals", url: "/proposals", icon: FilePlus2, search: { tab: "new" } },
];

const PLATFORM: Item[] = [
  { title: "AI Operations", url: "/platform/ai-operations", icon: Cpu },
  { title: "Agent Evaluation", url: "/platform/agent-evaluation", icon: Gauge },
  { title: "Agent Maturity", url: "/maturity", icon: TrendingUp },
  { title: "Approval Queue", url: "/approvals", icon: ClipboardList },
  { title: "Safety Dashboard", url: "/platform/safety-dashboard", icon: ShieldCheck },
  { title: "Red-Team Queue", url: "/platform/red-team-queue", icon: Bug },
  { title: "AI Governance", url: "/platform/ai-governance", icon: Scale },
  { title: "Integration Sync", url: "/connectors", icon: Plug },
  { title: "Analytics", url: "/platform/analytics", icon: LineChart },
];

const ACCOUNT: Item[] = [
  { title: "Memberships", url: "/account/memberships", icon: Users },
  { title: "Pending Approvals", url: "/account/pending-approvals", icon: ClipboardList },
  { title: "Intake Submissions", url: "/account/intake-submissions", icon: Inbox },
  { title: "Settings", url: "/account/settings", icon: Settings },
  { title: "Integrations", url: "/connectors", icon: Plug },
  { title: "User Guide", url: "/help", icon: BookOpen },

];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role = useActiveRole();

  const pods = PODS.filter((i) => !role || !i.pod || role.pods.includes(i.pod));
  const showPlatform = !role || role.pods.includes(4);
  const activePod = podForPath(pathname);
  const companion = activePod
    ? COMPANION[activePod]
    : { name: "Sylvia", blurb: "Proposal companion" };

  const menu = (items: Item[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title + item.url}>
          <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
            <Link
              to={item.url}
              {...(item.search ? { search: item.search as never } : {})}
              className="flex items-center gap-2"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate text-xs">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  const section = (label: string, items: Item[]) => (
    <SidebarGroup key={label}>
      {!collapsed && (
        <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>{menu(items)}</SidebarGroupContent>
    </SidebarGroup>
  );

  const collapsibleSection = (label: string, items: Item[], defaultOpen = false) => (
    <Collapsible key={label} defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        {!collapsed && (
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="flex w-full items-center font-mono text-[10px] uppercase tracking-widest">
              {label}
              <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
        )}
        <CollapsibleContent>
          <SidebarGroupContent>{menu(items)}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="block px-2 py-2">
          {collapsed ? (
            <img
              src={logo}
              alt="The Proposal Factory"
              className="mx-auto h-9 w-9 object-contain"
            />
          ) : (
            <img
              src={logo}
              alt="The Proposal Factory"
              className="w-full object-contain"
              style={{ maxHeight: "128px" }}
            />
          )}
          {!collapsed && (
            <span className="mt-1 block text-center text-xs font-extrabold leading-tight tracking-tight">
              The Proposal Factory™
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {section("Dashboard", MAIN)}
        {section("Pods", pods)}
        {activePod && collapsibleSection(POD_LABEL[activePod], POD_WORK[activePod], true)}
        {activePod === 2 && collapsibleSection("Pod 2 · Back Office", POD2_BACK_OFFICE, true)}
        {(!activePod || activePod === 1 || activePod === 3) &&
          collapsibleSection(
            "Company",
            activePod === 3
              ? [
                  { title: "Governance Queue", url: "/approvals", icon: ClipboardList },
                  ...COMPANY.filter((i) => i.url !== "/pipeline"),
                ]
              : COMPANY,
            true,
          )}
        {(!activePod || activePod === 1) && collapsibleSection("Proposals", PROPOSALS, true)}
        {showPlatform && collapsibleSection("Platform", PLATFORM)}
        {collapsibleSection("Account", ACCOUNT)}
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            AI Assistant
          </p>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={`Ask ${companion.name}`}>
              <Link to="/help" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                {!collapsed && (
                  <span className="flex flex-col leading-tight">
                    <span className="text-xs">{companion.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {companion.blurb}
                    </span>
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
