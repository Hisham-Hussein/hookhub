# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
