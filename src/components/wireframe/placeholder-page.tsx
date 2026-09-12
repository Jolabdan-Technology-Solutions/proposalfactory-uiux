/**
 * Shared wireframe placeholder for Platform / Account areas that exist in the
 * navigation but have no detailed screen designed yet. Static sample content.
 */
export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0]!.toUpperCase() + w.slice(1)))
    .join(" ");
}

export function PlaceholderPage({
  section,
  title,
  blurb,
}: {
  section: string;
  title: string;
  blurb: string;
}) {
  return (
    <div className="space-y-6">
      <header>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{section}</div>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{blurb}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {["This week", "Last 30 days", "All time"].map((k) => (
          <div key={k} className="rounded-xl border border-wireline p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
            <p className="mt-2 h-6 w-20 rounded bg-secondary" />
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-wireline p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Layout preview</p>
        <div className="mt-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md border border-wireline px-3 py-2.5">
              <span className="h-4 w-4 rounded-full bg-secondary" />
              <span className="h-3 flex-1 rounded bg-secondary" />
              <span className="h-3 w-16 rounded bg-secondary" />
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] text-muted-foreground">
          Sample layout · no live systems connected
        </p>
      </section>
    </div>
  );
}
