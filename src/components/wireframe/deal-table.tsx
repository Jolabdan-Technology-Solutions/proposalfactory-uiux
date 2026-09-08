import { Link } from "@tanstack/react-router";
import type { Deal, PodId } from "@/lib/deals";
import { POD_COPY, STAGE_LABELS, money } from "@/lib/deals";

/** Shared read-only table of pipeline deals used by the filter bar and pipeline page. */
export function DealTable({
  deals,
  limit,
  pod = 1,
}: {
  deals: Deal[];
  limit?: number;
  pod?: PodId;
}) {
  const rows = limit ? deals.slice(0, limit) : deals;
  const copy = POD_COPY[pod];

  if (deals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wireline px-4 py-10 text-center">
        <p className="text-sm font-semibold">No {copy.items} match these filters</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Widen a filter or clear them to see everything
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div className="min-w-[62rem]">
        <div className="grid grid-cols-[1.7fr_1.2fr_1fr_0.9fr_0.6fr_0.6fr_1fr] items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>{copy.item === "opportunity" ? "Opportunity" : copy.item === "event" ? "Event" : "Item"}</span>
          <span>{copy.counterparty}</span>
          <span>Sub-client</span>
          <span>Set-aside</span>
          <span>Due</span>
          <span>{copy.fit}</span>
          <span>Stage</span>
        </div>
        {rows.map((d) => (
          <div
            key={d.id}
            className="grid grid-cols-[1.7fr_1.2fr_1fr_0.9fr_0.6fr_0.6fr_1fr] items-center gap-2 border-b border-border px-4 py-2.5 text-xs last:border-0 hover:bg-secondary/30"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{d.name}</span>
              <span className="block truncate font-mono text-[10px] text-muted-foreground">
                {d.rfp} · {money(d.value)}
              </span>
            </span>
            <span className="truncate text-muted-foreground">{d.agency}</span>
            <span className="truncate text-muted-foreground">{d.subClient}</span>
            <span className="truncate font-mono text-[10px] text-muted-foreground">{d.setAside}</span>
            <span className="font-mono text-[10px]">{d.due} Oct</span>
            <span
              className={
                "font-mono text-[10px] " + (d.score >= 70 ? "text-accent" : "text-muted-foreground")
              }
            >
              {d.score}
            </span>
            <span className="truncate rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
              {STAGE_LABELS[d.stage]}
            </span>
          </div>
        ))}
        {limit && deals.length > rows.length && (
          <div className="border-t border-dashed border-wireline px-4 py-2.5 text-center">
            <Link
              to="/pipeline"
              search={{ pod }}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              View all {deals.length} matching {copy.items} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
