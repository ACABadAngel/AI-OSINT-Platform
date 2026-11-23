# TASK-032: CT and GitHub public organization adapters

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 031  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Add optional approved certificate-transparency metadata and public GitHub organization/repository release metadata connectors. No brute-force expansion, contributor identity correlation or automated secret hunting.

## Primary file areas
`apps/worker/connectors, docs/CONNECTORS_AND_AI.md`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
No unapproved domain/repo expansion; obey published API limits and terms; fixtures prove correct provenance, source IDs and failure behavior.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
