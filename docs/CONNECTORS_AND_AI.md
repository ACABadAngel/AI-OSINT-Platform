# Connectors + AI agent design

## 1. Connector system
Public sources are not interchangeable. Each integration must explicitly define allowed query kinds, auth mechanism, provenance, terms, rate limits, data minimization, and collection scope. The agent sees **schemas**, not arbitrary network access.

### Initial adapters (sequenced)
| Adapter | Input | Output | Stage | Restrictions |
|---|---|---|---|---|
| manual evidence | User-selected URL/file/text | cited source + observations | MVP | user attests rights; files sanitized |
| fixtures | fictional case identifier | deterministic sample data | UI | never touches network |
| approved RSS | exact URL in policy allowlist | feed items, published dates | P1 | provider terms, size/rate caps |
| RDAP | approved organization/domain | public registration metadata | P1 | minimize/redact individual registrant details; authoritative bootstrap |
| DNS records | approved domain | record sets with timestamps | P1 | passive resolver only; no enumeration |
| CT logs | approved domain | publicly issued certificate metadata | P1 | no brute-force subdomain expansion; restrict exact/scope-approved names |
| GitHub public org | approved organization/repo | public repo metadata and documented releases | P1/P2 | authenticated/unauth limits, avoid contributor identity profiling |
| Common Crawl | specifically approved URL/domain | historical public page references | P2 | archives/terms, avoid bulk profiling |
| OSV advisories | published package/version | advisory metadata | P2 | passive advisory enrichment, no exploit instructions |
| company registry | approved organization | public corporate filings | P2 | licensing, privacy and jurisdiction review first |

Do not promise connectors are free, reliable, or usable without keys; health and source conditions must be checked individually.

### Typed connector interface (conceptual)
```python
class Connector(Protocol):
    name: str
    supported_subject_types: tuple[str, ...]
    def validate_scope(self, scope: ScopePolicy, query: ConnectorQuery) -> PermitDecision: ...
    async def fetch(self, query: ConnectorQuery, context: SafeFetchContext) -> list[RawSourceRecord]: ...
    def normalize(self, raw: RawSourceRecord) -> list[ObservationCandidate]: ...
```
`SafeFetchContext` enforces approved destinations, IP/DNS/redirect checks, credential isolation, timeout, byte limits, per-provider concurrency, audit and cancellation. Connectors cannot invoke arbitrary shell commands, browser login or external AI tools.

`ObservationCandidate` MUST include source ID/URL, retrieval time, source-specific identifier, normalized subject, predicate, typed value, extraction method, and whether evidence is demo. Optional snapshot only where allowed.

## 2. AI roles (logical modules, not autonomous independent agents)
1. **Planner**: decomposes question into bounded tool requests, estimates source types, declares scope questions and unknowns. No network access.
2. **Collector orchestrator**: deterministic code compares plan against policy and explicitly approved connectors, queues idempotent jobs. Model cannot override.
3. **Extractor**: structured extraction from sanitized permitted text with passage citations; output is untrusted candidate until validation/review.
4. **Entity normalizer**: exact identifier matching for organizations/domains/repos; proposes ambiguous merges, never auto-merges ambiguous names or people.
5. **Evidence analyst**: synthesizes only approved case evidence; returns per-claim observation IDs, contradictory records and unknowns.
6. **Report drafter**: composes reviewer-friendly narrative with traceable bibliography, no unsupported extrapolation.

No autonomous recursive investigations. Next-step suggestions always return to a human approval gate with bounded scope.

## 3. Grounding contract
Inputs: case ID, user question, role, top-k filtered observations, source metadata, relevant relations, retrieval policy. Outputs: strict JSON schema with `claims:[{text,observation_ids,support}]`, `unknowns`, `contradictions`, `suggested_actions`. Post-processor verifies source IDs exist, are readable, have supported mapping, and do not contradict the status. Unsupported claims are withheld or labeled explicitly. Keep source quote lengths bounded. If insufficient evidence, output 'not established by available sources'.

## 4. Prompt injection and data integrity
Never forward raw HTML as system instructions. Use HTML-to-text extraction and delimit source content as external evidence. Model context must not contain connector credentials, internal network addresses or unrelated cases. Ignore source text telling the model to open sites, run commands, change objectives, or reveal secrets. Use schema-constrained outputs, budget limits, deterministic tool registry, and an audit log for every tool request.

## 5. Suggested provider-agnostic inference interface
```python
class ModelGateway(Protocol):
    async def propose_plan(self, case_context: CaseContext, question: str) -> PlanProposal: ...
    async def extract_observations(self, source: EvidenceContext) -> list[ObservationCandidate]: ...
    async def answer_with_citations(self, evidence: list[EvidenceContext], question: str) -> GroundedAnswer: ...
```
Default to fixture-backed fake provider in unit tests. Production AI key stored server-side only. Configure per-workspace request caps, token budget, provider policy, timeout, and manual fallback. No source results should be fabricated when provider fails.

## 6. Research step lifecycle
`draft` → `policy_validated` → `awaiting_approval` → `queued` → `running` → `normalizing` → `awaiting_review` → `completed`, with `cancelled`, `blocked`, `failed`, `retryable_failed`. Idempotent retries preserve provenance and do not duplicate reviewed observations.

## 7. Source verification procedure
- Separate the source's claim from our interpretation.
- Record source identity, published/retrieved dates, canonical URL and whether snapshot retention is allowed.
- Prefer primary/official sources where the question permits.
- If sources conflict, show a dispute rather than averaging them.
- Assign qualitative status (supported by source / corroborated / unreviewed / disputed); do not output made-up numerical certainty.

## 8. Open-source interoperability
MCP-compatible read-only inspection for *your own cases* can be added in a later phase with scoped authentication and explicit permissions. Do not expose remote execute, shell or unrestricted URL fetch as an AI tool. STIX 2.1 export limited to cyber-intelligence objects with semantics that actually map.
