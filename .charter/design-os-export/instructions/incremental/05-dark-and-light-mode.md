# Milestone 5: Dark & Light Mode

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete (Foundation, Landing & Hero, Hook Catalog, Filter System)

## Goal

Implement the Dark & Light Mode system — a cross-cutting theme that adds light mode support to HookHub, with automatic system preference detection and FOUC prevention.

## Overview

HookHub was designed dark-first. This milestone adds light mode as the CSS default, with dark mode activating via Tailwind `dark:` utility variants when the `.dark` class is present on `<html>`. The system detects the user's OS color scheme via `prefers-color-scheme` and applies the matching theme automatically. There is no manual toggle in the MVP — theme follows system preference only. A blocking inline `<script>` in `<head>` prevents flash of unstyled content.

**Key Functionality:**
- Automatic theme detection via `prefers-color-scheme` media query
- Light-first CSS: light mode classes are defaults, dark mode uses `dark:` variants
- FOUC prevention: inline script in `<head>` sets `.dark` class before first paint
- Live theme switching when user changes system preference (no page reload)
- 9 components updated with dual-mode color tokens
- WCAG AA contrast ratios in both modes

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/dark-and-light-mode/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/dark-and-light-mode/components/`:

- `ThemePreview.tsx` — Demo-only toggle component for reviewing themes (NOT for production use)
- `index.ts` — Barrel export

Copy the hook from `product-plan/sections/dark-and-light-mode/hooks/`:

- `useThemeDetection.ts` — React hook that detects system color scheme and syncs `.dark` class

### Theme Tokens

Update all 9 existing components with dual-mode classes:

**Light mode palette (CSS defaults):**
- Page background: `bg-white` / `bg-zinc-50`
- Headings: `text-zinc-900`
- Body text: `text-zinc-700`
- Muted text: `text-zinc-600`
- Card background: `bg-white`
- Card border: `border-zinc-200`
- Category badges: `bg-sky-50 text-sky-700`
- Event badges: `bg-indigo-50 text-indigo-700`
- Primary accent: `text-sky-600`
- Footer border: `border-zinc-300`

**Dark mode palette (`dark:` variants):**
- Page background: `dark:bg-black`
- Headings: `dark:text-zinc-100`
- Body text: `dark:text-zinc-400`
- Muted text: `dark:text-zinc-500`
- Card background: `dark:bg-zinc-950`
- Card border: `dark:border-zinc-800`
- Category badges: `dark:bg-sky-500/15 dark:text-sky-400`
- Event badges: `dark:bg-indigo-500/15 dark:text-indigo-400`
- Primary accent: `dark:text-sky-400`
- Footer border: `dark:border-zinc-800`

### Components to Update

All 9 components need `dark:` variants added:
1. `AppShell` — Page background, text defaults
2. `HeroBanner` — Headline, subtitle, glow, chevron colors
3. `PageFooter` — Border, text, link colors
4. `HookCard` — Card background, border, text, badge colors
5. `HookCatalog` — Grid background, empty state colors
6. `FilterChip` — Chip background, border, text, selected state colors
7. `FilterChipRow` — Row container styling
8. `FilterBar` — Result count text color
9. `FilterSystem` — Wrapper and empty state colors

### FOUC Prevention

Add this inline script to `<head>` in your HTML entry point, BEFORE any stylesheets:

```html
<script>(function(){try{if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()</script>
```

### Tailwind Dark Mode Configuration

Add the Tailwind v4 dark mode custom variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Focus Ring Adaptation

Update focus rings to adapt per mode:
- Light: `ring-offset-white`
- Dark: `dark:ring-offset-black`

## Files to Reference

- `product-plan/sections/dark-and-light-mode/README.md` — Feature overview and design intent
- `product-plan/sections/dark-and-light-mode/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/dark-and-light-mode/components/` — Theme preview component
- `product-plan/sections/dark-and-light-mode/hooks/` — useThemeDetection hook
- `product-plan/sections/dark-and-light-mode/types.ts` — TypeScript interfaces (Theme, ThemeTokens)
- `product-plan/sections/dark-and-light-mode/sample-data.json` — Token mappings
- `product-plan/sections/dark-and-light-mode/screenshot-light.png` — Light mode visual reference
- `product-plan/sections/dark-and-light-mode/screenshot-dark.png` — Dark mode visual reference

## Expected User Flows

### Flow 1: Light Mode Visit

1. User with system set to light mode visits HookHub
2. Page renders immediately in light mode — white backgrounds, dark text, light badges
3. No flash of dark content before light mode applies
4. **Outcome:** Clean light mode experience from first paint

### Flow 2: Dark Mode Visit

1. User with system set to dark mode visits HookHub
2. FOUC script sets `.dark` class before first paint
3. Page renders in dark mode — black background, zinc-950 cards, sky/indigo badges
4. **Outcome:** Dark mode applied without flicker

### Flow 3: Live Theme Switch

1. User has HookHub open in light mode
2. User changes their OS color scheme preference to dark
3. `matchMedia` listener fires, `.dark` class is added to `<html>`
4. All components transition to dark mode without page reload
5. **Outcome:** Theme follows system preference in real time

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] FOUC prevention script in `<head>` works (no flash on dark mode load)
- [ ] Light mode renders correctly across all 9 components
- [ ] Dark mode renders correctly across all 9 components
- [ ] System preference changes trigger live theme switching
- [ ] All text meets WCAG AA contrast ratios in both modes (4.5:1 normal, 3:1 large)
- [ ] Focus ring offsets adapt per mode
- [ ] Hover and transition states work in both modes
- [ ] `ThemePreview` component available for demo/review (not wired into production)
- [ ] Responsive on mobile, tablet, desktop in both modes
