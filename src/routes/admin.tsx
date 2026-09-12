import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, KeyRound } from "lucide-react";
import tpfLogo from "@/assets/tpf-logo.png";
import { findAccount, setActiveAccount } from "@/lib/accounts";
import { setActiveRole, type RoleId } from "@/lib/roles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrator Access — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Direct entry for the platform owner and super administrators. No role selection needed — enter straight into the platform environment.",
      },
      { property: "og:title", content: "Administrator Access" },
      {
        property: "og:description",
        content: "Platform owner and super administrator entry point.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminAccess,
});

/** Owner and super administrators skip role selection entirely. */
const DIRECT_ACCESS: { email: string; label: string; role: string; roleId: RoleId }[] = [
  {
    email: "owner@example.com",
    label: "Platform Owner",
    role: "Owns the platform",
    roleId: "platform-owner-admin",
  },
  {
    email: "superadmin@example.com",
    label: "Super Administrator",
    role: "Full platform reach",
    roleId: "super-admin",
  },
  {
    email: "admin@example.com",
    label: "Multi-Role Administrator",
    role: "Holds several roles",
    roleId: "super-admin",
  },
];

function AdminAccess() {
  const navigate = useNavigate();

  function enterDirect(email: string, roleId: RoleId) {
    const account = findAccount(email);
    if (account) setActiveAccount(account);
    setActiveRole(roleId);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-wireline px-6 py-5 lg:px-14">
        <Link to="/">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-14">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
          <KeyRound className="h-3.5 w-3.5" /> Administrator access
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Platform owner &amp; super administrators
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Entry straight into the platform environment — no role selection needed. Sample accounts
          only; no live sign-in.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {DIRECT_ACCESS.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => enterDirect(d.email, d.roleId)}
              className="group rounded-xl border border-wireline bg-card/50 p-5 text-left transition-colors hover:border-accent"
            >
              <p className="text-sm font-bold group-hover:text-accent">{d.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {d.role}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                Enter <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>

        <Link
          to="/start"
          className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        >
          Back to log in or sign up
        </Link>
      </main>

      <footer className="border-t border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)
      </footer>
    </div>
  );
}
