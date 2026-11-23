# Security, lawful use and privacy engineering

## 1. Scope and threat model
SCOPE collects public-source evidence about organizations, domains, public repositories and documents for legitimate research. **Public availability does not automatically make all processing or aggregation lawful**; verify legitimate purpose, lawful basis, minimization, notices/rights where applicable, cross-border transfer, data retention and source terms. In EU deployments, seek appropriate GDPR review before personal-data functionality. Not legal advice.

### Denied capability classes
- Personalized dossiers, mass identity resolution or cross-platform linking of private individuals.
- Tracking real-time or historical movements of individuals, identifying home addresses, geolocating people from photos.
- Facial recognition or image-based person matching.
- Leaked credentials, exposed secret hunting against third parties, password spraying, authentication bypasses, automated account enumeration.
- Exploitation, active vulnerability scanning, port sweeps, stealth enumeration, proxies to evade rate limits, captcha circumvention.
- Blanket harvesting of contact lists, private databases or access-controlled pages.

Research on publicly named organization leaders in a **specific source document** may quote only contextually relevant public statements, but the product must not offer a person-targeting/search profile workflow.

## 2. Abuse-case controls
| Threat | Control | Verification |
|---|---|---|
| SSRF / cloud metadata fetch | fixed adapter endpoints or validated allowlisted URLs, DNS pinning/connection validation, block private/link-local/loopback/multicast/reserved IPs IPv4+IPv6, validate every redirect, network egress firewall | malicious URL unit/integration tests |
| DNS rebinding | resolve + connect to validated address; revalidate after redirects; protected egress path | simulated rebinding tests |
| Prompt injection | treat source content as untrusted; no freeform model tools; schema-only candidate outputs | adversarial fixture corpus |
| Scope drift | immutable approved plan, per-run allowlist, expiry/budget, human approval of new scopes | policy bypass tests |
| Cross-tenant leakage | server RBAC, workspace/case authorization on every DB read/write and SSE channel, optional RLS | tenant isolation tests |
| Credential exposure | server secret manager, encryption, least privilege, redacted logs, no browser keys | secret scan, test logging |
| Data exfiltration through reports | report permission, redaction, review gate, export audit | viewer/export tests |
| Source poisoning / forged facts | provenance hashes, review status, contradicting evidence, no auto-approved graph claims | test invented citations |
| Unexpected high costs | requests/tokens/storage quotas, per-connector ceilings, status and cancellation | budget tests |
| Malicious file upload | MIME detection, content size, quarantine/safe parsing, no macro or script execution | parser tests |
| Abuse at scale | account limits, rate limits, abuse monitoring and suspension policy | end-to-end volume tests |

## 3. SSRF implementation rules
All external I/O in worker connectors runs through a *single* audited fetch gateway. For arbitrary document URLs, require user-approved exact URL or provider allowlist; reject unsupported schemes, userinfo, unusual ports, embedded credentials, and disallowed targets. Validate and bind public DNS answers at connection time, prevent redirects into private networks, block special-use address space (not just RFC1918), cap bytes, decompression ratio, time and redirect hops, and use OS/network egress isolation. Do not write an insecure generic `requests.get(user_url)` implementation. Follow OWASP's SSRF prevention guidance.

## 4. API security rules
- Auth for production: OIDC or secure session framework; secure, HttpOnly, SameSite cookies as applicable; CSRF protections for cookie state-changing routes.
- Authorize *object-level* on every route, query and job callback; jobs carry signed/validated context, not blindly trust case IDs.
- Parameterized SQL; no user-supplied query execution; bounded graph search depth and cursor size.
- Encrypt connector credentials at rest; store only secret reference in DB.
- TLS and strict CORS; content security policy; isolate untrusted previews.
- Hash passwords through an audited auth provider or Argon2id if local account auth is necessary.
- Backups + restoration drill; documented incident and vulnerability reporting process.

## 5. Lifecycle and rights
Retention configurable by workspace/source category with defaults appropriate to purpose; source metadata and legal holds handled separately. Provide case export, correction annotations, record deletion/redaction request process and visibility into affected reports. Avoid caching personal data unnecessarily. Logs should contain opaque IDs rather than personal content.

## 6. Responsible AI behavior
Agent cannot broaden target set, run new connector or schedule monitoring without user approval. User sees all planned sources and budget estimates. AI cannot approve its own findings. Clearly mark inferred/unknown/disputed content, record model/prompt versions and source manifest, and allow correction with audit trail. Reports cannot portray speculation as fact.

## 7. Deployment release gate
No internet-facing deployment until production authentication, server RBAC, per-tenant isolation, outgoing network controls, audit, request quotas, secret handling, source terms acceptance, retention policy and application security tests are complete. A polished demo is not a production security posture.

## 8. References
- OWASP SSRF prevention: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- EDPB privacy guidance portal: https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en
- GDPR official text: https://eur-lex.europa.eu/eli/reg/2016/679/oj
