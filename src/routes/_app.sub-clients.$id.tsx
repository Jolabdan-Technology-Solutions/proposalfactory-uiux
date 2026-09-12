import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleDot,
  FileText,
  Image as ImageIcon,
  Pencil,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { profileFor, subClientById, type ReadinessItem } from "@/lib/subclients";

export const Route = createFileRoute("/_app/sub-clients/$id")({
  head: () => ({
    meta: [
      { title: "Sub-Client Profile — The Proposal Factory" },
      { name: "description", content: "Profile, brand story, training data and onboarding readiness for a sub-client account." },
      { property: "og:title", content: "Sub-Client Profile — The Proposal Factory" },
      { property: "og:description", content: "Company profile, brand, training, pipeline and capability statement for one sub-client." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubClientProfilePage,
});

const TABS = [
  { id: "profile", label: "Profile", icon: Building2 },
  { id: "brand", label: "Brand", icon: Pencil },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "training", label: "Training", icon: BookOpen },
  { id: "subs", label: "Subs", icon: Briefcase },
  { id: "pipeline", label: "Pipeline", icon: CircleDot },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "package", label: "Package", icon: Briefcase },
  { id: "cap", label: "Cap Statement", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Check({ item }: { item: ReadinessItem }) {
  const Icon = item.state === "done" ? CheckCircle2 : item.state === "missing" ? XCircle : CircleDot;
  const tone =
    item.state === "done" ? "text-accent" : item.state === "missing" ? "text-destructive" : "text-muted-foreground";
  return (
    <li className="flex items-center gap-2 text-xs">
      <Icon className={`h-3.5 w-3.5 ${tone}`} />
      <span className={item.state === "done" ? "text-muted-foreground line-through" : ""}>{item.label}</span>
    </li>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-wireline p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      {subtitle && <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-md border border-wireline bg-transparent px-2 py-1.5 text-xs outline-none focus:border-accent/60"
      />
      {hint && <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-wireline p-8 text-center">
      <p className="text-sm">{label}</p>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">Sample data · wireframe placeholder</p>
    </div>
  );
}

function SubClientProfilePage() {
  const { id } = useParams({ from: "/_app/sub-clients/$id" });
  const sub = subClientById(id);
  const [tab, setTab] = useState<TabId>("profile");

  if (!sub) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Sub-client not found</h1>
        <Link to="/sub-clients" className="font-mono text-[11px] text-accent">
          ← Back to Sub-Clients
        </Link>
      </div>
    );
  }

  const p = profileFor(sub);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-wireline p-4">
        <div className="flex items-center gap-3">
          <Link
            to="/sub-clients"
            className="rounded-md border border-wireline p-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Building2 className="h-6 w-6 text-accent" />
          <div>
            <h1 className="text-xl font-semibold">{sub.name}</h1>
            <p className="font-mono text-[10px] text-muted-foreground">{sub.industry}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
            Demote to Sub-Client
          </button>
          <span className="rounded-full border border-wireline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Tenant</span>
          <span className="rounded-full border border-accent/60 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">{sub.status}</span>
          <button type="button" className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-wireline p-4">
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Subscription</div>
          <div className="mt-1 text-sm font-medium">{p.subscription.plan}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{p.subscription.price}</div>
          <div className="mt-1 text-sm text-accent">{p.subscription.annual}</div>
        </div>
        <div className="rounded-lg border border-wireline p-4">
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Proposals</div>
          <div className="mt-1 text-xl font-semibold">{p.proposals.used} / {p.proposals.cap}</div>
          <div className="font-mono text-[10px] text-muted-foreground">this month</div>
        </div>
        <div className="rounded-lg border border-wireline p-4">
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Training docs</div>
          <div className="mt-1 text-xl font-semibold">{p.trainingDocs}</div>
          <div className="font-mono text-[10px] text-muted-foreground">uploaded</div>
        </div>
        <div className="rounded-lg border border-wireline p-4">
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Onboarding</div>
          <div className="mt-1 text-xl font-semibold">{p.onboarding}</div>
        </div>
      </section>

      <section className="rounded-lg border border-wireline p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium">Onboarding readiness</h2>
            <p className="text-xs text-muted-foreground">
              3 required fields missing — agents stay blocked until these are filled.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              {p.readiness.filled}/{p.readiness.total}
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-accent"
                style={{ width: `${(p.readiness.filled / p.readiness.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Company profile</div>
            <ul className="space-y-1.5">{p.readiness.companyProfile.map((i) => <Check key={i.label} item={i} />)}</ul>
          </div>
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Brand &amp; design</div>
            <ul className="space-y-1.5">{p.readiness.brand.map((i) => <Check key={i.label} item={i} />)}</ul>
          </div>
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Training data</div>
            <ul className="space-y-1.5">{p.readiness.training.map((i) => <Check key={i.label} item={i} />)}</ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-wireline pt-3">
          <span className="font-mono text-[10px] text-muted-foreground">
            Capability profile generated (9/8/2026) · Website crawl: success · {p.trainingDocs} training docs
          </span>
          <button type="button" className="flex items-center gap-1 rounded-md border border-wireline px-2 py-1 font-mono text-[10px] text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-3 w-3" /> Refresh capabilities
          </button>
        </div>
        <p className="mt-3 border-l-2 border-accent/50 pl-3 text-xs italic text-muted-foreground">
          “{p.capabilityBlurb}”
        </p>
      </section>

      <nav className="flex flex-wrap gap-1.5 border-b border-wireline pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] transition-colors " +
              (tab === t.id
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-accent/5 hover:text-foreground")
            }
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </nav>

      {tab === "profile" && (
        <div className="space-y-4">
          <Card
            title="Company profile"
            subtitle="Identity, contact and government credentials. Required fields are flagged in the readiness checklist above."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Website URL *" value={p.identity.website} />
              <Field label="Industry *" value={p.identity.industry} />
              <Field label="Primary POC name *" value={p.identity.poc.name} />
              <Field label="Primary POC email *" value={p.identity.poc.email} />
              <Field label="Primary POC phone *" value={p.identity.poc.phone} />
              <Field label="CAGE code" value={p.credentials.cage} />
              <Field label="DUNS number" value={p.credentials.duns} />
              <Field label="SAM UEI" value={p.credentials.uei} />
            </div>
            <Field
              label="NAICS codes (comma separated) *"
              value={p.naics}
              hint="Exact 6-digit codes drive Pipeline maps. After edits, run Analyze Entire Pipeline, then pin clients in Bulk Edit."
            />
            <Field label="Certifications / set-asides (comma separated) *" value={p.certifications} />
            <Field label="Key personnel (comma separated)" value={p.keyPersonnel} />
            <Field label="Target agencies (comma separated)" value={p.targetAgencies} />
            <button type="button" className="rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-90">
              Save profile
            </button>
          </Card>

          <Card title="Company story &amp; approach" subtitle="Captured at intake — agents write in this voice.">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Company overview</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.story.overview}</p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Company purpose</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.story.purpose}</p>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Differentiators</div>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {p.story.differentiators.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </div>
            <Field label="Company address" value={p.story.address} hint="Printed in the capability statement contact header." />
            <button type="button" className="rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
              Save company story
            </button>
          </Card>

          <Card title="Past performance projects" subtitle="Up to 3 projects with case studies and photos, used to build the capability statement.">
            <p className="font-mono text-[11px] text-muted-foreground">
              0 of 3 projects · none added yet.
            </p>
            <button type="button" className="rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
              Add project
            </button>
          </Card>

          <Card title="Meeting roster" subtitle="The standard team for this client. Invitations are prefilled from this list; nothing is sent until someone confirms.">
            <p className="font-mono text-[11px] text-muted-foreground">
              Nobody is on this roster yet. Unassigned: Capture Lead, Compliance Lead, Document Controller, Executive
              Sponsor, Pink Team, Pricing Lead, Proposal Manager, QA Lead, Red Team, Section Owners, Technical Lead.
            </p>
            <button type="button" className="rounded-md border border-wireline px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
              Add person
            </button>
          </Card>
        </div>
      )}

      {tab === "brand" && <Placeholder label="Brand voice, colours and logo kit for this sub-client." />}
      {tab === "images" && <Placeholder label="Image library used in proposals and capability statements." />}
      {tab === "training" && <Placeholder label={`${p.trainingDocs} training documents, isolated to this sub-client.`} />}
      {tab === "subs" && <Placeholder label="Sub-accounts and referred clients under this account." />}
      {tab === "pipeline" && <Placeholder label="Opportunities mapped to this sub-client." />}
      {tab === "proposals" && <Placeholder label="Drafts, submitted and archived proposals for this sub-client." />}
      {tab === "package" && <Placeholder label="Subscription package, limits and billing history." />}
      {tab === "cap" && <Placeholder label="Generated capability statement preview and download." />}
    </div>
  );
}
