# Filter System

## Overview

Dual-dimension filter bar positioned above the hook catalog grid. Two horizontal rows of toggle chips — one for purpose categories (sky accent), one for lifecycle events (indigo accent) — allow developers to narrow the catalog using AND-intersection logic. Each dimension includes an "All" default to reset. A result count displays below the chip rows. Filtering is instant and client-side.

## User Flows

- Filter by category: Click a purpose category chip to filter. Clicking "All" resets.
- Filter by event: Same behavior for lifecycle events, independent of category.
- Combined filtering (AND): Select both a category and event — only hooks matching BOTH appear.
- Reset a single dimension: Click "All" in one row — that dimension clears, the other stays.
- No results: Zero-match AND shows "No hooks match these filters" with "Clear all filters" CTA.
- URL state: Filter selections sync to URL query params, making filters shareable/bookmarkable.

## Design Decisions

- **WAI-ARIA Radio Group pattern:** Each chip row is `role="radiogroup"` with chips as `role="radio"` and `aria-checked`
- **Roving tabindex:** Only the focused chip has `tabIndex=0`; others have `tabIndex=-1`. Arrow keys move focus AND select.
- **Selected chip glow:** Subtle box-shadow glow on selected chips for extra visual distinction
- **Category vs. event accent:** Category uses sky, event uses indigo — consistent with badge colors on cards
- **Mobile overflow:** Chips scroll horizontally on mobile, wrap on tablet+
- **Debounced announcements:** Result count uses `aria-live="polite"` (production should debounce ~300ms)

## Data Used

**Entities:** FilterOption, FilterState, FilterEmptyState, Hook, PurposeCategory, LifecycleEvent

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `FilterChip` — Individual toggle chip with radio semantics, forwardRef for roving tabindex
- `FilterChipRow` — Horizontal row managing keyboard navigation (Arrow, Home, End, Space, Enter)
- `FilterBar` — Composes two chip rows + result count announcer with `role="status"`
- `FilterSystem` — Top-level orchestrator: state management, AND filtering, grid rendering with HookCatalog

## Callback Props

| Callback | Description |
|----------|-------------|
| `onCategoryChange` | User selects category chip — receives `CategoryFilterValue` |
| `onEventChange` | User selects event chip — receives `EventFilterValue` |
| `onClearAll` | User clicks "Clear all filters" from zero-result empty state |
| `onFilterChange` | Any filter change — receives `(FilterState, resultCount)` |
| `onHookClick` | Hook card clicked — receives `githubRepoUrl` |
