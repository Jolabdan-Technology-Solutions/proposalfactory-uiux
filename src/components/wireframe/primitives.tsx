import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { COMPANIONS } from "@/lib/workflow";

/** Dashed placeholder block — the core wireframe element. */
export function SkeletonBlock({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-lg border border-wireline bg-card/40 p-4",
        className,
      )}
    >
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/** Numbered spec annotation. */
export function Annotation({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-[9px] font-semibold text-accent">
        {n}
      </span>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

/** Human-gate marker. */
export function GateBadge({ label = "Human gate" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}

/** Pod companion speech bubble. */
export function CompanionBubble({ pod, children }: { pod: 1 | 2 | 3; children: ReactNode }) {
  const c = COMPANIONS[pod];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-primary/10 p-4">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold",
          pod === 1 && "border-pod-1 text-pod-1",
          pod === 2 && "border-pod-2 text-pod-2",
          pod === 3 && "border-pod-3 text-pod-3",
        )}
      >
        {c.initial}
      </span>
      <div>
        <p
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-widest",
            pod === 1 && "text-pod-1",
            pod === 2 && "text-pod-2",
            pod === 3 && "text-pod-3",
          )}
        >
          {c.name} · companion
        </p>
        <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">{children}</p>
      </div>
    </div>
  );
}

/** Cross-pod trigger link. */
export function TriggerChip({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-wireline bg-card px-3 py-1.5 font-mono text-[11px] text-accent transition-colors hover:border-accent hover:bg-accent/10"
    >
      ⇢ {children}
    </Link>
  );
}
