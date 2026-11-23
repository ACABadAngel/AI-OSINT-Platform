# TASK-020: PostgreSQL schema and migrations

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 000  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Implement SQLAlchemy models and Alembic migrations matching docs/DATA_MODEL.md. Add indexed case-scoped graph tables, source provenance, review history, scoped policies and audit log. Provide deterministic seed command.

## Primary file areas
`apps/api/models, apps/api/alembic, apps/api/scripts`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Fresh DB migrates up/down; seed establishes three fictional demo cases; approved edge cannot exist without evidence; all read queries scoped by workspace.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
