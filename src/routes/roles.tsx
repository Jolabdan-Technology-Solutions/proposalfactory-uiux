import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ROLES, setActiveRole, type RoleId } from "@/lib/roles";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Choose Your Role — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Select the role you were given — platform owner, administrator, proposal manager, trainer, reviewer or client viewer — then sign in to that environment.",
      },
      { property: "og:title", content: "Choose Your Role — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Pick your role, sign in, and land in the environment built for it.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RoleChooser,
});

function RoleChooser() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RoleId | "">("");

  const role = ROLES.find((r) => r.id === selected);

  function continueToSignIn() {
    if (!role) return;
    setActiveRole(role.id);
    navigate({ to: "/signin" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-wireline px-8 py-5 lg:px-14">
        <Link to="/" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Step 1 of 2 · Choose role
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-8 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your administrator will have told you which role you hold. Select it below to continue.
        </p>

        <label
          htmlFor="role"
          className="mt-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          Role
        </label>
        <div className="relative mt-2">
          <select
            id="role"
            value={selected}
            onChange={(e) => setSelected(e.target.value as RoleId)}
            className="w-full appearance-none rounded-xl border border-dashed border-wireline bg-card/60 px-5 py-4 text-base font-semibold text-foreground outline-none transition-colors focus:border-accent [&>option]:bg-card"
          >
            <option value="" disabled>
              Select your role…
            </option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.status === "planned" ? " (at go-live)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>




        <button
          type="button"
          onClick={continueToSignIn}
          disabled={!role}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-wireline px-8 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        <span>© 2026 Mr. B2G &amp; Associates, LLC</span>
        <span>The Proposal Factory (TPF) · Privacy</span>
      </footer>
    </div>
  );
}
