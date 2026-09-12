import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Trophy } from "lucide-react";
import { money, wonProposals, type Deal } from "@/lib/deals";

export const Route = createFileRoute("/_app/event-handoffs")({
  head: () => ({
    meta: [
      { title: "Pod 2 Handoff Dashboard — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Track won proposals moving from Pod 1 into Pod 2 event delivery, stage by stage on a status timeline.",
      },
      { property: "og:title", content: "Pod 2 Handoff Dashboard — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Won proposals arriving in Pod 2, with a timeline for each handoff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventHandoffs,
});

/** The journey a win takes from Pod 1 award into Pod 2 delivery. */
const TIMELINE = [
  { key: "won", label: "Won in Pod 1", note: "Award recorded against the proposal." },
  { key: "logged", label: "Logged by Pod 3", note: "Handoff written to the audit trail." },
  { key: "received", label: "Received in Pod 2", note: "Appears automatically in Won Proposals." },
  { key: "brief", label: "Event brief created", note: "Brief pre-filled from the proposal." },
  { key: "kickoff", label: "Kickoff scheduled", note: "Delivery team and dates confirmed." },
] as const;

const WON = wonProposals();

/** Deterministic starting point so the sample dashboard is not all identical. */
const startIndex = (d: Deal, i: number) => Math.min(TIMELINE.length - 1, 2 + (i % 3) - (d.score > 80 ? 0 : 1));

function EventHandoffs() {
  const [progress, setProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(WON.map((d, i) => [d.id, Math.max(1, startIndex(d, i))])),
  );

  const advance = (d: Deal) =>
    setProgress((p) => ({ ...p, [d.id]: Math.min(TIMELINE.length - 1, (p[d.id] ?? 0) + 1) }));

  const summary = useMemo(() => {
    const done = WON.filter((d) => (progress[d.id] ?? 0) === TIMELINE.length - 1).length;
    const value = WON.reduce((s, d) => s + d.value, 0);
    return { total: WON.length, done, inFlight: WON.length - done, value };
  }, [progress]);

  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-2">
          Pod 2 · Events &amp; Experiential
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <Trophy className="h-6 w-6 text-accent" />
          Handoff dashboard
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Proposals won in Pod 1 arrive here automatically. Each one shows how far the handover has
          got — click the next point on its timeline to move it along.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sample data · no live systems connected
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Won proposals", value: String(summary.total) },
          { label: "Handover in flight", value: String(summary.inFlight) },
          { label: "Ready for kickoff", value: String(summary.done) },
          { label: "Total value", value: money(summary.value) },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-wireline p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-1 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {WON.map((d) => {
          const at = progress[d.id] ?? 0;
          const complete = at === TIMELINE.length - 1;
          return (
            <article key={d.id} className="rounded-lg border border-wireline p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{d.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{d.agency}</span>
                    <span>·</span>
                    <span>{d.subClient}</span>
                    <span>·</span>
                    <span>{money(d.value)}</span>
                    <span>·</span>
                    <span>Owner {d.owner}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    complete ? "border-pod-2/60 text-pod-2" : "border-accent/60 text-accent"
                  }`}
                >
                  {complete ? "Ready for kickoff" : (TIMELINE[at]?.label ?? "Won in Pod 1")}
                </span>
              </div>

              <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                {TIMELINE.map((t, i) => {
                  const done = i <= at;
                  const isNext = i === at + 1;
                  return (
                    <li key={t.key}>
                      <button
                        type="button"
                        disabled={!isNext}
                        onClick={() => advance(d)}
                        className={`w-full rounded-md border p-3 text-left transition-colors ${
                          done
                            ? "border-pod-2/60"
                            : isNext
                              ? "border-accent/60 hover:bg-sidebar-accent"
                              : "border-wireline opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                              done ? "border-pod-2 text-pod-2" : "border-wireline text-muted-foreground"
                            }`}
                          >
                            {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
                          </span>
                          <span className="text-xs font-medium">{t.label}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">{t.note}</p>
                        {isNext && (
                          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-accent">
                            Mark done <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                <Link to="/won-proposals" className="text-accent hover:underline">
                  View in Won Proposals
                </Link>
                <Link to="/event-details" className="text-accent hover:underline">
                  Create the event
                </Link>
                <Link to="/audit" className="text-accent hover:underline">
                  Handoff record in Pod 3
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
