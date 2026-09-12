import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, Search, Trophy } from "lucide-react";
import { money, wonProposals } from "@/lib/deals";

export const Route = createFileRoute("/_app/won-proposals")({
  head: () => ({
    meta: [
      { title: "Won Proposals — The Proposal Factory™" },
      { name: "description", content: "Proposals won in Pod 1, ready to be turned into events in Pod 2." },
      { property: "og:title", content: "Won Proposals — The Proposal Factory™" },
      { property: "og:description", content: "Proposals won in Pod 1, ready to be turned into events in Pod 2." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WonProposals,
});

/** Every Pod 1 proposal marked Won arrives here automatically — no re-entry. */
const WON = wonProposals();

function WonProposals() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return WON;
    return WON.filter((d) =>
      [d.name, d.agency, d.subClient, d.rfp, d.owner].some((v) => v.toLowerCase().includes(needle)),
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-2">
          Pod 2 · Events &amp; Experiential
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <Trophy className="h-5 w-5 text-pod-2" /> Won Proposals
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Proposals won in Pod 1. Choose one and create the event — its client, agency and budget carry into the event
          details form and then into the 48-step Event Creation Wizard.
        </p>
      </header>

      <div className="rounded-xl border border-pod-2/50 bg-pod-2/5 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-pod-2">Automatic handoff</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The moment a proposal is marked <span className="text-foreground">Won</span> in the Pod 1 pipeline, it lands
          in this list on its own. Nobody re-keys it. Filter the Pod 1 board or pipeline by{" "}
          <Link to="/pipeline" search={{ pod: 1 }} className="text-accent hover:underline">
            Won proposals
          </Link>{" "}
          to see the same rows, alongside Closed and Lost.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border border-wireline px-2 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search won proposals…"
            className="w-64 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {rows.length} won · sample data · no live systems connected
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-wireline">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-wireline font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Proposal</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Agency</th>
              <th className="px-4 py-3">Award value</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-wireline">
            {rows.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{d.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{d.rfp}</div>
                  <div className="mt-1 inline-block rounded-md border border-pod-1/40 bg-pod-1/10 px-1.5 py-0.5 font-mono text-[9px] text-pod-1">
                    Won in Pod 1 · auto-added
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.subClient}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.agency}</td>
                <td className="px-4 py-3 font-mono text-[10px]">{money(d.value)}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.owner}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/event-details"
                    search={{ proposal: d.id }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-mono text-[10px] font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> Create Event
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-mono text-[11px] text-muted-foreground">
                  No won proposals match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
