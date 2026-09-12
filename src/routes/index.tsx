import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, CalendarRange, ShieldCheck, HelpCircle } from "lucide-react";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — The Proposal Factory™" },
      {
        name: "description",
        content:
          "The Proposal Factory™ — guided proposal pursuit, event delivery and governance workflows, with a butler alongside you at every step. Start with Sylvia's welcome.",
      },
      { property: "og:title", content: "Welcome — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Guided proposal, event and governance workflows. Start with Sylvia's welcome.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SplashScreen,
});

const HIGHLIGHTS = [
  {
    icon: Compass,
    title: "Pursue and win work",
    body: "Find the right opportunities, decide what's worth bidding, and get a compliant response out the door.",
  },
  {
    icon: CalendarRange,
    title: "Deliver events",
    body: "Brief to closeout — venue, production, audience, talent and show day, with Eve alongside you.",
  },
  {
    icon: ShieldCheck,
    title: "Keep it governed",
    body: "Approvals, budgets, documents and a full audit trail, so everyone knows who signed off on what.",
  },
];

function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-wireline px-6 py-5 lg:px-14">
        <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        <Link
          to="/start"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Skip intro
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome to The Proposal Factory™
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              One guided workspace for pursuing work, delivering events and keeping everything
              governed — with a butler alongside you at each step. Start with Sylvia's welcome, or
              scroll on to see what's inside.
            </p>
            <Link
              to="/start"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ButlerVideo id="sylvia-intake-opening" />
        </div>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-wireline bg-card/40 p-6"
            >
              <h.icon className="h-6 w-6 text-accent" aria-hidden />
              <p className="mt-4 text-base font-bold">{h.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-wireline bg-card/40 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="text-base font-bold">Questions before you start?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sylvia has short answers to the fifteen questions we're asked most.
              </p>
            </div>
          </div>
          <Link
            to="/help"
            className="inline-flex items-center gap-2 rounded-xl border border-wireline px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            Ask Sylvia <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            to="/start"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground">
        <span>© 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)</span>
      </footer>
    </div>
  );
}
