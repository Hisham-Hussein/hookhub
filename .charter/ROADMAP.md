# Project Roadmap: HookHub

> **Generated from:** .charter/STORY-MAP.md + .charter/ARCHITECTURE-DOC.md
> **Generated on:** 2026-02-01
> **Methodology:** Vertical Slice Delivery with Wave-Based Parallelism

---

## Quick Reference

### Roadmap Overview

| Release | Slices | Stories | Wave Structure |
|---------|--------|---------|----------------|
| **MVP** | 3 | 16 | W1 (seq) → W2 (par: 2 slices) |
| **R2** | 2 | 3 | W1 (par: 2 slices) |
| **Future** | 1 | 2 | W1 (seq) |

### Release Summary

| Release | Delivers | Unlocks |
|---------|----------|---------|
| **MVP** | Browsable hook catalog with responsive grid, filtered by category and lifecycle event, backed by GitHub-enriched build pipeline | R2 can harden the pipeline, optimize SSR, and add theming |
| **R2** | Resilient builds, fast server-rendered load, dark/light mode | Future can layer search on a polished, resilient, themed catalog |
| **Future** | Real-time text search with empty-state handling | Complete discovery experience — browse, filter, and search |

---

## Release: MVP

### Transitions

| Aspect | Details |
|--------|---------|
| **Produces** | Hook domain model, responsive grid UI, filter infrastructure (category + event chips), build-time enrichment pipeline, manifest-driven catalog |
| **Requires** | Nothing (first release) |
| **Unlocks** | R2 can add resilience to the build pipeline, theme the existing UI, and optimize SSR performance |

### Wave 1 (sequential -- foundation)

#### PHASE-1: Walking Skeleton -- End-to-End Hook Browsing

A developer can land on HookHub, see the hero and understand the site's purpose, browse a responsive grid of hooks with basic card info, click through to GitHub repos, filter by category and lifecycle event — all backed by live data fetched at build time. Establishes domain types, grid component, basic card, filter bar, and the enrichment pipeline.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-001 | Clear landing hero communicates site purpose | BR-05 |
| SM-003 | Hook grid visible above the fold on desktop | BR-05 |
| SM-004 | Display hooks in responsive grid layout | BR-01 |
| SM-006 | Show hook name on card | BR-01 |
| SM-011 | Clickable link to GitHub repo (new tab) | BR-03 |
| SM-013 | Filter hooks by purpose category | BR-04 |
| SM-015 | Filter hooks by lifecycle event | BR-04 |
| SM-019 | Fetch live metadata from GitHub API at build time | BR-06 |

### Wave 2 (parallel -- independent enhancements)

#### PHASE-2: Rich Card Metadata

Hook cards display polished metadata — purpose category and lifecycle event shown as visually distinct badges, truncated description text, and formatted GitHub stars count. Builds on the basic card component from PHASE-1.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-007 | Show purpose category with visual distinction | BR-02 |
| SM-008 | Show lifecycle event with visual distinction | BR-02 |
| SM-009 | Show hook description on card | BR-01 |
| SM-010 | Show GitHub stars count on card | BR-01 |

#### PHASE-3: Filter & Data Pipeline Polish

Filter bars gain "All" reset options for both category and lifecycle event. Build pipeline validates repo links at build time and the local manifest becomes the authoritative source of which hooks appear.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-012 | Validate repo links at build time | BR-03 |
| SM-014 | "All" option resets category filter | BR-04 |
| SM-016 | "All" option resets lifecycle event filter | BR-04 |
| SM-020 | Local manifest file controls which hooks appear | BR-06 |

### Definition of Done

- [ ] All 16 SM-XXX stories functionally complete
- [ ] Unit tests for domain logic (types, filtering, formatting)
- [ ] E2E Playwright tests for user-facing flows (browse, filter, click-through)
- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes (ESLint flat config, no warnings)
- [ ] TypeScript strict mode — zero type errors
- [ ] Deployed to Vercel preview environment
- [ ] Manual verification of end-to-end user journey

---

## Release: R2

### Transitions

| Aspect | Details |
|--------|---------|
| **Produces** | Resilient build pipeline (graceful GitHub API fallback), fast SSR load (< 2s), dark/light theme system with CSS custom properties |
| **Requires** | MVP's build pipeline (SM-019), UI components (grid, cards, filters), layout infrastructure |
| **Unlocks** | Future can add search on top of a polished, resilient, themed catalog |

### Wave 1 (parallel -- independent improvements)

#### PHASE-4: Build Resilience

Build pipeline gracefully degrades if GitHub API is unavailable — uses cached/fallback data instead of failing the build. Modifies the adapters layer (GitHub API client, enrichment script) without touching UI.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-021 | Graceful degradation if GitHub API unavailable | BR-06 |

#### PHASE-5: Performance & Theming

Fast server-rendered initial load targeting < 2s and dark/light mode support via CSS custom properties and Tailwind v4 theme tokens. Modifies layout, globals.css, and component styles.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-002 | Fast server-rendered initial load (< 2s) | BR-07 |
| SM-005 | Support dark and light display modes | BR-08 |

### Definition of Done

- [ ] All 3 SM-XXX stories functionally complete
- [ ] Unit tests for fallback logic in enrichment pipeline
- [ ] E2E Playwright tests for theme toggle and load performance
- [ ] `pnpm build` succeeds without errors (including with simulated API failure)
- [ ] `pnpm lint` passes (ESLint flat config, no warnings)
- [ ] TypeScript strict mode — zero type errors
- [ ] Deployed to Vercel preview environment
- [ ] Manual verification: build resilience (disconnect API), theme switching, load time

---

## Release: Future

### Transitions

| Aspect | Details |
|--------|---------|
| **Produces** | Text search across hook names and descriptions, empty-state UX for zero-result queries |
| **Requires** | MVP's grid + filter infrastructure, R2's theme system (search input must respect dark/light mode) |
| **Unlocks** | Complete discovery experience — browse, filter, and search |

### Wave 1 (sequential -- single slice)

#### PHASE-6: Text Search

Real-time text search across hook names and descriptions with a "no results" empty state. Adds a new client component (`SearchInput`) that integrates with the existing filter infrastructure. Search applies as an AND condition alongside category and event filters.

| Story ID | Title | Source |
|----------|-------|--------|
| SM-017 | Real-time text search across names and descriptions | BR-09 |
| SM-018 | "No results" empty state | BR-09 |

### Definition of Done

- [ ] Both SM-XXX stories functionally complete
- [ ] Unit tests for search matching logic (domain layer)
- [ ] E2E Playwright tests for search input, filtering, and empty state
- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm lint` passes (ESLint flat config, no warnings)
- [ ] TypeScript strict mode — zero type errors
- [ ] Deployed to Vercel preview environment
- [ ] Manual verification: search + filter combinations, empty state display, dark/light mode

---

## Phase Numbering

Phases are numbered sequentially across all releases. Each slice = one phase.

| Phase | Release | Slice | Wave |
|-------|---------|-------|------|
| PHASE-1 | MVP | Walking Skeleton -- End-to-End Hook Browsing | W1 |
| PHASE-2 | MVP | Rich Card Metadata | W2 |
| PHASE-3 | MVP | Filter & Data Pipeline Polish | W2 |
| PHASE-4 | R2 | Build Resilience | W1 |
| PHASE-5 | R2 | Performance & Theming | W1 |
| PHASE-6 | Future | Text Search | W1 |

---

## Cross-Release Dependencies

| Dependency | From | To | Impact |
|------------|------|----|--------|
| Build pipeline | MVP.PHASE-1 (SM-019) | R2.PHASE-4 (SM-021) | Resilience layer wraps the enrichment pipeline established in MVP |
| Grid + Card UI | MVP.PHASE-1 + PHASE-2 | R2.PHASE-5 (SM-005) | Theme system must style all existing components |
| Layout infrastructure | MVP.PHASE-1 | R2.PHASE-5 (SM-002) | SSR optimization requires existing page structure |
| Filter infrastructure | MVP.PHASE-1 + PHASE-3 | Future.PHASE-6 (SM-017) | Search integrates as additional filter dimension |
| Theme system | R2.PHASE-5 (SM-005) | Future.PHASE-6 (SM-017) | Search input must respect dark/light mode |

---

## Complementary Artifacts

- **Story map (journey view):** .charter/STORY-MAP.md (from `/create-story-map`)
- **Full story details with AC:** .charter/USER-STORIES.md (from `/create-requirements`)
- **Architecture reference:** .charter/ARCHITECTURE-DOC.md (from `/create-design-doc`)
- **Phase-level task breakdown:** Run `/plan-phase-tasks` for PHASE-N-PLAN.md files
