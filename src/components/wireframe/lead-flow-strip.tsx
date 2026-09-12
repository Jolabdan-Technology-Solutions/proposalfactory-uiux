import { Collapse } from "@/components/wireframe/collapse";
import { ACCEPTANCE, GATES, LIFECYCLE, OWNERSHIP, type Gate } from "@/lib/lead-flow";

/**
 * How one opportunity moves through TPF, Zoho CRM and Asana.
 * Reference content from the lead-flow build guide — no live systems connected.
 */

function GateCard({ g }: { g: Gate }) {
  return (
    <div className="rounded-lg border border-wireline bg-card/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-accent px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
          Gate {g.id} · Step {g.step}
        </span>
        <p className="text-sm font-semibold">{g.title}</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{g.rule}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-wireline p-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Before the gate</p>
          <p className="mt-1 text-xs text-muted-foreground">{g.before}</p>
        </div>
        <div className="rounded border border-wireline p-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">After approval · {g.system}</p>
          <p className="mt-1 text-xs text-muted-foreground">{g.after}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {g.payload.map((p) => (
          <span key={p} className="rounded-full border border-wireline px-2 py-0.5 text-[11px] text-muted-foreground">
            {p}
          </span>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Guardrail · {g.guardrail}
      </p>
    </div>
  );
}

export function LeadFlowStrip() {
  return (
    <div className="space-y-3">
      <Collapse
        title="One opportunity, three gates"
        summary="Market universe → CRM candidate → CRM qualified (Zoho) → active deal → Asana proposal project"
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2 pr-3">State</th>
                  <th className="pb-2 pr-3">Volume</th>
                  <th className="pb-2 pr-3">Primary system</th>
                  <th className="pb-2 pr-3">Steps</th>
                  <th className="pb-2 pr-3">Meaning</th>
                  <th className="pb-2">Exit trigger</th>
                </tr>
              </thead>
              <tbody>
                {LIFECYCLE.map((l) => (
                  <tr key={l.state} className="border-t border-wireline align-top">
                    <td className="py-2 pr-3 font-semibold">{l.state}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{l.volume}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{l.system}</td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{l.steps}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{l.meaning}</td>
                    <td className="py-2 text-muted-foreground">{l.exit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3">
            {GATES.map((g) => (
              <GateCard key={g.id} g={g} />
            ))}
          </div>
        </div>
      </Collapse>

      <Collapse
        title="Which system owns what"
        summary="TPF owns discovery and pursuit judgement · Zoho owns the buyer relationship · Asana owns human execution · QuickBooks owns money"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="pb-2 pr-3">Data or activity</th>
                <th className="pb-2 pr-3">Authoritative system</th>
                <th className="pb-2 pr-3">Visible elsewhere</th>
                <th className="pb-2">Rule</th>
              </tr>
            </thead>
            <tbody>
              {OWNERSHIP.map((o) => (
                <tr key={o.data} className="border-t border-wireline align-top">
                  <td className="py-2 pr-3 font-semibold">{o.data}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{o.authority}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{o.visible}</td>
                  <td className="py-2 text-muted-foreground">{o.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapse>

      <Collapse title="What good looks like" summary="Ten acceptance rules the integration has to satisfy">
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {ACCEPTANCE.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="text-accent">·</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
}
