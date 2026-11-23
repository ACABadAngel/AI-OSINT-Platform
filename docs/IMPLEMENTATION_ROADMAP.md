# Codex-ready implementation roadmap

The tasks below are ordered by dependency. Their acceptance criteria are binding; implement small PR-sized slices. **Do not interpret estimated work as a promise of completion date.** A task is complete when tests, docs and UI behavior pass, not when code compiles once.

## Release A — UI prototype with full demo flow (M0)
**Outcome:** A visually coherent, interactive complete frontend running on fictional fixtures; no backend needed.

| ID | Priority | Dependency | Deliverable | Exit criterion |
|---|---|---|---|---|
| TASK-000 | P0 | none | monorepo, pnpm, Next.js, Python folders, CI skeleton, Compose | web dev server starts; tests/build can run |
| TASK-010 | P0 | 000 | tokens, layout, top nav, bottom dock, 20+ reusable components | responsive Storybook/examples and accessibility smoke tests |
| TASK-011 | P0 | 010 | dashboard, case overview, evidence inbox, fixtures | realistic interaction and state changes; no dead buttons |
| TASK-012 | P0 | 011 | graph, inspector, research-plan UI, report preview | graph selection/citation/report E2E demo flow |

## Release B — Durable evidence workspace (M1)
**Outcome:** Local persisted cases/evidence without an LLM or external adapters.

| ID | Priority | Dependency | Deliverable | Exit criterion |
|---|---|---|---|---|
| TASK-020 | P0 | 000 | PostgreSQL entities, Alembic migrations, seed import | clean schema create/rollback; referential tests |
| TASK-021 | P0 | 020,012 | FastAPI auth/dev stub, case/source/graph/review CRUD, typed client | E2E works against real DB and respects workspace |
| TASK-022 | P0 | 021 | Postgres full-text search, pagination, audit event plumbing | case-local search with deterministic seeded results |

## Release C — Safe public sources (M2)
**Outcome:** User-approved passive source collection with provenance and control.

| ID | Priority | Dependency | Deliverable | Exit criterion |
|---|---|---|---|---|
| TASK-030 | P0 | 020,021 | worker, queue, scope policies, safe fetch gateway, run states | SSRF/redirect/rebinding tests pass; cancel/idempotence works |
| TASK-031 | P1 | 030 | RSS + domain RDAP + passive DNS through constrained adapters | approved scoped sample produces source records; errors explicit |
| TASK-032 | P1 | 031 | optional CT + GitHub public-org connectors | quotas, source terms, outputs and data minimization tested |

## Release D — Evidence-grounded AI (M3)
**Outcome:** AI accelerates analysis without fabricating source-supported facts.

| ID | Priority | Dependency | Deliverable | Exit criterion |
|---|---|---|---|---|
| TASK-040 | P0 | 021,030 | provider gateway, plan proposal, evidence retrieval, response schemas | 50+ evaluation fixtures and fabricated-citation rejection |
| TASK-041 | P1 | 040 | reviewable AI observations/relationships + research feed | human review/approval and audit; no auto-publish |

## Release E — Collaboration, reports and release quality (M4)
**Outcome:** Secure self-hostable release for permitted research.

| ID | Priority | Dependency | Deliverable | Exit criterion |
|---|---|---|---|---|
| TASK-050 | P0 | 021,041 | auth, RBAC, per-case permissions, log/audit, retention, quotas | tenant-isolation and security tests pass |
| TASK-051 | P1 | 050 | Markdown and PDF exports, evidence manifest, report review | source-linked export with disputed/unknown caveats |
| TASK-052 | P1 | 050,051 | deploy docs, backups, observability, CI, hardening | reproducible self-host deployment and restore smoke test |

## Release F — Future enhancements (M5, optional)
Timeline playback, source change subscriptions for explicitly approved organizations/domains, licensed registries, richer document extraction, STIX converter for appropriate cyber data, more robust graph layout/clustering, team collaboration and scoped MCP read API.

## Parallelization plan
**Safe:** After TASK-000, UI component agent (TASK-010) and backend migration design agent (TASK-020) can work independently. After frozen contracts, dashboard/evidence UI and graph/research UI can use separate worktrees. Security reviewer can audit gate specs continuously.

**Do not parallel-edit:** `packages/contracts`, auth policy middleware, shared `schema.py`/migrations or style tokens. One integration owner approves changes in shared contracts before dependent branches merge.

## Dependencies / risk register
- Providers may have fees, rate limits, license changes or restrictions. Abstract connectors; demonstrate with fixtures if unavailable.
- Public sources may be wrong or disappear; store provenance and honest unknowns.
- Scraping arbitrary URLs creates legal and SSRF risks; prefer approved APIs and explicit safe fetching.
- AI citation correctness is a **validation problem**, not merely a prompt instruction.
- Graph layout can become cluttered; scope, filter, group, and progressive reveal.
- Privacy compliance is jurisdiction- and use-case-dependent; defer person-centric modes.

## Exact first integration milestone
From clean checkout, `pnpm install && pnpm --filter web dev` opens a full-width dashboard. Click a fictional case → graph → select approved edge → source inspector → evidence → create report preview. Responsive layout, state persistence in demo where useful, and 3 Playwright tests. No 'coming soon' controls disguised as functionality. After UI approval, wire API.
