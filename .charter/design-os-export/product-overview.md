# HookHub — Product Overview

## Summary

HookHub is a curated web directory that helps Claude Code developers discover open-source hooks. It provides a browsable, filterable catalog where each hook is categorized by purpose and lifecycle event, enriched with live GitHub metadata, and linked directly to its source repository.

## Problems Solved

1. **Fragmented Hook Ecosystem** — Hooks are scattered across individual GitHub repos, community lists, blog posts, and forum threads. HookHub centralizes them into a single, browsable directory with structured categorization.
2. **Inefficient Discovery** — Developers waste time searching GitHub with keyword combinations. HookHub provides dual-dimension filtering by purpose category and lifecycle event.
3. **No Quality Signals** — Evaluating hooks requires visiting each repository individually. HookHub surfaces live GitHub metadata (stars, descriptions, freshness) at a glance.
4. **Duplicated Effort** — Developers build hooks that already exist because they couldn't find them. HookHub's curated catalog makes existing hooks visible.

## Planned Sections

1. **Landing & Hero** — Hero section communicating HookHub's purpose with the hook grid positioned above the fold on desktop.
2. **Hook Catalog** — Responsive card grid displaying hook metadata including name, category badge, lifecycle badge, description, GitHub stars, and repository link.
3. **Filter System** — Dual-dimension toggle chips for purpose category and lifecycle event filtering with AND-intersection behavior and "All" reset options.
4. **Dark & Light Mode** — Theme system respecting system color scheme preference with readable content in both display modes.

## Data Model

Three entities:

- **Hook** — An open-source Claude Code hook with name, description, star count, purpose category, lifecycle event, and GitHub URL
- **PurposeCategory** — One of 8 classifications: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
- **LifecycleEvent** — One of 5 lifecycle points: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop

### Relationships

- Hook has one PurposeCategory
- Hook has one LifecycleEvent
- PurposeCategory classifies many Hooks
- LifecycleEvent classifies many Hooks

## Design System

**Colors:**
- Primary: `sky` — Used for buttons, links, category badges, key accents
- Secondary: `indigo` — Used for lifecycle event badges, secondary elements
- Neutral: `zinc` — Used for backgrounds, text, borders

**Typography:**
- Heading: Poppins (Light 300) — `font-headline`
- Body: Roboto (Light 300) — `font-body`
- Mono: JetBrains Mono — `font-mono`

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, and application shell
2. **Landing & Hero** — Hero section with headline, subtitle, and visual cue directing attention to the catalog
3. **Hook Catalog** — Responsive card grid with hook metadata, badges, stars, and GitHub links
4. **Filter System** — Dual-dimension filter bar with AND-intersection logic and empty state handling
5. **Dark & Light Mode** — System-preference-based theme switching with FOUC prevention

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
