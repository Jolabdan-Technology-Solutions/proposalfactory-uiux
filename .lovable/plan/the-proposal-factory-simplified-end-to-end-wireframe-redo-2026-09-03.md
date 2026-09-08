# The Proposal Factory — Simplified End-to-End Wireframe (Redo)

Replace the existing `wireframe.html` — a dense scrolling architecture document with ~30 text sections and changelogs — with a **simple, clickable wireframe** that walks the whole platform in 8 screens. Fewer screens, fewer words, clearer journey.

What carries over from the current page: the pods, Sylvia / Eve / Oscar companions, human gates, and the dark brand. What gets dropped: release changelogs, ticket numbers, stat walls, and long prose.

## What gets built

8 navigable screens, wireframe-style (skeleton blocks, dashed placeholders, short annotation labels) on the TPF dark brand (navy, maroon, gold) from the live login page. Persistent shell: slim top bar with pod tabs, and a "Next step →" button so the journey can be walked end to end like a slideshow. Fake login — any input proceeds. No backend; light mock content from the workbook.

### Screens

1. **Login** (`/`) — wireframe of the live split-screen sign-in.
2. **Home / Mission Control** (`/dashboard`) — the system at a glance: 3 pod cards, 3 companions, today's gates. Doubles as the system map, so no separate architecture page.

**Pod 1 — The Proposal Factory (Sylvia), 4 screens**
3. **Find & Decide** (`/find`) — opportunity pipeline, capability match, Go/No-Go gate.
4. **Read & Plan** (`/plan`) — RFP intake/parse, compliance matrix, win themes, Q&A / amendments.
5. **Build & Review** (`/build`) — outline, section drafting, cost draft, color-team reviews, final volumes + approval gates.
6. **Submit & Win** (`/submit`) — submission package, receipt, award notice, handoff trigger to Pod 2.

**Pod 2 — Events & Experiential (Eve), 1 screen**
7. **Event Delivery** (`/event`) — one guided flow: brief → concept → budget & venue → run-of-show → registration → live → closeout.

**Pod 3 — Back Office Governance (Oscar), 1 screen**
8. **Governance** (`/governance`) — approval queue, audit trail, budget guardrails, document locks, maturity dial (Crawl → Walk → Run → Autonomous).

### Wireframe conventions

- Each screen header: step number, pod, phase, and lead agent.
- Human-gate badges at gate moments; a small companion bubble shows what Sylvia / Eve / Oscar says at that step.
- Cross-pod trigger chips (e.g. "Award won → start Event") link directly to the next pod's screen.

## Technical details

- TanStack Start routes: `/` login standalone; other screens under a pathless `_app` layout rendering the shell (top bar + `<Outlet />`).
- Wireframe primitives in `src/components/wireframe/`: `ScreenHeader`, `SkeletonBlock`, `Annotation`, `GateBadge`, `CompanionBubble`, `TriggerChip`, `WireframeShell`.
- `src/lib/workflow.ts`: one ordered list of the 8 steps (route, label, pod, agent, gates) driving the top bar, next/prev controls, and headers.
- Design tokens in `src/styles.css`: navy background, maroon primary, gold accent, per-pod accent hues (oklch), dashed wireframe border token. No hardcoded color classes.
- Fonts via `<link>` in `__root.tsx`: geometric sans + mono for annotations.
- Each route gets its own `head()` title/description/og; root placeholder metadata replaced.
- Static mock content only — no Lovable Cloud, no auth, no database.

## Verification

Walk all 8 screens in a headless browser from login to governance, screenshot each, confirm navigation links resolve and build logs are clean.
