# Technical architecture

## 1. Overview
```
                         [ Browser / Next.js ]
                                   |
                       HTTPS, Auth, SSE
                                   |
                            [ FastAPI ]
                        /       |       \
                 [Postgres] [Object Store] [Redis]
                     |                         |
                Observations                [Celery worker]
                Evidence/Links                  |
                                         [Policy Gateway]
                                                |
                                        [Approved Connectors]
                                                |
                                          Public/Allowed APIs
                                   
                [FastAPI] --[AI Coordinator]-- [LLM Provider]
                                     |
                           Allowed read-only tools
                           + proposal/review tools
```

## 2. Monorepo architecture
- **Web:** Next.js App Router + React + TypeScript, Tailwind, shadcn/ui, TanStack Query, React Flow (`@xyflow/react`), Zod. No direct third-party secrets or research fetching from browser.
- **API:** FastAPI + Pydantic v2 + SQLAlchemy 2 + Alembic + PostgreSQL. Generates OpenAPI, typed frontend clients from stable contracts, scopes requests by workspace.
- **Workers:** Celery + Redis queue. Each job uses a server-side scope authorization service and connector-specific permit policy. FastAPI `BackgroundTasks` is not suitable for long-running distributed collector jobs.
- **Evidence storage:** Postgres for records + JSONB, object storage for optional permitted source snapshots and report artifacts, SHA-256 content hashes. Do not store unnecessary sensitive content.
- **Graph:** nodes/edges in relational tables with case and provenance; React Flow visualizes. PostgreSQL recursive SQL handles modest traversals. Add graph store only if proven necessary.
- **AI:** server-side orchestrator, provider interface, retrieval of internal evidence only, structured typed plans and outputs; a deterministic policy gate approves tool invocation. No LLM-issued raw HTTP requests.
- **Telemetry:** JSON structured logs, Prometheus-compatible metrics optional, OpenTelemetry spans for collection/AI steps; never log secrets or raw personal data by default.

## 3. Processes and deployment
Development: Web process + API + worker + PostgreSQL 16+ + Redis 7+ + MinIO optional via Docker Compose. Production: separate web/api/worker services, managed PG, object store, TLS at reverse proxy, Redis private, outbound network restrictions, encrypted secrets. Use locked dependency versions at implementation time.

## 4. Key flows
**Case creation:** authenticated user → authorization → case record + audit event → Web cache invalidation.

**Evidence ingestion:** submit source/reference → source policy validation → queue fetch job → fetch through egress-protected connector → parse/sanitize → source record + snapshot/hash → normalized observations → candidate graph links → review queue. No auto-approval.

**AI question:** user question → retrieve case-specific vetted observations → extract evidence chunks and citation IDs → model produces JSON `{answer, claim_citations, unknowns, proposed_next_steps}` → schema validation → citation existence validator → render citations + review suggestions. Invalid or source-free claims are stripped or marked unsupported; the model is not responsible for final validation.

**Graph editing:** user manually links two nodes → API validates same-case scope and permission → requires cited evidence or 'analyst hypothesis' status → stores edge audit record → graph refresh.

**Export:** assemble approved/disputed statements + cited evidence → markdown artifact → optional PDF renderer → immutable export log.

## 5. Isolation and controls
- Each API query scoped by `workspace_id` and `case_id`; enforce using repository/service patterns, database RLS as additional defense if practicable.
- Research `scope_policy` includes allowed entity types, source connectors, normalized target identifiers, purpose, expiration, per-run budget.
- `fetch_url` not exposed as a general AI tool. Use bounded connector methods with validated inputs.
- At egress: scheme HTTP(S) only, block loopback/private/link-local/metadata endpoints and IPv6 equivalents, DNS-rebinding-resistant resolution and validated redirects, per-host concurrency and bandwidth limits.
- Queue idempotence keys stop duplicate fetches; source-specific `429` handling; source terms and robots directives respected when applicable; explicit cancel state.
- Source content has no tool authority. Prompts instruct model to treat it as untrusted evidence.

## 6. Search and retrieval
MVP PostgreSQL FTS (`tsvector`, GIN indexes), exact canonical entity lookup, case/time/type/status filtering. AI retrieval uses DB-selected evidence chunks only; embeddings/pgvector may be added after evaluation with provenance link preservation. Avoid silent global case mixing.

## 7. Reporting and data lineage
All observation and relationship versions are immutable or revisioned. `claims` and report blocks cite stable IDs. A report export embeds its creation timestamp, case scope, reviewer status and bibliography. Source removals show redaction/tombstones for audit rather than erasing history silently.

## 8. Ops and scaling
- Start with Postgres + Celery. Later: partition observations by workspace/date, S3 object retention, rate limit by API key and tenant, cache external public responses within terms.
- Use queue names `ingest`, `enrich`, `ai`, `export` with worker rate limits.
- Circuit breakers for failing data providers; fallback to manual evidence import with no false claims of availability.
- Workers run with least privilege, separate network egress, capped memory/CPU and external request timeouts.

## 9. ADR and migrations
See `decisions/ADR-0001.md`. If adding Neo4j, a second queue, external crawler or STIX-native store, add a new ADR with measured rationale and ownership.
