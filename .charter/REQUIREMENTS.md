# Software Requirements Specification: HookHub

> Generated from: .charter/BUSINESS-CASE.md + .charter/STORY-MAP.md
> Generated on: 2026-02-01
> Methodology: BABOK v3 + ISO/IEC 25010:2023 + MoSCoW

## 1. Introduction

### 1.1 Purpose

HookHub is a browsable, filterable web directory of open-source Claude Code hooks. Each hook links to its GitHub source repository. The system displays a curated catalog in a grid with filtering by purpose category and lifecycle event. It is a read-only site backed by a local JSON manifest enriched via the GitHub API at build time.

This SRS transforms the 9 business requirements (BR-01 through BR-09) from the Business Requirements Document into formal, testable, traceable software requirements.

### 1.2 Scope

#### In Scope

- Browsable grid display of curated Claude Code hooks
- Each hook displays: name, purpose category, lifecycle event, description, GitHub stars, and link to GitHub repository
- Dual-dimension filtering: by purpose category and by lifecycle event
- Responsive design (mobile, tablet, desktop)
- Local manifest file with curator-selected hooks, enriched via GitHub API at build time
- Curator-managed catalog (no community submissions)

#### Out of Scope

See Section 5 (Won't Have).

### 1.3 Stakeholders

| Role | Type | Needs | Engagement |
|------|------|-------|------------|
| Developer (Claude Code user) | Primary end user | Browse, filter, and discover hooks; click through to GitHub repos | High — all user-facing requirements derive from this role |
| Curator (site maintainer) | Internal operator | Manage manifest, run builds, validate catalog quality | Medium — data pipeline and build requirements derive from this role |

### 1.4 Definitions

| Term | Definition |
|------|-----------|
| Hook | An open-source Claude Code hook hosted on GitHub |
| Purpose category | Classification of what a hook does: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom |
| Lifecycle event | When a hook fires: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop |
| Manifest | The local JSON file (`data/hooks.json`) listing curated hooks and their metadata |
| Enrichment | Build-time process that fetches live metadata from GitHub API for each hook |

---

## 2. Functional Requirements

### 2.1 Catalog Display (FR-CAT)

**Source:** BR-01 (BUSINESS-CASE.md, Section 9.3)

- [ ] **FR-CAT-01**: The system shall display all hooks from the catalog in a multi-column grid layout
  - Source: BR-01 | Priority: Must
  - Acceptance: Grid renders with all manifest hooks visible; no hooks omitted

- [ ] **FR-CAT-02**: The grid shall adapt responsively — 3–4 columns on desktop, 2 columns on tablet, 1 column on mobile
  - Source: BR-01 | Priority: Must
  - Acceptance: Grid breakpoints tested at 1440px (desktop), 768px (tablet), 375px (mobile)

- [ ] **FR-CAT-03**: The grid shall display all hooks without pagination
  - Source: BR-01 | Priority: Must
  - Acceptance: No "load more" button, pagination controls, or lazy-load triggers present

- [ ] **FR-CAT-04**: The grid shall maintain consistent spacing and alignment across all breakpoints
  - Source: BR-01 | Priority: Must
  - Acceptance: Cards have uniform gaps; no orphan cards break alignment at any viewport

### 2.2 Hook Card (FR-CARD)

**Source:** BR-01, BR-02, BR-03 (BUSINESS-CASE.md, Section 9.3)
**Design context (G-03):** Compact card — name as title, category + lifecycle as small badges, 2-line truncated description, stars count, subtle repo link.

- [ ] **FR-CARD-01**: Each hook card shall display the hook name as its title, the most prominent text element
  - Source: BR-01 | Priority: Must
  - Acceptance: Name renders as a semantic heading element; first and largest text on card

- [ ] **FR-CARD-02**: Each hook card shall display its purpose category as a visually distinct badge
  - Source: BR-02 | Priority: Must
  - Acceptance: Badge is color-coded or styled differently from other card elements; text is readable at small sizes

- [ ] **FR-CARD-03**: Each hook card shall display its lifecycle event as a visually distinct badge
  - Source: BR-02 | Priority: Must
  - Acceptance: Event badge uses a different styling/color scheme from the category badge

- [ ] **FR-CARD-04**: The purpose category badge and lifecycle event badge shall use different visual treatments so they are distinguishable at a glance
  - Source: BR-02 | Priority: Must
  - Acceptance: A user can tell which badge is "category" and which is "event" without reading labels

- [ ] **FR-CARD-05**: The system shall support all 8 purpose categories: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
  - Source: BR-02 | Priority: Must
  - Acceptance: Each of the 8 values renders correctly as a badge; no "unknown" fallback needed for valid data

- [ ] **FR-CARD-06**: The system shall support all 5 lifecycle events: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop
  - Source: BR-02 | Priority: Must
  - Acceptance: Each of the 5 values renders correctly; exact event names used as badge text

- [ ] **FR-CARD-07**: Each hook card shall display the hook description, truncated to approximately 2 lines
  - Source: BR-01 | Priority: Must
  - Acceptance: Truncated descriptions end with an ellipsis; cards with short descriptions maintain grid alignment

- [ ] **FR-CARD-08**: Each hook card shall display the GitHub stars count with a recognizable star icon
  - Source: BR-01 | Priority: Must
  - Acceptance: Star icon + numeric count visible on every card; hooks with 0 stars display "0" (not hidden)

- [ ] **FR-CARD-09**: Stars count shall be formatted for readability (e.g., "1.2k" for 1,200+)
  - Source: BR-01 | Priority: Must
  - Acceptance: Counts ≥ 1,000 display abbreviated format; counts < 1,000 display exact number

- [ ] **FR-CARD-10**: Each hook card shall include a clickable link to its GitHub repository
  - Source: BR-03 | Priority: Must
  - Acceptance: Link is visually identifiable as clickable; URL points to the correct repo

- [ ] **FR-CARD-11**: The GitHub repository link shall open in a new browser tab with appropriate security attributes
  - Source: BR-03 | Priority: Must
  - Acceptance: Link has `target="_blank"` and `rel="noopener noreferrer"`

### 2.3 Landing Page (FR-LAND)

**Source:** BR-05 (BUSINESS-CASE.md, Section 9.3)

- [ ] **FR-LAND-01**: The landing page shall include a hero section as the first visible content
  - Source: BR-05 | Priority: Must
  - Acceptance: Hero is the topmost element; no other content appears above it

- [ ] **FR-LAND-02**: The hero section shall communicate that HookHub is a directory of open-source Claude Code hooks
  - Source: BR-05 | Priority: Must
  - Acceptance: Headline and/or supporting text explicitly mention "Claude Code hooks" and "directory"

- [ ] **FR-LAND-03**: The site's purpose shall be understandable within 5 seconds of landing
  - Source: BR-05 | Priority: Must
  - Acceptance: Concise headline (≤ 10 words) + brief supporting text (1–2 sentences); no jargon

- [ ] **FR-LAND-04**: The hero shall include a visual cue directing toward the hook catalog below
  - Source: BR-05 | Priority: Must
  - Acceptance: Scroll indicator, arrow, or anchor link pointing to the grid section

- [ ] **FR-LAND-05**: At least the first row of hook cards shall be visible without scrolling on a 1080p desktop viewport
  - Source: BR-05 | Priority: Must
  - Acceptance: On a 1920×1080 viewport, hero + first row of cards are within the initial viewport

### 2.4 Filtering (FR-FILT)

**Source:** BR-04 (BUSINESS-CASE.md, Section 9.3)
**Design context (G-04):** Toggle chips — horizontal row of clickable chips/pills above the grid. Active chip highlighted.
**Design context (G-05):** AND logic — when both filters active, show only hooks matching both.

- [ ] **FR-FILT-01**: The system shall display a horizontal row of toggle chips for purpose categories above the grid
  - Source: BR-04 | Priority: Must
  - Acceptance: All 8 categories + "All" visible as chips in a single row; chips wrap gracefully on narrow viewports

- [ ] **FR-FILT-02**: The system shall display a horizontal row of toggle chips for lifecycle events below the category filter row
  - Source: BR-04 | Priority: Must
  - Acceptance: All 5 events + "All" visible as chips; visually grouped separately from category chips

- [ ] **FR-FILT-03**: Clicking a category chip shall highlight it and filter the grid to show only hooks matching that category
  - Source: BR-04 | Priority: Must
  - Acceptance: Selected chip has highlighted state; grid immediately shows only matching hooks

- [ ] **FR-FILT-04**: Clicking an event chip shall highlight it and filter the grid to show only hooks matching that lifecycle event
  - Source: BR-04 | Priority: Must
  - Acceptance: Selected chip has highlighted state; grid immediately shows only matching hooks

- [ ] **FR-FILT-05**: When both a category filter and an event filter are active, only hooks matching BOTH shall be displayed (AND logic)
  - Source: BR-04 | Priority: Must
  - Acceptance: Hook must match the selected category AND the selected event to appear

- [ ] **FR-FILT-06**: Each filter dimension shall be single-select — only one category and one event can be active at a time
  - Source: BR-04 | Priority: Must
  - Acceptance: Selecting a new chip in the same dimension deselects the previous one

- [ ] **FR-FILT-07**: An "All" option shall appear as the first chip in each filter row
  - Source: BR-04 | Priority: Must
  - Acceptance: "All" is the leftmost chip in both the category row and the event row

- [ ] **FR-FILT-08**: "All" shall be selected by default when no filter is active in that dimension
  - Source: BR-04 | Priority: Must
  - Acceptance: On initial page load, "All" is highlighted in both filter rows

- [ ] **FR-FILT-09**: Clicking "All" shall clear the filter in that dimension without affecting the other dimension
  - Source: BR-04 | Priority: Must
  - Acceptance: Clicking "All" in categories does not reset the event filter, and vice versa

- [ ] **FR-FILT-10**: Filtering shall update the grid immediately without a page reload (client-side)
  - Source: BR-04 | Priority: Must
  - Acceptance: No full-page navigation or visible loading state during filtering

- [ ] **FR-FILT-11**: The visible hook count shall update to reflect the currently filtered results
  - Source: BR-04 | Priority: Must
  - Acceptance: A count (e.g., "Showing 8 hooks") updates dynamically as filters change

- [ ] **FR-FILT-12**: When the active filter combination returns zero matching hooks, the system shall display an empty state message in the grid area
  - Source: Implicit from BR-04 (AND logic can produce zero results)
  - Priority: Should
  - Acceptance: Message such as "No hooks match your filters" replaces the grid; no blank/broken grid

### 2.5 Text Search (FR-SRCH)

**Source:** BR-09 (BUSINESS-CASE.md, Section 9.3)
**Release:** Future

- [ ] **FR-SRCH-01**: The system shall provide a search input field visible above or alongside the filter chips
  - Source: BR-09 | Priority: Could
  - Acceptance: Search field is accessible without scrolling; visually associated with filters

- [ ] **FR-SRCH-02**: Typing in the search field shall filter hooks in real-time as the user types (client-side)
  - Source: BR-09 | Priority: Could
  - Acceptance: Grid updates after each keystroke (or with ≤ 300ms debounce); no page reload

- [ ] **FR-SRCH-03**: Search shall match against hook name and description fields (case-insensitive)
  - Source: BR-09 | Priority: Could
  - Acceptance: Searching "auto" matches hooks with "Automation" in name or description regardless of case

- [ ] **FR-SRCH-04**: Clearing the search field shall restore the full catalog, subject to any active filters
  - Source: BR-09 | Priority: Could
  - Acceptance: Backspacing to empty shows all hooks (filtered by active category/event if any)

- [ ] **FR-SRCH-05**: Search shall combine with category and lifecycle event filters using AND logic
  - Source: BR-09 | Priority: Could
  - Acceptance: Search term + active category + active event all apply simultaneously

- [ ] **FR-SRCH-06**: When search and/or filters return zero matching hooks, a "No results" empty state shall be displayed
  - Source: BR-09 | Priority: Could
  - Acceptance: Helpful message (e.g., "No hooks found — try different search terms or clear your filters")

### 2.6 Theme (FR-UI)

**Source:** BR-08 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

- [ ] **FR-UI-01**: The site shall detect the user's system color scheme preference via the `prefers-color-scheme` media query
  - Source: BR-08 | Priority: Could
  - Acceptance: Site renders in dark mode on systems set to dark; light mode on systems set to light

- [ ] **FR-UI-02**: All content shall be readable and visually correct in both dark and light modes
  - Source: BR-08 | Priority: Could
  - Acceptance: Cards, badges, text, backgrounds, and links are all legible in both modes

- [ ] **FR-UI-03**: There shall be no flash of unstyled content (FOUC) when the initial color mode is applied
  - Source: BR-08 | Priority: Could
  - Acceptance: Page renders in the correct mode on first paint; no visible mode switch flicker

### 2.7 Data Pipeline (FR-DATA)

**Source:** BR-03, BR-06 (BUSINESS-CASE.md, Section 9.3)

- [ ] **FR-DATA-01**: The build process shall read hook entries from the local manifest file at `data/hooks.json`
  - Source: BR-06 | Priority: Must
  - Acceptance: Build reads and parses the manifest; errors on missing or malformed file

- [ ] **FR-DATA-02**: Each manifest entry shall include at minimum: GitHub repo URL, hook name, purpose category, and lifecycle event
  - Source: BR-06 | Priority: Must
  - Acceptance: Build-time validation rejects entries missing any of these four fields

- [ ] **FR-DATA-03**: For each hook, the build shall fetch from the GitHub API: stars count, description, and last updated date
  - Source: BR-06 | Priority: Must
  - Acceptance: All three fields are populated for each hook after a successful build

- [ ] **FR-DATA-04**: Fetched GitHub metadata shall be merged with manifest data and passed to page components as static props
  - Source: BR-06 | Priority: Must
  - Acceptance: Page components receive combined manifest + API data; no runtime API calls

- [ ] **FR-DATA-05**: Only hooks listed in the manifest file shall appear on the site
  - Source: BR-06 | Priority: Must
  - Acceptance: Adding a hook to the manifest and rebuilding shows it; removing and rebuilding hides it

- [ ] **FR-DATA-06**: The manifest file shall be valid JSON, validated at build time against a defined schema
  - Source: BR-06 | Priority: Must
  - Acceptance: Build fails with a descriptive error if manifest has invalid JSON or missing required fields

- [ ] **FR-DATA-07**: GitHub API usage shall be efficient — a single API request per repository via the repos endpoint
  - Source: BR-06 | Priority: Must
  - Acceptance: For N hooks, exactly N API requests are made (no duplicates, no extra endpoints)

- [ ] **FR-DATA-08**: The build process shall validate each hook's GitHub repo URL for accessibility
  - Source: BR-03 | Priority: Must
  - Acceptance: HTTP status is checked during the API fetch; unreachable repos are flagged

- [ ] **FR-DATA-09**: Build validation shall warn on unreachable repositories without failing the entire build
  - Source: BR-03 | Priority: Must
  - Acceptance: Build completes; log output lists any unreachable repos with their URLs and error codes

- [ ] **FR-DATA-10**: Build shall log enrichment results for curator review — which hooks succeeded and which failed
  - Source: BR-06 | Priority: Must
  - Acceptance: Build output includes a summary line (e.g., "Enriched 20/21 hooks; 1 failed: [url]")

---

## 3. Non-Functional Requirements

### 3.1 Performance Efficiency (ISO 25010)

**Source:** BR-07 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

- [ ] **NFR-PERF-01**: The page shall load in under 2 seconds on a standard broadband connection (10+ Mbps)
  - Source: BR-07 | Priority: Should
  - Measurement: Lighthouse or WebPageTest on production URL

- [ ] **NFR-PERF-02**: Main content (hero section + hook grid) shall be server-rendered — no client-side loading spinner for initial content
  - Source: BR-07 | Priority: Should
  - Measurement: View page source shows rendered HTML for hero and grid

- [ ] **NFR-PERF-03**: Largest Contentful Paint (LCP) shall be under 2.5 seconds
  - Source: BR-07 | Priority: Should
  - Measurement: Lighthouse Performance audit

- [ ] **NFR-PERF-04**: Cumulative Layout Shift (CLS) shall be under 0.1
  - Source: BR-07 | Priority: Should
  - Measurement: Lighthouse Performance audit; no layout shifts during hydration

### 3.2 Reliability (ISO 25010)

**Source:** BR-06 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

- [ ] **NFR-REL-01**: If the GitHub API returns errors or is unreachable during build, the build shall not fail
  - Source: BR-06 | Priority: Should
  - Measurement: Build completes when GitHub API is rate-limited or down

- [ ] **NFR-REL-02**: Hooks with failed API requests shall use cached data from the previous successful build (if available), or display manifest-only data with a "data unavailable" indicator
  - Source: BR-06 | Priority: Should
  - Measurement: Build with API blocked produces site with fallback data; no blank cards

### 3.3 Interaction Capability (ISO 25010)

**Source:** BR-08 (BUSINESS-CASE.md, Section 9.3)

- [ ] **NFR-INT-01**: Contrast ratios shall meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text) in both light and dark modes
  - Source: BR-08 | Priority: Could
  - Measurement: axe or Lighthouse accessibility audit passes in both modes

### 3.4 Maintainability (ISO 25010)

**Source:** Section 7 — Constraints (BUSINESS-CASE.md)

- [ ] **NFR-MAINT-01**: The catalog shall be manageable by editing a single manifest file and rebuilding — no database, CMS, or admin interface required
  - Source: Section 7 (Operational constraint: read-only site, no DB) | Priority: Must
  - Measurement: Curator can add/remove hooks by editing `data/hooks.json` and running `pnpm build`

### 3.5 Flexibility (ISO 25010)

**Source:** Section 6 — Success Criteria (BUSINESS-CASE.md)

- [ ] **NFR-FLEX-01**: The manifest and build pipeline shall support 25+ hook entries without build performance degradation
  - Source: Section 6 (15–25 hooks at launch, with growth expected) | Priority: Must
  - Measurement: Build completes in reasonable time with 25 entries; no timeouts or memory issues

---

## 4. Transition Requirements

- [ ] **TRANS-01**: The initial catalog shall be populated with 15–25 curated hooks sourced from the awesome-claude-code list and related community repositories
  - Source: Section 9.4 (Assumption: 15–25 quality hooks can be identified), Section 9.6 (awesome-claude-code reference)
  - Priority: Must
  - Acceptance: Manifest file contains 15–25 valid entries before first production build; each entry has all required fields (FR-DATA-02)

---

## 5. Out of Scope (Won't Have)

| Item | Source | Rationale | Revisit Trigger |
|------|--------|-----------|-----------------|
| User accounts, authentication, or personalization | Section 9.2 | Read-only MVP; no user-generated content | Post-MVP if community features needed |
| Community hook submissions | Section 9.2 | Curator-only curation for MVP quality control | R3+ based on community demand |
| Public API | Section 9.2 | No external consumers identified | Future if third-party integrations requested |
| Hook installation or execution from the site | Section 9.2 | Site is a directory, not a tool | Out of scope indefinitely |
| User ratings, reviews, or comments | Section 9.2 | Requires auth and moderation infrastructure | R3+ if community features added |
| Inline README rendering from GitHub | Section 9.2 | Adds complexity; users can click through to repo | R2/R3 if click-through rates are low |
| Real-time data (live API) | Section 9.2 | Build-time enrichment is sufficient for MVP | Future if freshness becomes a concern |
| Analytics for KPI measurement | OI-04 | Deferred to post-MVP; metrics measured manually | Post-MVP enhancement |

---

## 6. Traceability Matrix

### 6.1 BR-XX → FR-XX / NFR-XX Mapping

| BR-XX | Description | Priority | Functional Requirements | Non-Functional Requirements |
|-------|-------------|----------|------------------------|-----------------------------|
| BR-01 | Display catalog in grid | Must | FR-CAT-01..04, FR-CARD-01, FR-CARD-07..09 | — |
| BR-02 | Classify by purpose + lifecycle | Must | FR-CARD-02..06 | — |
| BR-03 | Link to GitHub source | Must | FR-CARD-10..11, FR-DATA-08..09 | — |
| BR-04 | Filter by category + lifecycle | Must | FR-FILT-01..12 | — |
| BR-05 | Clear landing experience | Must | FR-LAND-01..05 | — |
| BR-06 | GitHub API build-time fetch | Must | FR-DATA-01..07, FR-DATA-10 | NFR-REL-01..02 |
| BR-07 | Fast, performant browsing | Should | — | NFR-PERF-01..04 |
| BR-08 | Dark/light mode | Could | FR-UI-01..03 | NFR-INT-01 |
| BR-09 | Text search | Could | FR-SRCH-01..06 | — |

### 6.2 Constraint → NFR Mapping

| Constraint | Source | NFR |
|-----------|--------|-----|
| Read-only site, no DB, no auth | Section 7 (Operational) | NFR-MAINT-01 |
| 15–25 hooks at launch, growth expected | Section 6 (KPI) | NFR-FLEX-01 |
| Page load under 2 seconds | BR-07 | NFR-PERF-01..04 |
| Graceful degradation if API down | BR-06 (R2) | NFR-REL-01..02 |
| Readable in both color modes | BR-08 | NFR-INT-01 |

### 6.3 Implicit Requirements

| Requirement | Source | Rationale |
|-------------|--------|-----------|
| FR-FILT-12 (filter empty state) | Implicit from BR-04 | AND logic across two filter dimensions can produce zero results; without an empty state, the grid would appear broken |

---

## 6.5 Data Model Coverage

Each hook in the system is represented by the following fields:

| # | Field | Data Type | Source | Covered By | Status |
|---|-------|-----------|--------|------------|--------|
| 1 | name | string | Manifest | FR-CARD-01, FR-DATA-02 | Full |
| 2 | purpose_category | enum (8 values) | Manifest | FR-CARD-02, FR-CARD-05, FR-DATA-02 | Full |
| 3 | lifecycle_event | enum (5 values) | Manifest | FR-CARD-03, FR-CARD-06, FR-DATA-02 | Full |
| 4 | github_repo_url | URL | Manifest | FR-CARD-10, FR-DATA-01, FR-DATA-02, FR-DATA-08 | Full |
| 5 | description | string | GitHub API | FR-CARD-07, FR-DATA-03 | Full |
| 6 | stars_count | number | GitHub API | FR-CARD-08, FR-CARD-09, FR-DATA-03 | Full |
| 7 | last_updated | date | GitHub API | FR-DATA-03 | Full |

**Coverage:** 7/7 fields covered (100%)
**Gaps:** None

---

## 7. Prioritization Summary

### 7.1 Requirement Counts

| Category | FR Count | NFR Count | TRANS Count | Total | % of Total |
|----------|----------|-----------|-------------|-------|------------|
| Must | 42 | 2 | 1 | 45 | 73% |
| Should | 1 | 6 | 0 | 7 | 11% |
| Could | 9 | 1 | 0 | 10 | 16% |
| **Total** | **52** | **9** | **1** | **62** | **100%** |

### 7.2 60% Rule Assessment

Must-haves represent **73%** of scope, exceeding the MoSCoW guideline of ≤60%.

**Assessment:** Acceptable. HookHub's MVP is intentionally minimal — the 6 Must-priority business requirements (BR-01 through BR-06) define the entire product. Removing any Must FR would leave a non-functional directory:
- Without BR-01 (grid display): no visible catalog
- Without BR-02 (classification): hooks have no structure
- Without BR-03 (GitHub links): hooks are dead ends
- Without BR-04 (filtering): no way to narrow results
- Without BR-05 (landing): visitors don't understand the site
- Without BR-06 (data pipeline): no live metadata

The high Must percentage reflects a tight, well-scoped MVP rather than scope creep.

### 7.3 Kano Validation

| Kano Category | Requirements | Rationale |
|---------------|-------------|-----------|
| Must-Be (Basic) | FR-CAT, FR-CARD, FR-LAND, FR-DATA | Without these, the product doesn't exist — users would be dissatisfied |
| Must-Be (Basic) | FR-FILT | A hook directory without filtering is just a list — fails the core value proposition |
| Performance | NFR-PERF-01..04 | Better performance = proportionally more satisfaction; threshold-based |
| Attractive (Delighter) | FR-UI (dark/light mode) | Developers expect it in dev tools; absence is neutral but presence delights |
| Attractive (Delighter) | FR-SRCH (text search) | Power-user feature; absence is tolerable but presence adds significant convenience |

### 7.4 Release Mapping

| Release | Must | Should | Could | Total |
|---------|------|--------|-------|-------|
| MVP | 44 | 1 | 0 | 45 |
| R2 | 0 | 6 | 4 | 10 |
| Future | 0 | 0 | 6 | 6 |
| Pre-build | 1 | 0 | 0 | 1 |

---

## Appendix A: Requirement Index

### Functional Requirements (52)

| ID | Title | Source | Priority |
|----|-------|--------|----------|
| FR-CAT-01 | Multi-column grid layout | BR-01 | Must |
| FR-CAT-02 | Responsive column adaptation | BR-01 | Must |
| FR-CAT-03 | No pagination | BR-01 | Must |
| FR-CAT-04 | Consistent spacing/alignment | BR-01 | Must |
| FR-CARD-01 | Hook name as card title | BR-01 | Must |
| FR-CARD-02 | Purpose category badge | BR-02 | Must |
| FR-CARD-03 | Lifecycle event badge | BR-02 | Must |
| FR-CARD-04 | Distinct badge styling | BR-02 | Must |
| FR-CARD-05 | 8 purpose categories supported | BR-02 | Must |
| FR-CARD-06 | 5 lifecycle events supported | BR-02 | Must |
| FR-CARD-07 | Truncated description (~2 lines) | BR-01 | Must |
| FR-CARD-08 | Stars count with icon | BR-01 | Must |
| FR-CARD-09 | Formatted stars (e.g., "1.2k") | BR-01 | Must |
| FR-CARD-10 | Clickable GitHub repo link | BR-03 | Must |
| FR-CARD-11 | New tab with security attributes | BR-03 | Must |
| FR-LAND-01 | Hero as first visible content | BR-05 | Must |
| FR-LAND-02 | Hero communicates purpose | BR-05 | Must |
| FR-LAND-03 | Purpose understandable in 5 seconds | BR-05 | Must |
| FR-LAND-04 | Visual cue toward catalog | BR-05 | Must |
| FR-LAND-05 | First hook row visible without scroll (1080p) | BR-05 | Must |
| FR-FILT-01 | Category toggle chips | BR-04 | Must |
| FR-FILT-02 | Event toggle chips | BR-04 | Must |
| FR-FILT-03 | Category selection filters grid | BR-04 | Must |
| FR-FILT-04 | Event selection filters grid | BR-04 | Must |
| FR-FILT-05 | AND logic for combined filters | BR-04 | Must |
| FR-FILT-06 | Single-select per dimension | BR-04 | Must |
| FR-FILT-07 | "All" option first in each row | BR-04 | Must |
| FR-FILT-08 | "All" selected by default | BR-04 | Must |
| FR-FILT-09 | "All" clears own dimension only | BR-04 | Must |
| FR-FILT-10 | Client-side filtering (no reload) | BR-04 | Must |
| FR-FILT-11 | Hook count updates with filters | BR-04 | Must |
| FR-FILT-12 | Empty state for zero filter results | Implicit (BR-04) | Should |
| FR-SRCH-01 | Search input field | BR-09 | Could |
| FR-SRCH-02 | Real-time client-side filtering | BR-09 | Could |
| FR-SRCH-03 | Case-insensitive name + description match | BR-09 | Could |
| FR-SRCH-04 | Clearing restores full catalog | BR-09 | Could |
| FR-SRCH-05 | Search combines with filters (AND) | BR-09 | Could |
| FR-SRCH-06 | No-results empty state | BR-09 | Could |
| FR-UI-01 | Detect system color scheme | BR-08 | Could |
| FR-UI-02 | Readable in both modes | BR-08 | Could |
| FR-UI-03 | No FOUC on initial mode | BR-08 | Could |
| FR-DATA-01 | Read from manifest (data/hooks.json) | BR-06 | Must |
| FR-DATA-02 | Manifest entries: URL, name, category, event | BR-06 | Must |
| FR-DATA-03 | GitHub API fetch: stars, description, date | BR-06 | Must |
| FR-DATA-04 | Merge API + manifest as static props | BR-06 | Must |
| FR-DATA-05 | Only manifest-listed hooks appear | BR-06 | Must |
| FR-DATA-06 | JSON schema validation at build time | BR-06 | Must |
| FR-DATA-07 | Efficient API usage (1 request/repo) | BR-06 | Must |
| FR-DATA-08 | Validate repo URLs during build | BR-03 | Must |
| FR-DATA-09 | Warn on unreachable repos (don't fail) | BR-03 | Must |
| FR-DATA-10 | Log enrichment results | BR-06 | Must |
| FR-DATA-IMP | — | — | — |

### Non-Functional Requirements (9)

| ID | Title | Source | Priority |
|----|-------|--------|----------|
| NFR-PERF-01 | Page load < 2s | BR-07 | Should |
| NFR-PERF-02 | Server-rendered main content | BR-07 | Should |
| NFR-PERF-03 | LCP < 2.5s | BR-07 | Should |
| NFR-PERF-04 | CLS < 0.1 | BR-07 | Should |
| NFR-REL-01 | Build continues if API unavailable | BR-06 | Should |
| NFR-REL-02 | Cached/fallback data on API failure | BR-06 | Should |
| NFR-INT-01 | WCAG AA contrast in both modes | BR-08 | Could |
| NFR-MAINT-01 | Single manifest file management | Section 7 | Must |
| NFR-FLEX-01 | Support 25+ hooks without degradation | Section 6 | Must |

### Transition Requirements (1)

| ID | Title | Source | Priority |
|----|-------|--------|----------|
| TRANS-01 | Initial catalog of 15–25 hooks | Section 9.4 | Must |
