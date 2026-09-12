import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Detail-heavy text sections collapse by default so screens stay calm.
 * Uses native <details> so it works without state or JS.
 */
export function Collapse({
  title,
  summary,
  defaultOpen = false,
  className,
  children,
}: {
  title: ReactNode;
  summary?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn("group rounded-xl border border-wireline bg-card/40", className)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">{title}</div>
          {summary && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{summary}</p>
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-wireline px-5 py-4">{children}</div>
    </details>
  );
}
