# Milestone 4: Filter System

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-3 complete (Foundation, Landing & Hero, Hook Catalog)

## Goal

Implement the Filter System — a dual-dimension filter bar with purpose category and lifecycle event chips, AND-intersection logic, and URL state persistence.

## Overview

The filter system is the primary discovery tool on HookHub. Positioned above the hook catalog grid, it provides two rows of toggle chips — one for purpose categories (sky accent) and one for lifecycle events (indigo accent). Developers use these to narrow the catalog using AND-intersection logic. Each dimension operates independently with single-select behavior and an "All" option to reset. A result count updates on every filter change, and filter selections sync to URL query parameters for shareability.

**Key Functionality:**
- Two horizontal chip rows: category (9 chips: "All" + 8 categories) and event (6 chips: "All" + 5 events)
- Single-select within each dimension (radio behavior)
- AND-intersection: selecting both a category and event shows only hooks matching BOTH
- "All" resets one dimension while preserving the other
- Result count with `aria-live="polite"` announcements
- URL query param sync (`?category=Safety&event=PreToolUse`) for sharing/bookmarking
- Browser back/forward navigates filter history
- Full WAI-ARIA radio group keyboard pattern

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/filter-system/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic — adapt them to your testing setup.

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/filter-system/components/`:

- `FilterChip.tsx` — Individual toggle chip with `role="radio"`, `forwardRef` for roving tabindex
- `FilterChipRow.tsx` — Horizontal row managing keyboard navigation (Arrow, Home, End, Space, Enter)
- `FilterBar.tsx` — Composes two chip rows + result count announcer with `role="status"`
- `FilterSystem.tsx` — Top-level orchestrator: state management, AND filtering, grid rendering
- `index.ts` — Barrel export

### Data Layer

The components expect these data shapes:

- `FilterOption` — label and value for each chip
- `FilterState` — current selections for category and event dimensions
- `CategoryFilterValue` — `"All" | PurposeCategory`
- `EventFilterValue` — `"All" | LifecycleEvent`

You'll need to:
- Implement AND-intersection filtering logic
- Sync filter state to/from URL query parameters
- Compute and display result counts
- Handle browser back/forward navigation

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onCategoryChange` | User selects a category chip — receives `CategoryFilterValue` |
| `onEventChange` | User selects an event chip — receives `EventFilterValue` |
| `onClearAll` | User clicks "Clear all filters" from zero-result empty state |
| `onFilterChange` | Any filter change — receives `(FilterState, resultCount)` |
| `onHookClick` | Hook card clicked in the filtered grid — receives `githubRepoUrl` |

### Empty States

- **No filter results:** When AND-intersection produces zero hooks, show "No hooks match these filters" with a "Clear all filters" CTA. The filter bar stays interactive.
- **Transition from results to empty:** When a filter change removes all results, the empty state replaces the grid smoothly

### Accessibility

- Each chip row uses `role="radiogroup"` with descriptive `aria-label`
- Each chip uses `role="radio"` with `aria-checked`
- Roving tabindex: only focused chip has `tabIndex=0`, others `tabIndex=-1`
- Arrow Left/Right moves focus AND selects within a row
- Home/End jump to first/last chip
- Space/Enter activate the focused chip
- Tab exits the radiogroup
- Result count: `role="status"`, `aria-live="polite"`, `aria-atomic="true"` (debounce ~300ms in production)
- `prefers-reduced-motion`: all chip/grid animations removed, state changes instant

## Files to Reference

- `product-plan/sections/filter-system/README.md` — Feature overview and design intent
- `product-plan/sections/filter-system/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/filter-system/components/` — React components
- `product-plan/sections/filter-system/types.ts` — TypeScript interfaces
- `product-plan/sections/filter-system/sample-data.json` — Test data
- `product-plan/sections/filter-system/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Filter by Category

1. Developer clicks a purpose category chip (e.g., "Safety")
2. Chip becomes highlighted (filled + text weight change)
3. Card grid immediately shows only Safety hooks
4. Result count updates (e.g., "Showing 3 hooks")
5. URL updates to `?category=Safety`
6. **Outcome:** Developer sees only hooks in the selected category

### Flow 2: Combined AND Filter

1. Developer selects "Safety" category chip
2. Developer selects "PreToolUse" event chip
3. Grid shows only hooks matching BOTH Safety AND PreToolUse
4. Result count reflects the intersection
5. URL updates to `?category=Safety&event=PreToolUse`
6. **Outcome:** Developer has narrowed to a precise subset

### Flow 3: No Results — Clear Filters

1. Developer selects a category + event combination with zero matches
2. Grid area shows "No hooks match these filters" message
3. "Clear all filters" CTA is visible
4. Developer clicks "Clear all filters"
5. Both dimensions reset to "All", full catalog returns
6. **Outcome:** Developer recovers from a zero-result state

### Flow 4: Share a Filtered View

1. Developer applies filters (e.g., `?category=Automation&event=PostToolUse`)
2. Developer copies the URL from the address bar
3. Another developer opens that URL
4. Page loads with the same filters pre-selected
5. **Outcome:** Filtered views are shareable via URL

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Two chip rows render: category (9 chips) and event (6 chips)
- [ ] "All" is first chip in each row, selected by default
- [ ] Single-select within each dimension (radio behavior)
- [ ] AND-intersection filtering works correctly
- [ ] Result count updates on every filter change
- [ ] Zero-result empty state shows "No hooks match these filters" + "Clear all filters"
- [ ] URL query params sync bidirectionally
- [ ] Browser back/forward navigates filter history
- [ ] WAI-ARIA radio group pattern: roles, aria-checked, roving tabindex, keyboard navigation
- [ ] `prefers-reduced-motion` removes all animations
- [ ] Mobile: chips horizontally scrollable, 44x44 min touch targets
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works in both light and dark mode
