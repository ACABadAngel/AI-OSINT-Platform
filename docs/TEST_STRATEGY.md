# Testing and acceptance strategy

## 1. Required CI checks
- Frontend: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- Backend: `ruff check .`, `ruff format --check .`, `mypy .` (incremental coverage), `pytest`.
- Contract: OpenAPI JSON generation, TS-client type generation, schema compatibility validation.
- E2E: Playwright desktop 1440×900 and mobile 390×844, seeded data and deterministic API intercepts.
- Security: secret scanner, dependency audit, malicious URL/redirect tests, RBAC matrix, injection fixtures.
- Infrastructure: Compose startup healthcheck, migration up/down in test DB, worker job test, restore smoke test later.

Tests should target documented commands after actual scaffolding, not assume packages exist now.

## 2. Test scenarios / acceptance cases
| Test ID | Scenario | Expected |
|---|---|---|
| T-001 | Fresh first run | Demo data visible and marked demo on every evidence surface |
| T-002 | Create case with purpose/scope | persisted, listed, audit event created |
| T-003 | Invalid scope | network job denied without external requests |
| T-004 | Select graph edge | inspector shows cited observations and source metadata |
| T-005 | Approve edge with no supporting observation | rejected with validation error |
| T-006 | Approve edge with valid source + reviewer | status changes, immutable review event recorded |
| T-007 | Source has contradictory dates | both dates preserved; dispute visible |
| T-008 | AI invents source ID | validator rejects claim, user sees insufficient evidence |
| T-009 | Source contains instruction to fetch secret | no tool call; stored as untrusted text |
| T-010 | Block 127.0.0.1, ::1, private/link-local IP, metadata endpoints and redirect/rebinding variants | zero outbound HTTP requests to restricted IPs |
| T-011 | Rate-limit from approved API | bounded retries respecting backoff/Retry-After; user-visible failure |
| T-012 | Cancel job | no new steps executed; run cancelled/audited |
| T-013 | User from another workspace fetches case/source/report/SSE | consistently 404/403; no metadata leak |
| T-014 | Viewer tries to export confidential report | denied, logged |
| T-015 | AI unavailable | manual case/evidence/graph/report features remain usable |
| T-016 | Source removed / expired | redaction/tombstone behavior aligns with policy |
| T-017 | Graph on 300/500 seed | responsive interaction without severe UI hangs |
| T-018 | Keyboard-only graph and evidence navigation | focus-visible, operable, ESC/shortcuts work |
| T-019 | Fake connector says fetched when fixture | UI still displays demo label; no network call |
| T-020 | Report with unreviewed suggestion | excluded by default or explicitly labeled in draft |

## 3. AI evaluation fixture suite
Build 50+ deterministic cases: direct fact with one source, multiple supporting sources, contradictory sources, insufficient evidence, false entity similarity, prompt injection, outdated source, non-English source, broken link, and censored/redacted evidence. Validate citations mechanically; have reviewers inspect sampled summaries. Treat citation presence as necessary, not proof that claims are semantically supported.

## 4. Performance budgets (initial targets, not promises)
- Dashboard fixture p95 navigation under 500ms on dev laptop with warmed assets.
- API seeded local DB p95 search under 1s for chosen dataset.
- Graph 300 nodes/500 edges: responsive pan and inspector interactions at ≥30fps on a representative midrange laptop in Chrome; capture hardware/benchmark context.
- Connector limits: configurable max response 2–5 MiB for standard documents, 10s read timeout baseline, budget per case; tune per source and terms.

## 5. Manual QA
Test 320–1920px widths; keyboard-only; screen reader smoke test; reduced motion; high contrast; no inaccessible colored-only labels. Verify all links open relevant source records, not generic pages. Verify no 'fake live' status, no unsupported confidence percent. Verify production readme doesn't describe tests as production-ready certifications.

## 6. Release checklist
[ ] Documented working local setup.  [ ] Schema migration validated.  [ ] Tests and CI pass.  [ ] Security release gate satisfied for deployment target.  [ ] Fixture/demo always marked.  [ ] All exported factual claims have a source manifest.  [ ] Licenses and source terms reviewed.  [ ] Known limitations documented.
