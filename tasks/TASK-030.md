# TASK-030: Worker policy gate and safe fetch

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 020,021  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Create Celery queues, job/run state models and events, scope-policy validator, user-approved plan executor and audited egress gateway. Implement defenses for SSRF, DNS rebinding, redirect escapes and source rate limits.

## Primary file areas
`apps/worker, apps/api/services/policy, apps/api/services/research`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Fake connector jobs succeed; cancellation/idempotency work; tests prove private address variants denied including 127.0.0.1, ::1, link-local and metadata endpoints.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
