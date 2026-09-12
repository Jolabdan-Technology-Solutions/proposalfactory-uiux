/**
 * Sample sub-client directory data (wireframe only — no live systems).
 * Tenants own sub-clients; each sub-client has an isolated profile,
 * brand story, training data and onboarding readiness.
 */

export type Plan = "basic" | "professional" | "enterprise";

export type SubClient = {
  id: string;
  name: string;
  industry: string;
  plan: Plan;
  status: "Active" | "Inactive";
  proposalsPerMonth: number;
  tenantId: string;
  isTenant?: boolean;
};

export type Tenant = {
  id: string;
  name: string;
  descriptor: string;
  plan: Plan;
  status: "Active" | "Inactive";
  platformOwner?: boolean;
};

export const TENANTS: Tenant[] = [
  {
    id: "t-b2g-owner",
    name: "Mr. B2G & Associates",
    descriptor: "Issues licenses to other tenants",
    plan: "enterprise",
    status: "Active",
    platformOwner: true,
  },
  {
    id: "t-b2g-advisors",
    name: "Mr. B2G Advisors (Prime & Consulting)",
    descriptor: "Government Marketplace Consulting",
    plan: "enterprise",
    status: "Active",
  },
  {
    id: "t-mtm",
    name: "MTM (Prime & Consulting)",
    descriptor: "Integrated Marketing",
    plan: "enterprise",
    status: "Active",
  },
];

export const SUB_CLIENTS: SubClient[] = [
  { id: "sc-b2g-associates", name: "Mr. B2G & Associates", industry: "Consulting Experts", plan: "enterprise", status: "Active", proposalsPerMonth: 13, tenantId: "t-b2g-advisors", isTenant: true },
  { id: "sc-jolabdan-group", name: "Jolabdan Group", industry: "Technology — AI / Government Contracting", plan: "enterprise", status: "Active", proposalsPerMonth: 2, tenantId: "t-b2g-advisors" },
  { id: "sc-ahhc-aventura", name: "Accessible Home Health Care of Aventura", industry: "Medical Staffing", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-sentry-it", name: "Sentry IT", industry: "IT Services", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-united-security", name: "United Security Financial", industry: "Housing", plan: "professional", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-jts", name: "Jolabdan Technology Solutions (JTS)", industry: "Technology — AI / Proposal Automation Platform", plan: "enterprise", status: "Active", proposalsPerMonth: 13, tenantId: "t-b2g-advisors" },
  { id: "sc-analytic-vision", name: "Analytic Vision", industry: "Technology", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-city-permit", name: "City Permit", industry: "Construction", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-ahhc", name: "Accessible Home Health Care", industry: "Medical Staffing", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },
  { id: "sc-clean-protect", name: "Clean and Protect LLC", industry: "Janitorial Services", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-b2g-advisors" },

  { id: "sc-wood-eye", name: "WOOD EYE INC dba BELL THE CAT", industry: "Full suite film and television production services", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-red-orange-design", name: "Red Orange Design LLC (dba Red Orange Studio)", industry: "Creative Agency", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-red-orange-studio", name: "Red Orange Studio", industry: "Creative Services", plan: "basic", status: "Inactive", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-wm-events", name: "WM Events", industry: "Event Production", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-majesty", name: "Majesty Ventures", industry: "Paid Media Strategy & Solutions", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-next-marketing", name: "Next Marketing", industry: "Events", plan: "basic", status: "Inactive", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-angelle", name: "Angelle Consulting (DBA Elevia)", industry: "Public Relations", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
  { id: "sc-mvo", name: "MVO Marketing", industry: "Marketing", plan: "basic", status: "Active", proposalsPerMonth: 0, tenantId: "t-mtm" },
];

export function subClientById(id: string) {
  return SUB_CLIENTS.find((s) => s.id === id);
}

export function subClientsForTenant(tenantId: string) {
  return SUB_CLIENTS.filter((s) => s.tenantId === tenantId);
}

/* ------------------------------------------------------- profile detail --- */

export type ReadinessItem = { label: string; state: "done" | "missing" | "optional" };

export type SubClientProfile = {
  subscription: { plan: string; price: string; annual: string };
  proposals: { used: number; cap: string };
  trainingDocs: number;
  onboarding: string;
  readiness: {
    companyProfile: ReadinessItem[];
    brand: ReadinessItem[];
    training: ReadinessItem[];
    filled: number;
    total: number;
  };
  capabilityBlurb: string;
  identity: { website: string; industry: string; poc: { name: string; email: string; phone: string } };
  credentials: { cage: string; duns: string; uei: string };
  naics: string;
  certifications: string;
  keyPersonnel: string;
  targetAgencies: string;
  story: { overview: string; purpose: string; differentiators: string[]; address: string };
};

/** One representative profile — every sub-client renders it with its own header. */
export function profileFor(sub: SubClient): SubClientProfile {
  return {
    subscription:
      sub.plan === "enterprise"
        ? { plan: "Enterprise", price: "$5,000+/mo · unlimited", annual: "$80,000" }
        : sub.plan === "professional"
          ? { plan: "Professional", price: "$1,500/mo · 25 proposals", annual: "$18,000" }
          : { plan: "Basic", price: "$500/mo · 5 proposals", annual: "$6,000" },
    proposals: { used: sub.proposalsPerMonth, cap: sub.plan === "enterprise" ? "unlimited" : sub.plan === "professional" ? "25" : "5" },
    trainingDocs: sub.plan === "enterprise" ? 94 : sub.plan === "professional" ? 21 : 4,
    onboarding: sub.plan === "basic" ? "In progress" : "Complete",
    readiness: {
      companyProfile: [
        { label: "Company name", state: "done" },
        { label: "Industry", state: "done" },
        { label: "Website URL", state: "done" },
        { label: "Primary POC name", state: "done" },
        { label: "Primary POC email", state: "done" },
        { label: "Primary POC phone", state: "done" },
        { label: "NAICS codes (at least 1)", state: "done" },
        { label: "Set-asides / certifications", state: "missing" },
        { label: "CAGE code (optional)", state: "optional" },
        { label: "DUNS number (optional)", state: "optional" },
        { label: "SAM UEI (optional)", state: "optional" },
      ],
      brand: [
        { label: "Logo image", state: "missing" },
        { label: "Brand voice / about us", state: "done" },
        { label: "Primary brand colour", state: "missing" },
      ],
      training: [{ label: "Training documents (≥1 uploaded)", state: "done" }],
      filled: 9,
      total: 12,
    },
    capabilityBlurb:
      `${sub.name} is a professional firm specialising in ${sub.industry.toLowerCase()}, offering solutions-oriented expertise across public and private sector engagements.`,
    identity: {
      website: "https://staging.example.com",
      industry: sub.industry,
      poc: { name: "Platform Owner Massey", email: "delano@example.com", phone: "(678) 382-4645" },
    },
    credentials: { cage: "XXXXX", duns: "XX-XXX-XXXX", uei: "Unique Entity ID" },
    naics: "541611, 541613, 541618",
    certifications: "8(a), HUBZone, SDVOSB, WOSB",
    keyPersonnel: "John Smith (PM), Jane Doe (CEO)",
    targetAgencies: "DOD, DHS, VA, HHS",
    story: {
      overview:
        "Mr.B2G stands for Mr. Business to Government Contracting and provides education, guidance and support to entrepreneurs interested in winning government contracts.",
      purpose:
        "With a proven system, experienced leadership and a commitment to client success, the business aims to become a trusted partner for entrepreneurs navigating government procurement.",
      differentiators: [
        "Specialised expertise in government (B2G) and commercial sector consulting",
        "Comprehensive management consulting across strategic, operational and administrative domains",
        "Dual-sector experience enabling cross-pollination of best practices",
        "Focused approach to practical, implementable management solutions",
      ],
      address: "123 Peachtree St NE, Atlanta, GA 30303",
    },
  };
}
