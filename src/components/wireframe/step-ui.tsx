import { Check, Download, FileText, Play, RefreshCw, Search, Upload, X } from "lucide-react";
import type { SubStep } from "@/lib/workflow";
import { GateBadge } from "@/components/wireframe/primitives";

/**
 * Renders a mock of the screen a user actually sees for a given step,
 * inferred from the step's name and whether it carries a human gate.
 */

type Kind = "gate" | "run" | "table" | "editor" | "form" | "review" | "package" | "board";

function kindFor(s: SubStep): Kind {
  const n = s.name.toLowerCase();
  if (s.gate?.toLowerCase().includes("human") || /gate|approval|approve|sign-?off|decision/.test(n))
    return "gate";
  if (/scan|import|sync|dedup|normali|refresh|crawl|feed|monitor scan/.test(n)) return "run";
  if (/score|match|rank|analy|lookup|intel|compare|forecast|budget|track|matrix|check|shred|audit/.test(n))
    return "table";
  if (/draft|write|narrative|summar|generat|response|content|copy|letter|proposal section/.test(n))
    return "editor";
  if (/profile|notes|intake|form|register|enter|capture|brief|setup|configure|assumption|plan/.test(n))
    return "form";
  if (/review|qa|quality|compliance|validate|verify|proof|inspect/.test(n)) return "review";
  if (/submit|package|export|lock|deliver|upload|archive|closeout|report/.test(n)) return "package";
  return "board";
}

const KIND_LABEL: Record<Kind, string> = {
  gate: "Decision screen",
  run: "Run & monitor screen",
  table: "Results screen",
  editor: "Document screen",
  form: "Entry form screen",
  review: "Review screen",
  package: "Package & export screen",
  board: "Working screen",
};

function Btn({
  children,
  tone = "ghost",
  icon: Icon,
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "ghost" | "danger";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    accent: "border border-accent bg-accent/10 text-accent",
    ghost: "border border-dashed border-wireline text-muted-foreground",
    danger: "border border-destructive/60 text-destructive",
  } as const;
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-1 rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-secondary-foreground">
        {value}
      </div>
    </div>
  );
}

function Bar({ w, dim }: { w: string; dim?: boolean }) {
  return <div className={`h-2 rounded-full ${dim ? "bg-secondary" : "bg-secondary/70"}`} style={{ width: w }} />;
}

const ROWS = [
  ["Navy IT Modernization", "N00178-25-R-0042", "84", "Strong fit"],
  ["DHS Campus Security", "70RTAC-25-R-0011", "71", "Review"],
  ["GSA Facilities Support", "47QRAA-25-R-0088", "58", "Watch"],
  ["State DOT Signage", "SLED-2025-114", "39", "Low fit"],
];

function StepBody({ kind, step }: { kind: Kind; step: SubStep }) {
  switch (kind) {
    case "gate":
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-accent/50 bg-accent/5 p-4">
            <GateBadge label={step.gate ?? "Human gate"} />
            <p className="mt-3 text-sm font-semibold">{step.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nothing moves forward until a person decides. Your decision and comment are recorded
              in the audit trail.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Item" value="Navy IT Modernization" />
            <Field label="Recommendation" value="Proceed · confidence 84%" />
            <Field label="Why" value="Capability match on 4 of 5 required areas." wide />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Your comment
            </p>
            <div className="mt-1 h-16 rounded-md border border-dashed border-wireline bg-background/60" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn tone="primary" icon={Check}>Approve</Btn>
            <Btn tone="accent" icon={RefreshCw}>Request changes</Btn>
            <Btn tone="danger" icon={X}>Decline</Btn>
          </div>
        </div>
      );
    case "run":
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Btn tone="primary" icon={Play}>Run now</Btn>
            <Btn icon={RefreshCw}>Schedule</Btn>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              Last run 09:12 · 128 records
            </span>
          </div>
          <div className="space-y-2 rounded-lg border border-border p-4">
            {["SAM.gov daily feed", "Agency forecasts", "SLED portals", "Uploaded list"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-xs">{s}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${100 - i * 18}%` }} />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                  {100 - i * 18}%
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Found" value="128" />
            <Field label="Duplicates removed" value="34" />
            <Field label="Errors" value="0" />
          </div>
        </div>
      );
    case "table":
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Search or filter…</span>
            </div>
            <Btn icon={Download}>Download report</Btn>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[2fr_1.4fr_0.6fr_0.9fr] gap-2 border-b border-border bg-secondary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Opportunity</span>
              <span>Reference</span>
              <span>Score</span>
              <span>Status</span>
            </div>
            {ROWS.map((r) => (
              <div
                key={r[1]}
                className="grid grid-cols-[2fr_1.4fr_0.6fr_0.9fr] gap-2 border-b border-border px-4 py-2.5 text-xs last:border-0 hover:bg-secondary/30"
              >
                <span className="truncate">{r[0]}</span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">{r[1]}</span>
                <span className="font-semibold text-accent">{r[2]}</span>
                <span className="text-muted-foreground">{r[3]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "editor":
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2">
            {["B", "I", "H2", "List", "Link"].map((t) => (
              <span key={t} className="font-mono text-[10px] text-muted-foreground">{t}</span>
            ))}
            <span className="ml-auto flex gap-2">
              <Btn tone="accent" icon={RefreshCw}>Regenerate draft</Btn>
              <Btn icon={Check}>Save</Btn>
            </span>
          </div>
          <div className="space-y-2.5 rounded-lg border border-border p-5">
            <p className="text-sm font-semibold">{step.name}</p>
            <Bar w="96%" /><Bar w="88%" /><Bar w="92%" dim /><Bar w="64%" dim />
            <div className="h-3" />
            <Bar w="90%" /><Bar w="76%" dim /><Bar w="83%" dim />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            Draft prepared by {step.agent} · you edit and approve before it counts.
          </p>
        </div>
      );
    case "form":
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value="Navy IT Modernization" />
            <Field label="Agency / client" value="Department of the Navy" />
            <Field label="Owner" value="Assigned to you" />
            <Field label="Due date" value="14 Oct 2026" />
            <Field label="Notes" value="Key assumptions and capture notes…" wide />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Btn icon={Upload}>Attach files</Btn>
            <Btn tone="primary" icon={Check}>Save and continue</Btn>
          </div>
        </div>
      );
    case "review":
      return (
        <div className="space-y-3">
          {[
            ["Section L instructions covered", true],
            ["Section M criteria addressed", true],
            ["Page limits respected", true],
            ["Required forms attached", false],
            ["Formatting and branding", true],
          ].map(([label, ok]) => (
            <div
              key={label as string}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5"
            >
              {ok ? (
                <Check className="h-4 w-4 shrink-0 text-accent" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-destructive" />
              )}
              <span className="flex-1 text-xs">{label as string}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {ok ? "Pass" : "Needs attention"}
              </span>
            </div>
          ))}
          <div className="flex gap-2">
            <Btn tone="primary" icon={Check}>Mark reviewed</Btn>
            <Btn icon={Download}>Download findings</Btn>
          </div>
        </div>
      );
    case "package":
      return (
        <div className="space-y-3">
          {["Technical volume.pdf", "Cost volume.xlsx", "Compliance matrix.pdf", "Signed forms.zip"].map(
            (f) => (
              <div key={f} className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-xs">{f}</span>
                <span className="font-mono text-[10px] text-muted-foreground">Ready</span>
                <Download className="h-3.5 w-3.5 text-accent" />
              </div>
            ),
          )}
          <div className="flex flex-wrap gap-2">
            <Btn tone="primary" icon={Check}>Lock package</Btn>
            <Btn icon={Download}>Download all</Btn>
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="In progress" value="6" />
            <Field label="Completed" value="41" />
            <Field label="Blocked" value="1" />
          </div>
          <div className="space-y-2 rounded-lg border border-border p-4">
            <Bar w="92%" /><Bar w="78%" dim /><Bar w="85%" dim />
          </div>
          <Btn tone="primary" icon={Check}>Continue</Btn>
        </div>
      );
  }
}

export function StepUI({ step }: { step: SubStep }) {
  const kind = kindFor(step);
  return (
    <div className="rounded-xl border border-border bg-card/60">
      {/* Fake app window chrome so it reads as a real screen */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        </span>
        <p className="ml-2 truncate text-xs font-semibold">
          Step {String(step.n).padStart(2, "0")} · {step.name}
        </p>
        <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {KIND_LABEL[kind]}
        </span>
      </div>
      <div className="p-5">
        <StepBody kind={kind} step={step} />
      </div>
    </div>
  );
}

export { kindFor, KIND_LABEL };
