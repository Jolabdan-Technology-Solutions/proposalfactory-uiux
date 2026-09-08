import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import tpfLogo from "@/assets/tpf-logo.png";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Create your account with your name, organisation and contact details, then meet your butlers and set up access.",
      },
      { property: "og:title", content: "Create Your Account" },
      {
        property: "og:description",
        content: "A few details to get you set up on The Proposal Factory.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SignUpScreen,
});

const FIELDS = [
  { id: "first", label: "First name", type: "text", placeholder: "Jordan", half: true },
  { id: "last", label: "Last name", type: "text", placeholder: "Rivera", half: true },
  { id: "org", label: "Organisation", type: "text", placeholder: "Rivera Consulting LLC" },
  { id: "email", label: "Work email", type: "email", placeholder: "you@company.com" },
  { id: "phone", label: "Phone", type: "tel", placeholder: "(555) 010-2233", half: true },
  { id: "title", label: "Job title", type: "text", placeholder: "Managing Director", half: true },
  { id: "password", label: "Create a password", type: "password", placeholder: "••••••••" },
];

function SignUpScreen() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const ready = Boolean(values["first"] && values["last"] && values["email"] && agreed);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-dashed border-wireline px-6 py-5 lg:px-14">
        <Link to="/start" className="min-w-0">
          <img src={tpfLogo} alt="The Proposal Factory" className="h-20 w-auto sm:h-24" />
        </Link>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          New account · Step 1 of 3
        </span>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
        <Link
          to="/start"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A few details so we know who you are. Next you'll meet your butlers, then set up the
          access for your role.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <label key={f.id} className={f.half ? "col-span-1" : "col-span-2"}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {f.label}
              </span>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-dashed border-wireline bg-card/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent"
              />
            </label>
          ))}
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-dashed border-wireline bg-card/40 p-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--accent)]"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            I agree to the terms of use and privacy notice.
          </span>
        </label>

        <button
          type="button"
          disabled={!ready}
          onClick={() => navigate({ to: "/orientation" })}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UserPlus className="h-4 w-4" /> Create account <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/roles" className="text-accent underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </main>

      <footer className="border-t border-dashed border-wireline px-6 py-4 font-mono text-[10px] text-muted-foreground lg:px-14">
        © 2026 Mr. B2G &amp; Associates, LLC · The Proposal Factory (TPF)
      </footer>
    </div>
  );
}
