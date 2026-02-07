# Phase 1 Plan: Walking Skeleton -- End-to-End Hook Browsing

## Metadata
- **Phase:** 1
- **Release:** MVP
- **Wave:** Wave 1 (sequential -- foundation)
- **Source Stories:** SM-001, SM-003, SM-004, SM-006, SM-011, SM-013, SM-015, SM-019
- **Derived User Stories:** US-001, US-003, US-004, US-006, US-011, US-013, US-015, US-019
- **Date Generated:** 2026-02-06
- **Architecture Layers Touched:** Domain, Application, Adapters
- **UX Inputs Loaded:** Yes -- Design OS export (sections: landing-and-hero, hook-catalog, filter-system)

## Story Summary

Phase 1 delivers the complete walking skeleton: a developer can land on HookHub, understand its purpose via a hero section, browse hooks in a responsive grid, click through to GitHub repos, and filter by category or lifecycle event -- all backed by live data fetched at build time. US-019 is the foundational story establishing domain types and the build pipeline. UI stories (US-001, US-003, US-004, US-006, US-011) build the browse experience. Filter stories (US-013, US-015) add interactive discovery. Eight stories decompose into 20 tasks across all three architecture layers.

| Story | Name | Layer Coverage | Task Count |
|-------|------|---------------|------------|
| US-019 | Fetch live metadata from GitHub API at build time | Domain, Application, Adapters | 8 |
| US-001 | Clear landing hero communicates site purpose | Adapters | 1 |
| US-004 | Display hooks in responsive grid layout | Application, Adapters | 3 |
| US-006 | Show hook name on card | Adapters | 1 |
| US-013 | Filter hooks by purpose category | Domain, Adapters | 3 |
| US-011 | Clickable link to GitHub repo opens in new tab | Adapters | 1 |
| US-003 | Hook grid visible above the fold on desktop | Adapters | 1 |
| US-015 | Filter hooks by lifecycle event | Domain, Adapters | 2 |

## Task Decomposition

### Story US-019: Fetch live metadata from GitHub API at build time

#### Layer: Domain

**Task 1: Create core domain types and enumerations** (`lib/domain/types.ts`)
- **Input:** Hook entity from arch doc (name, githubRepoUrl, purposeCategory, lifecycleEvent, description, starsCount, lastUpdated); PurposeCategory union (8 values: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom); LifecycleEvent union (5 values: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop); ManifestEntry interface (name, githubRepoUrl, purposeCategory, lifecycleEvent)
- **Output:** Exported Hook, ManifestEntry, PurposeCategory, LifecycleEvent types; isValidPurposeCategory and isValidLifecycleEvent type guards
- **Test:** Type compilation passes strict mode; type guards correctly accept valid values and reject invalid ones; ManifestEntry fields are a subset of Hook fields

#### Layer: Application

**Task 2: Create HookDataSource port** (`lib/application/ports.ts`)
- **Input:** Hook type from lib/domain/types.ts; arch doc port definition (getAll returns `Promise<Hook[]>`)
- **Output:** Exported HookDataSource interface
- **Test:** Type compilation; interface is implementable by a mock class

**Task 3: Create manifest validation function** (`lib/application/validate-manifest.ts`)
- **Input:** ManifestEntry type; PurposeCategory and LifecycleEvent type guards from types.ts
- **Output:** validateManifestEntry function returning `{valid: boolean, errors: string[]}`; validateManifest function for array of entries
- **Test:** Valid entry passes; invalid purposeCategory rejected; invalid lifecycleEvent rejected; missing required fields reported; malformed githubRepoUrl caught

**Task 4: Create EnrichManifest use case** (`lib/application/enrich-manifest.ts`)
- **Input:** ManifestEntry and Hook types; EnrichManifestInput (manifestPath, githubToken?) and EnrichManifestOutput (hooks, failures, summary) interfaces from arch doc; depends on validate-manifest.ts, ports.ts
- **Output:** enrichManifest function orchestrating: read manifest → validate entries → fetch GitHub metadata per entry → merge into Hook[] → return results with failure details and summary string
- **Test:** Unit tests with mocked GitHub fetch: all succeed (N/N enriched); partial failure (summary reports count); all fail (empty hooks, all in failures); invalid manifest entry skipped with error; summary string format matches "Enriched X/Y hooks; Z failed"

#### Layer: Adapters

**Task 5: Create GitHub API client** (`lib/adapters/github-api.ts`)
- **Input:** GitHub REST API repos endpoint (`GET /repos/{owner}/{repo}`); response fields: stargazers_count, description, updated_at; optional GITHUB_TOKEN env var for authenticated requests
- **Output:** `fetchRepoMetadata(githubRepoUrl: string, token?: string)` function returning `{description, starsCount, lastUpdated}`; extracts owner/repo from URL
- **Test:** Mocked fetch: successful response maps fields correctly; 404 throws descriptive error; rate limit (403) throws with retry hint; malformed URL throws before fetch; token passed as Authorization header when provided

**Task 6: Create manifest file reader** (`lib/adapters/manifest-reader.ts`)
- **Input:** ManifestEntry type; file path to data/hooks.json; Node.js fs module
- **Output:** `readManifest(path: string)` function returning `ManifestEntry[]`; reads and parses JSON file
- **Test:** Valid JSON file returns parsed entries; file not found throws descriptive error; malformed JSON throws parse error

**Task 7: Create seed manifest data** (`data/hooks.json`)
- **Input:** ManifestEntry schema; real Claude Code hook GitHub repositories; must cover all 8 PurposeCategory values and all 5 LifecycleEvent values
- **Output:** JSON array with 10–15 real hook entries, each with name, githubRepoUrl, purposeCategory, lifecycleEvent
- **Test:** All entries pass validateManifest; all 8 categories represented; all 5 events represented; all githubRepoUrl values are valid GitHub URLs

**Task 8: Create build-time enrichment script** (`scripts/enrich.ts`)
- **Input:** enrichManifest use case; readManifest adapter; fetchRepoMetadata adapter; writes output to data/enriched-hooks.json; reads GITHUB_TOKEN from env
- **Output:** Executable script (invoked by `pnpm build`) that wires adapters to use case, runs enrichment, writes enriched Hook[] to JSON file, logs summary to console
- **Test:** E2E: run script with test manifest → enriched-hooks.json exists with correct Hook[] structure; script exits 0 on success; script logs summary line; build log reports which hooks were enriched

---

### Story US-001: Clear landing hero communicates site purpose

#### Layer: Adapters

**Task 1: Create HeroBanner server component** (`app/components/HeroBanner.tsx`)
- **Input:** AC: hero is first visible content on page; communicates HookHub is a directory of open-source Claude Code hooks; purpose understandable within 5 seconds (concise headline + brief supporting text); includes visual cue directing toward hook catalog below; renders correctly on mobile, tablet, and desktop
- **Output:** HeroBanner React Server Component with headline, tagline, and downward scroll cue; Tailwind v4 utility classes; responsive layout
- **Test:** Renders heading element with site purpose text; renders supporting description; renders scroll cue element; no "use client" directive (server component)
- **Reference:** design-os-export/sections/landing-and-hero/

---

### Story US-004: Display hooks in responsive grid layout

#### Layer: Application

**Task 1: Create LoadCatalog use case** (`lib/application/load-catalog.ts`)
- **Input:** HookDataSource port; Hook, PurposeCategory, LifecycleEvent types; LoadCatalogOutput interface from arch doc (hooks, categories, events, totalCount)
- **Output:** `loadCatalog(dataSource: HookDataSource)` function returning LoadCatalogOutput with all hooks, all category values, all event values, and total count
- **Test:** With mocked data source returning 3 hooks: output.hooks has length 3; output.categories contains all 8 values; output.events contains all 5 values; output.totalCount equals 3

#### Layer: Adapters

**Task 2: Create enriched data reader adapter** (`lib/adapters/enriched-data-reader.ts`)
- **Input:** HookDataSource port; Hook type; reads data/enriched-hooks.json (output of build-time enrichment)
- **Output:** EnrichedDataReader class implementing HookDataSource; getAll() reads and returns enriched hooks
- **Test:** With sample enriched JSON: getAll returns Hook[]; fields correctly typed; missing file throws descriptive error

**Task 3: Create HookGrid server component** (`app/components/HookGrid.tsx`)
- **Input:** Hook[] from loadCatalog; AC: 3–4 columns on desktop, 2 on tablet, 1 on mobile; consistent spacing and alignment; no pagination; works with 15 and 25+ hooks
- **Output:** HookGrid server component rendering CSS Grid of HookCard children; responsive column configuration via Tailwind breakpoint utilities
- **Test:** Renders correct number of HookCard children matching input array length; Tailwind grid classes present for responsive breakpoints
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-006: Show hook name on card

#### Layer: Adapters

**Task 1: Create HookCard server component** (`app/components/HookCard.tsx`)
- **Input:** Hook type (using name field); AC: name appears as card title in prominent readable font; name is first and most prominent text element; long names handled gracefully (truncation or wrapping); sufficient contrast; semantic heading element
- **Output:** HookCard server component rendering hook name as heading with Tailwind typography utilities; text-overflow handling for long names; card container with consistent sizing
- **Test:** Renders hook name inside a heading element (h2 or h3); long name (50+ chars) does not break card layout; name is first text content in DOM order
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-013: Filter hooks by purpose category

#### Layer: Domain

**Task 1: Create PurposeCategory metadata** (`lib/domain/categories.ts`)
- **Input:** PurposeCategory type from types.ts; 8 values (Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom); need display labels for chip rendering
- **Output:** CATEGORIES constant array of `{value: PurposeCategory, label: string}` covering all 8 values; ALL_CATEGORIES array for iteration
- **Test:** Array contains exactly 8 entries; each entry.value is a valid PurposeCategory; each entry.label is a non-empty string; no duplicate values

**Task 2: Create FilterState type and filterHooks function** (`lib/domain/filter.ts`)
- **Input:** Hook, PurposeCategory, LifecycleEvent types from types.ts; FilterState interface from arch doc (category: PurposeCategory | null, event: LifecycleEvent | null); AND-logic filtering spec
- **Output:** FilterState type; `filterHooks(hooks: Hook[], state: FilterState): Hook[]` pure function; null = no constraint on that dimension
- **Test:** Filter by category only returns matching hooks; filter by event only returns matching hooks; filter by both (AND) returns intersection; both null returns all hooks; no matches returns empty array; does not mutate input array

#### Layer: Adapters

**Task 3: Create FilterBar client component — category chips** (`app/components/FilterBar.tsx`)
- **Input:** CATEGORIES metadata; FilterState type; filterHooks function; AC: horizontal row of toggle chips above grid; all 8 categories shown; clicking highlights and filters; single-select; immediate grid update; visible count updates
- **Output:** `"use client"` FilterBar component managing FilterState via useState; renders category chip row; calls filterHooks on state change; lifts filtered hooks + count to parent via callback prop
- **Test:** Renders 8 category chip buttons; clicking chip updates active state; clicking active chip deselects (resets to null); parent receives filtered hooks on each state change; active chip has visual highlight
- **Reference:** design-os-export/sections/filter-system/

---

### Story US-011: Clickable link to GitHub repo opens in new tab

#### Layer: Adapters

**Task 1: Add GitHub repo link to HookCard** (`app/components/HookCard.tsx`)
- **Input:** Hook.githubRepoUrl field; AC: each card has clickable link to GitHub repo; opens in new tab (`target="_blank"`); includes `rel="noopener noreferrer"`; visually identifiable as clickable; correct URL per hook
- **Output:** HookCard enhanced with anchor element linking to hook's GitHub repo; proper security attributes; subtle visual treatment per G-03 design guideline
- **Test:** Link element has href matching hook.githubRepoUrl; link has `target="_blank"`; link has `rel="noopener noreferrer"`; each rendered card links to its own repo URL
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-003: Hook grid visible above the fold on desktop

#### Layer: Adapters

**Task 1: Compose page layout with compact hero and grid** (`app/page.tsx`)
- **Input:** HeroBanner component (US-001); HookGrid component (US-004); FilterBar component (US-013); loadCatalog use case (US-004); AC: first row of cards visible without scrolling on 1080p desktop; hero compact enough to share viewport; no excessive whitespace between hero and grid; minimal scrolling on mobile/tablet
- **Output:** Page server component composing HeroBanner → FilterBar → HookGrid in a vertical layout; loads catalog data via loadCatalog; passes hooks to FilterBar and HookGrid; Tailwind layout utilities ensuring compact vertical spacing
- **Test:** E2E Playwright at 1920x1080: first hook card is within viewport (no scroll needed); hero and first grid row both visible; no whitespace gap > 32px between hero and filter/grid
- **Reference:** design-os-export/sections/landing-and-hero/

---

### Story US-015: Filter hooks by lifecycle event

#### Layer: Domain

**Task 1: Create LifecycleEvent metadata** (`lib/domain/events.ts`)
- **Input:** LifecycleEvent type from types.ts; 5 values (PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop); need display labels for chip rendering
- **Output:** EVENTS constant array of `{value: LifecycleEvent, label: string}` covering all 5 values; ALL_EVENTS array for iteration
- **Test:** Array contains exactly 5 entries; each entry.value is a valid LifecycleEvent; each entry.label is a non-empty string; no duplicate values

#### Layer: Adapters

**Task 2: Add event chip row to FilterBar** (`app/components/FilterBar.tsx`)
- **Input:** EVENTS metadata; FilterState already includes event field (from US-013); filterHooks already handles event filtering (from US-013); AC: horizontal row below category chips; all 5 events shown; single-select within events; AND logic with category dimension; immediate update; count reflects combined filter
- **Output:** FilterBar enhanced with second chip row for lifecycle events below category chips; both dimensions update shared FilterState; filterHooks applies AND logic across both
- **Test:** Renders 5 event chip buttons below category chips; clicking event chip filters grid; selecting category AND event shows intersection only; visible count reflects combined filter; deselecting event restores category-only filter
- **Reference:** design-os-export/sections/filter-system/

## Parallelism Analysis

Stories are INVEST-independent per upstream `/create-requirements`, but implementation-level dependencies exist: US-019 establishes shared domain types and the data pipeline; US-013 creates filter infrastructure reused by US-015; US-006 creates the HookCard that US-011 enhances; US-003 composes components from US-001 and US-004.

### Execution Group 1 (foundation -- sequential)
- US-019: Fetch live metadata from GitHub API at build time -- establishes domain types (Hook, ManifestEntry, PurposeCategory, LifecycleEvent), application ports, and the build-time enrichment pipeline that produces data for all other stories

### Execution Group 2 (parallel -- after Group 1)
- US-001: Clear landing hero -- independent UI component, no dependency on other Group 2 stories
- US-004: Display hooks in responsive grid layout -- creates LoadCatalog use case + HookGrid component; depends only on types from US-019
- US-006: Show hook name on card -- creates HookCard component; depends only on Hook type from US-019
- US-013: Filter hooks by purpose category -- creates filter domain logic (categories.ts, filter.ts) + FilterBar; depends only on types from US-019

### Execution Group 3 (parallel -- after Group 2)
- US-003: Hook grid visible above the fold on desktop -- composes HeroBanner (US-001) + HookGrid (US-004) + FilterBar (US-013) into page.tsx layout
- US-011: Clickable link to GitHub repo -- enhances HookCard (US-006) with GitHub link
- US-015: Filter hooks by lifecycle event -- adds events.ts domain metadata + event chip row to FilterBar (US-013)

### Sequential Dependencies
- US-003 must complete after US-001 + US-004 + US-013 because it composes their components into the page layout
- US-011 must complete after US-006 because it enhances the HookCard component that US-006 creates
- US-015 must complete after US-013 because it extends the FilterBar component and depends on FilterState/filterHooks from US-013

### Recommended Execution Order
1. **US-019** alone -- dispatch to single agent (8 tasks, foundation)
2. **US-001, US-004, US-006, US-013** -- dispatch to 4 parallel agents (6 tasks total)
3. **US-003, US-011, US-015** -- dispatch to 3 parallel agents (4 tasks total)

> **For Claude -- superpowers:writing-plans:**
> This PHASE-1-PLAN.md is the spec input for `superpowers:writing-plans`.
> Feed the Task Decomposition section (story by story) into `writing-plans`
> to produce a detailed implementation plan with TDD steps
> (RED-GREEN-REFACTOR) baked into each task. The Parallelism Analysis
> section determines agent dispatch order via
> `superpowers:dispatching-parallel-agents`. Do not modify the Metadata
> or Story Summary sections -- they are reference context, not work items.
