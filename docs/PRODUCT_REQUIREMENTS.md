# Product requirements — SCOPE

## 1. Vision
One workspace for responsible, repeatable OSINT research: collect documented public sources; preserve verifiable evidence; connect organizations, domains, repositories, documents and public events; analyze with AI; and deliver auditable findings.

## 2. Personas and permissions
- **Independent researcher:** small case portfolio, public sources, notes and reports.
- **Defender/analyst:** authorized organizational footprint research and published advisory context, never active exploitation.
- **Team reviewer:** quality-checks citations and proposed links before publication.
- **Administrator:** manages workspace members, policies, integration keys, retention and audit.

Roles: owner (everything + policy), editor (case editing, collection, exports), analyst (research, suggestions, drafting), reviewer (approve/dispute), viewer (read permitted cases). MVP ships with a single local owner account in development; production must support secure auth and server-side RBAC before multiuser release.

## 3. Supported subject types and boundaries
**MVP:** organizations, domains, DNS records, public repository, public article, document, certificate, publicly announced event. **Later:** corporate registry entry, public technology advisory, datasets with appropriate licenses, map views for *organization offices or event venues* only. **Not a feature:** tracking individuals' physical locations, identifying people from photos, private-account discovery, compiling personal contact dossiers, leaked credentials, automated targeting or offensive security.

A **scope policy** records approved subjects, exact source types, domain/organization allowlist, purpose, actor who authorized collection, limits and expiration. Arbitrary pasted names/URLs do not automatically authorize automated expansion.

## 4. Core functionality

| ID | Priority | Feature | Requirements / acceptance focus |
|---|---|---|---|
| F-001 | P0 | Case management | Create, edit, archive, tag and search cases; purpose, scope, status, timeline. |
| F-002 | P0 | Research homepage | Case cards, recent findings, review queue, research runs, totals, shortcuts. |
| F-003 | P0 | Evidence inbox | Capture source type, URL/title, retrieved timestamp, quote/snippet, hash, collector, source terms, case. Flag duplicates; attach notes. |
| F-004 | P0 | Provenance | Source panel always shows provenance. Claims cannot be finalized without ≥1 source; reports use stable citation IDs. |
| F-005 | P0 | Relationship graph | Render nodes/edges with type, status and citations; select/filter/layout; suggestions visually distinct from approved edges. |
| F-006 | P0 | Review workflow | Proposed observation/relation → accepted/disputed/rejected; preserve original and audit rationale. |
| F-007 | P0 | Search | Search case titles, source titles, observations and normalized entities; filters by time/type/status. |
| F-008 | P0 | Demo mode | Seed a fictional organization + fictional domain under reserved `.example` namespace; distinctly marked DEMO. No real network fetch. |
| F-009 | P1 | Safe source collection | Vetted public integrations, per-source credentials, rate/size limits, retries, terms review, cancellation. |
| F-010 | P1 | AI assistance | Plan research, summarize evidence, answer with citations, state unknowns, propose reviewable link suggestions. No unsupervised external tool use. |
| F-011 | P1 | Report builder | Choose findings, source list, review status, export Markdown + PDF (PDF phase after functional text export). |
| F-012 | P1 | Runs/jobs | Progress, step log, retry/cancel, costs and source access errors. |
| F-013 | P1 | Workspaces | Secure login, invitation, RBAC, case-specific membership, audit events. |
| F-014 | P2 | Timeline | Compare source observations by observed date vs retrieved date. |
| F-015 | P2 | Notifications | Source change detection only for user-approved subjects and compliant sources. |
| F-016 | P2 | Additional connectors | Approved licensed company registries, RSS, GitHub org info, CT, Common Crawl with adapter health. |
| F-017 | P2 | Interoperability | JSON/CSV export; STIX 2.1 adapter for cyber data where semantically appropriate, not for all human/business entities. |

## 5. Search/research experience
Input is a **question + optional case scope** rather than a 'hack any target' prompt. User sees a proposed research plan: requested sources, scope, resource cost, and expected artifacts. User approves before any fetch. Agent runs approved tools, each emitting observations with cited sources. Response separates *confirmed from sources*, *corroborated*, *unverified hypothesis*, *unknown*, and *blocked by policy*.

## 6. Explicit MVP exclusions
- No hidden-background omniscient searches, spidering all links, proxy rotation or captcha avoidance.
- No account creation or authentication to third-party services on behalf of users for scraping.
- No exploit inference, password/breach dataset ingestion, scanning beyond passive permitted sources, or automated identity resolution.
- No user-selectable private individual target category.
- No embedding raw source instructions as trusted system prompts.

## 7. Nonfunctional requirements
- Local dev `docker compose up` starts API, DB, Redis and worker; web via pnpm or Compose as documented.
- Graph with 300 nodes/500 edges remains responsive on a midrange laptop; page uses virtualization, clustering/limits when larger.
- Search on seed dataset responds within 1s at local p95; network sources have explicit timeouts and cancellation.
- 100% reviewed findings have valid source references in DB; orphan-source integrity test enforced.
- Demo fresh install creates 3 cases, ≥15 evidence items, ≥30 nodes and ≥35 edges, all fictional and flagged demo.
- No LLM provider required for basic research workflows; graceful unavailable state.
- WCAG 2.2 AA design target (audit rather than claiming certification).
- Transparent errors, no hallucinated enrichment, no false progress bars.

## 8. User stories
**Researcher:** 'I create a case for a fictional company, add a public announcement, inspect a relation in the graph, see its source, and export an evidence-backed summary.'

**Analyst:** 'I approve a scoped company-domain investigation, review RDAP/DNS/CT facts from public sources, and reject an AI suggestion without losing its provenance.'

**Reviewer:** 'I open findings awaiting validation, compare two conflicting sources, mark disputed, and ensure report language reflects the dispute.'

**Admin:** 'I disable a connector, revoke a user, inspect audit logs, and verify old data retention policy still applies.'

## 9. Success measures
- First case setup under 2 minutes with fixtures.
- Every published graph relationship has at least one evidence reference.
- No successful SSRF/private-IP egress in automated tests.
- ≥95% of fixture-based Q&A citation checks pass; unsupported questions explicitly state insufficient evidence.
- A user can trace every final report claim to a clickable local evidence record and original permitted public source.
