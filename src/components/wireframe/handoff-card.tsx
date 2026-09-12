import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { handoffFor, handoffsForPod, type Handoff } from "@/lib/cross-pod";
import { Collapse } from "@/components/wireframe/collapse";

/**
 * The Cross-Pod Master Workflow shown where it actually happens: on the step
 * that triggers the handoff, not as a separate menu item.
 */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[12px] leading-relaxed text-secondary-foreground">{value}</p>
    </div>
  );
}

export function HandoffCard({ handoff }: { handoff: Handoff }) {
  return (
    <div className="rounded-xl border border-accent/50 bg-accent/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent">
          Cross-pod handoff
        </span>
        <span className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Maturity · {handoff.maturity}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold">{handoff.title}</p>
      <p className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        {handoff.from}
        <ArrowRight className="h-3 w-3 text-accent" />
        {handoff.to}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Happens automatically" value={handoff.autoAction} />
        <Field label="Human condition" value={handoff.humanGate} />
        <Field label="Connector" value={handoff.connector} />
        <Field label="Recorded as" value={handoff.audit} />
        <Field label="Dashboard impact" value={handoff.dashboard} />
        {handoff.link && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">See the other side</p>
            <Link
              to={handoff.link.to}
              className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-accent underline-offset-4 hover:underline"
            >
              ⇢ {handoff.link.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders nothing unless this exact step triggers a handoff. */
export function StepHandoff({ pod, step }: { pod: number; step: number }) {
  const handoff = handoffFor(pod, step);
  if (!handoff) return null;
  return (
    <Collapse
      className="mt-3"
      title="Cross-pod handoff"
      summary={`${handoff.title} — ${handoff.from} → ${handoff.to}`}
    >
      <HandoffCard handoff={handoff} />
    </Collapse>
  );
}

/** Compact strip for a pod dashboard: where this pod connects to the others. */
export function PodHandoffStrip({ pod }: { pod: number }) {
  const items = handoffsForPod(pod);
  if (items.length === 0) return null;
  return (
    <Collapse
      title="Cross-pod master workflow · where this pod connects"
      summary={`${items.length} handoffs — these run inside the workflow steps. Open a step to see the full rule.`}
    >
      <div className="grid gap-2">
        {items.map((h) => (
          <div
            key={`${h.pod}-${h.step}`}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-wireline px-3 py-2.5 transition-colors hover:border-accent/60"
          >
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent">
              Step {h.step}
            </span>
            <span className="min-w-[12rem] flex-1 text-sm">{h.title}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{h.connector}</span>
            {h.link && (
              <Link to={h.link.to} className="font-mono text-[10px] text-accent underline-offset-4 hover:underline">
                {h.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </Collapse>
  );
}
