import { useState } from "react";
import { Download } from "lucide-react";
import {
  Annotation,
  CompanionBubble,
  GateBadge,
  TriggerChip,
} from "@/components/wireframe/primitives";
import { ScreenHeader } from "@/components/wireframe/screen-header";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import { Collapse } from "@/components/wireframe/collapse";
import { StepUI } from "@/components/wireframe/step-ui";
import { cn } from "@/lib/utils";
import type { SubStep, WorkflowStep } from "@/lib/workflow";
import { faqForPath, videoForPod } from "@/lib/videos";

import { POD1_PARTS } from "@/components/wireframe/journey-header";

function StepChips({
  subs,
  active,
  onSelect,
}: {
  subs: SubStep[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {subs.map((s, i) => (
        <button
          key={s.n}
          type="button"
          onClick={() => onSelect(i)}
          className={
            "rounded-full border px-3 py-1 font-mono text-[10px] transition-colors " +
            (i === active
              ? "border-accent bg-accent/15 text-accent"
              : "border-dashed border-wireline text-muted-foreground hover:border-accent/60 hover:text-foreground")
          }
        >
          {String(s.n).padStart(2, "0")}
          {s.gate ? " ·" : ""}
        </button>
      ))}
    </div>
  );
}

/** Generic phase screen: clickable step-by-step UI + artifact + companion + triggers. */
export function PhaseScreen({ step, showGuidance = true }: { step: WorkflowStep; showGuidance?: boolean }) {
  const moduleVideo = showGuidance ? videoForPod(step.pod) : null;
  const faq = faqForPath(step.path);
  const subs = step.steps ?? [];
  const [active, setActive] = useState(0);
  const current = subs[Math.min(active, subs.length - 1)];

  const isPod1 = step.pod === 1 && subs.length > 0;
  const firstN = subs[0]?.n ?? 1;
  const activePart = POD1_PARTS.find((p) => firstN >= p.from && firstN <= p.to);

  return (
    <div>
      <ScreenHeader step={step} />

      {/* Pod 1 journey header: steps live inside the three parts */}
      {isPod1 && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Pod 1 journey
              </p>
              <h2 className="text-sm font-bold">What you see, step by step</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {step.maturity && (
                <span className="rounded-full border border-dashed border-wireline px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Maturity · {step.maturity}
                </span>
              )}
              <p className="font-mono text-xs font-bold text-foreground">
                Step {current?.n ?? firstN} of 70
              </p>
            </div>
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            {POD1_PARTS.map((p) => {
              const isActive = p === activePart;
              return (
                <div
                  key={p.n}
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-dashed border-wireline opacity-60",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "border border-dashed border-wireline text-muted-foreground",
                      )}
                    >
                      {p.n}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight">
                        Part {p.n} · {p.name}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        Steps {p.from}–{p.to}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{p.sub}</p>
                  {isActive ? (
                    <div className="mt-3 border-t border-dashed border-wireline pt-3">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-accent">
                        You are here · {step.label}
                      </p>
                      <StepChips subs={subs} active={active} onSelect={setActive} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Clickable step-by-step UI */}
        <section className="lg:col-span-3">
          {!isPod1 && (
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">What you see, step by step</h2>
              {step.maturity && (
                <span className="rounded-full border border-dashed border-wireline px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Maturity · {step.maturity}
                </span>
              )}
            </div>
          )}

          {subs.length > 0 && (
            <>
              {!isPod1 && (
                <div className="mt-3">
                  <StepChips subs={subs} active={active} onSelect={setActive} />
                </div>
              )}

              {current && (
                <>
                  <div className="mt-3">
                    <StepUI step={current} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={active === 0}
                      onClick={() => setActive((a) => Math.max(0, a - 1))}
                      className="rounded-md border border-dashed border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground disabled:opacity-40"
                    >
                      ← Previous step
                    </button>
                    <button
                      type="button"
                      disabled={active >= subs.length - 1}
                      onClick={() => setActive((a) => Math.min(subs.length - 1, a + 1))}
                      className="rounded-md border border-dashed border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground disabled:opacity-40"
                    >
                      Next step →
                    </button>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Step {active + 1} of {subs.length} in this phase · run by {current.agent}
                    </span>
                    {current.gate && <GateBadge label={current.gate} />}
                    <button
                      type="button"
                      className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-dashed border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:border-accent hover:text-accent"
                    >
                      <Download className="h-3.5 w-3.5" /> Download report
                    </button>

                  </div>
                </>
              )}

              <Collapse
                className="mt-4"
                title="All steps in this phase"
                summary={`${subs.length} steps · what happens behind each screen`}
              >
                <ol className="divide-y divide-border rounded-lg border border-border">
                  {subs.map((s, i) => (
                    <li key={s.n}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-secondary/40"
                      >
                        <span className="w-7 shrink-0 font-mono text-[10px] text-muted-foreground">
                          {String(s.n).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{s.name}</p>
                          <p className="truncate font-mono text-[10px] text-muted-foreground">
                            {s.agent}
                          </p>
                        </div>
                        {s.gate && <GateBadge label={s.gate} />}
                      </button>
                    </li>
                  ))}
                </ol>
              </Collapse>
            </>
          )}
        </section>

        {/* Side rail */}
        <aside className="space-y-4 lg:col-span-2">


          {step.note && (step.pod === 1 || step.pod === 2 || step.pod === 3) && (
            <CompanionBubble pod={step.pod as 1 | 2 | 3}>{step.note}</CompanionBubble>
          )}
          {moduleVideo && (
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Guidance for this module
              </p>
              <ButlerVideo id={moduleVideo} compact />
            </div>
          )}
          {faq.length > 0 && (
            <Collapse title="Ask Sylvia" summary={`${faq.length} short answers for this step`}>
              <div className="space-y-3">
                {faq.map((f) => (
                  <ButlerVideo key={f.id} id={f.id} compact showMeta={false} />
                ))}
              </div>
            </Collapse>
          )}
          {step.triggers && step.triggers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.triggers.map((t) => (
                <TriggerChip key={t.to} to={t.to}>
                  {t.label}
                </TriggerChip>
              ))}
            </div>
          )}
        </aside>
      </div>

      {step.annotation && (
        <div className="mt-8">
          <Annotation n={1}>{step.annotation}</Annotation>
        </div>
      )}
    </div>
  );
}
