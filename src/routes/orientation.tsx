import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/orientation")({
  head: () => ({
    meta: [
      { title: "Orientation — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Meet Sylvia, Eve and Oscar. Three short introductions explain what The Proposal Factory does and how each guide helps you before you set up access.",
      },
      { property: "og:title", content: "Orientation — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Three short welcome videos, then set up your access.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Orientation,
});

const CHAPTERS = [
  {
    guide: "Sylvia",
    title: "Welcome to The Proposal Factory",
    videoId: "sylvia-intake-opening",
  },
  {
    guide: "Eve",
    title: "Events and experiences",
    videoId: "eve-events-experiential",
  },
  {
    guide: "Oscar",
    title: "Governance and back-office",
    videoId: "oscar-operations-backoffice",
  },
];

function Orientation() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const chapter = CHAPTERS[i]!;
  const last = i === CHAPTERS.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-wireline px-6 py-5 lg:px-14">
        <Link to="/start" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Orientation · {i + 1} of {CHAPTERS.length}
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Welcome to The Proposal Factory™
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Three short introductions from the guides who'll be alongside you. You can skip ahead at
          any point.
        </p>

        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {chapter.guide}
          </p>
          <h2 className="mt-1 text-xl font-bold">{chapter.title}</h2>
          <div className="mt-4">
            <ButlerVideo key={chapter.guide} id={chapter.videoId} />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-wireline px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          <div className="flex items-center gap-2">
            {CHAPTERS.map((c, n) => (
              <button
                key={c.guide}
                type="button"
                aria-label={`Go to ${c.guide}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={
                  n === i
                    ? "h-2.5 w-8 rounded-full bg-accent"
                    : "h-2.5 w-2.5 rounded-full bg-muted-foreground/40 hover:bg-muted-foreground"
                }
              />
            ))}
          </div>

          {last ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/roles" })}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground hover:opacity-90"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setI((n) => Math.min(CHAPTERS.length - 1, n + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground hover:opacity-90"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Link
          to="/roles"
          className="mt-6 inline-block font-mono text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Skip orientation and set up access
        </Link>
      </main>

      <footer className="border-t border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)
      </footer>
    </div>
  );
}
