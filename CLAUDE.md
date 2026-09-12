# CLAUDE.md — The Proposal Factory™ UI/UX Reference

This repo is a **clickable UI/UX wireframe** of The Proposal Factory™ platform. It is a design reference, not a production app: there is no backend, no database, and all data is static mock content. Use it to understand the intended screens, flows, roles, and visual system before implementing the real product.

## Stack

- **TanStack Start v1** (React 19, Vite 7) — file-based routing, SSR
- **Tailwind CSS v4** — theme via CSS variables in `src/styles.css`
- **shadcn/ui + Radix** primitives, **Lucide** icons
- No Lovable Cloud / Supabase / API calls. Do not add them when mirroring this design.

## Platform concept

Three "pods" (AI-assisted work areas), each with a companion persona and human approval gates:

| Pod | Name | Companion | Purpose |
|-----|------|-----------|---------|
| 1 | Proposal Factory | Sylvia | Federal/SLED proposal lifecycle: a 70-step process in 12 phases, grouped as Pre-Award (1–18), In Process (19–60), Post-Award (61–70) |
| 2 | Events & Experiential | Eve | Brief → concept → venue → production → comms/registration → execution → closeout |
| 3 | Back-Office Governance | Oscar | Approvals, audit trail, budget guardrails, documents, access/RBAC, maturity dial |

Cross-pod trigger: winning an award in Pod 1 hands off to Pod 2 event delivery. Pod 3 governs both.

## Roles & onboarding flow

Onboarding: splash `/` → returning/new chooser `/start` → new users see a 3-video orientation `/orientation` → role pick `/roles` → sign-in `/signin` → task chooser `/goals` (pod-first). Platform Owner skips the task chooser and lands on the pod dashboards directly.

Roles (defined in `src/lib/roles.ts`): Platform Owner (Delano), Super Admin, Tenant Admin (MTM), Sub-tenant Admin, Sub-tenant User, Proposal Manager, Reviewer, Viewer. Accounts can hold one role or multiple (`src/lib/accounts.ts`); multi-role users pick/switch a role after sign-in. Role determines visible pods, nav, and gates.

## Route map (all under `src/routes/`)

- Public/onboarding: `index.tsx` (splash), `start.tsx`, `orientation.tsx`, `roles.tsx`, `signin.tsx`, `signup.tsx`, `help.tsx`
- App shell lives in `_app.tsx` (pathless layout) + `src/components/wireframe/shell.tsx` (top bar, role chip, next/back, goal progress) + `app-sidebar.tsx` (role-filtered nav: Dashboard, Pods, Company, Proposals, Platform, Account)
- Dashboards: `_app.dashboard.tsx`, `_app.pod1.tsx`, `_app.pod2.tsx`, `_app.pod3.tsx` (pod hubs via `pod-hub.tsx`), `_app.goals.tsx` (task chooser)
- Pod 1: `_app.opportunities.tsx` (Jira-like Board/Calendar/List/Uploads views), `_app.pipeline.tsx` (filterable deal table), `_app.bulk-edit.tsx`, `_app.proposals.tsx` (Drafts/Archived/New tabs), `_app.subclient-mapping.tsx`, plus phase screens (`_app.rfp-intake.tsx`, `_app.compliance.tsx`, `_app.shaping.tsx`, `_app.bid-decision.tsx`, `_app.revision.tsx`, `_app.tech-cost.tsx`, `_app.qa-amendments.tsx`, `_app.finalization.tsx`, `_app.submission.tsx`, `_app.post-submit.tsx`, `_app.award.tsx`, `_app.closeout.tsx`, …)
- Pod 2: `_app.event-intake.tsx`, `_app.venue-pitch.tsx`, `_app.production.tsx`, `_app.comms-registration.tsx`, `_app.talent-sponsors.tsx`, `_app.execution-prep.tsx`, `_app.execution.tsx`, `_app.closeout.tsx`
- Pod 3: `_app.approvals.tsx`, `_app.audit.tsx`, `_app.budget.tsx`, `_app.documents.tsx` (plain document library — no steps), `_app.access.tsx`, `_app.maturity.tsx`
- Reference: `_app.overview.tsx`, `_app.master-map.tsx`, `_app.connectors.tsx` (MCP/integration gateway), `_app.roadmap.tsx`, `_app.reference.tsx`

Phase screens are **data-driven**: one entry in `src/lib/workflow.ts` (`WORKFLOW_STEPS`) renders through `src/components/wireframe/phase-screen.tsx` + `step-ui.tsx`. To add a screen, add a workflow entry and a thin route file.

## Key data files

- `src/lib/workflow.ts` — ordered steps (route, label, pod, phase, agents, human gates, maturity stages, companion notes) driving headers, breadcrumbs, and next/prev nav
- `src/lib/deals.ts` — mock deal records shared by Pipeline and Opportunities across all three pods (`?pod=1|2|3`)
- `src/lib/roles.ts`, `src/lib/accounts.ts`, `src/lib/goals.ts` — role/account/task model
- `src/lib/videos.ts` — companion video slots (Sylvia/Eve/Oscar)

## Design tokens (never hardcode colors)

Defined in `src/styles.css` (oklch): dark navy background, maroon primary, gold accent; per-pod accents `pod-1`/`pod-2`/`pod-3`; dashed "wireframe" border token `wireline`. Components must use semantic utilities (`bg-background`, `text-muted-foreground`, `border-wireline`, `text-accent`, …) — no `text-white`, `bg-black`, or hex classes. Fonts loaded via `<link>` in `src/routes/__root.tsx`.

## UI conventions

- Wireframe aesthetic: skeleton blocks, dashed placeholders, mono annotation labels.
- Human-gate badges mark approval moments; companion bubbles show what Sylvia/Eve/Oscar say at each step.
- Pod 1 pages share the journey header: Pre-Award (1–18) / In Process (19–60) / Post-Award (61–70) with clickable phase chips (`journey-header.tsx`).
- Global filters (`global-filters.tsx`) appear only on pod dashboards (`/pod1`, `/pod2`, `/pod3`); directory pages keep their own scoped filters; `/dashboard` has none.
- Everything clickable must look clickable — no "start anywhere" disclaimers; rows/cards get hover affordances.
- Sample data is always labeled as such; no live system integrations.

## Gotchas for implementers

- Router is TanStack only — never `react-router-dom`.
- Every route needs its own `head()` with unique title/description/og tags.
- `/documents` and `/subclient-mapping` intentionally have no step numbering or prev/next nav.
- Sidebar is hidden on `/dashboard` and `/goals`.
- Keep pod context: a page reached from Pod N must stay in Pod N chrome (title, breadcrumb, filters).
