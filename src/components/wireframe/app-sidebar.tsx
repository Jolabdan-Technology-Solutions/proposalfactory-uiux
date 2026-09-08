import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Briefcase,
  Grid2X2,
  Users,
  BookOpen,
  Route as RouteIcon,
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

const COMPANY: Item[] = [
  { title: "Sub-Clients", url: "/subclient-mapping", icon: Users },
  { title: "Capability Statement", url: "/reference", icon: BookOpen },
  { title: "B2G Journey", url: "/master-map", icon: RouteIcon },
];

const PROPOSALS: Item[] = [
  { title: "Drafts", url: "/proposals", icon: PencilLine, search: { tab: "drafts" } },
  { title: "Archived", url: "/proposals", icon: Archive, search: { tab: "archived" } },
  { title: "New Proposals", url: "/proposals", icon: FilePlus2, search: { tab: "new" } },
];

const PLATFORM: Item[] = [
  { title: "Master Map", url: "/master-map", icon: Map },
  { title: "Connectors", url: "/connectors", icon: Plug },
  { title: "Future Pods", url: "/future-pods", icon: Rocket },
  { title: "Roadmap", url: "/roadmap", icon: ClipboardList },
];

const ACCOUNT: Item[] = [
  { title: "Access", url: "/access", icon: KeyRound },
  { title: "Audit Trail", url: "/audit", icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role = useActiveRole();

  const pods = PODS.filter((i) => !role || !i.pod || role.pods.includes(i.pod));
  const showPlatform = !role || role.pods.includes(4);

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
                    <span className="ml-auto rounded-full border border-dashed border-wireline px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
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
        <Link to="/dashboard" className="flex items-center gap-2 px-1 py-2">
          <img
            src={logo}
            alt="The Proposal Factory"
            className={collapsed ? "h-8 w-8 object-contain" : "h-12 w-12 object-contain"}
          />
          {!collapsed && <span className="text-xs font-extrabold leading-tight">The Proposal Factory™</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {section("Dashboard", MAIN)}
        {section("Pods", pods)}
        {section("Company", COMPANY)}
        {collapsibleSection("Proposals", PROPOSALS, true)}
        {showPlatform && collapsibleSection("Platform", PLATFORM)}
        {collapsibleSection("Account", ACCOUNT)}
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            AI Assistants
          </p>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ask Sylvia">
              <Link to="/help" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                {!collapsed && <span className="text-xs">Sylvia</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
