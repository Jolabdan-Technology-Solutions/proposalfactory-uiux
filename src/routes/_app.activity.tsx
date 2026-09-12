import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

type Entry = {
  user: string;
  role: string;
  action: string;
  target: string;
  when: string;
};

const ACTIVITY: Entry[] = [
  { user: "Sub-Tenant Administrator", role: "Super Administrator", action: "Approved Go/No-Go", target: "DOT-2026-114 Transit Signage", when: "Today · 3:42 PM" },
  { user: "BD User Coles", role: "Sub-Tenant User", action: "Logged a client meeting", target: "CivicPath Partners", when: "Today · 2:10 PM" },
  { user: "Super Administrator", role: "Super Administrator", action: "Re-ran pipeline analysis", target: "48 new opportunities", when: "Today · 1:05 PM" },
  { user: "Marcus Lee", role: "Proposal Manager", action: "Uploaded RFP package", target: "HHS-2026-771 Outreach", when: "Yesterday · 5:28 PM" },
  { user: "Ana Ruiz", role: "Reviewer", action: "Requested changes", target: "Technical volume draft v3", when: "Yesterday · 4:02 PM" },
  { user: "Sub-Tenant Administrator", role: "Super Administrator", action: "Mapped sub-client", target: "Atlas Defense Group → 6 opportunities", when: "Yesterday · 11:47 AM" },
  { user: "Marcus Lee", role: "Proposal Manager", action: "Locked submission package", target: "GSA-2026-208 Facilities", when: "Sep 9 · 6:15 PM" },
  { user: "BD User Coles", role: "Sub-Tenant User", action: "Flagged opportunity for review", target: "State of GA · Fleet Services", when: "Sep 9 · 9:31 AM" },
  { user: "Ana Ruiz", role: "Reviewer", action: "Approved pink team review", target: "Northstar Health Solutions", when: "Sep 8 · 3:20 PM" },
  { user: "Super Administrator", role: "Super Administrator", action: "Removed duplicate rows", target: "12 duplicate groups", when: "Sep 8 · 10:04 AM" },
];

function ActivityByUser() {
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = needle
      ? ACTIVITY.filter((a) =>
          [a.user, a.role, a.action, a.target].some((v) => v.toLowerCase().includes(needle)),
        )
      : ACTIVITY;
    const map = new Map<string, Entry[]>();
    rows.forEach((r) => {
      const list = map.get(r.user) ?? [];
      list.push(r);
      map.set(r.user, list);
    });
    return [...map.entries()];
  }, [q]);

  return (
    <div>
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
          Pod 1 · Proposal Factory
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Activity by User</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Who did what across Pod 1, grouped by person. Sample data — no live feeds connected.
        </p>
        <div className="mt-4 border-b border-wireline" />
      </header>

      <div className="mb-5 flex items-center gap-2 rounded-md border border-wireline px-3 py-2">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people, roles or actions…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-4">
        {grouped.map(([user, rows]) => (
          <section key={user} className="rounded-xl border border-wireline bg-card/40">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wireline px-4 py-3">
              <p className="text-sm font-bold">{user}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {rows[0]?.role} · {rows.length} update{rows.length > 1 ? "s" : ""}
              </p>
            </div>
            <ol className="divide-y divide-dashed divide-wireline">
              {rows.map((r, i) => (
                <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5">
                  <span className="text-xs font-medium">{r.action}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {r.target}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.when}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
        {grouped.length === 0 && (
          <p className="rounded-xl border border-wireline p-8 text-center font-mono text-[11px] text-muted-foreground">
            No activity matches that search.
          </p>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/activity")({
  head: () => ({
    meta: [
      { title: "Activity by User — The Proposal Factory™" },
      { name: "description", content: "Pod 1 activity feed grouped by user: approvals, uploads, mappings and reviews." },
      { property: "og:title", content: "Activity by User — The Proposal Factory™" },
      { property: "og:description", content: "Pod 1 activity feed grouped by user: approvals, uploads, mappings and reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ActivityByUser,
});
