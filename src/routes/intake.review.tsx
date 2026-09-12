import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CircleAlert, ArrowLeft } from "lucide-react";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/intake/review")({
  head: () => ({
    meta: [
      { title: "Review & Submit — Client Readiness Intake | The Proposal Factory™" },
      {
        name: "description",
        content:
          "Review your Client Readiness Intake summary, hear Sylvia explain what happens next, then give consent and submit.",
      },
      { property: "og:title", content: "Review & Submit — Client Readiness Intake" },
      {
        property: "og:description",
        content: "Check your answers, hear what happens next, and submit your intake.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReviewSubmit,
});

const SUMMARY = [
  { section: "Organisation profile", state: "complete", note: "Legal name, size, locations" },
  { section: "Registrations & certifications", state: "complete", note: "SAM, UEI, set-aside status" },
  { section: "Past performance", state: "complete", note: "3 references captured" },
  { section: "Capability & differentiators", state: "complete", note: "Core services, key staff" },
  { section: "Financial & bonding", state: "partial", note: "Bonding capacity still to add" },
  { section: "Goals & timeline", state: "complete", note: "Target opportunities, readiness date" },
];

function ReviewSubmit() {
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-wireline px-6 py-5 lg:px-14">
        <Link to="/" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Client Readiness Intake · Final step
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 lg:px-10">
        <Link
          to="/intake"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to getting started
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Review and submit
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Here's what you've shared. You can go back and add to any section — anything still open can
          also be filled in later with your advisor.
        </p>

        <ul className="mt-8 divide-y divide-dashed divide-wireline rounded-2xl border border-wireline bg-card/40">
          {SUMMARY.map((s) => (
            <li
              key={s.section}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{s.section}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>
              </div>
              <span
                className={
                  s.state === "complete"
                    ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/60 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent"
                    : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-wireline px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                }
              >
                {s.state === "complete" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <CircleAlert className="h-3 w-3" />
                )}
                {s.state === "complete" ? "Captured" : "Can add later"}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm font-semibold">
          You're almost there. Sylvia explains what happens next.
        </p>
        <div className="mt-4">
          <ButlerVideo id="sylvia-intake-closing" />
        </div>

        <label className="mt-8 flex items-start gap-3 rounded-xl border border-wireline bg-card/40 p-4">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--accent)]"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            I confirm the information above is accurate to the best of my knowledge and consent to it
            being used to prepare my Client Readiness Snapshot and route me to the right support.
          </span>
        </label>

        <button
          type="button"
          disabled={!consent || submitted}
          onClick={() => setSubmitted(true)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {submitted ? "Intake submitted" : "Submit intake"}
        </button>

        {submitted && (
          <p className="mt-4 text-sm leading-relaxed text-accent">
            Thank you — your intake is in. We'll prepare your Client Readiness Snapshot and come back
            to you with your next step.
          </p>
        )}
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Watching the video is optional.
        </p>
      </main>

      <footer className="border-t border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF) · Privacy
      </footer>
    </div>
  );
}
