import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Download,
  FileText,
  Search,
  Upload,
  X,
} from "lucide-react";

/* ---------------------------------------------------------------- data ---- */

const CATEGORIES = [
  "Training",
  "Opportunities",
  "RFP / Solicitation",
  "Proposals & drafts",
  "Boilerplate & templates",
  "Past performance",
  "Contracts & awards",
  "Compliance & policy",
  "Uploads (misc.)",
] as const;

type Category = (typeof CATEGORIES)[number];

type Doc = {
  id: string;
  name: string;
  category: Category;
  type: "PDF" | "DOCX" | "XLSX" | "PPTX" | "MP4" | "CSV";
  size: string;
  owner: string;
  relatedTo: string;
  uploaded: string; // ISO
};

const DOCS: Doc[] = [
  { id: "D-1001", name: "Proposal Factory — Onboarding Guide.pdf", category: "Training", type: "PDF", size: "4.2 MB", owner: "Super Administrator M.", relatedTo: "Platform", uploaded: "2026-08-14" },
  { id: "D-1002", name: "Sylvia Intake Walkthrough.mp4", category: "Training", type: "MP4", size: "128 MB", owner: "Super Administrator M.", relatedTo: "Platform", uploaded: "2026-08-14" },
  { id: "D-1003", name: "Capture Manager Playbook.docx", category: "Training", type: "DOCX", size: "1.1 MB", owner: "Alicia R.", relatedTo: "Pod 1", uploaded: "2026-07-30" },
  { id: "D-1004", name: "Pipeline Import — August.csv", category: "Opportunities", type: "CSV", size: "312 KB", owner: "System", relatedTo: "Pipeline", uploaded: "2026-09-01" },
  { id: "D-1005", name: "Opportunity Brief — USACE Facilities.pdf", category: "Opportunities", type: "PDF", size: "880 KB", owner: "Alicia R.", relatedTo: "OPP-2214", uploaded: "2026-08-28" },
  { id: "D-1006", name: "RFP W912DY-26-R-0042.pdf", category: "RFP / Solicitation", type: "PDF", size: "12.6 MB", owner: "System", relatedTo: "OPP-2214", uploaded: "2026-08-27" },
  { id: "D-1007", name: "Amendment 0002 — Q&A Responses.pdf", category: "RFP / Solicitation", type: "PDF", size: "640 KB", owner: "System", relatedTo: "OPP-2214", uploaded: "2026-09-03" },
  { id: "D-1008", name: "Volume I — Technical (Draft v4).docx", category: "Proposals & drafts", type: "DOCX", size: "3.4 MB", owner: "Marcus T.", relatedTo: "OPP-2214", uploaded: "2026-09-05" },
  { id: "D-1009", name: "Volume II — Price Workbook.xlsx", category: "Proposals & drafts", type: "XLSX", size: "790 KB", owner: "Finance", relatedTo: "OPP-2214", uploaded: "2026-09-05" },
  { id: "D-1010", name: "Executive Summary Boilerplate.docx", category: "Boilerplate & templates", type: "DOCX", size: "220 KB", owner: "Library", relatedTo: "Reusable", uploaded: "2026-05-12" },
  { id: "D-1011", name: "Compliance Matrix Template.xlsx", category: "Boilerplate & templates", type: "XLSX", size: "180 KB", owner: "Library", relatedTo: "Reusable", uploaded: "2026-05-12" },
  { id: "D-1012", name: "Past Performance — City of Aurora.pdf", category: "Past performance", type: "PDF", size: "1.9 MB", owner: "Library", relatedTo: "CPARS", uploaded: "2026-03-08" },
  { id: "D-1013", name: "Past Performance — VA Region 4.pdf", category: "Past performance", type: "PDF", size: "2.3 MB", owner: "Library", relatedTo: "CPARS", uploaded: "2026-03-08" },
  { id: "D-1014", name: "Award Notice — GSA 47QT.pdf", category: "Contracts & awards", type: "PDF", size: "410 KB", owner: "Back Office", relatedTo: "OPP-1987", uploaded: "2026-06-19" },
  { id: "D-1015", name: "Signed Subcontract — Atlas Defense.pdf", category: "Contracts & awards", type: "PDF", size: "1.2 MB", owner: "Back Office", relatedTo: "OPP-1987", uploaded: "2026-06-25" },
  { id: "D-1016", name: "Data Handling & Privacy Policy.pdf", category: "Compliance & policy", type: "PDF", size: "560 KB", owner: "Super Administrator M.", relatedTo: "Platform", uploaded: "2026-02-02" },
  { id: "D-1017", name: "Capability Statement (2026).pptx", category: "Uploads (misc.)", type: "PPTX", size: "6.8 MB", owner: "Marketing", relatedTo: "Company", uploaded: "2026-04-17" },
  { id: "D-1018", name: "Scanned Vendor Forms.pdf", category: "Uploads (misc.)", type: "PDF", size: "3.1 MB", owner: "Alicia R.", relatedTo: "Company", uploaded: "2026-07-02" },
];

type SortKey = "name" | "category" | "owner" | "uploaded";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* --------------------------------------------------------------- screen --- */

function DocumentLibrary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"ALL" | Category>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = DOCS.filter(
      (d) =>
        (cat === "ALL" || d.category === cat) &&
        (!needle ||
          d.name.toLowerCase().includes(needle) ||
          d.relatedTo.toLowerCase().includes(needle) ||
          d.owner.toLowerCase().includes(needle)),
    );
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = sortKey === "uploaded" ? av.localeCompare(bv) : av.localeCompare(bv, undefined, { sensitivity: "base" });
      return asc ? cmp : -cmp;
    });
  }, [q, cat, sortKey, asc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const SortHead = ({ label, k, className = "" }: { label: string; k: SortKey; className?: string }) => (
    <th className={`px-4 py-3 text-left font-medium ${className}`}>
      <button
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        {sortKey === k ? (
          asc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownUp className="h-3.5 w-3.5 opacity-40" />
        )}
      </button>
    </th>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Document Library</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Every document added to the system — training material, opportunity files, solicitations,
          drafts, templates, past performance, contracts and uploads. Search, sort and download.
        </p>
      </header>

      {/* toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents, owner or related item"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-9 text-sm outline-none focus:border-primary"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as "ALL" | Category)}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="ALL">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted">
          <Upload className="h-4 w-4" /> Upload document
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted">
          <Download className="h-4 w-4" /> Download all
        </button>
      </div>

      <p className="mb-2 text-xs text-muted-foreground">
        {rows.length} of {DOCS.length} documents
      </p>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide">
            <tr>
              <SortHead label="Document" k="name" />
              <SortHead label="Category" k="category" className="hidden md:table-cell" />
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Related to</th>
              <SortHead label="Added by" k="owner" className="hidden lg:table-cell" />
              <SortHead label="Date added" k="uploaded" className="hidden sm:table-cell" />
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Download</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.type} · {d.size} · {d.id}
                        <span className="md:hidden"> · {d.category}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{d.category}</td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{d.relatedTo}</td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{d.owner}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{fmt(d.uploaded)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
                    aria-label={`Download ${d.name}`}
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No documents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/documents")({
  head: () => ({
    meta: [
      { title: "Document Library — The Proposal Factory™" },
      {
        name: "description",
        content:
          "All documents in The Proposal Factory: training, opportunities, solicitations, drafts, templates, past performance and contracts — searchable and downloadable.",
      },
      { property: "og:title", content: "Document Library — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Search, sort and download every document added to The Proposal Factory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentLibrary,
});
