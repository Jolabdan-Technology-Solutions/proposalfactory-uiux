import { cn } from "@/lib/utils";
import type { Kpi, PlatformScreenData, Row, Tone } from "@/lib/platform-analytics";

/**
 * One light, standard analytics layout shared by every Platform screen:
 * headline numbers → one trend → one table → short notes.
 */

const TONE: Record<Tone, string> = {
  ok: "border-pod-2/60 bg-pod-2/10 text-pod-2",
  warn: "border-accent/60 bg-accent/10 text-accent",
  risk: "border-destructive/60 bg-destructive/10 text-destructive",
  muted: "border-wireline bg-secondary/60 text-muted-foreground",
};

export function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest", TONE[tone])}>
      {label}
    </span>
  );
}

export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-xl border border-wireline bg-card/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
          <p className="mt-2 text-2xl font-semibold">{k.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
        </div>
      ))}
    </section>
  );
}

export function TrendBars({ label, unit, points }: PlatformScreenData["trend"]) {
  const max = Math.max(...points.map((p) => p.v), 1);
  return (
    <section className="rounded-xl border border-wireline p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">last 8 weeks · {unit}</p>
      </div>
      <div className="mt-4 flex h-32 items-end gap-2">
        {points.map((p) => (
          <div key={p.x} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">{p.v}</span>
            <div
              className="w-full rounded-t bg-accent/70 transition-colors hover:bg-accent"
              style={{ height: `${Math.max(6, (p.v / max) * 100)}%` }}
              title={`${p.x} · ${p.v} ${unit}`}
            />
            <span className="font-mono text-[10px] text-muted-foreground">{p.x}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DataTable({ title, columns, rows }: { title: string; columns: string[]; rows: Row[] }) {
  return (
    <section className="rounded-xl border border-wireline">
      <div className="border-b border-wireline px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wireline text-left">
              {columns.map((c) => (
                <th key={c} className="whitespace-nowrap px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c}
                </th>
              ))}
              <th className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cells.join("|")} className="border-b border-wireline/60 last:border-0 transition-colors hover:bg-sidebar-accent/40">
                {r.cells.map((cell, i) => (
                  <td key={i} className={cn("px-5 py-3 align-middle", i === 0 ? "font-medium" : "text-muted-foreground")}>
                    {cell}
                  </td>
                ))}
                <td className="px-5 py-3">{r.status && <StatusPill {...r.status} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PlatformScreen({ data }: { data: PlatformScreenData }) {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{data.section}</div>
        <h1 className="mt-2 text-2xl font-semibold">{data.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{data.blurb}</p>
      </header>

      <KpiRow items={data.kpis} />
      <TrendBars {...data.trend} />
      <DataTable {...data.table} />

      <section className="rounded-xl border border-wireline p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">How to read this</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {data.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-accent">·</span>
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] text-muted-foreground">Sample data · no live systems connected</p>
      </section>
    </div>
  );
}
