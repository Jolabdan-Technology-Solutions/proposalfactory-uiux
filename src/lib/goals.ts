/** Task-first entry: a user picks what they want to accomplish, and only that path is shown. */
export type Goal = {
  id: string;
  title: string;
  blurb: string;
  /** Ordered screens that make up this task. */
  steps: string[];
  /** Pods this task belongs to — used to hide tasks a role cannot reach. */
  pods: Array<1 | 2 | 3 | 4>;
};

export const GOALS: Goal[] = [
  {
    id: "win-contract",
    title: "Win a new contract",
    blurb: "The full pursuit: find it, decide on it, write it, review it, submit it.",
    pods: [1],
    steps: [
      "/pipeline",
      "/shaping",
      "/bid-decision",
      "/rfp-intake",
      "/compliance",
      "/qa-amendments",
      "/tech-cost",
      "/revision",
      "/finalization",
      "/submission",
      "/post-submit",
      "/award",
    ],
  },
  {
    id: "add-opportunity",
    title: "Add a new opportunity",
    blurb: "Log an opportunity, research the buyer, and take it to a go / no-go.",
    pods: [1],
    steps: ["/pipeline", "/shaping", "/bid-decision"],
  },
  {
    id: "write-response",
    title: "Write and finish a response",
    blurb: "Work an existing solicitation from parsing through to submission.",
    pods: [1],
    steps: [
      "/rfp-intake",
      "/compliance",
      "/tech-cost",
      "/revision",
      "/finalization",
      "/submission",
    ],
  },
  {
    id: "deliver-event",
    title: "Deliver an event",
    blurb: "Brief to close-out: venue, production, audience, talent, show day.",
    pods: [2],
    steps: [
      "/event-intake",
      "/venue-pitch",
      "/production",
      "/comms-registration",
      "/talent-sponsors",
      "/execution-prep",
      "/execution",
      "/closeout",
    ],
  },
  {
    id: "review-approve",
    title: "Review and approve work",
    blurb: "Everything waiting on a decision, with the documents behind it.",
    pods: [3],
    steps: ["/approvals", "/documents", "/audit"],
  },
  {
    id: "run-governance",
    title: "Look after governance",
    blurb: "Access, budget, audit trail and how far automation is turned up.",
    pods: [3],
    steps: ["/access", "/budget", "/audit", "/maturity"],
  },
  {
    id: "learn-platform",
    title: "Learn how the platform works",
    blurb: "The guided tour: the big picture, the map, connectors and the roadmap.",
    pods: [4],
    steps: ["/overview", "/master-map", "/connectors", "/roadmap", "/reference"],
  },
];

const KEY = "tpf.goal";

export function setActiveGoal(id: string) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}

export function clearActiveGoal() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function readActiveGoal(): Goal | null {
  try {
    const id = window.localStorage.getItem(KEY);
    return GOALS.find((g) => g.id === id) ?? null;
  } catch {
    return null;
  }
}
