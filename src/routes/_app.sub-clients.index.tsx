import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  Copy,
  Link2,
  Plus,
  Search,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { SUB_CLIENTS, TENANTS, subClientsForTenant, type Plan } from "@/lib/subclients";

export const Route = createFileRoute("/_app/sub-clients/")({
  head: () => ({
    meta: [
      { title: "Sub-Clients — The Proposal Factory" },
      { name: "description", content: "Manage B2B2C sub-client accounts with isolated training and proposals." },
      { property: "og:title", content: "Sub-Clients — The Proposal Factory" },
      { property: "og:description", content: "Tenant and sub-client directory with plans, status and proposal volume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubClientsDirectory,
});

const PLAN_TONE: Record<Plan, string> = {
  basic: "border-wireline text-muted-foreground",
  professional: "border-pod-2/60 text-pod-2",
  enterprise: "border-accent/60 text-accent",
};

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${className}`}>{children}</span>
  );
}

function Stat({ icon: Icon, value, label, note }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string; note?: string }) {
  return (
    <div className="rounded-lg border border-wireline p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-accent" />
        <div>
          <div className="text-xl font-semibold">{value}</div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
          {note && <div className="font-mono text-[10px] text-accent">{note}</div>}
        </div>
      </div>
    </div>
  );
}

function SubClientsDirectory() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "Active" | "Inactive">("ALL");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SUB_CLIENTS.filter(
      (s) =>
        (status === "ALL" || s.status === status) &&
        (!needle || s.name.toLowerCase().includes(needle) || s.industry.toLowerCase().includes(needle)),
    );
  }, [q, status]);

  const active = SUB_CLIENTS.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Sub-Clients</h1>
          <p className="text-sm text-muted-foreground">
            Manage B2B2C sub-client accounts with isolated training and proposals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Copy Intake Survey Link", icon: Link2 },
            { label: "Auto-fill Client Data", icon: Sparkles },
            { label: "Add Tenant", icon: Plus },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:border-accent/60 hover:text-foreground"
            >
              <b.icon className="h-3.5 w-3.5" /> {b.label}
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Add Sub-Client
          </button>
        </div>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-wireline p-4">
        <div>
          <div className="text-sm font-medium">Client Intake Survey</div>
          <p className="text-xs text-muted-foreground">
            Send this link to new clients. They fill out the form, you review and approve.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded border border-wireline px-2 py-1 font-mono text-[10px] text-muted-foreground">
            https://proposal-factory.web.app/intake/new
          </code>
          <button type="button" className="flex items-center gap-1 rounded-md border border-wireline px-2 py-1 font-mono text-[10px] text-muted-foreground hover:text-foreground">
            <Copy className="h-3 w-3" /> Copy
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Building2} value={String(SUB_CLIENTS.length + TENANTS.length)} label="All" />
        <Stat icon={CheckCircle2} value={String(active)} label="Active" note="Filtered" />
        <Stat icon={XCircle} value={String(SUB_CLIENTS.length - active)} label="Inactive" />
        <Stat icon={Users} value="34" label="Proposals this month" />
      </section>

      <section className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border border-wireline px-2 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sub-clients…"
            className="w-56 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        {(["ALL", "Active", "Inactive"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[10px] " +
              (status === s ? "border-accent bg-accent/15 text-accent" : "border-wireline text-muted-foreground hover:text-foreground")
            }
          >
            {s === "ALL" ? "All" : s}
          </button>
        ))}
        <span className="font-mono text-[10px] text-muted-foreground">Sample data · no live systems connected</span>
      </section>

      <p className="font-mono text-[10px] text-muted-foreground">
        Tenants on The Proposal Factory (TPF): Mr. B2G is the platform owner and a tenant. Every tenant runs its own
        sub-clients with isolated training.
      </p>

      <div className="space-y-5">
        {TENANTS.map((tenant) => {
          const rows = subClientsForTenant(tenant.id).filter((s) => filtered.includes(s));
          const total = subClientsForTenant(tenant.id).length;
          return (
            <section key={tenant.id} className="rounded-lg border border-wireline">
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-wireline p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-accent" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{tenant.name}</span>
                      {tenant.platformOwner && <Pill className="border-accent/60 text-accent">Platform Owner</Pill>}
                      <Pill className="border-wireline text-muted-foreground">Tenant</Pill>
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {tenant.descriptor} · {total} sub-clients
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill className={PLAN_TONE[tenant.plan]}>{tenant.plan}</Pill>
                  <Pill className="border-accent/60 bg-accent/10 text-accent">{tenant.status}</Pill>
                </div>
              </header>

              {total === 0 ? (
                <p className="p-4 font-mono text-[11px] text-muted-foreground">
                  {tenant.name} has no sub-clients yet.
                </p>
              ) : rows.length === 0 ? (
                <p className="p-4 font-mono text-[11px] text-muted-foreground">No sub-clients match this filter.</p>
              ) : (
                <ul className="divide-y divide-dashed divide-wireline">
                  {rows.map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/sub-clients/$id"
                        params={{ id: s.id }}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-accent/5"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              {s.name}
                              {s.isTenant && <Pill className="border-wireline text-muted-foreground">Tenant</Pill>}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground">{s.industry}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Pill className={PLAN_TONE[s.plan]}>{s.plan}</Pill>
                          <Pill className="border-accent/60 bg-accent/10 text-accent">{s.status}</Pill>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {s.proposalsPerMonth} props/mo
                          </span>
                          <span className="font-mono text-[10px] text-accent">Open profile →</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
