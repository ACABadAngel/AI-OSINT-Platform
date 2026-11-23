# TASK-051: Evidence-backed reports and exports

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 050  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Build persistent report editor, claim/citation validator, Markdown/JSON export with frozen manifest, PDF renderer with sanitization and reviewer warnings.

## Primary file areas
`apps/api/services/reports, apps/web/features/reports`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Every reported factual claim links to evidence; unreviewed findings flagged/excluded; exported files render and preserve timestamps/bibliography; export audit exists.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
