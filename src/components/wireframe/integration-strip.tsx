import { Link } from "@tanstack/react-router";
import { Collapse } from "@/components/wireframe/collapse";
import { integrationsForPod, type IntegrationPhase } from "@/lib/integrations";
import { momentsForPod } from "@/lib/lead-flow";

const PHASE_TONE: Record<IntegrationPhase, string> = {
  "Phase 1": "border-pod-1 text-pod-1",
  "Phase 2": "border-accent text-accent",
  Future: "border-wireline text-muted-foreground",
};

/**
 * Shows which integration (MCP connector) families this pod uses.
 * Sample reference data — no live systems are connected.
 */
export function IntegrationStrip({ pod }: { pod: 1 | 2 | 3 }) {
  const rows = integrationsForPod(pod);
  const live = rows.filter((r) => r.phase === "Phase 1").length;
  const moments = momentsForPod(pod);

  return (
    <div className="space-y-3">
    <Collapse
      title={`Where the outside tools do the work in Pod ${pod}`}
      summary="Zoho CRM, Asana, QuickBooks, Slack, Drive and calendar — at the exact step each one is used"
    >
      <div className="space-y-2">
        {moments.map((m) => (
          <div key={m.step + m.system} className="rounded-lg border border-wireline p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-wireline px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                {m.step}
              </span>
              <p className="text-sm font-semibold">{m.system}</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.action}</p>
          </div>
        ))}
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Event-driven by design · only the record, signal or action a gate needs crosses systems
        </p>
      </div>
    </Collapse>
    <Collapse
      title={`Integrations used by Pod ${pod}`}
      summary={`${rows.length} connector families · ${live} in phase 1 — Zoho, Asana, Slack, Drive and more`}
    >
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.family}
            className="rounded-lg border border-wireline bg-card/40 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{r.family}</p>
              <span
                className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${PHASE_TONE[r.phase]}`}
              >
                {r.phase}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {r.owner}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-wireline px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.purpose}</p>
          </div>
        ))}
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sample data · no live systems connected ·{" "}
          <Link to="/connectors" className="text-accent hover:underline">
            See the full connector gateway
          </Link>
        </p>
      </div>
    </Collapse>
    </div>
  );
}
