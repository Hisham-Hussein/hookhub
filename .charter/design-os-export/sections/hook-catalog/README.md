# Hook Catalog

## Overview

Responsive card grid displaying all curated hooks from the manifest. Each hook card shows its name, purpose category badge, lifecycle event badge, 2-line truncated description, GitHub stars count, and a clickable link to its GitHub repository. The grid adapts from 3-4 columns on desktop to 1 column on mobile with no pagination.

## User Flows

- Browse hooks: Scroll the grid, scan cards visually using name, badges, and description
- Access source: Click a card to open the GitHub repository in a new tab
- Scan metadata: Category badge (sky, rounded-md) and event badge (indigo, italic, rounded) are visually distinct
- Handle empty catalog: Helpful empty state replaces the grid when zero hooks exist

## Design Decisions

- **Stretched link pattern:** The `<a>` title uses `::after` pseudo-element to make the entire card surface clickable — one tab stop per card
- **Dual badge treatment:** Category badges are sky with rounded-md corners; event badges are indigo with rounded corners and italic text — visually distinguishable by more than color alone
- **Star formatting:** Exact below 1,000, abbreviated "1.2k" at 1,000+. Screen readers get the full count via aria-label
- **No pagination:** All hooks rendered at once. The manifest is curated, so the count stays manageable

## Data Used

**Entities:** Hook, EmptyState, PurposeCategory, LifecycleEvent

## Visual Reference

See `screenshot.png` for the target UI design (18 hooks in a 4-column grid).

## Components Provided

- `HookCard` — Refined card with stretched link, dual badges, star aria-labels, focus ring
- `HookCatalog` — Grid container with `<ul>/<li>` semantics and empty state fallback

## Callback Props

| Callback | Description |
|----------|-------------|
| `onHookClick` | Called when user clicks a hook card — receives `githubRepoUrl` |
