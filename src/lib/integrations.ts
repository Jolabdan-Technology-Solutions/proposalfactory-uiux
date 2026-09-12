/**
 * Integration (MCP connector) families from the integration document.
 * Static wireframe data only — nothing here talks to a live system.
 */

export type IntegrationPhase = "Phase 1" | "Phase 2" | "Future";

export type Integration = {
  /** Connector family name, e.g. "Work Management MCP". */
  family: string;
  /** Named tools in this family. */
  tools: string[];
  /** Which pods use this family. */
  pods: (1 | 2 | 3)[];
  /** Rollout phase from the integration document. */
  phase: IntegrationPhase;
  /** Owning agent or router. */
  owner: string;
  /** What the family actually does in the platform. */
  purpose: string;
};

export const INTEGRATIONS: Integration[] = [
  {
    family: "CRM MCP",
    tools: ["Zoho CRM", "HubSpot", "Salesforce", "Airtable"],
    pods: [1, 3],
    phase: "Phase 1",
    owner: "Pipeline Agent · Sylvia",
    purpose: "Holds the qualified opportunity record and returns the CRM ID against the TPF opportunity ID.",
  },
  {
    family: "Work Management MCP",
    tools: ["Asana", "Monday", "ClickUp", "Jira"],
    pods: [1, 2, 3],
    phase: "Phase 1",
    owner: "Approval Router",
    purpose: "Creates the proposal or event project and mirrors task status back into the pod board.",
  },
  {
    family: "Communications MCP",
    tools: ["Slack", "Teams", "Gmail", "Outlook", "SendGrid", "Twilio"],
    pods: [1, 2, 3],
    phase: "Phase 1",
    owner: "Comms Agent",
    purpose: "Posts gate notifications, approval requests and submission confirmations to the right channel.",
  },
  {
    family: "Document MCP",
    tools: ["Google Drive", "SharePoint", "OneDrive", "Box", "Dropbox"],
    pods: [1, 2, 3],
    phase: "Phase 1",
    owner: "Document Controller",
    purpose: "Stores the solicitation package, drafts and final submissions in the tenant folder.",
  },
  {
    family: "Finance MCP",
    tools: ["QuickBooks", "Xero", "Bill.com", "Stripe", "Square"],
    pods: [1, 2, 3],
    phase: "Phase 1",
    owner: "Budget Tracker · Oscar",
    purpose: "Feeds pricing, event budget and spend guardrails, and flags overruns before a gate.",
  },
  {
    family: "Calendar MCP",
    tools: ["Google Calendar", "Outlook", "Calendly"],
    pods: [1, 2],
    phase: "Phase 1",
    owner: "Schedule Agent",
    purpose: "Books deadlines, review sessions, kickoffs and run-of-show milestones.",
  },
  {
    family: "Audit / Observability MCP",
    tools: ["Sentry", "Datadog", "GCS / S3 Archive"],
    pods: [3],
    phase: "Phase 1",
    owner: "All agents via Oscar",
    purpose: "Writes the immutable audit record for every automatic action and human decision.",
  },
  {
    family: "Event Registration MCP",
    tools: ["Eventbrite", "Cvent", "Bizzabo", "Splash"],
    pods: [2],
    phase: "Phase 2",
    owner: "Registration Manager · Eve",
    purpose: "Opens registration, syncs attendee counts and drives comms lists.",
  },
  {
    family: "Creative Asset MCP",
    tools: ["Canva", "Adobe", "Cloudinary", "Bynder"],
    pods: [1, 2],
    phase: "Phase 2",
    owner: "Brand Guardian",
    purpose: "Pulls approved brand assets into proposals, decks and event collateral.",
  },
  {
    family: "Social / Listening MCP",
    tools: ["Meta", "LinkedIn", "Sprout", "Hootsuite", "Brandwatch"],
    pods: [2],
    phase: "Phase 2",
    owner: "Comms Agent · Eve",
    purpose: "Schedules event promotion and reports reach into closeout.",
  },
  {
    family: "Identity / Access MCP",
    tools: ["Okta", "Azure AD", "Google Workspace"],
    pods: [3],
    phase: "Future",
    owner: "RBAC Manager",
    purpose: "Provisions tenant and sub-tenant access, and keeps role changes on the audit trail.",
  },
  {
    family: "Ad Platform MCP",
    tools: ["Google Ads", "Meta", "LinkedIn", "TikTok", "DV360", "Trade Desk"],
    pods: [2],
    phase: "Future",
    owner: "Media Planner",
    purpose: "Reserved for paid promotion of events and future marketing pods.",
  },
  {
    family: "Research / Survey MCP",
    tools: ["Qualtrics", "SurveyMonkey", "SPSS", "Tableau"],
    pods: [2, 3],
    phase: "Future",
    owner: "Data Analyst",
    purpose: "Post-event surveys and maturity reporting inputs.",
  },
  {
    family: "CMS / Web MCP",
    tools: ["WordPress", "HubSpot CMS", "Webflow", "GitHub", "Vercel"],
    pods: [2],
    phase: "Future",
    owner: "Web Agent",
    purpose: "Publishes event pages and public-facing content behind a human gate.",
  },
];

export function integrationsForPod(pod: 1 | 2 | 3): Integration[] {
  const order: Record<IntegrationPhase, number> = { "Phase 1": 0, "Phase 2": 1, Future: 2 };
  return INTEGRATIONS.filter((i) => i.pods.includes(pod)).sort(
    (a, b) => order[a.phase] - order[b.phase] || a.family.localeCompare(b.family),
  );
}
