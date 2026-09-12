import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ListTree, Lock } from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/workflow";

const PHASES = WORKFLOW_STEPS.filter((s) => s.pod === 1);
const TOTAL = PHASES.reduce((n, p) => n + (p.steps?.length ?? 0), 0);

/**
 * Dropdown that lists all 70 Pod 1 steps. Any step can be opened directly —
 * the preceding steps do not have to be completed first.
 */
export function StepJump({ current }: { current?: number | undefined }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-wireline bg-card/60 px-3 py-2 text-xs font-semibold transition-colors hover:border-accent"
      >
        <ListTree className="h-4 w-4 text-accent" />
        {TOTAL}-Step Workflow
        {current ? (
          <span className="font-mono text-[10px] font-normal text-accent">
            · Step {current}
          </span>
        ) : null}
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {TOTAL} steps · {PHASES.length} phases
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Jump to any step
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {PHASES.map((p) => {
              const isOpen = expanded === p.path;
              return (
                <div key={p.path} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : p.path)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-secondary/50"
                  >
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : "-rotate-90"}`}
                    />
                    <span className="flex-1 truncate text-xs font-semibold">{p.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {p.steps?.length ?? 0} steps
                    </span>
                  </button>
                  {isOpen && (
                    <ol className="ml-4 border-l border-wireline pl-2">
                      {(p.steps ?? []).map((s) => (
                        <li key={s.n}>
                          <Link
                            to={p.path}
                            hash={`step-${s.n}`}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/50 ${
                              s.n === current ? "text-accent" : ""
                            }`}
                          >
                            <span className="w-7 shrink-0 font-mono text-[10px] text-muted-foreground">
                              {String(s.n).padStart(2, "0")}
                            </span>
                            <span className="flex-1 truncate text-xs">{s.name}</span>
                            {s.gate && <Lock className="h-3 w-3 shrink-0 text-accent" />}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
