# Landing & Hero

## Overview

The hero section is the first thing a developer sees when arriving at HookHub. It communicates the site's purpose ("a directory of open-source Claude Code hooks") within 5 seconds through a concise headline and brief subtitle, then directs attention to the catalog grid below. On desktop, the hero is deliberately compact so the first row of hook cards is visible without scrolling.

## User Flows

- Developer arrives and immediately sees headline + subtitle
- Hero communicates purpose — understood within 5 seconds
- Visual cue (animated chevron) directs attention to the grid below
- On desktop 1080p, first row of cards is visible without scrolling
- Skip link bypasses hero to reach filter bar + grid

## Design Decisions

- **Compact hero height:** ~20% viewport on desktop to ensure above-the-fold grid visibility
- **Ambient glow:** Subtle radial gradient behind hero text for depth without distraction
- **Animated chevron:** Gentle bouncing animation directs eye downward
- **Skip link:** First focusable element for keyboard users
- **Simplified filter bar:** This section uses a lighter version of the filter bar with `aria-pressed` buttons rather than the full radiogroup pattern

## Data Used

**Entities:** HeroContent, Hook, PurposeCategory, LifecycleEvent

**From global model:** Hook is the central entity displayed in the card grid below the hero

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `HeroBanner` — Hero section with headline, subtitle, ambient glow, animated chevron, skip link
- `FilterBar` — Simplified dual-dimension toggle chips (category + event)
- `HookCard` — Dark-themed card with name, badges, description, stars, GitHub link
- `LandingAndHero` — Composer that wires hero + filter bar + card grid together

## Callback Props

| Callback | Description |
|----------|-------------|
| `onHookClick` | Called when user clicks a hook card — receives `githubRepoUrl` |
| `onFilterByCategory` | Called when user selects a category filter — receives `PurposeCategory \| null` |
| `onFilterByEvent` | Called when user selects an event filter — receives `LifecycleEvent \| null` |
