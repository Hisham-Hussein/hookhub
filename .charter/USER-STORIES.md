# User Stories Backlog: HookHub

> Generated from: .charter/BUSINESS-CASE.md + .charter/STORY-MAP.md
> Generated on: 2026-02-01
> Mode: story-map
> Methodology: INVEST + MoSCoW + Vertical Slicing

## Overview

### Epic Summary

| Epic | Activity | Features | Stories | Releases | Priority |
|------|----------|----------|---------|----------|----------|
| Land & Understand | Land & Understand | 2 | 3 | MVP, R2 | Must / Should |
| Browse Catalog | Browse Catalog | 3 | 8 | MVP, R2 | Must / Could |
| Filter & Search | Filter & Search | 3 | 6 | MVP, Future | Must / Could |
| Data Pipeline | Data Pipeline | 1 | 4 | MVP, R2 | Must / Should |

**Totals:** 4 Epics, 9 Features, 21 Stories (MVP: 16, R2: 3, Future: 2)

### Priority Distribution

| Priority | Count | % | Guideline |
|----------|-------|---|-----------|
| Must | 16 | 76% | ≤60% (exceeded — acceptable for minimal MVP scope) |
| Should | 2 | 10% | — |
| Could | 3 | 14% | — |

### Resolved Design Context

These decisions from the story map (STORY-MAP.md, Gaps and Questions > Resolved) inform acceptance criteria throughout:

| ID | Decision | Stories Affected |
|----|----------|------------------|
| G-03 | **Compact card**: Name as title, category + lifecycle as small badges, 2-line description truncated, stars count, subtle repo link | US-006 – US-011 |
| G-04 | **Toggle chips**: Horizontal row of clickable chips/pills above the grid. One row for purpose categories, one row for lifecycle events. Active chip highlighted. | US-013 – US-016 |
| G-05 | **AND (intersection)**: When both a category and lifecycle event filter are active, show only hooks matching BOTH. | US-013, US-015 |

---

## Epic 1: Land & Understand

**Source:** BR-05, BR-07
**Activity:** Land & Understand
**Business Objective:** Present a clear landing experience so that first-time visitors understand what HookHub is

### Feature 1.1: View Landing Page

**Source:** BR-05, BR-07
**Task:** View landing page

#### US-001: Clear landing hero communicates site purpose

**Parent:** SM-001 (STORY-MAP.md)
**Source:** BR-05 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer visiting HookHub for the first time,
I want to see a clear hero section that tells me what HookHub is and what it offers,
So that I understand the site's purpose within seconds and decide whether to explore further.

**Acceptance Criteria:**
- [ ] Hero section is the first visible content on the page
- [ ] Hero communicates that HookHub is a directory of open-source Claude Code hooks
- [ ] Site purpose is understandable within 5 seconds (concise headline + brief supporting text)
- [ ] Hero includes a visual cue directing toward the hook catalog below
- [ ] Hero renders correctly on mobile, tablet, and desktop viewports

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-002: Fast server-rendered initial load under 2 seconds

**Parent:** SM-002 (STORY-MAP.md)
**Source:** BR-07 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

As a developer arriving at HookHub,
I want the page to load quickly with server-rendered content,
So that I see useful content immediately without waiting or seeing a loading spinner.

**Acceptance Criteria:**
- [ ] Page loads in under 2 seconds on a standard broadband connection
- [ ] Main content (hero + hook grid) is server-rendered — no client-side loading spinner for initial content
- [ ] Largest Contentful Paint (LCP) is under 2.5 seconds
- [ ] No layout shift occurs as the page hydrates (CLS < 0.1)

**Priority:** Should | **Size:** M | **INVEST:** ✓

---

### Feature 1.2: See Hook Grid Preview

**Source:** BR-05
**Task:** See hook grid preview

#### US-003: Hook grid visible above the fold on desktop

**Parent:** SM-003 (STORY-MAP.md)
**Source:** BR-05 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer landing on HookHub for the first time,
I want to see the hook grid without scrolling on desktop,
So that I immediately see real content and know this is an active, useful directory.

**Acceptance Criteria:**
- [ ] At least the first row of hook cards is visible without scrolling on a 1080p desktop viewport
- [ ] Hero section is compact enough to share the initial viewport with the grid
- [ ] Hook grid appears immediately below the hero with no excessive whitespace
- [ ] On smaller viewports (mobile/tablet), grid appears with minimal scrolling

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

## Epic 2: Browse Catalog

**Source:** BR-01, BR-02, BR-03, BR-08
**Activity:** Browse Catalog
**Business Objective:** Display a catalog of Claude Code hooks so developers can visually scan available hooks and access their source

### Feature 2.1: View Hook Grid

**Source:** BR-01, BR-08
**Task:** View hook grid

#### US-004: Display hooks in responsive grid layout

**Parent:** SM-004 (STORY-MAP.md)
**Source:** BR-01 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer browsing HookHub,
I want hooks displayed in a responsive grid layout,
So that I can visually scan the catalog efficiently on any device.

**Acceptance Criteria:**
- [ ] Hooks render in a multi-column grid on desktop (3–4 columns)
- [ ] Grid adapts to 2 columns on tablet and 1 column on mobile
- [ ] All hooks in the catalog are displayed (no pagination in MVP)
- [ ] Grid layout uses consistent spacing and alignment across breakpoints
- [ ] Grid looks well-proportioned with both small (15) and larger (25+) hook counts

**Priority:** Must | **Size:** M | **INVEST:** ✓

---

#### US-005: Support dark and light display modes

**Parent:** SM-005 (STORY-MAP.md)
**Source:** BR-08 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

As a developer browsing HookHub,
I want the site to respect my system color scheme preference,
So that I can browse comfortably whether I use dark or light mode.

**Acceptance Criteria:**
- [ ] Site detects system color scheme preference (`prefers-color-scheme` media query)
- [ ] All content is readable and visually correct in both dark and light modes
- [ ] Hook cards, badges, text, and backgrounds adapt appropriately to both modes
- [ ] No flash of unstyled content (FOUC) when initial mode is applied
- [ ] Contrast ratios meet WCAG AA standards in both modes

**Priority:** Could | **Size:** M | **INVEST:** ✓

---

### Feature 2.2: Scan Hook Cards

**Source:** BR-01, BR-02
**Task:** Scan hook cards

> **Design context (G-03):** Compact card layout — name as title, category + lifecycle as small badges, 2-line truncated description, stars count, subtle repo link. Dense grid maximizes hooks visible at once.

> **INVEST note:** Stories US-006 through US-010 each add one metadata element to the hook card. While individually small, they are independently testable. In practice, they form a cohesive card component and may be implemented together.

#### US-006: Show hook name on card

**Parent:** SM-006 (STORY-MAP.md)
**Source:** BR-01 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer scanning the hook catalog,
I want each card to display the hook's name as its title,
So that I can quickly identify hooks by name.

**Acceptance Criteria:**
- [ ] Hook name appears as the card title in a prominent, readable font
- [ ] Name is the first and most prominent text element on the card (per G-03)
- [ ] Long hook names are handled gracefully (truncation or wrapping without breaking layout)
- [ ] Name text has sufficient contrast and uses a semantic heading element

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-007: Show purpose category with visual distinction

**Parent:** SM-007 (STORY-MAP.md)
**Source:** BR-02 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer scanning hook cards,
I want to see each hook's purpose category displayed as a visually distinct badge,
So that I can quickly identify what the hook does at a glance.

**Acceptance Criteria:**
- [ ] Purpose category displays as a small badge on the card (per G-03)
- [ ] Badge is visually distinct from other card elements (color-coded or styled differently)
- [ ] All 8 purpose categories are supported: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
- [ ] Badge text is readable at small sizes
- [ ] Category badge is visually distinguishable from the lifecycle event badge (different styling/color scheme)

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-008: Show lifecycle event with visual distinction

**Parent:** SM-008 (STORY-MAP.md)
**Source:** BR-02 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer scanning hook cards,
I want to see each hook's lifecycle event displayed as a visually distinct badge,
So that I can quickly identify when the hook fires.

**Acceptance Criteria:**
- [ ] Lifecycle event displays as a small badge on the card (per G-03)
- [ ] Event badge uses a different styling/color scheme from the purpose category badge
- [ ] All 5 lifecycle events are supported: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop
- [ ] Badge text is readable and uses the exact event name
- [ ] Event badge is positioned consistently relative to the category badge

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-009: Show hook description on card

**Parent:** SM-009 (STORY-MAP.md)
**Source:** BR-01 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer scanning hook cards,
I want to see a brief description of what each hook does,
So that I can understand its purpose without clicking through to the repository.

**Acceptance Criteria:**
- [ ] Description text appears on the card below the name and badges
- [ ] Description is truncated to approximately 2 lines (per G-03)
- [ ] Truncated descriptions end with an ellipsis or similar visual indicator
- [ ] Cards with short descriptions maintain consistent grid alignment
- [ ] Description content comes from the GitHub API enrichment (repo description)

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-010: Show GitHub stars count on card

**Parent:** SM-010 (STORY-MAP.md)
**Source:** BR-01 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer evaluating hooks in the catalog,
I want to see each hook's GitHub stars count on the card,
So that I can quickly gauge community interest and quality.

**Acceptance Criteria:**
- [ ] Stars count displays on the card with a recognizable star icon
- [ ] Count is formatted for readability (e.g., "1.2k" for 1,200+)
- [ ] Stars data is fetched from GitHub API at build time (per BR-06)
- [ ] A hook with 0 stars displays "0" (not hidden or empty)

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

### Feature 2.3: Access Hook Source

**Source:** BR-03
**Task:** Access hook source

#### US-011: Clickable link to GitHub repo opens in new tab

**Parent:** SM-011 (STORY-MAP.md)
**Source:** BR-03 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer who found an interesting hook,
I want to click a link on the card that takes me to the hook's GitHub repository,
So that I can view the source code, installation instructions, and full README.

**Acceptance Criteria:**
- [ ] Each hook card includes a clickable link to its GitHub repository
- [ ] Link opens in a new browser tab (`target="_blank"`)
- [ ] Link includes `rel="noopener noreferrer"` for security
- [ ] Link is visually identifiable as a clickable element (subtle repo link per G-03)
- [ ] Link URL points to the correct GitHub repository for each hook

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-012: Validate repo links at build time

**Parent:** SM-012 (STORY-MAP.md)
**Source:** BR-03 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a curator maintaining the HookHub catalog,
I want repository links validated during the build process,
So that broken links are caught before they reach users.

**Acceptance Criteria:**
- [ ] Build process checks each hook's GitHub repo URL for accessibility (HTTP 200)
- [ ] Build outputs a warning for any hook with an unreachable repository
- [ ] Build does not fail on a single broken link (warns but continues)
- [ ] Validation results are logged for curator review
- [ ] Validation reuses the GitHub API response from the metadata fetch (no extra request)

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

## Epic 3: Filter & Search

**Source:** BR-04, BR-09
**Activity:** Filter & Search
**Business Objective:** Enable developers to narrow results and find hooks relevant to their needs

### Feature 3.1: Filter by Purpose Category

**Source:** BR-04
**Task:** Filter by purpose category

> **Design context (G-04, G-05):** Toggle chips in a horizontal row above the grid. Active chip is highlighted. When both category and event filters are active, AND logic applies (show only hooks matching both).

#### US-013: Filter hooks by purpose category

**Parent:** SM-013 (STORY-MAP.md)
**Source:** BR-04 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer looking for a specific type of hook,
I want to filter the catalog by purpose category,
So that I only see hooks relevant to my need (e.g., Safety, Automation, Testing).

**Acceptance Criteria:**
- [ ] A horizontal row of toggle chips displays all purpose categories above the grid (per G-04)
- [ ] Categories shown: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
- [ ] Clicking a category chip highlights it and filters the grid to show only matching hooks
- [ ] Only one category can be active at a time (single-select within the category dimension)
- [ ] When a category filter and lifecycle event filter are both active, only hooks matching BOTH are shown (AND logic, per G-05)
- [ ] Filter updates the grid immediately without page reload (client-side filtering)
- [ ] Visible hook count updates to reflect filtered results

**Priority:** Must | **Size:** M | **INVEST:** ✓

---

#### US-014: "All" option resets category filter

**Parent:** SM-014 (STORY-MAP.md)
**Source:** BR-04 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer who has filtered by category,
I want an "All" option to clear my category filter,
So that I can return to viewing the full catalog.

**Acceptance Criteria:**
- [ ] An "All" chip appears as the first option in the category filter row
- [ ] "All" is selected by default when no category filter is active
- [ ] Clicking "All" deselects any active category chip and shows all hooks (subject to any active event filter)
- [ ] "All" chip has a visually distinct state when active
- [ ] Resetting the category filter does not affect the lifecycle event filter

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

### Feature 3.2: Filter by Lifecycle Event

**Source:** BR-04
**Task:** Filter by lifecycle event

#### US-015: Filter hooks by lifecycle event

**Parent:** SM-015 (STORY-MAP.md)
**Source:** BR-04 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer looking for hooks that fire at a specific point in the Claude Code lifecycle,
I want to filter the catalog by lifecycle event,
So that I only see hooks that trigger when I need them (e.g., PreToolUse, PostToolUse).

**Acceptance Criteria:**
- [ ] A horizontal row of toggle chips displays all lifecycle events below the category filter row (per G-04)
- [ ] Events shown: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop
- [ ] Clicking an event chip highlights it and filters the grid to show only matching hooks
- [ ] Only one event can be active at a time (single-select within the event dimension)
- [ ] When an event filter and category filter are both active, only hooks matching BOTH are shown (AND logic, per G-05)
- [ ] Filter updates the grid immediately without page reload (client-side filtering)
- [ ] Visible hook count updates to reflect filtered results

**Priority:** Must | **Size:** M | **INVEST:** ✓

---

#### US-016: "All" option resets lifecycle event filter

**Parent:** SM-016 (STORY-MAP.md)
**Source:** BR-04 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a developer who has filtered by lifecycle event,
I want an "All" option to clear my event filter,
So that I can return to viewing hooks across all lifecycle events.

**Acceptance Criteria:**
- [ ] An "All" chip appears as the first option in the lifecycle event filter row
- [ ] "All" is selected by default when no event filter is active
- [ ] Clicking "All" deselects any active event chip and shows all hooks (subject to any active category filter)
- [ ] Resetting the event filter does not affect the category filter

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

### Feature 3.3: Search by Text

**Source:** BR-09
**Task:** Search by text

#### US-017: Real-time text search across names and descriptions

**Parent:** SM-017 (STORY-MAP.md)
**Source:** BR-09 (BUSINESS-CASE.md, Section 9.3)
**Release:** Future

As a developer looking for a specific hook by keyword,
I want to type in a search box and see the catalog filter in real-time,
So that I can find hooks by name or description without manually scanning the grid.

**Acceptance Criteria:**
- [ ] A search input field is visible above or alongside the filter chips
- [ ] Typing in the search field filters hooks in real-time as the user types (client-side)
- [ ] Search matches against hook name and description fields
- [ ] Search is case-insensitive
- [ ] Clearing the search field restores the full catalog (subject to any active filters)
- [ ] Search works in combination with category and lifecycle event filters (AND logic)

**Priority:** Could | **Size:** M | **INVEST:** ✓

---

#### US-018: "No results" empty state when search matches nothing

**Parent:** SM-018 (STORY-MAP.md)
**Source:** BR-09 (BUSINESS-CASE.md, Section 9.3)
**Release:** Future

As a developer whose search or filter combination returns no hooks,
I want to see a helpful empty state message,
So that I know the search worked but nothing matched, rather than thinking the site is broken.

**Acceptance Criteria:**
- [ ] When filters and/or search produce zero matching hooks, a "No results" message displays in the grid area
- [ ] Empty state message is friendly and descriptive (e.g., "No hooks found matching your criteria")
- [ ] Empty state suggests corrective actions (e.g., "Try a different search term or clear your filters")
- [ ] Empty state replaces the grid area cleanly (no broken or blank grid)

**Priority:** Could | **Size:** S | **INVEST:** ✓

---

## Epic 4: Data Pipeline

**Source:** BR-06
**Activity:** Data Pipeline
**Business Objective:** Fetch hook data from GitHub at build time so the catalog displays live metadata

### Feature 4.1: Enrich Hook Data from GitHub

**Source:** BR-06
**Task:** Enrich hook data from GitHub

#### US-019: Fetch live metadata from GitHub API at build time

**Parent:** SM-019 (STORY-MAP.md)
**Source:** BR-06 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a curator building the HookHub site,
I want the build process to fetch live metadata from GitHub for each hook,
So that the catalog displays up-to-date stars, descriptions, and freshness data.

**Acceptance Criteria:**
- [ ] Build process reads hook repo URLs from the local manifest file (`data/hooks.json`)
- [ ] For each hook, the build fetches from the GitHub API: stars count, description, last updated date
- [ ] Fetched metadata is merged with manifest data and passed to page components as static props
- [ ] Build completes successfully and site renders with enriched data
- [ ] GitHub API usage is efficient (single request per repo via the repos endpoint)
- [ ] Build logs report which hooks were successfully enriched

**Priority:** Must | **Size:** M | **INVEST:** ✓

---

#### US-020: Local manifest file controls which hooks appear

**Parent:** SM-020 (STORY-MAP.md)
**Source:** BR-06 (BUSINESS-CASE.md, Section 9.3)
**Release:** MVP

As a curator managing the HookHub catalog,
I want to maintain a local manifest file that lists curated hooks and their metadata,
So that I have full control over which hooks appear in the directory.

**Acceptance Criteria:**
- [ ] A manifest file exists at `data/hooks.json`
- [ ] Each entry includes at minimum: GitHub repo URL, hook name, purpose category, lifecycle event
- [ ] Only hooks listed in the manifest appear on the site (no automatic discovery)
- [ ] Adding or removing an entry and rebuilding the site adds/removes the hook
- [ ] Manifest file is valid JSON with build-time schema validation
- [ ] Manifest supports 15–25+ entries without build performance degradation

**Priority:** Must | **Size:** S | **INVEST:** ✓

---

#### US-021: Graceful degradation if GitHub API unavailable

**Parent:** SM-021 (STORY-MAP.md)
**Source:** BR-06 (BUSINESS-CASE.md, Section 9.3)
**Release:** R2

As a curator building the HookHub site when the GitHub API is down,
I want the build to succeed using cached or fallback data,
So that I can still deploy the site without waiting for GitHub to recover.

**Acceptance Criteria:**
- [ ] If the GitHub API returns errors or is unreachable, the build does not fail
- [ ] Hooks with failed API requests use cached data from the previous successful build (if available)
- [ ] If no cached data exists, hooks display manifest-only data (name, category, event) with a "data unavailable" indicator
- [ ] Build logs clearly indicate which hooks failed to fetch and the error reason
- [ ] The site remains functional and browsable with degraded data

**Priority:** Should | **Size:** M | **INVEST:** ✓

---

## Deferred (Out of Scope)

| Item | Source | Rationale | Revisit |
|------|--------|-----------|---------|
| User accounts, authentication, or personalization | Section 9.2 | Read-only MVP; no user-generated content | Post-MVP if community features needed |
| Community hook submissions | Section 9.2 | Curator-only curation for MVP quality control | R3+ based on community demand |
| Public API | Section 9.2 | No external consumers identified | Future if third-party integrations requested |
| Hook installation or execution from the site | Section 9.2 | Site is a directory, not a tool | Out of scope indefinitely |
| User ratings, reviews, or comments | Section 9.2 | Requires auth and moderation infrastructure | R3+ if community features added |
| Inline README rendering from GitHub | Section 9.2 | Adds complexity; users can click through to repo | R2/R3 if click-through rates are low |
| Real-time data (live API) | Section 9.2 | Build-time enrichment is sufficient for MVP | Future if freshness becomes a concern |
| Analytics for KPI measurement | OI-04 | Deferred to post-MVP; metrics measured manually | Post-MVP enhancement |

---

## Traceability

| SM-XXX | BR-XX | Activity → Task | US-XXX | Release |
|--------|-------|-----------------|--------|---------|
| SM-001 | BR-05 | Land & Understand → View Landing Page | US-001 | MVP |
| SM-002 | BR-07 | Land & Understand → View Landing Page | US-002 | R2 |
| SM-003 | BR-05 | Land & Understand → See Hook Grid Preview | US-003 | MVP |
| SM-004 | BR-01 | Browse Catalog → View Hook Grid | US-004 | MVP |
| SM-005 | BR-08 | Browse Catalog → View Hook Grid | US-005 | R2 |
| SM-006 | BR-01 | Browse Catalog → Scan Hook Cards | US-006 | MVP |
| SM-007 | BR-02 | Browse Catalog → Scan Hook Cards | US-007 | MVP |
| SM-008 | BR-02 | Browse Catalog → Scan Hook Cards | US-008 | MVP |
| SM-009 | BR-01 | Browse Catalog → Scan Hook Cards | US-009 | MVP |
| SM-010 | BR-01 | Browse Catalog → Scan Hook Cards | US-010 | MVP |
| SM-011 | BR-03 | Browse Catalog → Access Hook Source | US-011 | MVP |
| SM-012 | BR-03 | Browse Catalog → Access Hook Source | US-012 | MVP |
| SM-013 | BR-04 | Filter & Search → Filter by Purpose Category | US-013 | MVP |
| SM-014 | BR-04 | Filter & Search → Filter by Purpose Category | US-014 | MVP |
| SM-015 | BR-04 | Filter & Search → Filter by Lifecycle Event | US-015 | MVP |
| SM-016 | BR-04 | Filter & Search → Filter by Lifecycle Event | US-016 | MVP |
| SM-017 | BR-09 | Filter & Search → Search by Text | US-017 | Future |
| SM-018 | BR-09 | Filter & Search → Search by Text | US-018 | Future |
| SM-019 | BR-06 | Data Pipeline → Enrich Hook Data | US-019 | MVP |
| SM-020 | BR-06 | Data Pipeline → Enrich Hook Data | US-020 | MVP |
| SM-021 | BR-06 | Data Pipeline → Enrich Hook Data | US-021 | R2 |

**Coverage:** 21/21 SM-XXX stories expanded to US-XXX | 9/9 BR-XX requirements covered
