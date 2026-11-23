# TASK-010: Design system and navigation

**Stage:** see `docs/IMPLEMENTATION_ROADMAP.md`  
**Dependencies:** 000  
**Ownership:** one integration or feature agent, coordinated using `AGENTS.md`.

## Objective
Build design tokens from docs/UI_UX.md, accessible buttons, inputs, cards, command search modal, review badge, provenance chip, entity chip, breadcrumb/context tabs, top nav and responsive bottom dock. Add typography/icon/spacing system.

## Primary file areas
`apps/web/components, apps/web/styles, apps/web/app`

## Deliverables
1. Implement the user-visible/API functionality in the objective with typed contracts.
2. Add unit, integration and/or E2E tests appropriate to the affected layers.
3. Add fixture-driven success, empty, loading, invalid, forbidden and external-failure states as applicable.
4. Update relevant documentation, dev scripts and changelog notes.

## Acceptance criteria
20 reusable pieces; keyboard navigation and visible focus; mobile widths and dark theme pass UI checks; no permanent left sidebar.

## Guardrails
Follow `AGENTS.md` and `docs/SECURITY_PRIVACY.md`. No unrestricted network access or autonomous third-party reconnaissance. Any public source fetch must remain in case scope and behind a verified policy gateway. Never present fixture data as real-world research. Human validation required for inferred relationships.

## Validation/reporting
Run the repo's standard format, lint, typecheck, unit/build and applicable E2E checks. Capture command outputs and screenshots for UI work. Report files changed, test results, limitations and follow-on tasks; do not claim a test passed without running it.
