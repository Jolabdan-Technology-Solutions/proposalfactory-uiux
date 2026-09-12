export type RoleId =
  | "platform-owner-admin"
  | "super-admin"
  | "subtenant-admin"
  | "subtenant-user"
  | "trainer"
  | "proposal-manager"
  | "reviewer"
  | "viewer";

export type Role = {
  id: RoleId;
  name: string;
  /**
   * What the role covers, in functional terms.
   *
   * This must describe ACCESS, never the business: no named individuals, no
   * statement of who owns or built the platform, no share-of-platform figure.
   * `/signin` and `/dashboard` both render it, and `/signin` sits in front of
   * the auth wall — so anything written here is published to anyone who
   * reaches the app. A `who` field naming real people and an ownership line
   * used to live alongside this one and were rendered on both screens; they
   * were removed rather than hidden, so no future consumer can resurface them.
   */
  scope: string;
  /** Landing screen after sign-in. */
  home: string;
  /** Pods visible in this environment. */
  pods: Array<1 | 2 | 3 | 4>;
  /** Access tier — 1 = widest. Roles on the same tier have the same reach. */
  tier: number;
  /** Can this role act on human gates (approve / decide)? */
  canDecide: boolean;
  sees: string[];
  hidden: string[];
  status: "active" | "planned";
};

export const ROLES: Role[] = [
  {
    id: "platform-owner-admin",
    name: "Platform Owner",
    who: "Platform Owner — owns the platform",
    scope: "Whole platform. Nothing is out of reach.",
    tier: 1,
    home: "/dashboard",
    pods: [1, 2, 3, 4],
    canDecide: true,
    status: "active",
    sees: [
      "Every tenant and every sub-tenant side by side",
      "All pods: Proposal Factory, Events & Experiential, Back-Office, Reference",
      "Memberships, RBAC audit, access reports, over-permission checks",
      "Billing, licensing, platform settings, connector gateway",
      "Full audit trail across the whole platform",
    ],
    hidden: ["Nothing is hidden at this level"],
  },
  {
    id: "super-admin",
    name: "Super Administrator",
    who: "Super Administrator — built the platform",
    scope: "Same reach as the platform owner. The difference is ownership, not access.",
    tier: 1,
    home: "/dashboard",
    pods: [1, 2, 3, 4],
    canDecide: true,
    status: "active",
    sees: [
      "Everything the platform owner sees",
      "Every tenant, every sub-tenant, every pod",
      "Memberships, RBAC audit, connectors, full audit trail",
      "Can grant and revoke any role, including sub-tenant admins",
    ],
    hidden: ["Nothing — ownership of the business is the only difference"],
  },
  {
    id: "subtenant-admin",
    name: "Sub-Tenant Admin",
    who: "Admin User — MTM",
    scope: "One sub-tenant (MTM) and everyone working under it.",
    tier: 2,
    home: "/dashboard",
    pods: [1, 2, 3],
    canDecide: true,
    status: "active",
    sees: [
      "Every pursuit, event and back-office item belonging to MTM",
      "All sub-tenant users under MTM and what they are working on",
      "Add, remove and set the role of people inside MTM",
      "Approvals, budgets, documents and audit for MTM",
    ],
    hidden: [
      "Any other sub-tenant's work",
      "Platform ownership, licensing and billing",
      "Platform-wide access audit and connector settings",
    ],
  },
  {
    id: "proposal-manager",
    name: "Proposal Manager",
    scope: "The proposal and event work itself, from opportunity to submission.",
    tier: 3,
    home: "/pipeline",
    pods: [1, 2],
    canDecide: false,
    status: "active",
    sees: [
      "Pursuits and events assigned to them",
      "All 70 proposal steps and all 48 event steps for their work",
      "Draft, edit, upload documents, run compliance checks",
      "Send work into the approvals queue",
    ],
    hidden: [
      "Approving their own gates — Admin User or an admin decides",
      "Adding or removing people",
      "Budgets and organisation-wide audit",
      "Platform settings and reference material",
    ],
  },
  {
    id: "trainer",
    name: "Trainer",
    scope: "Training material and practice content — never live pursuits.",
    tier: 3,
    home: "/dashboard",
    pods: [1, 4],
    canDecide: false,
    status: "active",
    sees: [
      "Training modules, walkthroughs and sample pursuits",
      "A read-only view of the workflow so it can be taught",
      "Capability statement, brand story and B2G journey material",
    ],
    hidden: [
      "Live client pursuits, budgets and submissions",
      "Approvals, audit trail and access management",
    ],
  },
  {
    id: "subtenant-user",
    name: "Sub-Tenant User",
    who: "BD User and others working under MTM",
    scope:
      "Business development. Looks up client information to have the conversation — does not write or analyse proposals.",
    tier: 4,
    home: "/pipeline",
    pods: [1],
    canDecide: false,
    status: "active",
    sees: [
      "Client and opportunity profiles: who they are, what they buy, history",
      "Contact details, notes and their own outreach activity",
      "Status of pursuits their clients are attached to",
      "Log a meeting, add a note, flag an opportunity for the team",
    ],
    hidden: [
      "Writing, editing or analysing proposal content",
      "Compliance checks, pricing and submissions",
      "Approvals, budgets, audit and access management",
      "Other sub-tenants entirely",
    ],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    scope: "Read, comment and sign off on what is shared with them.",
    tier: 4,
    home: "/approvals",
    pods: [1, 3],
    canDecide: true,
    status: "active",
    sees: [
      "Only items explicitly shared for review",
      "Read the draft, leave comments, approve or send back",
      "Their own review history and decisions",
    ],
    hidden: [
      "Editing the proposal or event content",
      "Pipeline, budgets, document library, access management",
      "Anything not shared with them",
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    scope: "A read-only progress window on their own work.",
    tier: 5,
    home: "/dashboard",
    pods: [1],
    canDecide: false,
    status: "planned",
    sees: [
      "Status and progress of their own pursuits",
      "Milestone dates and what stage the work is at",
      "Final shared documents only",
    ],
    hidden: [
      "Every internal step, agent and companion note",
      "Comments, approvals, budgets, audit",
      "Any other client's work",
    ],
  },
];

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, Role>;

const KEY = "tpf.role";

export function setActiveRole(id: RoleId) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}

export function readActiveRole(): Role | null {
  try {
    const id = localStorage.getItem(KEY) as RoleId | null;
    return id && ROLE_BY_ID[id] ? ROLE_BY_ID[id] : null;
  } catch {
    return null;
  }
}

export function clearActiveRole() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
