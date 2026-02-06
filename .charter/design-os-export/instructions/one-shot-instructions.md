# HookHub — Complete Implementation Instructions

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization (if needed — HookHub MVP is public/read-only)
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

## Product Overview

HookHub is a curated web directory that helps Claude Code developers discover open-source hooks. It provides a browsable, filterable catalog where each hook is categorized by purpose and lifecycle event, enriched with live GitHub metadata, and linked directly to its source repository.

### Planned Sections

1. **Landing & Hero** — Hero section communicating HookHub's purpose with the hook grid positioned above the fold on desktop.
2. **Hook Catalog** — Responsive card grid displaying hook metadata including name, category badge, lifecycle badge, description, GitHub stars, and repository link.
3. **Filter System** — Dual-dimension toggle chips for purpose category and lifecycle event filtering with AND-intersection behavior and "All" reset options.
4. **Dark & Light Mode** — Theme system respecting system color scheme preference with readable content in both display modes.

### Data Model

Three entities:
- **Hook** — An open-source Claude Code hook with name, description, star count, purpose category, lifecycle event, and GitHub URL
- **PurposeCategory** — One of 8 classifications: Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
- **LifecycleEvent** — One of 5 lifecycle points: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop

### Design System

**Colors:**
- Primary: `sky` — Buttons, links, category badges, key accents
- Secondary: `indigo` — Lifecycle event badges, secondary elements
- Neutral: `zinc` — Backgrounds, text, borders

**Typography:**
- Heading: Poppins (Light 300) — `font-headline`
- Body: Roboto (Light 300) — `font-body`
- Mono: JetBrains Mono — `font-mono`

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

Key decisions:
- Primary color: `sky` (buttons, links, category badges)
- Secondary color: `indigo` (lifecycle event badges)
- Neutral color: `zinc` (backgrounds, text, borders)
- Heading font: Poppins Light (300)
- Body font: Roboto Light (300)
- Mono font: JetBrains Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

Core types:
- `Hook` — name, githubRepoUrl, purposeCategory, lifecycleEvent, description, starsCount, lastUpdated
- `PurposeCategory` — union of 8 category strings
- `LifecycleEvent` — union of 5 event strings

### 3. Routing Structure

HookHub is a single-page application with no multi-page routing:

- `/` — The homepage (only route)
- Filter state persisted in URL query parameters: `?category=Safety&event=PreToolUse`

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper (`min-h-screen`, `max-w-7xl` centered)
- `HeroBanner.tsx` — Hero section with headline + subtitle
- `PageFooter.tsx` — Minimal attribution footer

**Layout Pattern:**
The shell renders four stacked zones:
1. Hero Zone — Site identity (headline + subtitle + visual cue)
2. Filter Zone — Category chips + event chips + result count
3. Content Zone — Responsive hook card grid
4. Footer Zone — Minimal attribution

**Responsive Behavior:**
- Desktop: max-width container centered, hero compact (~20% viewport), grid 3-4 columns
- Tablet: hero ~30% viewport, grid 2 columns
- Mobile: hero ~40% viewport, grid 1 column, filter chips horizontally scrollable

### 5. Dark Mode Support

Add FOUC prevention to `index.html`:

```html
<script>(function(){try{if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()</script>
```

This must be placed in `<head>` before any stylesheets.

Add Tailwind v4 dark mode configuration:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components
- `product-plan/shell/screenshot.png` — Shell visual reference

## Done When

- [ ] Design tokens are configured (colors, fonts, dark mode variant)
- [ ] Data model types are defined (Hook, PurposeCategory, LifecycleEvent)
- [ ] Single-page route exists with URL query parameter support for filters
- [ ] Shell renders with hero banner and footer
- [ ] FOUC prevention script in `<head>`
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Both light and dark mode render correctly

---

# Milestone 2: Landing & Hero

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

## What to Implement

### Components

Copy from `product-plan/sections/landing-and-hero/components/`:

- `HeroBanner.tsx` — Hero section with headline, subtitle, ambient glow, animated chevron, skip link
- `FilterBar.tsx` — Simplified dual-dimension toggle chips (category + event)
- `HookCard.tsx` — Card with name, badges, description, stars, GitHub link
- `LandingAndHero.tsx` — Composer that wires hero + filter bar + card grid together

### Callbacks

| Callback | Description |
|----------|-------------|
| `onHookClick` | User clicks a hook card — open `githubRepoUrl` in a new tab |
| `onFilterByCategory` | User selects a category chip — receives `PurposeCategory \| null` |
| `onFilterByEvent` | User selects an event chip — receives `LifecycleEvent \| null` |

### Empty States

- **No hooks:** Empty manifest shows a helpful message instead of the grid
- **No filter results:** Zero-match filter shows "No hooks match" message

## Files to Reference

- `product-plan/sections/landing-and-hero/` — README, tests, components, types, sample data, screenshot

## Done When

- [ ] Tests written and passing
- [ ] Hero renders with headline, subtitle, ambient glow, animated chevron
- [ ] Skip link works as first focusable element
- [ ] Hero is compact — first card row visible on 1080p
- [ ] Filter bar chips toggle and filter the card grid
- [ ] Hook cards display all metadata
- [ ] Card clicks open GitHub repo in new tab
- [ ] Empty state renders when no hooks match
- [ ] Responsive and works in both light and dark mode

---

# Milestone 3: Hook Catalog

## Goal

Implement the Hook Catalog — a responsive card grid displaying all curated hooks with rich metadata, dual badge treatments, and GitHub repository links.

## Overview

The hook catalog is the core content of HookHub. It renders every curated hook as a card in a responsive grid layout. Each card surfaces the hook's name, purpose category badge (sky), lifecycle event badge (indigo), a truncated description, GitHub star count, and a direct link to the source repository.

**Key Functionality:**
- Responsive card grid: 3-4 columns desktop, 2 tablet, 1 mobile
- All hooks rendered without pagination
- Dual badge treatment: sky (category, rounded-md) and indigo (event, italic, rounded)
- Star count formatting: exact below 1,000, abbreviated "1.2k" at 1,000+
- Stretched link: entire card clickable, one tab stop per card
- Skeleton loading state during initial data fetch
- Empty state when zero hooks exist

## What to Implement

### Components

Copy from `product-plan/sections/hook-catalog/components/`:

- `HookCard.tsx` — Refined card with stretched link, dual badges, star aria-labels, focus ring
- `HookCatalog.tsx` — Grid container with `<ul>/<li>` semantics and empty state fallback

### Callbacks

| Callback | Description |
|----------|-------------|
| `onHookClick` | User clicks a hook card — receives `githubRepoUrl`, open in new tab |

### Key Details

- Description truncates at 2 lines with ellipsis
- Stars: exact below 1,000, "1.2k" at 1,000+, `aria-label` with full count
- Hooks with 0 stars display "0" (not hidden)
- GitHub links: `rel="noopener noreferrer"`, opens new tab
- Long hook names: truncation or wrapping

## Files to Reference

- `product-plan/sections/hook-catalog/` — README, tests, components, types, sample data, screenshot

## Done When

- [ ] Tests written and passing
- [ ] Grid displays all hooks with name, badges, description, stars
- [ ] Stretched link pattern: entire card clickable, one tab stop
- [ ] Star formatting correct (exact vs. abbreviated)
- [ ] Skeleton loading state during initial fetch
- [ ] Empty state for zero hooks
- [ ] Responsive grid and works in both light and dark mode

---

# Milestone 4: Filter System

## Goal

Implement the Filter System — a dual-dimension filter bar with purpose category and lifecycle event chips, AND-intersection logic, and URL state persistence.

## Overview

The filter system is the primary discovery tool. Positioned above the hook catalog grid, it provides two rows of toggle chips — one for purpose categories (sky accent, 9 chips) and one for lifecycle events (indigo accent, 6 chips). Developers use AND-intersection logic to narrow the catalog. Filter selections sync to URL query parameters for shareability.

**Key Functionality:**
- Two horizontal chip rows: category ("All" + 8 categories) and event ("All" + 5 events)
- Single-select within each dimension (radio behavior)
- AND-intersection: both dimensions must match
- "All" resets one dimension while preserving the other
- Result count with `aria-live="polite"` announcements
- URL query param sync for sharing/bookmarking
- Full WAI-ARIA radio group keyboard pattern

## What to Implement

### Components

Copy from `product-plan/sections/filter-system/components/`:

- `FilterChip.tsx` — Toggle chip with `role="radio"`, `forwardRef`
- `FilterChipRow.tsx` — Row with keyboard navigation (Arrow, Home, End)
- `FilterBar.tsx` — Two rows + result count with `role="status"`
- `FilterSystem.tsx` — Orchestrator: state, AND filtering, grid rendering

### Callbacks

| Callback | Description |
|----------|-------------|
| `onCategoryChange` | Category chip selected — receives `CategoryFilterValue` |
| `onEventChange` | Event chip selected — receives `EventFilterValue` |
| `onClearAll` | "Clear all filters" from zero-result state |
| `onFilterChange` | Any change — receives `(FilterState, resultCount)` |
| `onHookClick` | Hook card clicked — receives `githubRepoUrl` |

### Accessibility

- `role="radiogroup"` per row, `role="radio"` per chip, `aria-checked`
- Roving tabindex, Arrow Left/Right, Home/End, Space/Enter
- Result count: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`
- `prefers-reduced-motion`: animations removed
- Mobile: 44x44 min touch targets, horizontal scroll

## Files to Reference

- `product-plan/sections/filter-system/` — README, tests, components, types, sample data, screenshot

## Done When

- [ ] Tests written and passing
- [ ] Two chip rows with correct counts (9 category, 6 event)
- [ ] AND-intersection filtering works
- [ ] Zero-result empty state with "Clear all filters"
- [ ] URL query params sync bidirectionally
- [ ] WAI-ARIA radio group keyboard pattern complete
- [ ] `prefers-reduced-motion` supported
- [ ] Responsive and works in both light and dark mode

---

# Milestone 5: Dark & Light Mode

## Goal

Implement the Dark & Light Mode system — a cross-cutting theme that adds light mode support with automatic system preference detection and FOUC prevention.

## Overview

HookHub was designed dark-first. This milestone adds light mode as the CSS default, with dark mode activating via Tailwind `dark:` variants. The system detects OS color scheme via `prefers-color-scheme` and applies themes automatically. No manual toggle in MVP. A blocking inline script prevents FOUC.

**Key Functionality:**
- Automatic theme detection via `prefers-color-scheme`
- Light-first CSS with `dark:` variants
- FOUC prevention script in `<head>`
- Live switching when system preference changes
- 9 components updated with dual-mode tokens
- WCAG AA contrast in both modes

## What to Implement

### Components

Copy from `product-plan/sections/dark-and-light-mode/`:
- `components/ThemePreview.tsx` — Demo-only toggle (NOT for production)
- `hooks/useThemeDetection.ts` — System preference detection hook

### Theme Token Map

**Light mode (CSS defaults):**
- Page: `bg-white` / `bg-zinc-50`, headings: `text-zinc-900`, body: `text-zinc-700`
- Cards: `bg-white border-zinc-200`, badges: `bg-sky-50 text-sky-700` / `bg-indigo-50 text-indigo-700`

**Dark mode (`dark:` variants):**
- Page: `dark:bg-black`, headings: `dark:text-zinc-100`, body: `dark:text-zinc-400`
- Cards: `dark:bg-zinc-950 dark:border-zinc-800`, badges: `dark:bg-sky-500/15 dark:text-sky-400` / `dark:bg-indigo-500/15 dark:text-indigo-400`

### 9 Components to Update

AppShell, HeroBanner, PageFooter, HookCard, HookCatalog, FilterChip, FilterChipRow, FilterBar, FilterSystem

### FOUC Prevention

```html
<script>(function(){try{if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()</script>
```

### Focus Ring Adaptation

- Light: `ring-offset-white`
- Dark: `dark:ring-offset-black`

## Files to Reference

- `product-plan/sections/dark-and-light-mode/` — README, tests, components, hooks, types, sample data, screenshots (light + dark)

## Done When

- [ ] Tests written and passing
- [ ] FOUC prevention works (no flash on dark mode load)
- [ ] Light mode correct across all 9 components
- [ ] Dark mode correct across all 9 components
- [ ] Live switching on system preference change
- [ ] WCAG AA contrast in both modes
- [ ] Focus rings adapt per mode
- [ ] Responsive in both modes
