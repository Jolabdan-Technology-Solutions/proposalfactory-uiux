import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Pod 1 journey: the 70 steps grouped into the three high-level parts. */
export const POD1_PARTS = [
  {
    n: 1,
    name: "Pre-Award",
    sub: "Also called Pre-Proposal",
    from: 1,
    to: 18,
    entry: "/pipeline",
  },
  {
    n: 2,
    name: "In Process",
    sub: "Also called Proposal Generation",
    from: 19,
    to: 60,
    entry: "/rfp-intake",
  },
  {
    n: 3,
    name: "Post-Award",
    sub: "Submission · Orals · Negotiation · Kickoff",
    from: 61,
    to: 70,
    entry: "/award",
  },
] as const;

export type Pod1Part = (typeof POD1_PARTS)[number];

export function partForStep(n: number | undefined) {
  if (!n) return undefined;
  return POD1_PARTS.find((p) => n >= p.from && n <= p.to);
}

/**
 * Compact numbered breadcrumb of the Pod 1 journey.
 * Shown across every Pod 1 page so the numbers guide the user everywhere.
 */
export function JourneyBreadcrumb({
  activePart,
  stepNumber,
  maturity,
  label,
  className,
}: {
  activePart?: number | undefined;
  stepNumber?: number | undefined;
  maturity?: string | undefined;
  label?: string | undefined;
  className?: string | undefined;
}) {
  const active = activePart ?? partForStep(stepNumber)?.n;

  return (
    <div className={cn("rounded-xl border border-dashed border-wireline p-3", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Pod 1 journey
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {POD1_PARTS.map((p, i) => {
            const isActive = p.n === active;
            return (
              <span key={p.n} className="flex items-center gap-1.5">
                {i > 0 && <span className="font-mono text-[10px] text-muted-foreground">›</span>}
                <Link
                  to={p.entry}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-2.5 py-1 transition-colors",
                    isActive
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-dashed border-wireline text-muted-foreground hover:border-accent/60 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full font-mono text-[9px] font-bold",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "border border-dashed border-wireline",
                    )}
                  >
                    {p.n}
                  </span>
                  <span className="text-[11px] font-bold">{p.name}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">
                    {p.from}–{p.to}
                  </span>
                </Link>
              </span>
            );
          })}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {label && (
            <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
          )}
          {maturity && (
            <span className="rounded-full border border-dashed border-wireline px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Maturity · {maturity}
            </span>
          )}
          {stepNumber ? (
            <span className="font-mono text-xs font-bold text-foreground">
              Step {stepNumber} of 70
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground">70 steps</span>
          )}
        </div>
      </div>
    </div>
  );
}
