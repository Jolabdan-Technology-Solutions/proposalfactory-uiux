import { createFileRoute } from "@tanstack/react-router";
import { PlatformScreen } from "@/components/wireframe/analytics-kit";
import { PlaceholderPage, titleFromSlug } from "@/components/wireframe/placeholder-page";
import { EVENT_OPS_SCREENS } from "@/lib/event-ops";

export const Route = createFileRoute("/_app/event-ops/$slug")({
  head: () => ({
    meta: [
      { title: "Events Back Office — The Proposal Factory™" },
      {
        name: "description",
        content:
          "Pod 2 back-office views: event approval queue, audit trail, budget guardrails, vendors and documents.",
      },
      { property: "og:title", content: "Events Back Office — The Proposal Factory™" },
      {
        property: "og:description",
        content: "Approvals, audit, budget, vendors and documents for event delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventOpsPage,
});

function EventOpsPage() {
  const { slug } = Route.useParams();
  const data = EVENT_OPS_SCREENS[slug];
  if (data) return <PlatformScreen data={data} />;
  return (
    <PlaceholderPage
      section="Pod 2 · Events Back Office"
      title={titleFromSlug(slug)}
      blurb="Event back-office area."
    />
  );
}
