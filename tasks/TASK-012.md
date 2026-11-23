# TASK-012: Graph and research/report demo UI

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 011  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Implement React Flow graph for 30 nodes and 35 edges, selection inspector, filter/layout controls, plan approval preview, mocked run event timeline, report composer/preview. Use typed fixtures, not live results.

## Primary file areas
`apps/web/features/graph, apps/web/features/research, apps/web/features/reports`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Select edge -> inspect evidence -> open source record -> add source to report preview; no dead buttons; keyboard and mobile graph flows tested.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
