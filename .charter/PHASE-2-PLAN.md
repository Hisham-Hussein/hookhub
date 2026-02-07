# Phase 2 Plan: Rich Card Metadata

## Metadata
- **Phase:** 2
- **Release:** MVP
- **Wave:** Wave 2 (parallel -- independent enhancements)
- **Source Stories:** SM-007, SM-008, SM-009, SM-010
- **Derived User Stories:** US-007, US-008, US-009, US-010
- **Date Generated:** 2026-02-07
- **Architecture Layers Touched:** Domain, Adapters
- **UX Inputs Loaded:** Yes -- Design OS export (sections: hook-catalog)

## Story Summary

Phase 2 enriches the HookCard component created in Phase 1 with polished metadata displays. Four small stories add purpose category badges (US-007), lifecycle event badges (US-008), truncated description text (US-009), and formatted GitHub stars count (US-010). Two stories require domain layer work: US-007 adds badge color/style metadata for categories, and US-010 adds StarsCount formatting logic. All stories touch the Adapters layer (HookCard component). All four stories modify the same `HookCard.tsx` component, creating an implementation-level sequential dependency despite being INVEST-independent. Eight tasks total across Domain and Adapters layers.

| Story | Name | Layer Coverage | Task Count |
|-------|------|---------------|------------|
| US-007 | Show purpose category with visual distinction | Domain, Adapters | 2 |
| US-008 | Show lifecycle event with visual distinction | Domain, Adapters | 2 |
| US-009 | Show hook description on card | Adapters | 1 |
| US-010 | Show GitHub stars count on card | Domain, Adapters | 3 |

## Task Decomposition

### Story US-007: Show purpose category with visual distinction

#### Layer: Domain

**Task 1: Add badge styling metadata to PurposeCategory** (`lib/domain/categories.ts`)
- **Input:** Existing CATEGORIES array from Phase 1 (has value + label); AC requires 8 categories visually distinguishable from each other and from lifecycle event badges; color-coded or styled differently; readable at small sizes
- **Output:** Extend CATEGORIES entries with `badgeColor` (Tailwind bg color class) and `textColor` (Tailwind text color class) for each of the 8 categories; export `getCategoryBadgeStyle(category: PurposeCategory)` helper returning the style pair; color palette must be distinct from lifecycle event badge colors (coordinate with US-008)
- **Test:** All 8 categories have non-empty badgeColor and textColor; getCategoryBadgeStyle returns correct style for each category; no two categories share the same badgeColor; returned classes are valid Tailwind color utilities

#### Layer: Adapters

**Task 2: Add purpose category badge to HookCard** (`app/components/HookCard.tsx`)
- **Input:** Hook.purposeCategory field; getCategoryBadgeStyle helper from categories.ts; AC: badge displayed as small element on card; visually distinct from other card content; all 8 categories supported; readable at small sizes; distinguishable from lifecycle event badge
- **Output:** HookCard enhanced with a purpose category badge element using the category's label and color styling; badge positioned per Design OS reference; small rounded pill/chip styling via Tailwind utilities
- **Test:** Badge renders with correct category label text; badge has color styling matching getCategoryBadgeStyle output; all 8 category values render without error; badge is visually distinct element (has background color)
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-008: Show lifecycle event with visual distinction

#### Layer: Domain

**Task 1: Add badge styling metadata to LifecycleEvent** (`lib/domain/events.ts`)
- **Input:** Existing EVENTS array from Phase 1 (has value + label); AC requires 5 events visually distinguishable from each other; different styling/color scheme from purpose category badges; readable; uses exact event name
- **Output:** Extend EVENTS entries with `badgeColor` (Tailwind bg color class) and `textColor` (Tailwind text color class) for each of the 5 events; export `getEventBadgeStyle(event: LifecycleEvent)` helper; color scheme must differ from category badge colors (e.g., muted/neutral tones vs. category's saturated colors)
- **Test:** All 5 events have non-empty badgeColor and textColor; getEventBadgeStyle returns correct style for each event; no two events share the same badgeColor; event badge colors are visually distinct from category badge colors (different hue family)

#### Layer: Adapters

**Task 2: Add lifecycle event badge to HookCard** (`app/components/HookCard.tsx`)
- **Input:** Hook.lifecycleEvent field; getEventBadgeStyle helper from events.ts; AC: badge uses different styling/color scheme from purpose badge; all 5 events supported; uses exact event name; positioned consistently relative to category badge
- **Output:** HookCard enhanced with a lifecycle event badge element adjacent to the category badge; uses event's label and distinct color scheme; consistent badge sizing and spacing with the category badge
- **Test:** Event badge renders with correct event name text; event badge styling differs from category badge styling; both badges visible simultaneously on a card; all 5 event values render without error; badge pair has consistent horizontal or inline layout
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-009: Show hook description on card

#### Layer: Adapters

**Task 1: Add truncated description to HookCard** (`app/components/HookCard.tsx`)
- **Input:** Hook.description field (from GitHub API enrichment); AC: description below name and badges; truncated to ~2 lines; truncated text ends with ellipsis; short descriptions maintain grid alignment; content from GitHub API
- **Output:** HookCard enhanced with description paragraph element below the name and badge section; CSS line-clamp (2 lines) via Tailwind `line-clamp-2` utility; consistent card height maintained regardless of description length
- **Test:** Description text renders on card; long description (100+ chars) is visually truncated to 2 lines; truncated description shows ellipsis indicator; short description (< 2 lines) renders without extra blank space affecting card height; empty description renders gracefully (no blank gap)
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-010: Show GitHub stars count on card

#### Layer: Domain

**Task 1: Create StarsCount formatting function** (`lib/domain/format.ts`)
- **Input:** StarsCount value object spec from arch doc: must be >= 0; displayed as exact number below 1,000, abbreviated (e.g., "1.2k") at 1,000+; AC: formatted for readability
- **Output:** `formatStarsCount(count: number): string` pure function; returns exact string for 0-999 (e.g., "0", "42", "999"); returns abbreviated string for 1000+ (e.g., "1k", "1.2k", "10k", "1.5k"); handles edge cases (0, negative input defaults to "0")
- **Test:** 0 → "0"; 42 → "42"; 999 → "999"; 1000 → "1k"; 1200 → "1.2k"; 1500 → "1.5k"; 10000 → "10k"; 999999 → "1000k" or "1M" (define upper boundary); negative → "0"

**Task 2: Create star icon component** (`app/components/StarIcon.tsx`)
- **Input:** AC: recognizable star icon displayed alongside count; no external icon library needed -- use inline SVG; small size matching badge typography
- **Output:** StarIcon React component rendering a small SVG star (filled); accepts optional className prop for Tailwind sizing/color; defaults to a muted/accent color appropriate for the dark theme
- **Test:** Renders an SVG element; SVG contains star path; accepts and applies className prop; renders at appropriate small size (16px or similar)

#### Layer: Adapters

**Task 3: Add formatted stars count to HookCard** (`app/components/HookCard.tsx`)
- **Input:** Hook.starsCount field; formatStarsCount function from format.ts; StarIcon component; AC: star icon + formatted count displayed on card; 0 stars shows "0" (not hidden)
- **Output:** HookCard enhanced with a stars display element combining StarIcon and formatted count text; positioned in card footer or metadata section; muted styling that doesn't compete with name/badges
- **Test:** Stars count renders with star icon; count of 0 displays "0" with icon (not hidden); count of 1200 displays "1.2k"; star icon and count text are adjacent; all sample hook data renders stars without error
- **Reference:** design-os-export/sections/hook-catalog/

## Parallelism Analysis

All four stories modify the same file (`app/components/HookCard.tsx`), creating implementation-level merge conflicts if run simultaneously. Despite being INVEST-independent at the story level, they must be serialized at the file level.

US-007 and US-008 share a badge design concern -- their color schemes must be coordinated to be distinguishable from each other. US-007 should run first to establish the badge pattern, and US-008 follows using a complementary color scheme.

US-009 is fully independent (different card section: description area) but still modifies HookCard.tsx.

US-010 has the most domain work (format.ts + StarIcon component) and modifies HookCard.tsx for the stars display.

### Execution Group 1 (badge foundation)
- US-007: Show purpose category with visual distinction -- establishes badge component pattern and category color scheme in HookCard

### Execution Group 2 (parallel -- after Group 1)
- US-008: Show lifecycle event with visual distinction -- adds second badge using complementary color scheme; depends on US-007's badge layout pattern
- US-010: Show GitHub stars count on card -- domain work (format.ts) is independent; StarIcon is a new file; only the final HookCard integration step conflicts with US-008

### Execution Group 3 (independent -- after Group 2)
- US-009: Show hook description on card -- adds description text below badges/stars; positioned last because it needs awareness of the final badge + stars layout to maintain consistent card spacing

### Sequential Dependencies
- US-008 must complete after US-007 because it establishes a complementary badge color scheme and reuses US-007's badge layout pattern
- US-009 should complete after US-007 + US-008 + US-010 because the description positioning depends on the final badge and stars layout above it
- US-010 domain tasks (format.ts, StarIcon) can run in parallel with US-008; the HookCard integration (Task 3) must follow US-008

### Recommended Execution Order
1. **US-007** alone -- dispatch to single agent (2 tasks: domain badge metadata + HookCard badge)
2. **US-008 + US-010 Tasks 1-2** -- dispatch to 2 parallel agents (US-008: 2 tasks; US-010: format.ts + StarIcon only)
3. **US-010 Task 3** -- dispatch to single agent (HookCard stars integration, after US-008 HookCard changes)
4. **US-009** -- dispatch to single agent (1 task: HookCard description, positioned below all other metadata)

> **For Claude -- superpowers:writing-plans:**
> This PHASE-2-PLAN.md is the spec input for `superpowers:writing-plans`.
> Feed the Task Decomposition section (story by story) into `writing-plans`
> to produce a detailed implementation plan with TDD steps
> (RED-GREEN-REFACTOR) baked into each task. The Parallelism Analysis
> section determines agent dispatch order via
> `superpowers:dispatching-parallel-agents`. Do not modify the Metadata
> or Story Summary sections -- they are reference context, not work items.
