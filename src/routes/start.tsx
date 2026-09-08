import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Log In or Sign Up — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Log in if you already have an account, or sign up as a new user and we'll take you through orientation and access setup.",
      },
      { property: "og:title", content: "Log In or Sign Up" },
      {
        property: "og:description",
        content: "Returning users log in. New users sign up and get a short orientation first.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StartScreen,
});

function StartScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-dashed border-wireline px-6 py-5 lg:px-14">
        <Link to="/">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-14">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
           Returning or New User?
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Already have an account? Log in and carry on where you left off. New here? Sign up — it
          takes a minute, then we'll introduce your butlers.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to="/roles"
            className="group rounded-2xl border border-dashed border-wireline bg-card/50 p-6 transition-colors hover:border-accent"
          >
            <LogIn className="h-6 w-6 text-accent" aria-hidden />
             <p className="mt-4 text-lg font-bold">Returning User</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Choose the role you're working as today, then sign in to that environment.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              Log in{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/signup"
            className="group rounded-2xl border border-dashed border-wireline bg-card/50 p-6 transition-colors hover:border-accent"
          >
            <UserPlus className="h-6 w-6 text-accent" aria-hidden />
             <p className="mt-4 text-lg font-bold">New User</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Give us your name and a few details, meet your butlers, then set up access.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              Create account{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </main>

      <footer className="border-t border-dashed border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)
      </footer>
    </div>
  );
}
