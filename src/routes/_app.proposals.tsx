import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, FilePlus2, FileText, PencilLine } from "lucide-react";
import { CompanionBubble } from "@/components/wireframe/primitives";

type Tab = "drafts" | "archived" | "new";

const TABS: { id: Tab; label: string; icon: typeof FileText; hint: string }[] = [
  { id: "drafts", label: "Drafts", icon: PencilLine, hint: "Proposals being written right now." },
  { id: "archived", label: "Archived", icon: Archive, hint: "Submitted, lost or withdrawn — kept for reference." },
  { id: "new", label: "New Proposals", icon: FilePlus2, hint: "Opportunities cleared to start a proposal." },
];

const ROWS: Record<Tab, { name: string; ref: string; owner: string; when: string; state: string }[]> = {
  drafts: [
    { name: "Navy IT Modernization", ref: "N00178-25-R-0042", owner: "Julie", when: "Edited today", state: "Volume 1 in review" },
    { name: "VA Clinic Staffing", ref: "36C24825R0037", owner: "Reggie", when: "Edited yesterday", state: "Pricing pending" },
    { name: "Army Training Support", ref: "W9124-26-R-0003", owner: "Julie", when: "2 days ago", state: "Compliance matrix open" },
  ],
  archived: [
    { name: "GSA Facilities Support", ref: "47QRAA-25-R-0088", owner: "Julie", when: "12 Aug 2026", state: "Submitted · no award yet" },
    { name: "State DOT Signage", ref: "SLED-2025-114", owner: "Reggie", when: "4 Aug 2026", state: "No-go · archived" },
    { name: "City of Atlanta Events", ref: "COA-2026-EV-07", owner: "Delano", when: "22 Jul 2026", state: "Won · closed out" },
  ],
  new: [
    { name: "DHS Campus Security", ref: "70RTAC-25-R-0011", owner: "Unassigned", when: "Go decision 3 Sep", state: "Ready to start" },
    { name: "Tribal Utility Modernization", ref: "TRB-2026-019", owner: "Unassigned", when: "Go decision 1 Sep", state: "Ready to start" },
  ],
};

function Proposals() {
  const { tab = "drafts" } = Route.useSearch();
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]!;
  const rows = ROWS[active.id];

  return (
    <div>
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
          Pod 1 · Proposal Factory
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Proposals</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Everything being written, everything finished, and the opportunities cleared to start.
        </p>
        <div className="mt-4 border-b border-dashed border-wireline" />
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.id}
            to="/proposals"
            search={{ tab: t.id }}
            className={
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors " +
              (t.id === active.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </Link>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-bold">
        {active.label} <span className="font-mono text-[10px] font-normal text-muted-foreground">· {rows.length} items</span>
      </h2>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {active.hint}
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        {rows.map((r) => (
          <div
            key={r.ref}
            className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 text-xs last:border-0 hover:bg-secondary/30"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-[14rem] flex-1">
              <p className="font-semibold">{r.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{r.ref}</p>
            </div>
            <span className="text-muted-foreground">{r.owner}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{r.when}</span>
            <span className="rounded-full border border-dashed border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {r.state}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <CompanionBubble pod={1}>
          {"\u201C"}Drafts are live work. Archived keeps the trail. New proposals are the ones the
          go / no-go already cleared.{"\u201D"}
        </CompanionBubble>
        <Link to="/pod1" className="inline-block font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
          ← Back to Pod 1
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/proposals")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const t = search["tab"];
    return { tab: t === "archived" ? "archived" : t === "new" ? "new" : "drafts" };
  },
  head: () => ({
    meta: [
      { title: "Proposals — Drafts, Archived & New — The Proposal Factory™" },
      { name: "description", content: "Proposal drafts in progress, archived submissions, and opportunities cleared to start a new proposal." },
      { property: "og:title", content: "Proposals — Drafts, Archived & New — The Proposal Factory™" },
      { property: "og:description", content: "Drafts, archived submissions and new proposals in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Proposals,
});
