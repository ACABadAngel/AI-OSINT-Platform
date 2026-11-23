# Copy this prompt into Codex after committing the blueprint files

You are the lead engineer for SCOPE, a public-source, evidence-grounded OSINT research workspace. Read `AGENTS.md`, `README.md`, `docs/PRODUCT_REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, `docs/UI_UX.md`, `docs/SECURITY_PRIVACY.md`, `docs/TEST_STRATEGY.md`, and `docs/IMPLEMENTATION_ROADMAP.md` before touching code.

Implement **only `TASK-000` and `TASK-010`** in the first execution. Begin with a short checklist of files you will create and commands to verify the work. Scaffold the project using stable dependency releases and lockfiles, then implement the complete dark Monochrome Glass Bento shell: top nav, responsive bento dashboard skeleton, context tabs, optional bottom dock, design tokens, reusable components, and fixture data types. No live OSINT crawling, arbitrary URL fetching, or fake data claimed as real.

Design constraints: monochrome near-black (#080B0D), subtle blur, high readability, restrained aqua accent, modular cards, generous whitespace, expressive but accessible microinteractions, no conventional permanent left nav. Keep keyboard accessibility and mobile views. Route structure and acceptance checks must align with docs. Use realistic fully fictional `.example` demonstration data and visible DEMO labels. Do not overcomplicate backend at this stage.

Make controls functional for this slice; any unavailable navigation should be disabled explicitly and explained instead of fake clickable UI. Add working scripts for format/lint/typecheck/tests/build, CI skeleton, setup docs, and screenshots if possible. Run all checks, fix failures, and report changes, validation, and next steps. Do not continue into TASK-011 until TASK-000/010 are green.
