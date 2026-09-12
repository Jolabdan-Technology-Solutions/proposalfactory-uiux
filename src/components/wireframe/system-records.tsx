import { Collapse } from "@/components/wireframe/collapse";
import { systemRecords } from "@/lib/lead-flow";
import type { Deal } from "@/lib/deals";

/**
 * One persistent opportunity ID, linked to the record it created in each
 * outside system as it passed each gate. Sample data — no live systems.
 */
export function SystemRecordsStrip({ deals }: { deals: Deal[] }) {
  const rows = deals.slice(0, 6);
  if (rows.length === 0) return null;

  return (
    <Collapse
      title="Connected system records"
      summary="The same opportunity ID carried into Zoho, Asana, Drive and QuickBooks — never a new record"
    >
      <div className="space-y-3">
        {rows.map((d) => (
          <div key={d.id} className="rounded-lg border border-wireline p-3">
            <p className="text-sm font-semibold">{d.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {systemRecords(`TPF-${d.id.toUpperCase()}`, d.stage).map((r) => (
                <span
                  key={r.system}
                  title={r.note}
                  className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {r.system}: {r.id}
                </span>
              ))}
            </div>
          </div>
        ))}
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Sample identifiers · records appear only once their gate has been passed
        </p>
      </div>
    </Collapse>
  );
}
