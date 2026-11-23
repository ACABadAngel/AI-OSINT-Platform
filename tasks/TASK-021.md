# TASK-021: REST API and typed client

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 020,012  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Implement v1 API for case/entity/source/observation/relation/review CRUD, typed request/response schemas and OpenAPI-derived TypeScript client; replace in-memory UI adapters with server adapters using feature flag.

## Primary file areas
`apps/api/routes, apps/api/services, packages/contracts, apps/web/lib/api`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Cross-workspace access denied; graph, evidence and case flows persist; audit events on mutation; contract tests pass; UI works with API.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
