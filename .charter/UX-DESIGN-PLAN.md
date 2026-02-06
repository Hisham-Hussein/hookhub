# UX Design Plan — HookHub

> **Generated from:** .charter/STORY-MAP.md | .charter/USER-STORIES.md
> **Scope:** MVP (16 stories)
> **Date:** 2026-02-01

**Companion files:**

| File | Sections |
|------|----------|
| **UX-DESIGN-PLAN.md** (this file) | 1–4: Overview, IA, Visual Hierarchy, Page Layouts |
| [UX-COMPONENTS.md](UX-COMPONENTS.md) | 5: Component Specifications (atoms, molecules, organisms) |
| [UX-INTERACTIONS.md](UX-INTERACTIONS.md) | 6–8: Interaction Patterns, Responsive Behavior, Data States |
| [UX-FLOWS.md](UX-FLOWS.md) | 9–11: Accessibility, User Flows, Traceability Matrix |

---

## Section 1: Overview & Design Principles

**Product summary:** HookHub is a browsable, filterable web directory of open-source Claude Code hooks. It helps developers discover hooks by displaying a curated catalog in a responsive grid with category and lifecycle event filtering, linking each hook to its GitHub source repository.

**Guiding UX principles:**

1. **Instant Comprehension** — A developer must understand what HookHub is and find relevant hooks within seconds. The hero communicates purpose; the grid delivers value immediately.
2. **Scan-First, Click-Second** — The catalog optimizes for visual scanning over deep interaction. Hook cards expose all essential metadata (name, category, event, description, stars) without requiring clicks. The only click-through is to GitHub.
3. **Progressive Narrowing** — Two independent filter dimensions (category, event) let developers incrementally narrow results. Filters are always visible, always reversible, and never hide content without a clear escape path.
4. **Data Transparency** — Every piece of metadata on a hook card comes from either the curated manifest or the GitHub API. The site never fabricates data. When data is unavailable, the UX communicates this honestly.
5. **Zero-Friction Access** — No accounts, no onboarding, no popups. A developer lands and immediately has full access to the entire catalog. The path from discovery to GitHub source is one click.

---

## Section 2: Information Architecture

### Page Inventory

| Page ID | Page Name | Source Activity | Page Type | Nav Level |
|---------|-----------|-----------------|-----------|-----------|
| PG-001 | Homepage (Hook Catalog) | Land & Understand, Browse Catalog, Filter & Search | listing | primary |

**Note:** The entire MVP is a single-page filtered catalog. Activities "Land & Understand," "Browse Catalog," and "Filter & Search" map to sections within PG-001. Activity "Data Pipeline" (SM-019, SM-020) is a build-time concern with no dedicated page; its UX impact is enriched card metadata.

### Navigation Model

**Primary model:** Flat with filtered view

HookHub has a single page in MVP. Navigation operates as follows:

- **Entry:** Developer arrives at the homepage via direct URL or search engine
- **Internal navigation:** Filter chips narrow the displayed catalog (no page navigation)
- **Exit:** Click-through to GitHub repo (external, new tab)

**Deep linking strategy:** Filter state persisted in URL query parameters (e.g., `?category=Safety&event=PreToolUse`) enabling bookmarking and sharing of filtered views. Browser back button reverses filter changes.

### Content Hierarchy

**PG-001: Homepage**

| Priority | Content | Source |
|----------|---------|--------|
| P1 | Hook card grid (the catalog) | SM-004, SM-006–010 |
| P2 | Filter controls (category + event chips) | SM-013–016 |
| P3 | Hero section (purpose communication) | SM-001, SM-003 |
| P4 | Result count, footer | Ambient / Supporting |

The grid is P1 because it's why developers visit. Filters are P2 because they enable the primary interaction. The hero is P3 because it serves orientation for new visitors but is not the ongoing value.

---

## Section 3: Visual Hierarchy Map

| Rank | Element Name | Type Role | Emphasis | Container |
|------|-------------|-----------|----------|-----------|
| 1 | hero-headline | display | high | hero-section |
| 2 | hero-subtitle | body | medium | hero-section |
| 3 | hero-visual-cue | icon | low | hero-section |
| 4 | filter-section-label | label | medium | filter-bar |
| 5 | filter-chip-text (active) | label | high | filter-chip-group |
| 6 | filter-chip-text (inactive) | label | medium | filter-chip-group |
| 7 | result-count | body-small | low | filter-bar |
| 8 | card-title | heading-3 | high | hook-card |
| 9 | card-category-badge | label | medium | hook-card |
| 10 | card-event-badge | label | medium | hook-card |
| 11 | card-description | body | medium | hook-card |
| 12 | card-stars-count | caption | low | hook-card |
| 13 | card-stars-icon | icon | low | hook-card |
| 14 | card-repo-link | label | low | hook-card |
| 15 | card-link-icon | icon | low | hook-card |
| 16 | footer-text | body-small | low | footer |

**Scanning pattern per page:**

- **Homepage — Hero zone:** Center-aligned, brief scan. Headline captures attention; subtitle provides context; visual cue directs eye downward to the catalog.
- **Homepage — Catalog zone:** F-pattern.
  - **F-bar-1 (top horizontal):** Filter section — category chips, event chips, result count
  - **F-bar-2 (second horizontal):** First row of hook cards — card titles scannable across columns
  - **F-stem (left vertical):** Card titles cascading down the grid
  - **Right zone (lower attention):** Badge metadata, star counts, link icons

---

## Section 4: Page Layouts

### Homepage (PG-001)

**Base tier (mobile):**

```
┌────────────────────────────────┐
│          HERO SECTION           │
│                                 │
│    [hero-headline]              │
│    display, high emphasis       │
│    center-aligned               │
│              S                  │
│    [hero-subtitle]              │
│    body, medium emphasis        │
│    center-aligned               │
│              M                  │
│    [visual-cue ↓]              │
│              XL                 │
├────────────────────────────────┤
│        FILTER SECTION           │
│              M                  │
│  Category:                      │
│  [All] [Safety] [Automation]... │
│  (horizontal scroll if needed)  │
│              M                  │
│  Event:                         │
│  [All] [PreToolUse] [PostTool…] │
│  (horizontal scroll if needed)  │
│              S                  │
│  Showing N hooks                │
│              L                  │
├────────────────────────────────┤
│          HOOK GRID              │
│       (1 column, full-width)    │
│                                 │
│  ┌──────────────────────────┐  │
│  │ [card-title]             │  │
│  │ heading-3, high          │  │
│  │        XS                │  │
│  │ [category] [event]       │  │
│  │ badges, medium           │  │
│  │        S                 │  │
│  │ [card-description]       │  │
│  │ body, medium, 2-line max │  │
│  │        S                 │  │
│  │ ★ [stars]    [→ repo]    │  │
│  │ caption/low   label/low  │  │
│  └──────────────────────────┘  │
│              M                  │
│  ┌──────────────────────────┐  │
│  │ [next card...]           │  │
│  └──────────────────────────┘  │
│              ...                │
│              XL                 │
├────────────────────────────────┤
│           FOOTER                │
│  [footer-text] body-small, low  │
└────────────────────────────────┘
```

**Tablet adds:**
- Grid becomes 2 columns with M gap between cards
- Filter chips wrap naturally without horizontal scroll (more horizontal space)
- Hero headline may use slightly larger type scale (still display role)
- Hero and filter sections remain full-width above the grid

**Desktop adds:**
- Grid becomes 3–4 columns (3 at standard desktop; 4 at wide viewports)
- Hero section is compact: headline + subtitle on ~2 lines, with grid visible below on a 1080p viewport without scrolling (per US-003)
- All filter chips visible on a single line per dimension (no wrapping or scrolling)
- Max content width constraint prevents overly wide layouts
- Hero vertical height minimized to maximize grid visibility above fold
