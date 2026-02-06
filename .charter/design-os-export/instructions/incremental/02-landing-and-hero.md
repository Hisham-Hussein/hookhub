# Milestone 2: Landing & Hero

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the Landing & Hero section — the first screen a developer sees when arriving at HookHub. The hero communicates the site's purpose within 5 seconds and directs attention to the hook catalog below.

## Overview

The hero section sits at the top of the single-page layout and immediately tells developers what HookHub is: a curated directory of open-source Claude Code hooks. It uses a concise headline, a brief subtitle, and a visual cue (animated chevron) to draw the eye downward to the card grid. On desktop 1080p, the hero is compact enough that the first row of hook cards is visible without scrolling.

**Key Functionality:**
- Display a headline and subtitle communicating HookHub's purpose
- Animated visual cue (bouncing chevron) directing attention to the catalog below
- Skip link as first focusable element, bypassing the hero to reach the filter bar + grid
- Compact hero height (~20% viewport on desktop) ensuring above-the-fold card visibility
- Simplified filter bar with category and event toggle chips
- Hook card grid below the hero showing sample catalog data

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/landing-and-hero/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/landing-and-hero/components/`:

- `HeroBanner.tsx` — Hero section with headline, subtitle, ambient glow, animated chevron, skip link
- `FilterBar.tsx` — Simplified dual-dimension toggle chips (category + event) with `aria-pressed` buttons
- `HookCard.tsx` — Dark-themed card with name, badges, description, stars, GitHub link
- `LandingAndHero.tsx` — Composer that wires hero + filter bar + card grid together
- `index.ts` — Barrel export

### Data Layer

The components expect these data shapes:

- `Hook` — name, githubRepoUrl, purposeCategory, lifecycleEvent, description, starsCount, lastUpdated
- `PurposeCategory` — union type for 8 categories
- `LifecycleEvent` — union type for 5 events
- `HeroContent` — headline and subtitle text

You'll need to:
- Load hook data from your manifest/API
- Pass hero content (headline, subtitle) as props or config

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onHookClick` | User clicks a hook card — open `githubRepoUrl` in a new tab |
| `onFilterByCategory` | User selects a category chip — receives `PurposeCategory \| null` |
| `onFilterByEvent` | User selects an event chip — receives `LifecycleEvent \| null` |

### Empty States

- **No hooks:** If the catalog has zero hooks (empty manifest), show a helpful empty state message instead of the grid
- **No filter results:** If the simplified filter produces zero matches, show "No hooks match" message

## Files to Reference

- `product-plan/sections/landing-and-hero/README.md` — Feature overview and design intent
- `product-plan/sections/landing-and-hero/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/landing-and-hero/components/` — React components
- `product-plan/sections/landing-and-hero/types.ts` — TypeScript interfaces
- `product-plan/sections/landing-and-hero/sample-data.json` — Test data
- `product-plan/sections/landing-and-hero/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: First Visit — Understand Purpose

1. Developer navigates to HookHub homepage
2. Developer immediately sees the hero headline and subtitle
3. Developer understands "this is a directory of Claude Code hooks" within 5 seconds
4. **Outcome:** Purpose communicated, developer scrolls or clicks the visual cue

### Flow 2: Navigate to Catalog

1. Developer sees the animated chevron at the bottom of the hero
2. Developer scrolls past the hero section
3. Developer sees the first row of hook cards (on desktop 1080p)
4. **Outcome:** Hook cards are visible above the fold

### Flow 3: Skip to Content (Keyboard)

1. Keyboard user tabs into the page
2. First focusable element is the "Skip to main content" link
3. User activates the skip link
4. Focus moves past the hero to the filter bar / grid area
5. **Outcome:** Keyboard user bypasses the hero efficiently

### Flow 4: Quick Filter from Landing

1. Developer uses the simplified filter bar chips
2. Selects a category (e.g., "Safety") or event (e.g., "PreToolUse")
3. Card grid updates to show only matching hooks
4. **Outcome:** Filtered view of hooks

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Hero renders with headline, subtitle, and ambient glow
- [ ] Animated chevron bounces, respects `prefers-reduced-motion`
- [ ] Skip link is first focusable element and works correctly
- [ ] Hero is compact — first card row visible on 1080p without scrolling
- [ ] Filter bar chips toggle and filter the card grid
- [ ] Hook cards display all metadata (name, badges, description, stars)
- [ ] Card clicks open GitHub repo in new tab
- [ ] Empty state renders when no hooks match
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works in both light and dark mode
