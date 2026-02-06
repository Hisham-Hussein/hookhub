# Test Instructions: Landing & Hero

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Landing & Hero section is the first thing users see. Test that it communicates the site's purpose, renders hooks correctly, and enables basic filtering.

---

## User Flow Tests

### Flow 1: Purpose Communication

**Scenario:** Developer arrives at the homepage and understands HookHub's purpose

#### Success Path

**Setup:**
- Render the LandingAndHero component with hero content and hook data

**Steps:**
1. Page loads
2. Check for hero content visibility

**Expected Results:**
- [ ] Heading "Discover Claude Code Hooks" is visible as an h1
- [ ] Subtitle text is visible below the heading
- [ ] Animated downward chevron is present (aria-hidden="true")
- [ ] Skip link "Skip to main content" exists as first focusable element

### Flow 2: Browse and Click Through to GitHub

**Scenario:** Developer clicks a hook card to view its GitHub repository

#### Success Path

**Setup:**
- Render with sample hook data (at least 3 hooks)
- Mock `onHookClick` callback

**Steps:**
1. User sees hook cards in the grid
2. User clicks on a hook card

**Expected Results:**
- [ ] Hook card displays hook name as heading (h3)
- [ ] Category badge shows purpose (e.g., "Safety")
- [ ] Event badge shows lifecycle event (e.g., "PreToolUse")
- [ ] Description is visible (clamped to 2 lines)
- [ ] Star count is formatted: "1.2k" for 1247, "178" for 178
- [ ] "View on GitHub →" text is visible
- [ ] Clicking card calls `onHookClick` with the correct `githubRepoUrl`

### Flow 3: Quick Category Filter

**Scenario:** Developer filters by purpose category

#### Success Path

**Setup:**
- Render with 10 hooks across multiple categories
- Mock `onFilterByCategory`

**Steps:**
1. Click the "Safety" chip in the category row

**Expected Results:**
- [ ] `onFilterByCategory` called with `"Safety"`
- [ ] "Safety" chip shows active styling (aria-pressed="true")

#### Reset Path

**Steps:**
1. Click "All" chip in category row

**Expected Results:**
- [ ] `onFilterByCategory` called with `null`
- [ ] "All" chip shows active styling

---

## Empty State Tests

### Catalog Empty State

**Scenario:** Manifest has zero hooks

**Setup:**
- Render with empty hooks array `[]`

**Expected Results:**
- [ ] No hook cards are rendered
- [ ] Grid area is empty (no crash or error)

---

## Component Interaction Tests

### HeroBanner

**Renders correctly:**
- [ ] h1 has id="hero-heading"
- [ ] Section has aria-labelledby="hero-heading"
- [ ] Subtitle renders in a `<p>` tag

### HookCard

**Star formatting:**
- [ ] 0 → "0"
- [ ] 178 → "178"
- [ ] 1000 → "1k"
- [ ] 1247 → "1.2k"
- [ ] 2103 → "2.1k"
- [ ] 3451 → "3.5k"

---

## Edge Cases

- [ ] Hook with very long name truncates or wraps gracefully
- [ ] Hook with 0 stars shows "0" (not hidden)
- [ ] Grid responsive: 1 column on mobile, 2 on tablet, 3-4 on desktop
- [ ] Works in both light and dark mode

---

## Accessibility Checks

- [ ] Skip link is first focusable element
- [ ] Skip link targets "#main-content"
- [ ] Hero section has proper aria-labelledby
- [ ] Cards are keyboard accessible (role="link" or actual anchor)
- [ ] Filter chips have aria-pressed attribute

---

## Sample Test Data

```typescript
const mockHeroContent = {
  headline: "Discover Claude Code Hooks",
  subtitle: "A curated directory of open-source hooks for Claude Code."
}

const mockHooks = [
  {
    name: "safe-rm",
    githubRepoUrl: "https://github.com/devtools-org/safe-rm-hook",
    purposeCategory: "Safety",
    lifecycleEvent: "PreToolUse",
    description: "Prevents accidental deletion of critical system files.",
    starsCount: 1247,
    lastUpdated: "2026-01-28"
  },
  {
    name: "auto-prettier",
    githubRepoUrl: "https://github.com/fmt-hooks/auto-prettier",
    purposeCategory: "Formatting",
    lifecycleEvent: "PostToolUse",
    description: "Runs Prettier on any file modified by Claude Code.",
    starsCount: 892,
    lastUpdated: "2026-01-15"
  },
  {
    name: "snapshot-test-generator",
    githubRepoUrl: "https://github.com/tdd-hooks/snapshot-test-generator",
    purposeCategory: "Testing",
    lifecycleEvent: "PostToolUse",
    description: "Generates snapshot tests for React components after edits.",
    starsCount: 0,
    lastUpdated: "2026-01-31"
  }
]
```
