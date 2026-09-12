import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowLeft } from "lucide-react";
import { ButlerVideo } from "@/components/wireframe/butler-video";
import { SYLVIA_FAQ, getVideo } from "@/lib/videos";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Ask Sylvia: Common Questions — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Search the Ask Sylvia library: fifteen short question-and-answer videos covering how The Proposal Factory works, what the butlers do, and what happens after intake.",
      },
      { property: "og:title", content: "Ask Sylvia: Common Questions" },
      {
        property: "og:description",
        content: "A searchable library of short answers from Sylvia.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HelpLibrary,
});

function HelpLibrary() {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string>(SYLVIA_FAQ[0]!.id);
  const results = SYLVIA_FAQ.filter((f) => f.title.toLowerCase().includes(q.trim().toLowerCase()));
  const open = getVideo(openId);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-wireline px-6 py-5 lg:px-14">
        <Link to="/" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Help &amp; Learning
        </span>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Ask Sylvia: common questions
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Fifteen short answers, one question per clip. Search for what you need — nothing plays
          until you press play.
        </p>

        <label className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-wireline bg-card/40 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions — e.g. intake, human gate, cost"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
          <ul className="divide-y divide-dashed divide-wireline overflow-hidden rounded-2xl border border-wireline bg-card/40">
            {results.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(f.id)}
                  className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/40 ${
                    f.id === openId ? "bg-secondary/50" : ""
                  }`}
                >
                  <span className="w-6 shrink-0 font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">{f.title}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {f.duration}
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">
                No question matches that. Try a different word, or ask for a human advisor.
              </li>
            )}
          </ul>

          <div className="lg:sticky lg:top-6 lg:self-start">
            {open && (
              <>
                <h2 className="mb-3 text-lg font-bold">{open.title}</h2>
                <ButlerVideo id={open.id} />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)
      </footer>
    </div>
  );
}
