# TASK-000: Monorepo scaffold

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** none  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Initialize Next.js TypeScript app, FastAPI service, worker package, shared contracts, pnpm workspaces, Python package tooling, basic CI, Docker Compose for Postgres/Redis. Configure .env.example without secrets.

## Primary file areas
`apps/web, apps/api, apps/worker, packages/contracts, infra, .github/workflows, README.md`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Web home renders; API /health/live works; lockfiles committed; lint/test/build scripts run; no network collector runs.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
