# TASK-040: AI evidence gateway

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 021,030  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Create pluggable LLM provider, strict PlanProposal and GroundedAnswer schemas, case-local evidence retrieval, deterministic source-ID validation and mocked AI tests. AI cannot directly call URL/tools.

## Primary file areas
`apps/api/services/ai, apps/api/schemas/ai, apps/api/tests/ai`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
50+ citation adversarial fixtures pass; source-free factual claims withheld/unknown; provider outage preserves manual workflows; budget and approval gates enforced.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
