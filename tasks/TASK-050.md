# TASK-050: Production auth, RBAC, privacy controls

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 021,041  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Implement secure auth/OIDC, memberships, server-side policy enforcement including SSE, retention controls, redacted audits, connector secret storage, quotas, security middleware and deployment security docs.

## Primary file areas
`apps/api/security, apps/api/services/workspaces, apps/web/features/settings, infra`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
Tenant access matrix passes including background jobs; secret audit passes; report permissions enforced; rights/retention workflows documented; production release gate met.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
