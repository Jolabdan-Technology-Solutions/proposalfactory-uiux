import { cn } from "@/lib/utils";
import { POD_NAMES, type WorkflowStep } from "@/lib/workflow";

export function ScreenHeader({ step }: { step: WorkflowStep }) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span
          className={cn(
            step.pod === 1 && "text-pod-1",
            step.pod === 2 && "text-pod-2",
            step.pod === 3 && "text-pod-3",
            step.pod === 4 && "text-pod-4",
          )}
        >
          {POD_NAMES[step.pod]}
        </span>
        <span aria-hidden>·</span>
        <span>{step.phase}</span>
      </div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
        {step.label}
      </h1>
      <p className="mt-1 font-mono text-xs text-muted-foreground">Agents: {step.agent}</p>
      <div className="mt-4 border-b border-wireline" />
    </header>
  );
}
