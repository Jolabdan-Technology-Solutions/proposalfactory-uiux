/**
 * Butler animation library — single source of truth.
 *
 * Every placement in the platform references a video by `id`. Replacing a
 * Version 1 asset means editing the entry below (src, poster, transcript,
 * title, duration, version) — no page needs to be redesigned or recoded.
 */

export type Butler = "Sylvia" | "Eve" | "Oscar";

export type ButlerVideoAsset = {
  /** Stable reference used by every placement. */
  id: string;
  /** Internal label / source file reference. */
  label: string;
  butler: Butler;
  title: string;
  topic: string;
  /** Platform module this asset primarily belongs to. */
  module: string;
  /** Media source. Empty until the produced file is uploaded. */
  src?: string;
  poster?: string;
  /** Human-readable duration, e.g. "1:24". */
  duration?: string;
  version: string;
  activeDate: string;
  /** Where this one asset is referenced across the platform. */
  placements: string[];
  replacementPriority: "high" | "medium" | "low";
  status: "active" | "archived";
  transcript?: string;
  /** Play button wording for this asset. */
  playLabel?: string;
  /** Short line shown under the player. */
  caption?: string;
  /** Play once per session, then offer "Watch again" only. */
  playOncePerSession?: boolean;
};

const V1 = { version: "v1", activeDate: "2026-09-01", status: "active" as const };

/** The 15 Sylvia FAQ clips — titled by the exact question asked. */
const FAQ_QUESTIONS: string[] = [
  "What is The Proposal Factory?",
  "Who is The Proposal Factory for?",
  "How do I get started?",
  "What happens after I complete my intake?",
  "What is a Client Readiness Snapshot?",
  "Who are the Butlers and what do they do?",
  "What does Sylvia help me with?",
  "What does Eve help me with?",
  "What does Oscar help me with?",
  "What is a Human Gate and why does it exist?",
  "How does the platform decide what I see?",
  "Is my information confidential?",
  "Can I save my work and come back later?",
  "How do I get help from a real person?",
  "What does it cost and what do I get?",
];

export const SYLVIA_FAQ: ButlerVideoAsset[] = FAQ_QUESTIONS.map((q, i) => ({
  id: `sylvia-faq-${String(i + 1).padStart(2, "0")}`,
  label: `Sylvia_FAQ_${String(i + 1).padStart(2, "0")}_v1`,
  butler: "Sylvia",
  title: q,
  topic: "Frequently asked questions",
  module: "Help & Learning",
  duration: "0:45",
  placements: [
    "Ask Sylvia: Common Questions",
    "Contextual help throughout the platform",
    "Empty states and first-use help",
  ],
  replacementPriority: "medium",
  playLabel: "Play answer",
  caption: q,
  ...V1,
}));

export const VIDEOS: ButlerVideoAsset[] = [
  {
    id: "sylvia-intake-opening",
    label: "Sylvia_Intake_Opening_v1",
    butler: "Sylvia",
    title: "Welcome — before you begin your intake",
    topic: "Orientation",
    module: "Intake",
    duration: "1:10",
    placements: [
      "Intake welcome screen",
      "New-member onboarding",
      "Landing page",
      "Orientation chapter 1",
    ],
    replacementPriority: "high",
    playLabel: "Hear Sylvia's Welcome",
    caption:
      "Sylvia introduces the platform and the intake, and explains what happens with what you share. Sound is off until you turn it on.",
    ...V1,
  },
  {
    id: "sylvia-intake-closing",
    label: "Sylvia_Intake_Closing_v1",
    butler: "Sylvia",
    title: "What happens next",
    topic: "Routing and next steps",
    module: "Intake",
    duration: "1:05",
    placements: ["Final intake review", "Submission / next-step explanation"],
    replacementPriority: "high",
    playLabel: "Play with sound",
    caption:
      "Your intake is reviewed privately and turned into your Client Readiness Snapshot. From there your next step may lead to proposal or opportunity support, service delivery support with Eve, operational and governance support with Oscar, or a focused conversation with the right human advisor.",
    ...V1,
  },
  {
    id: "eve-events-experiential",
    label: "Eve_Events_Experiential_Overview_v1",
    butler: "Eve",
    title: "Events & Experiential — planning to closeout",
    topic: "Event planning, execution readiness, risk, reporting, closeout",
    module: "Events & Experiential",
    duration: "1:30",
    placements: [
      "Events & Experiential module",
      "Event intake",
      "Event planning dashboard",
      "Start an Event",
      "Event help & resources",
      "Routed into Events from Sylvia",
    ],
    replacementPriority: "high",
    playLabel: "Hear Eve on Events",
    caption:
      "Eve walks through event planning, execution readiness, risk, reporting and closeout. This covers Events & Experiential — it is not her full service-delivery role.",
    ...V1,
  },
  {
    id: "oscar-operations-backoffice",
    label: "Oscar_Operations_BackOffice_v1",
    butler: "Oscar",
    title: "Back office and operations",
    topic: "Operational readiness, workflow, governance, post-award",
    module: "Back Office / Operations",
    duration: "1:25",
    placements: [
      "Back Office / Operations landing",
      "Growth readiness",
      "Post-award transition",
      "Capacity planning",
      "Workflow setup",
      "Accounting / operating dashboard help",
      "Award kickoff",
      "Human Gate & governance education",
    ],
    replacementPriority: "high",
    playOncePerSession: true,
    playLabel: "Meet Oscar",
    caption:
      "Oscar covers approvals, budgets, documents and the audit trail — who signs off on what, and how readiness carries through after award.",
    ...V1,
  },
  ...SYLVIA_FAQ,
];

export function getVideo(id: string): ButlerVideoAsset | undefined {
  return VIDEOS.find((v) => v.id === id);
}

/** Maps a pod to the butler asset that belongs in that module. */
export function videoForPod(pod: number): string | undefined {
  if (pod === 2) return "eve-events-experiential";
  if (pod === 3) return "oscar-operations-backoffice";
  return undefined;
}

/** Contextual FAQ clip suggestions for a given screen path. */
export function faqForPath(path: string): ButlerVideoAsset[] {
  const byQuestion = (q: string) => SYLVIA_FAQ.find((f) => f.title === q)!;
  if (path.includes("approval") || path.includes("audit"))
    return [byQuestion("What is a Human Gate and why does it exist?")];
  if (path.includes("intake"))
    return [
      byQuestion("What happens after I complete my intake?"),
      byQuestion("Can I save my work and come back later?"),
    ];
  if (path.includes("pipeline")) return [byQuestion("How does the platform decide what I see?")];
  return [];
}
