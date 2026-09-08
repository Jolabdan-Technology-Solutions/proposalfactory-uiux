import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Save, Lock, FileText } from "lucide-react";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/intake/")({
  head: () => ({
    meta: [
      { title: "Getting Started — Client Readiness Intake | The Proposal Factory™" },
      {
        name: "description",
        content:
          "Start the Client Readiness Intake. Sylvia orients you, then you complete a short intake you can save and return to at any time.",
      },
      { property: "og:title", content: "Getting Started — Client Readiness Intake" },
      {
        property: "og:description",
        content: "Sylvia welcomes you, then you begin the Client Readiness Intake.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GettingStarted,
});

const ORIENTATION = [
  { icon: Clock, label: "About 12–15 minutes to complete" },
  { icon: Save, label: "Save and return at any point — nothing is lost" },
  { icon: Lock, label: "Confidential. Shared only with your support team" },
  { icon: FileText, label: "Helpful to have: capability statement, past awards, registrations" },
];

function GettingStarted() {
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    try {
      setReturning(window.localStorage.getItem("tpf.intake.started") === "yes");
      window.localStorage.setItem("tpf.intake.started", "yes");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-wireline px-6 py-5 lg:px-14">
        <Link to="/" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Client Readiness Intake · Getting started
        </span>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 lg:px-10">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Getting started
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The Client Readiness Intake tells us where you are today so we can point you to the right
          support — proposal and opportunity help, service delivery, governance, or a conversation
          with a human advisor.
        </p>

        {returning && (
          <p className="mt-4 text-sm text-accent">
            Welcome back — Sylvia's introduction is here if you'd like it again, otherwise carry
            straight on.
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
          <ButlerVideo id="sylvia-intake-opening" />

          <div className="min-w-0">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              What to expect
            </h2>
            <ul className="mt-4 space-y-3">
              {ORIENTATION.map((o) => (
                <li key={o.label} className="flex items-start gap-3">
                  <o.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="text-sm leading-relaxed text-muted-foreground">{o.label}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/intake/review"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Begin intake <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              You can begin without watching the video.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-dashed border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF) · Privacy
      </footer>
    </div>
  );
}
