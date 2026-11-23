# Data model and provenance

## 1. Core entities (UUID primary keys; UTC timestamps)
| Table | Core fields | Important constraints |
|---|---|---|
| workspaces | id, name, created_at, retention_days | Multitenant boundary |
| users | id, external_auth_id, display_name | No unnecessary personal profile fields |
| memberships | workspace_id, user_id, role, joined_at | Unique workspace/user |
| cases | id, workspace_id, title, purpose, status, scope_policy_id, created_by | Scope by workspace; archived timestamp |
| case_memberships | case_id, user_id, role | Optional finer-grained access |
| scope_policies | id, workspace_id, purpose, approved_subjects JSONB, allowed_connectors JSONB, limits JSONB, expires_at, authorized_by | No collection without valid policy |
| source_records | id, workspace_id, case_id, connector_id, source_url, title, content_type, retrieved_at, published_at, external_id, sha256, snapshot_ref, license_notes, status, demo | Uniqueness by normalized URL + hash + case as appropriate |
| observations | id, case_id, source_id, subject_entity_id, predicate, value JSONB, observed_at, extracted_at, extracted_by, review_status, reviewer_id | Source required; revision instead of destructive edits |
| entities | id, case_id, type, canonical_label, normalized_key, metadata JSONB, review_status | Scoped canonical identities, no automatic person correlation |
| relationships | id, case_id, from_entity_id, to_entity_id, type, review_status, rationale, created_by | Same-case FK validation; never silently finalized |
| relationship_evidence | relationship_id, observation_id | ≥1 supporting observation for reviewed/approved edge |
| evidence_reviews | id, case_id, object_type, object_id, decision, rationale, reviewer_id, created_at | Immutable review history |
| research_runs | id, case_id, initiated_by, objective, plan JSONB, approved_at, status, cost_budget, started_at, ended_at | Approved plan immutable per run |
| research_steps | id, run_id, connector, normalized_target, status, started_at, ended_at, error_code, record_count | Job observability |
| model_outputs | id, run_id, provider, model, prompt_version, schema_version, validated_output JSONB, review_status | Prompt/tool audit without storing secrets |
| report_versions | id, case_id, version, rendered_markdown_ref, source_manifest JSONB, created_by, created_at | Freeze manifest upon export |
| audit_events | id, workspace_id, actor_id, action, object_type, object_id, metadata JSONB, created_at | Append-only; metadata redaction |
| connector_configs | id, workspace_id, connector_name, enabled, credential_ref, terms_accepted_at, rate_limit_profile | Secrets never in cleartext |

Add indexes: `(workspace_id, created_at)` for cases/sources, `(case_id, type, normalized_key)` for entities, `(case_id, from_entity_id)` and `(case_id, to_entity_id)` for relationships, FTS index for text fields, `(case_id, review_status)` for review queue, `(run_id,status)` for steps.

## 2. Semantics
- **Source:** a record of where information was obtained. Not inherently true.
- **Observation:** a source-anchored extract or assertion, possibly mistaken.
- **Entity:** case-local normalized named thing, not a universal real-world identity.
- **Relationship:** evidence-linked statement between entities; can be reviewed, disputed, rejected, or hypothesis.
- **Claim:** report/AI sentence traceable to observation IDs and source references.
- `observed_at` = event happened / information applies; `retrieved_at` = collected from source; `published_at` = source publication time. May all differ or be null except retrieval.

Never conflate similarity with identity. Duplicate matching is initially exact normalized identifiers plus analyst review, not automatic fuzzy person matching.

## 3. Relationship status state machine
`proposed` → `approved` | `disputed` | `rejected`; `approved` → `disputed` | `superseded`. Change creates review record. An `approved` relationship must have at least one linked observation from same case. A human-authored `hypothesis` is never a verified fact and must retain author.

## 4. Source identification and snapshot policy
Store canonical URL, fetch timestamp, source-specific ID, ETag/Last-Modified when available, SHA-256 of permitted captured bytes, licensing/robots notes, and object storage ref if archiving allowed. If copying prohibited, store metadata, citation URL and allowed excerpt only. For source deletion/retention expiry, preserve a non-content tombstone/limited audit trail as legally appropriate; do not rely on old external URLs always remaining accessible.

## 5. Demo seed design
Use the reserved `.example` domain and entirely fictitious names: Aurora Systems, Beacon Research Ltd, `aurora.example`, `beacon.example`, fictional announcements and repositories. At least 3 cases, 15 sources, 30 nodes, 35 edges. Every demo record has `demo=true`. No contact emails, phone numbers or individual profiles.

## 6. Example graph query semantics
Graph API returns only nodes relevant to a case and edges where both endpoints belong to it; depth is capped, pagination or viewport filters required for larger graphs. Each edge includes `evidence_count`, `review_status`, `source_ids`, `created_at`; each node includes `type`, `label`, `status`, `metadata`, with sensitive optional data omitted per role.

## 7. Export compatibility
CSV/JSON for general evidence; STIX 2.1 conversion only for expressible cyber-intelligence records, preserving source references and explicit mapping status. OpenCTI models cyber threat intelligence around STIX 2.1, not a general replacement for every organizational fact.
