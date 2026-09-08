import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Pencil, RotateCcw, Save, Search, X } from "lucide-react";
import {
  DEALS,
  STAGE_LABELS,
  money,
  optionsForPod,
  type Deal,
} from "@/lib/deals";
import { CompanionBubble } from "@/components/wireframe/primitives";

const OPTIONS = optionsForPod(1);
const POD1 = DEALS.filter((d) => d.pod === 1);

type FieldKey = "subClient" | "setAside" | "status" | "owner" | "vertical";

const FIELDS: { key: FieldKey; label: string; options: string[] }[] = [
  { key: "subClient", label: "Sub-client", options: OPTIONS.subClients },
  { key: "setAside", label: "Set-aside", options: OPTIONS.setAsides },
  { key: "status", label: "Status", options: OPTIONS.statuses },
  { key: "owner", label: "Owner", options: OPTIONS.owners },
  { key: "vertical", label: "Vertical", options: OPTIONS.verticals },
];

type Override = Partial<Record<FieldKey, string>>;

function valueOf(d: Deal, key: FieldKey, ov: Override | undefined): string {
  if (ov?.[key]) return ov[key]!;
  if (key === "status") return STAGE_LABELS[d.stage];
  return d[key];
}

function BulkEdit() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [field, setField] = useState<FieldKey>("subClient");
  const [value, setValue] = useState<string>(OPTIONS.subClients[0] ?? "");
  const [edits, setEdits] = useState<Record<string, Override>>({});

  const rows = useMemo(
    () =>
      POD1.filter((d) =>
        q ? `${d.name} ${d.agency} ${d.rfp} ${d.subClient}`.toLowerCase().includes(q.toLowerCase()) : true,
      ),
    [q],
  );

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const changedCount = Object.keys(edits).length;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () =>
    setSelected(allSelected ? [] : rows.map((r) => r.id));

  function apply() {
    if (selected.length === 0) return;
    setEdits((prev) => {
      const next = { ...prev };
      for (const id of selected) next[id] = { ...next[id], [field]: value };
      return next;
    });
  }

  function reset() {
    setEdits({});
    setSelected([]);
  }

  const fieldDef = FIELDS.find((f) => f.key === field)!;

  return (
    <div>
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
          Pod 1 · Proposal Factory
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Bulk Edit</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Select opportunities, pick one field, set the new value and apply it to everything you
          selected. Nothing is saved until you press Save changes.
        </p>
        <div className="mt-4 border-b border-dashed border-wireline" />
      </header>

      {/* Bulk action bar */}
      <div className="sticky top-16 z-10 mb-4 rounded-xl border border-border bg-card/80 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-[10px] text-accent">
            {selected.length} selected
          </span>
          <select
            value={field}
            onChange={(e) => {
              const k = e.target.value as FieldKey;
              setField(k);
              setValue(FIELDS.find((f) => f.key === k)?.options[0] ?? "");
            }}
            className="rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {FIELDS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-w-[14rem] rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {fieldDef.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={apply}
            disabled={selected.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 font-mono text-[11px] font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Pencil className="h-3.5 w-3.5" /> Apply to selected
          </button>
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search opportunities…"
              className="w-56 rounded-md border border-border bg-background/60 py-2 pl-8 pr-3 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
        {changedCount > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-dashed border-wireline pt-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {changedCount} row{changedCount > 1 ? "s" : ""} changed · not saved
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 font-mono text-[10px] font-semibold text-accent-foreground"
            >
              <Save className="h-3.5 w-3.5" /> Save changes
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-wireline px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:border-accent hover:text-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Discard
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[52rem] text-left">
          <thead className="bg-secondary/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-3 py-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="px-3 py-2">Opportunity</th>
              <th className="px-3 py-2">Sub-client</th>
              <th className="px-3 py-2">Set-aside</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const ov = edits[d.id];
              const isSel = selected.includes(d.id);
              return (
                <tr
                  key={d.id}
                  className={
                    "border-t border-border text-xs " + (isSel ? "bg-accent/5" : "hover:bg-secondary/30")
                  }
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(d.id)}
                      aria-label={`Select ${d.name}`}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold">{d.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{d.rfp}</p>
                  </td>
                  {(["subClient", "setAside", "status", "owner"] as FieldKey[]).map((k) => (
                    <td key={k} className="px-3 py-2.5">
                      <span className={ov?.[k] ? "text-accent" : ""}>{valueOf(d, k, ov)}</span>
                      {ov?.[k] && <Check className="ml-1 inline h-3 w-3 text-accent" />}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">
                    {money(d.value)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nothing matches that search.
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-accent"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4">
        <CompanionBubble pod={1}>
          {"\u201C"}Re-map in batches: filter to the rows that went to the wrong sub-client, select
          them all, set the right one, save once.{"\u201D"}
        </CompanionBubble>
        <div className="flex flex-wrap gap-3">
          <Link to="/subclient-mapping" className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
            ← Back to sub-client mapping
          </Link>
          <Link to="/pod1" className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
            ← Back to Pod 1
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/bulk-edit")({
  head: () => ({
    meta: [
      { title: "Bulk Edit Opportunities — The Proposal Factory™" },
      { name: "description", content: "Select many opportunities and update sub-client, set-aside, status or owner in one action." },
      { property: "og:title", content: "Bulk Edit Opportunities — The Proposal Factory™" },
      { property: "og:description", content: "Re-map or update many opportunities at once." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BulkEdit,
});
