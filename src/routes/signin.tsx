import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { SkeletonBlock } from "@/components/wireframe/primitives";
import { useActiveRole } from "@/hooks/use-role";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Sign in to the environment for the role you chose. Sign-in only — accounts are issued by an administrator.",
      },
      { property: "og:title", content: "Sign In — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Sign in to open the environment for your role.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SignInScreen,
});

function SignInScreen() {
  const navigate = useNavigate();
  const role = useActiveRole();

  function signIn() {
    if (!role) return;
    navigate({ to: "/goals" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-wireline px-8 py-5 lg:px-14">
        <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Step 2 of 2 · Sign in
        </span>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-8 py-12">
        <section>
          <Link
            to="/roles"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="h-3 w-3" /> Change role
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Sign in as
            <br />
            <span className="text-accent">{role ? role.name : "…"}</span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {role ? role.scope : "Pick a role first."}
          </p>

          <div className="mt-8 max-w-md rounded-2xl border border-wireline bg-card/60 p-7">
            <div className="space-y-3">
              <SkeletonBlock label="Email" className="h-11" />
              <SkeletonBlock label="Password" className="h-11" />
              <p className="text-right font-mono text-[10px] text-accent">Forgot password?</p>
              <button
                type="button"
                onClick={signIn}
                disabled={!role}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LockKeyhole className="h-4 w-4" />
                {role ? `Enter ${role.name} environment` : "Sign In"}
              </button>
              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Sign-in only · accounts are issued by an administrator
              </p>
            </div>
          </div>
        </section>
      </main>


      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-wireline px-8 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        <span>© 2026 Mr. B2G &amp; Associates, LLC</span>
        <span>The Proposal Factory (TPF) · Privacy</span>
      </footer>
    </div>
  );
}
