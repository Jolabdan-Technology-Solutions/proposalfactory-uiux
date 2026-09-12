import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gauge, Target, CheckCircle2, ShieldAlert } from "lucide-react";
import { Collapse } from "@/components/wireframe/collapse";
import {
  BANDS,
  SCORECARD_FACTORS,
  SCORE_STATES,
  bandCounts,
  bandFor,
  byVertical,
  funnelCounts,
  pipelineMath,
  valueCascade,
} from "@/lib/scorecard";
import { dealsForPod, money } from "@/lib/deals";

export const Route = createFileRoute("/_app/sales-engine")({
  component: SalesEngine,
  head: () => ({
    meta: [
      { title: "Sales Engine Command Center · Pod 1 · The Proposal Factory" },
      {
        name: "description",
        content:
          "ICP-filtered pipeline, the 5-state scoring flow and Mr. B2G's 4-band Go/No-Go recommendation across Pod 1 opportunities.",
      },
      { property: "og:title", content: "Sales Engine Command Center · The Proposal Factory" },
      {
        property: "og:description",
        content: "Fit scoring, win probability and the 4-band Go/No-Go recommendation for Pod 1.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Stat({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-wireline bg-card/40 p-4">
      <Icon className="h-4 w-4 text-accent" />
      <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function SalesEngine() {
  const deals = useMemo(() => dealsForPod(1), []);
  const [band, setBand] = useState<string>("all");

  const funnel = funnelCounts(deals);
  const bands = bandCounts(deals);
  const math = pipelineMath(deals);
  const cascade = valueCascade(deals);
  const verticals = byVertical(deals);

  const highFit = deals.filter((d) => d.score >= 80);
  const readyToBid = deals.filter((d) => bandFor(d.score).id === "strong_go");
  const blocked = deals.filter((d) => d.subClient === "Unassigned");

  const rows = (band === "all" ? deals : deals.filter((d) => bandFor(d.score).id === band))
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-1">
          Pod 1 · Analytics &amp; command center · Steps 1–18
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Sales Engine Command Center</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          ICP-filtered pipeline, sorted by fit, with Mr. B2G&rsquo;s four-band Go/No-Go
          recommendation. Sample data — no live scoring service is connected.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Gauge}
          label="Scored"
          value={`${math.scored}/${deals.length}`}
          note="Opportunities with Sales Engine context"
        />
        <Stat
          icon={Target}
          label="High fit"
          value={String(highFit.length)}
          note={`${money(highFit.reduce((s, d) => s + d.value, 0))} pipeline (fit ≥ 80)`}
        />
        <Stat
          icon={CheckCircle2}
          label="Ready to bid"
          value={String(readyToBid.length)}
          note={`${money(readyToBid.reduce((s, d) => s + d.value, 0))} · Strong Go band`}
        />
        <Stat
          icon={ShieldAlert}
          label="Blocked"
          value={String(blocked.length)}
          note={blocked.length ? "No sub-client match on file yet" : "None — no eligibility gaps"}
        />
      </section>

      {/* 5-state scoring flow */}
      <section>
        <h2 className="text-sm font-bold">5-state scoring flow · Steps 1–18</h2>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Each state implies the states before it
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {SCORE_STATES.map((s) => (
            <div key={s.id} className="rounded-xl border border-wireline bg-card/40 p-3">
              <p className="text-2xl font-extrabold tracking-tight">{funnel[s.id]}</p>
              <p className="mt-1 text-sm font-semibold">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 bands */}
      <section>
        <h2 className="text-sm font-bold">Distribution across Mr. B2G&rsquo;s 4 bands</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBand(band === b.id ? "all" : b.id)}
              className={`rounded-xl border p-4 text-left transition-colors hover:border-accent ${
                band === b.id ? "border-accent bg-accent/5" : "border-wireline bg-card/40"
              }`}
            >
              <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] ${b.tone}`}>
                {b.code}
              </span>
              <p className="mt-3 text-2xl font-extrabold tracking-tight">{bands[b.id]}</p>
              <p className="mt-1 text-sm font-semibold">
                {b.label} · score {b.min === 0 ? `under ${b.max + 1}` : `${b.min}–${b.max}`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{b.meaning}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {b.action}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Top by fit */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold">
            Top 10 by strategic fit{band === "all" ? "" : ` · ${bandFor(BANDS.find((b) => b.id === band)!.min).label}`}
          </h2>
          {band !== "all" && (
            <button
              type="button"
              onClick={() => setBand("all")}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              Clear band filter
            </button>
          )}
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <div className="min-w-[54rem]">
            <div className="grid grid-cols-[1.8fr_1.2fr_0.7fr_0.5fr_0.5fr_1fr] gap-2 border-b border-border bg-secondary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Opportunity</span>
              <span>Agency</span>
              <span>Value</span>
              <span>Fit</span>
              <span>Prob</span>
              <span>Band</span>
            </div>
            {rows.map((d) => {
              const b = bandFor(d.score);
              return (
                <div
                  key={d.id}
                  className="grid grid-cols-[1.8fr_1.2fr_0.7fr_0.5fr_0.5fr_1fr] items-center gap-2 border-b border-border px-4 py-2.5 text-xs last:border-0 hover:bg-secondary/30"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{d.name}</span>
                    <span className="block truncate font-mono text-[10px] text-muted-foreground">
                      NAICS {d.naics} · {d.rfp}
                    </span>
                  </span>
                  <span className="truncate text-muted-foreground">{d.agency}</span>
                  <span className="font-mono text-[10px]">{money(d.value)}</span>
                  <span className="font-mono text-[10px] text-accent">{d.score}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{d.score}%</span>
                  <span className={`truncate rounded-md border px-2 py-0.5 font-mono text-[10px] ${b.tone}`}>
                    {b.label}
                  </span>
                </div>
              );
            })}
            {rows.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No opportunities in this band right now.
              </p>
            )}
          </div>
        </div>
      </section>

      <Collapse
        title="Pipeline value cascade"
        summary="Per-opportunity waterfall · addressable share × win probability · each tier implies the next"
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Total possible", value: money(math.totalPossible), note: "Sum of estimated price" },
              { label: "Qualified value", value: money(math.qualified), note: "Σ price × addressable share" },
              {
                label: "Expected wins",
                value: money(math.expected),
                note: `Σ qualified × win probability · avg ${(math.avgProb * 100).toFixed(1)}%`,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-wireline p-3">
                <p className="text-xl font-extrabold tracking-tight">{s.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {cascade.map((t) => (
              <div
                key={t.label}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-wireline px-3 py-2 text-xs"
              >
                <span className="font-semibold">{t.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {money(t.value)} · {t.rows} opportunities
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2 pr-3">Vertical</th>
                  <th className="pb-2 pr-3">Opps</th>
                  <th className="pb-2 pr-3">Scored / baseline</th>
                  <th className="pb-2 pr-3">Qualified</th>
                  <th className="pb-2 pr-3">Expected wins</th>
                  <th className="pb-2">Avg prob</th>
                </tr>
              </thead>
              <tbody>
                {verticals.map((v) => (
                  <tr key={v.vertical} className="border-t border-wireline">
                    <td className="py-2 pr-3 font-semibold">{v.vertical}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{v.opps}</td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {v.scored} / {v.baseline}
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{money(v.qualified)}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{money(v.expected)}</td>
                    <td className="py-2 text-muted-foreground">{(v.avgProb * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Baselines used when Go/No-Go has not scored an opportunity — Federal 15%, SLED 25%.
            Addressable share is resolved against the certifications on file.
          </p>
        </div>
      </Collapse>

      <Collapse
        title="The 10-factor Go/No-Go scorecard"
        summary="Runs at Step 15 against opportunity metadata and stores a win probability on the row"
      >
        <div className="space-y-1.5">
          {SCORECARD_FACTORS.map((f) => (
            <div
              key={f.n}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-wireline px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold">
                  {f.n}. {f.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.asks}</p>
              </div>
              <span className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                weight {f.weight}
              </span>
            </div>
          ))}
          <p className="pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Strong Go or Conditional Go offers &ldquo;Bid on this&rdquo; · Hold / Shape shows the
            conditions for go first
          </p>
        </div>
      </Collapse>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/pipeline"
          search={{ pod: 1 }}
          className="rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20"
        >
          Open the pipeline
        </Link>
        <Link
          to="/bid-decision"
          className="rounded-md border border-wireline px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
        >
          Go to the bid decision gate
        </Link>
      </div>
    </div>
  );
}
