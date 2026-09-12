import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, titleFromSlug } from "@/components/wireframe/placeholder-page";

export const Route = createFileRoute("/_app/account/$slug")({
  head: () => ({
    meta: [
      { title: "Account — The Proposal Factory™" },
      { name: "description", content: "Memberships, approvals, intake submissions and account settings." },
      { property: "og:title", content: "Account — The Proposal Factory™" },
      { property: "og:description", content: "Memberships, approvals, intake submissions and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const BLURBS: Record<string, string> = {
  memberships: "People on this account, the tenants they belong to and the roles they hold.",
  "pending-approvals": "Anything waiting on your decision, across all three pods.",
  "intake-submissions": "Client intake surveys that have come back and still need review.",
  settings: "Account name, branding, notifications and defaults.",
};

function AccountPage() {
  const { slug } = Route.useParams();
  return (
    <PlaceholderPage
      section="Account"
      title={titleFromSlug(slug)}
      blurb={BLURBS[slug] ?? "Account area."}
    />
  );
}
