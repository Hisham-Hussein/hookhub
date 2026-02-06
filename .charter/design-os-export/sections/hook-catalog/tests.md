# Test Instructions: Hook Catalog

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Hook Catalog displays hooks in a responsive card grid with rich metadata, accessibility labels, and a stretched-link click pattern. Test card rendering, accessibility, click behavior, star formatting, and empty state.

---

## User Flow Tests

### Flow 1: Browse and Access Hook Repository

**Scenario:** Developer browses the catalog and clicks through to a hook's GitHub page

#### Success Path

**Setup:**
- Render HookCatalog with 18 hooks and an empty state config
- Mock `onHookClick`

**Steps:**
1. Verify all 18 cards render
2. Click on the "secret-scanner" card

**Expected Results:**
- [ ] 18 list items rendered in the grid
- [ ] Grid has aria-label="18 hooks"
- [ ] Clicking calls `onHookClick` with "https://github.com/secops-hooks/secret-scanner"
- [ ] Card title is an `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"`

#### With onHookClick Handler

**Setup:**
- Render with `onHookClick` handler that prevents default

**Steps:**
1. Click card title link

**Expected Results:**
- [ ] `e.preventDefault()` is called
- [ ] `onHookClick` receives the correct URL

### Flow 2: Empty Catalog

**Scenario:** The manifest has zero hooks

**Setup:**
- Render HookCatalog with `hooks: []` and emptyState: `{ title: "No hooks yet", message: "Check back soon.", icon: "inbox" }`

**Expected Results:**
- [ ] No grid is rendered
- [ ] Empty state section is visible
- [ ] Heading "No hooks yet" is displayed
- [ ] Message "Check back soon." is displayed
- [ ] Empty state icon (inbox SVG) is present

---

## Component Interaction Tests

### HookCard

**Renders all metadata:**
- [ ] Hook name appears as h3 inside an `<a>` tag
- [ ] Category badge shows purpose (e.g., "Safety") with sky styling
- [ ] Event badge shows lifecycle event (e.g., "PreToolUse") with indigo styling + italic
- [ ] Description is present and clamped to 2 lines (line-clamp-2)
- [ ] Star count is visible
- [ ] "GitHub" text with external link arrow icon is visible

**Star count formatting:**
- [ ] 0 → "0"
- [ ] 89 → "89"
- [ ] 178 → "178"
- [ ] 415 → "415"
- [ ] 892 → "892"
- [ ] 1000 → "1k"
- [ ] 1034 → "1k" (1.034 rounds to 1.0k displayed as "1k")
- [ ] 1247 → "1.2k"
- [ ] 1502 → "1.5k"
- [ ] 2103 → "2.1k"
- [ ] 3451 → "3.5k"

**Accessibility:**
- [ ] Star count has aria-label like "1,247 GitHub stars"
- [ ] Card has focus-within ring styling
- [ ] Badges have `relative z-10` (clickable above stretched link)
- [ ] Card container is an `<article>` element

### HookCatalog Grid

- [ ] Grid uses `<ul>` with `<li>` items
- [ ] Grid is responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

## Edge Cases

- [ ] Very long hook name (e.g., "input-sanitizer-and-prompt-validation-middleware") truncates in title
- [ ] Very long description gracefully handles 2-line clamp
- [ ] Hook with 0 stars displays "0" with aria-label "0 GitHub stars"
- [ ] Single hook in catalog renders correctly (no layout issues)
- [ ] Works in both light and dark mode

---

## Accessibility Checks

- [ ] Full card is one tab stop (via stretched `::after` on the link)
- [ ] Focus ring visible on card when focused
- [ ] Star count read by screen readers with full number
- [ ] Empty state icon has aria-hidden="true"

---

## Sample Test Data

```typescript
const mockHook = {
  name: "safe-rm",
  githubRepoUrl: "https://github.com/devtools-org/safe-rm-hook",
  purposeCategory: "Safety" as const,
  lifecycleEvent: "PreToolUse" as const,
  description: "Prevents accidental deletion of critical system files and project directories.",
  starsCount: 1247,
  lastUpdated: "2026-01-28"
}

const mockZeroStarHook = {
  name: "snapshot-test-generator",
  githubRepoUrl: "https://github.com/tdd-hooks/snapshot-test-generator",
  purposeCategory: "Testing" as const,
  lifecycleEvent: "PostToolUse" as const,
  description: "Generates snapshot tests for React components.",
  starsCount: 0,
  lastUpdated: "2026-01-31"
}

const mockEmptyState = {
  title: "No hooks yet",
  message: "The catalog is empty. Check back soon.",
  icon: "inbox"
}
```
