import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Pencil, Search } from "lucide-react";
import { DEALS, optionsForPod, type Deal } from "@/lib/deals";
import { CompanionBubble } from "@/components/wireframe/primitives";

const OPTIONS = optionsForPod(1);
const SUB_CLIENTS = OPTIONS.subClients.filter((s) => s !== "Unassigned");
const POD1 = DEALS.filter((d) => d.pod === 1);

/** Sample corpus figures — this wireframe loads a slice, not the whole pool. */
const TOTAL_MATCHING = 32721;

type Mapping = { primary: string | null; matched: string[] };

function initialMapping(d: Deal): Mapping {
  return { primary: d.subClient === "Unassigned" ? null : d.subClient, matched: [] };
}

const NO_CHANGE = "__none__";

function BulkEdit() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [maps, setMaps] = useState<Record<string, Mapping>>(() =>
    Object.fromEntries(POD1.map((d) => [d.id, initialMapping(d)])),
  );
  const [selected, setSelected] = useState<string[]>(POD1.map((d) => d.id));

  const [assignPrimary, setAssignPrimary] = useState(NO_CHANGE);
  const [addSecondary, setAddSecondary] = useState(NO_CHANGE);
  const [unassignMatched, setUnassignMatched] = useState(NO_CHANGE);
  const [clearPrimary, setClearPrimary] = useState(false);
  const [unassignAll, setUnassignAll] = useState(false);

  const loaded = POD1.length;
  const remaining = TOTAL_MATCHING - loaded;

  const rows = useMemo(
    () =>
      POD1.filter((d) =>
        q
          ? `${d.name} ${d.agency} ${d.source} ${d.rfp}`.toLowerCase().includes(q.toLowerCase())
          : true,
      ),
    [q],
  );

  const isUnmapped = (id: string) => {
    const m = maps[id];
    return !m?.primary && (m?.matched.length ?? 0) === 0;
  };
  const unmappedIds = POD1.filter((d) => isUnmapped(d.id)).map((d) => d.id);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const hasAction =
    assignPrimary !== NO_CHANGE ||
    addSecondary !== NO_CHANGE ||
    unassignMatched !== NO_CHANGE ||
    clearPrimary ||
    unassignAll;

  function apply() {
    if (!hasAction || selected.length === 0) return;
    setMaps((prev) => {
      const next = { ...prev };
      for (const id of selected) {
        const cur = next[id] ?? { primary: null, matched: [] };
        let primary = cur.primary;
        let matched = [...cur.matched];
        if (unassignAll) {
          primary = null;
          matched = [];
        }
        if (clearPrimary) primary = null;
        if (unassignMatched !== NO_CHANGE) matched = matched.filter((m) => m !== unassignMatched);
        if (assignPrimary !== NO_CHANGE) primary = assignPrimary;
        if (addSecondary !== NO_CHANGE && !matched.includes(addSecondary))
          matched = [...matched, addSecondary];
        next[id] = { primary, matched };
      }
      return next;
    });
  }

  return (
    <div>
      <header className="mb-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
          Pod 1 · Proposal Factory
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <Pencil className="h-5 w-5 text-accent" /> Bulk Edit / Remap
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Working with <strong className="text-foreground">{loaded} loaded</strong> of{" "}
          <strong className="text-foreground">{TOTAL_MATCHING.toLocaleString()} matching</strong>{" "}
          opportunities (current board filters — not the full corpus).{" "}
          {remaining.toLocaleString()} more match the filter but are not loaded yet — use{" "}
          <strong className="text-foreground">Load 500 more / Load all</strong> on the board, then
          reopen Bulk Edit.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          <strong className="text-foreground">Unmapped</strong> means no primary pin{" "}
          <em>and</em> no matched sub-clients. Tip: run{" "}
          <strong className="text-foreground">Analyze Pipeline</strong> first for auto-matches, then
          use Bulk Edit for corrections.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sample data · no live feeds connected
        </p>
      </header>

      {/* Assign / unassign controls */}
      <div className="mb-4 rounded-xl border border-border bg-secondary/20 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium">Assign primary sub-client</span>
            <select
              value={assignPrimary}
              onChange={(e) => setAssignPrimary(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={NO_CHANGE}>— No change —</option>
              {SUB_CLIENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium">Also add matched (secondary) sub-clients</span>
            <select
              value={addSecondary}
              onChange={(e) => setAddSecondary(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={NO_CHANGE}>— None —</option>
              {SUB_CLIENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-medium">Unassign matched sub-clients</span>
            <select
              value={unassignMatched}
              onChange={(e) => setUnassignMatched(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={NO_CHANGE}>— None —</option>
              {SUB_CLIENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={clearPrimary}
              onChange={(e) => setClearPrimary(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Clear primary pin only
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={unassignAll}
              onChange={(e) => setUnassignAll(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Unassign all matches (primary + secondary)
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search loaded by title, agency, or source…"
          className="w-full rounded-lg border border-border bg-background/60 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Selection summary */}
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>
          <strong className="text-foreground">{selected.length}</strong> selected of {loaded} loaded
        </span>
        <span>·</span>
        <button
          type="button"
          onClick={() => setSelected(POD1.map((d) => d.id))}
          className="text-accent hover:underline"
        >
          Select loaded ({loaded})
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => setSelected(unmappedIds)}
          className="text-accent hover:underline"
        >
          Select unmapped ({unmappedIds.length})
        </button>
        <span>·</span>
        <button type="button" onClick={() => setSelected([])} className="hover:underline">
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="max-h-[26rem] overflow-y-auto rounded-xl border border-border">
        <table className="w-full min-w-[40rem] text-left">
          <thead className="sticky top-0 bg-secondary/60 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <tr>
              <th className="w-10 px-3 py-2.5"></th>
              <th className="px-3 py-2.5">Opportunity</th>
              <th className="px-3 py-2.5">Matches (click name for full detail)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const m = maps[d.id] ?? { primary: null, matched: [] };
              const isSel = selected.includes(d.id);
              return (
                <tr
                  key={d.id}
                  className={
                    "border-t border-border align-top " +
                    (isSel ? "bg-accent/5" : "hover:bg-secondary/30")
                  }
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(d.id)}
                      aria-label={`Select ${d.name}`}
                      className="size-4 accent-[var(--accent)]"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {d.agency} · {d.source}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    {!m.primary && m.matched.length === 0 ? (
                      <span className="text-sm text-accent">Unmapped</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {m.primary && (
                          <span className="rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 text-[11px] text-accent">
                            {m.primary} · primary
                          </span>
                        )}
                        {m.matched.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-wireline px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nothing matches that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer actions */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-wireline pt-3">
        <p className="text-xs text-accent">
          {hasAction
            ? `Ready to apply to ${selected.length} selected.`
            : "Choose assign / unassign action above, then Apply."}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={!hasAction || selected.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" /> Apply to {selected.length} selected
          </button>
        </div>
      </div>

      <div className="mt-6">
        <CompanionBubble pod={1}>
          {"\u201C"}Pin one primary sub-client per opportunity and add secondary matches where more
          than one capability fits — I keep the mapping trail for the audit log.{"\u201D"}
        </CompanionBubble>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/bulk-edit")({
  head: () => ({
    meta: [
      { title: "Bulk Edit / Remap — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Assign and unassign primary and secondary sub-clients across many opportunities at once.",
      },
      { property: "og:title", content: "Bulk Edit / Remap — The Proposal Factory™" },
      {
        property: "og:description",
        content:
          "Assign and unassign primary and secondary sub-clients across many opportunities at once.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BulkEdit,
});
