# UI/UX plan — SCOPE

## 1. Visual direction
**Monochrome Glass Bento:** near-black, compact professional research console; modular cards, generous whitespace, subtle blur, informative typography, restrained aqua/ice-blue accent. Do not replicate products or trademarks. Avoid a permanent old-style vertical sidebar. Prefer top app bar, case-context chips and a compact bottom task dock when useful.

### Foundation tokens (initial proposals, tune after screenshots)
```
--bg: #080B0D; --surface: #10161A; --surface-raised: #151D22;
--glass: rgba(22,30,35,.76); --border: rgba(255,255,255,.09);
--text: #F3F7F8; --muted: #9DABB3; --accent: #75D9CE;
--success: #80CDA7; --warning: #E2BF7A; --danger: #E18B92;
--radius-card: 18px; --radius-control: 11px;
--shadow: 0 12px 40px rgba(0,0,0,.24);
```
Typography: Inter or Geist, 14–15px reading, 12px metadata, 24–32px page headlines. Spacing scale 4/8/12/16/24/32. Never use colored badges as decorative headings. Motion subtle, functional, 140–250ms normally; `prefers-reduced-motion` disables transitions where appropriate.

## 2. Primary information architecture
```
TOP BAR  Logo | Workspace / Case switcher | Global search | +New | Jobs | Profile

HOME       BENTO CASES / RECENT EVIDENCE / REVIEW QUEUE / ACTIVITY
CASE       OVERVIEW | GRAPH | EVIDENCE | RESEARCH | TIMELINE | REPORTS
SOURCES    CONNECTOR CATALOG | CONNECTION STATES | PROVIDER TERMS
SETTINGS   MEMBERS | POLICIES | LLM PROVIDER | RETENTION | AUDIT

BOTTOM DOCK (desktop optional): Home / Cases / Search / Graph / Assistant
```
Mobile: top condensed bar + bottom navigation (Home, Cases, Research, More); graph goes full-screen with a floating inspector sheet.

## 3. Screen specifications
### 3.1 Onboarding + demo
- First run: Create workspace, choose local demo or real workspace, establish safe-use scope.
- Demo comes preloaded with **fictional** company/asset records; a persistent DEMO label prevents confusion.
- Four short actions: open case, inspect evidence, explore graph, export demo report.

### 3.2 Dashboard (`/app`)
Desktop bento grid: wide 'Continue investigation' card, four counters (active cases, reviewed evidence, pending links, jobs), recent cases, review queue, recent source activity, AI entry point. Counters link to filtered views. Skeleton/zero states must make sense.

### 3.3 Case overview (`/app/cases/[id]`)
Header: case name, scope badge, created/last activity, collaborators and actions. Below: objective/purpose, recent findings, entity chips, recent research runs, review-needed cards, timeline preview. Secondary top-tabs rather than left tree. Case switcher in header.

### 3.4 Graph (`/app/cases/[id]/graph`)
```
┌────────────────────────────── Top / context nav ──────────────────────────┐
│ Case: Aurora Systems (DEMO)    Graph | Evidence | Research | Reports       │
├────────────────────────────────────────────────────────────────────────────┤
│ Filters: [type] [review status] [date]  Layout: [Force / Hierarchy]  Search│
├───────────────────────────────────────────────┬────────────────────────────┤
│                                               │ Inspector                   │
│                INTERACTIVE GRAPH              │ Selected: Organization     │
│  [Org]──documented ownership──[Domain]        │ Status: reviewed           │
│    │                         │                │ Evidence refs: [SRC-...]   │
│    └──publishes────────────[Article]          │ Links / Notes / History    │
│                                               │ [Open source] [Suggest link]│
├───────────────────────────────────────────────┴────────────────────────────┤
│ Fit / Zoom / Layout / Snapshot   30 nodes, 35 relationships                │
└────────────────────────────────────────────────────────────────────────────┘
```
Node categories: organization (building), domain (globe), repo (code), source (document), certificate (shield), event (calendar). Node status is conveyed by text/shape as well as color. Connections solid = approved cited fact; dashed = suggestion; dotted = analyst hypothesis. All edge types have accessible labels. Inspector displays linked evidence with timestamp, method, direct source link, review status and event history. Large graphs use search + focus depth and clustering.

Graph interactions: drag/pan/zoom, keyboard node selection, multi-select, filter, layout reset, undo of local viewport operations, open evidence from node/edge. Edge creation is a suggestion until cited/reviewed, never instant evidence.

### 3.5 Evidence inbox (`/app/cases/[id]/evidence`)
Three-pane desktop: filter list | evidence preview | provenance/review. At smaller widths use two panes or stacked tabs. Each item shows title, source type, collection time, cited observation count, verification and review status. Viewer supports sanitized text/HTML and allowed downloads, no raw HTML execution. Source details show URL and fetch metadata; separate `observed_at` from `retrieved_at`. Actions: add note, propose entity, mark duplicate, request review, accept/dispute/reject.

### 3.6 AI research (`/app/cases/[id]/research`)
Split screen: chat-style analysis on left, **Research Plan** + tool invocation feed on right. User types a question; response begins with proposed sources, boundaries and estimated usage. **Approve plan** button before any network request. Each run shows source adapter, number of records, errors, stopped/cancelled. Answer renders claim-specific citation chips (`[S1]`, `[S2]`), supported/unsupported sections, and optional 'Propose graph link' cards awaiting review. No fabricated live results or silently executed steps.

### 3.7 Report studio (`/app/cases/[id]/reports`)
Editable title, abstract, findings list with citation count, caveats, sources, reviewer. Drag sections, preview markdown and PDF, export markdown/JSON first and PDF later. Report export modal warns about unreviewed items; by default exclude rejected and privacy-prohibited data. Claims link to frozen source record identifiers.

### 3.8 Source catalog (`/app/sources`)
Connector cards: provider, supported entities, auth requirement, source terms, health, cost tier (estimate or unknown), enable/disable. Never promise a provider's free usage or availability. Per-connector test action uses an approved fixture/public sample.

### 3.9 Settings (`/app/settings`)
Workspace permissions, source policies, model provider BYOK, audit logs, data retention/erasure, billing/limits if ever added. Separate research scope policy from API credential storage.

## 4. UX interaction contracts
- Loading: precise loading state; slow runs show real step names, no fake percentage.
- Errors: clear cause + retry affordance; policy-denied requests explain reason without offering bypasses.
- Empty: one contextual action and educational example.
- Quality: reviewed/verified, corroborated, unreviewed, disputed, rejected are explicit and consistent across graph/evidence/reports.
- Citations: hover shows source title/timestamp/snippet; click opens evidence inspector; original source opens separately.
- Human review: never one-click publish mass AI output; bulk review requires itemized selections.
- Keyboard shortcuts: `/` search, `g` graph when not typing, `Esc` close; shortcut help in profile menu.
- Performance: optimistic edits only for safe UI state; provenance updates require confirmed server response.

## 5. Responsive widths
Desktop ≥1280: bento + graph inspector; tablet 768–1279: collapsible inspector; mobile <768: list-first graph, full-screen inspector and compressed top bar. Touch targets ≥44px. Preserve data visibility in reduced-motion and high-contrast environments.

## 6. Exact first UI deliverable
Implement all routes using typed **fictional seed fixtures** with real interactions: switch case, search/filter evidence, focus graph node, inspect citation, create/edit an in-memory demo case, open research-plan modal, toggle connector state mock, assemble report preview. Add Storybook (optional) for 20 reusable components. Tests verify routing and keyboard use. No backend dependency yet, but API client interfaces must be typed and later replaceable.

## 7. UI acceptance screenshots
1. Dashboard at 1440×900.
2. Graph with inspector at 1440×900 and mobile 390×844.
3. Evidence three-pane and mobile variant.
4. Research plan approval + running/failure state.
5. Report editor with citations.
6. Accessibility keyboard focus snapshots.
