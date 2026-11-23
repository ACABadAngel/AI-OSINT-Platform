# SCOPE — Source-Cited OSINT & Public Evidence

**Status:** M0 fixture-backed frontend and development services. The roadmap describes the later persisted and live-source milestones.

SCOPE is a modular, AI-assisted workspace for legitimate, public-source investigations focused on organizations, domains, publicly documented technical assets, public repositories, and research documents. It connects evidence to citations, represents relationships explicitly, and generates reviewable reports. It is **not** an autonomous intrusion, stalking, or personal-profiling system.

## Product principles

1. **Evidence before inference.** No factual claim without a durable source reference.
2. **User-directed research.** The assistant proposes research steps; only policy-allowed source adapters execute them. No unbounded target expansion.
3. **Provenance by default.** Every observation and relationship references one or more observations/sources; capture date, URL, hash, and retrieval method are stored.
4. **Safe collection.** Source terms, robots directives where applicable, credentials, consent, jurisdiction, throttling, and privacy rules are respected.
5. **Useful without AI.** Cases, graph, evidence inbox, search, filtering, exports and annotation work without an LLM API key.
6. **UI-first delivery.** Design system and realistic fixture-backed application flows are implemented before live integrations.

## What is included

- `AGENTS.md` — durable instructions for Codex and contributing agents.
- `docs/PRODUCT_REQUIREMENTS.md` — scope, roles, feature requirements, non-goals, acceptance targets.
- `docs/ARCHITECTURE.md` — stack, components, data flow, deployment, queues, AI orchestration.
- `docs/UI_UX.md` — screens, detailed interactions, wireframes, design tokens, states.
- `docs/DATA_MODEL.md` — database tables, evidence + graph semantics, retention.
- `docs/API_CONTRACT.md` — REST endpoints, payloads, errors, streaming events.
- `docs/CONNECTORS_AND_AI.md` — connector interfaces and evidence-grounded AI workflows.
- `docs/SECURITY_PRIVACY.md` — safeguards, abuse cases, collection boundaries.
- `docs/TEST_STRATEGY.md` — quality gates and measurable behavior.
- `docs/IMPLEMENTATION_ROADMAP.md` — staged work packages, dependencies, exit criteria.
- `tasks/` — Codex-friendly work assignments by milestone.
- `prompts/START_WITH_CODEX.md` — first prompt to use in an empty repo.
- `examples/` — JSON request and normalized evidence schema samples.
- `decisions/ADR-0001.md` — why the MVP uses SQL for graph relationships.

## Local stack target

Node.js LTS + pnpm, Python 3.12+, PostgreSQL, Redis, Docker Compose. Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Flow, TanStack Query. Backend: FastAPI, Pydantic, SQLAlchemy, Alembic, Celery. AI: pluggable server-side provider with strict schemas and explicit tool authorization.

Versions are intentionally not hard-coded here. Codex must use current stable releases, inspect migration notes, and commit lockfiles. The React Flow 13 transition in November 2026 warrants checking event-handler compatibility during implementation.

## Recommended start

1. Read `AGENTS.md`, `docs/UI_UX.md`, `docs/PRODUCT_REQUIREMENTS.md`, and the roadmap.
2. Paste `prompts/START_WITH_CODEX.md` into Codex in a new project repository.
3. Deliver UI and complete demo flows against seeded fixtures; do not fake live collection.
4. Add schema + API + workers and only then permitted connectors and an AI provider.

## Working definition of 'MVP complete'

A user can create a case, add a domain or organization, import/capture public source evidence through a reviewed workflow, inspect citations and a relationship graph, ask questions that return citations with explicit unknowns, and export a report. UI must show which data is fixture/demo versus fetched/verified.

## Verified references (consult as documentation, not implicit endorsements)

- React Flow: https://reactflow.dev/learn
- FastAPI background processing: https://fastapi.tiangolo.com/tutorial/background-tasks/
- OpenCTI/STIX model: https://docs.opencti.io/latest/usage/data-model/
- OWASP SSRF: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- GitHub API limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Common Crawl index: https://index.commoncrawl.org/
- RDAP bootstrap: https://www.rfc-editor.org/rfc/rfc9224.html

## Running the foundation

Use Node.js 24, pnpm 11 and (for Python services) Python 3.12 and uv.

- Run `pnpm install --frozen-lockfile` and `pnpm --filter web dev`. Open `http://localhost:3000/app`.
- Run `docker compose -f infra/compose.yaml up --build` for the development stack. The API health check is at `http://localhost:8000/health/live`.
- Run `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Install browsers with `pnpm --filter web exec playwright install chromium`, then run `pnpm e2e`.
- Run `uv sync --locked`, followed by `uv run ruff check apps`, `uv run ruff format --check apps`, `uv run mypy apps/api apps/worker`, and `uv run pytest`.

## Try the demo workspace

Open Aurora Systems and select **Graph**. Select **Identifies official domain**, then open citation **SRC-002**. In the evidence inbox, open the source record or add the approved source to the report. The report studio previews Markdown and exports Markdown or JSON with a frozen source manifest.

Use **New case** to create a local case with a fictional `.example` domain. The sidebar-free workspace includes case search, evidence review, timeline, graph proposals, a source catalog, and settings. Reviews, drafts, proposals, and research runs are retained in this browser. Settings can restore the original fixtures.

The research assistant runs a deterministic case-local evidence matcher after you approve a plan. It supports a simulated adapter error, explicit retry and cancellation. Source records and their URL metadata are fictional. The demo executes zero external collection requests.

CI captures desktop and mobile dashboard, graph, source, report, research-plan, and keyboard-focus screenshots with Playwright. Production authentication, durable server-backed storage, live source collection, model providers, and PDF exports are tracked in later roadmap milestones.
