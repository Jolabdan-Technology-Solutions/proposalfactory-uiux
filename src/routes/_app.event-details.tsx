import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarPlus, Paperclip } from "lucide-react";
import { DEALS, money } from "@/lib/deals";

type Search = { proposal?: string };

export const Route = createFileRoute("/_app/event-details")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search['proposal'] === "string" ? { proposal: search['proposal'] } : {},
  head: () => ({
    meta: [
      { title: "Event Details — The Proposal Factory™" },
      { name: "description", content: "Capture the event brief before running the 48-step Event Creation Wizard." },
      { property: "og:title", content: "Event Details — The Proposal Factory™" },
      { property: "og:description", content: "Capture the event brief before running the 48-step Event Creation Wizard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventDetails,
});

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        className="mt-1 w-full rounded-md border border-wireline bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function EventDetails() {
  const { proposal } = Route.useSearch();
  const navigate = useNavigate();
  const source = DEALS.find((d) => d.id === proposal);

  const [name, setName] = useState(source ? `${source.name} — Event` : "");
  const [client, setClient] = useState(source?.subClient ?? "");
  const [type, setType] = useState("Conference");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [budget, setBudget] = useState(source ? String(Math.round(source.value * 0.15)) : "");
  const [objectives, setObjectives] = useState("");
  const [files, setFiles] = useState<string[]>(source ? ["Awarded proposal.pdf", "Statement of work.pdf"] : []);

  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pod-2">
          Pod 2 · Events &amp; Experiential
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <CalendarPlus className="h-5 w-5 text-pod-2" /> Event details
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Tell Eve what the event is. Whatever you enter here — plus anything you attach — feeds the Event Creation
          Wizard, which builds the event across the 48-step workflow.
        </p>
      </header>

      {source && (
        <section className="rounded-xl border border-wireline bg-card/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Carried over from the won proposal
          </p>
          <p className="mt-1 text-sm font-medium">{source.name}</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {source.rfp} · {source.agency} · {money(source.value)} award · owner {source.owner}
          </p>
        </section>
      )}

      <section className="grid gap-4 rounded-xl border border-wireline p-5 sm:grid-cols-2">
        <Field label="Event name" value={name} onChange={setName} placeholder="e.g. Navy Innovation Summit" />
        <Field label="Client / sub-client" value={client} onChange={setClient} placeholder="Who is it for?" />
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Event type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-md border border-wireline bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {["Conference", "Gala / awards", "Expo", "Roadshow", "Career fair", "Community day"].map((t) => (
              <option key={t} value={t} className="bg-background">
                {t}
              </option>
            ))}
          </select>
        </label>
        <Field label="Target date" value={date} onChange={setDate} type="date" />
        <Field label="Location" value={location} onChange={setLocation} placeholder="City / venue preference" />
        <Field label="Expected attendees" value={attendees} onChange={setAttendees} placeholder="e.g. 450" />
        <Field label="Budget (USD)" value={budget} onChange={setBudget} placeholder="e.g. 250000" />
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Objectives &amp; must-haves
          </span>
          <textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            rows={4}
            placeholder="Audience, outcomes, VIPs, sponsors, brand rules…"
            className="mt-1 w-full rounded-md border border-wireline bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <div className="sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Supporting files
          </span>
          <div className="mt-1 rounded-md border border-wireline p-4">
            <button
              type="button"
              onClick={() => setFiles((f) => [...f, `Brief attachment ${f.length + 1}.pdf`])}
              className="inline-flex items-center gap-1.5 rounded-md border border-wireline px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:border-accent hover:text-foreground"
            >
              <Paperclip className="h-3.5 w-3.5" /> Attach file
            </button>
            <ul className="mt-3 space-y-1">
              {files.map((f) => (
                <li key={f} className="font-mono text-[10px] text-muted-foreground">
                  · {f}
                </li>
              ))}
              {files.length === 0 && (
                <li className="font-mono text-[10px] text-muted-foreground">No files attached yet.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/event-wizard",
              search: {
                name: name || "Untitled event",
                client: client || "Unassigned",
                type,
                date,
                location,
                attendees,
                budget,
                objectives,
                files: String(files.length),
                ...(proposal ? { proposal } : {}),
              },
            })
          }
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Continue to Event Creation Wizard
        </button>
        <Link to="/pod2" className="font-mono text-[10px] text-muted-foreground hover:text-accent">
          Cancel
        </Link>
        <span className="font-mono text-[10px] text-muted-foreground">
          Sample data · nothing is saved to a live system
        </span>
      </div>
    </div>
  );
}
