import { createFileRoute, redirect } from "@tanstack/react-router";
import { PlaceholderPage, titleFromSlug } from "@/components/wireframe/placeholder-page";
import { PlatformScreen } from "@/components/wireframe/analytics-kit";
import { PLATFORM_SCREENS } from "@/lib/platform-analytics";

export const Route = createFileRoute("/_app/platform/$slug")({
  // There is only one analytics view now — the old "platform analytics" link
  // lands on it instead of showing a second, near-identical screen.
  beforeLoad: ({ params }) => {
    if (params.slug === "platform-analytics") {
      throw redirect({ to: "/platform/$slug", params: { slug: "analytics" } });
    }
  },
  head: () => ({
    meta: [
      { title: "Platform — The Proposal Factory™" },
      { name: "description", content: "Platform operations, evaluation, safety and analytics views." },
      { property: "og:title", content: "Platform — The Proposal Factory™" },
      { property: "og:description", content: "Platform operations, evaluation, safety and analytics views." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlatformPage,
});

function PlatformPage() {
  const { slug } = Route.useParams();
  const data = PLATFORM_SCREENS[slug];
  if (data) return <PlatformScreen data={data} />;
  return <PlaceholderPage section="Platform" title={titleFromSlug(slug)} blurb="Platform area." />;
}
