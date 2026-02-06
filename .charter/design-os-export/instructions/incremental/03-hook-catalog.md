# Milestone 3: Hook Catalog

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete, Milestone 2 (Landing & Hero) complete

## Goal

Implement the Hook Catalog — a responsive card grid displaying all curated hooks from the manifest with rich metadata, dual badge treatments, and GitHub repository links.

## Overview

The hook catalog is the core content of HookHub. It renders every curated hook as a card in a responsive grid layout. Each card surfaces the hook's name, purpose category badge, lifecycle event badge, a truncated description, GitHub star count, and a direct link to the source repository. The entire card surface is clickable via a stretched link pattern.

**Key Functionality:**
- Responsive card grid: 3-4 columns desktop, 2 tablet, 1 mobile
- All hooks rendered without pagination
- Dual badge treatment: sky (category, rounded-md) and indigo (event, italic, rounded)
- Star count formatting: exact below 1,000, abbreviated "1.2k" at 1,000+
- Stretched link: entire card clickable, one tab stop per card
- Skeleton loading state during initial data fetch
- Empty state when zero hooks exist

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/hook-catalog/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/hook-catalog/components/`:

- `HookCard.tsx` — Refined card with stretched link, dual badges, star aria-labels, focus ring
- `HookCatalog.tsx` — Grid container with `<ul>/<li>` semantics and empty state fallback
- `index.ts` — Barrel export

### Data Layer

The components expect these data shapes:

- `Hook` — name, githubRepoUrl, purposeCategory, lifecycleEvent, description, starsCount, lastUpdated
- `EmptyState` — message and optional CTA for zero-hook scenarios

You'll need to:
- Fetch hook data from your manifest/API
- Implement the star count formatting logic (exact vs. abbreviated)
- Handle loading states (skeleton placeholders)

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onHookClick` | User clicks a hook card — receives `githubRepoUrl`, open in new tab |

### Empty States

- **No hooks in catalog:** If the manifest is empty, show a helpful message like "No hooks available yet" with guidance
- **Loading state:** Show skeleton cards matching the card dimensions during initial data fetch

## Files to Reference

- `product-plan/sections/hook-catalog/README.md` — Feature overview and design intent
- `product-plan/sections/hook-catalog/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/hook-catalog/components/` — React components
- `product-plan/sections/hook-catalog/types.ts` — TypeScript interfaces
- `product-plan/sections/hook-catalog/sample-data.json` — Test data (18 hooks)
- `product-plan/sections/hook-catalog/screenshot.png` — Visual reference (4-column grid)

## Expected User Flows

### Flow 1: Browse All Hooks

1. Developer scrolls past the hero section
2. Developer sees the full card grid with all hooks displayed
3. Developer scans cards using name, badges, and description
4. Developer identifies an interesting hook by its category badge
5. **Outcome:** Developer has a quick visual overview of all available hooks

### Flow 2: Access Source Repository

1. Developer hovers on a card (subtle elevation/border feedback)
2. Developer clicks anywhere on the card
3. GitHub repository opens in a new tab (`rel="noopener noreferrer"`)
4. **Outcome:** Developer reaches the hook's source code

### Flow 3: Scan Metadata at a Glance

1. Developer looks at a hook card
2. Category badge (sky, rounded-md) shows what the hook does (e.g., "Safety")
3. Event badge (indigo, italic, rounded) shows when it fires (e.g., "PreToolUse")
4. Star count shows community traction (e.g., "1.2k")
5. **Outcome:** Developer evaluates the hook without clicking into it

### Flow 4: Handle Empty Catalog

1. Developer visits HookHub with an empty manifest
2. Instead of an empty grid, a helpful message appears
3. **Outcome:** Developer understands why no hooks are shown

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Grid displays all hooks from the manifest
- [ ] Cards show name, category badge (sky), event badge (indigo), description, stars
- [ ] Description truncates at 2 lines with ellipsis
- [ ] Star count: exact below 1,000, abbreviated "1.2k" at 1,000+
- [ ] Stars use `aria-label` with full count for screen readers
- [ ] Entire card is clickable via stretched link pattern
- [ ] One tab stop per card, focus ring visible on keyboard navigation
- [ ] GitHub links open in new tab with `rel="noopener noreferrer"`
- [ ] Hooks with 0 stars display "0" (not hidden)
- [ ] Long hook names handled gracefully (truncation or wrapping)
- [ ] Skeleton loading state during initial data fetch
- [ ] Empty state renders when zero hooks exist
- [ ] Responsive grid: 3-4 columns desktop, 2 tablet, 1 mobile
- [ ] Works in both light and dark mode
