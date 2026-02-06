# Test Instructions: Filter System

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Filter System is HookHub's most interaction-heavy section. Test dual-dimension AND-intersection filtering, radio group keyboard navigation, result count announcements, empty states, and URL sync.

---

## User Flow Tests

### Flow 1: Single Dimension Filter

**Scenario:** Developer filters by one dimension only

#### Category Filter

**Setup:**
- Render FilterSystem with 18 hooks, category options, and event options

**Steps:**
1. Click the "Safety" chip in the category row

**Expected Results:**
- [ ] "Safety" chip shows selected styling (bg-sky-100 or bg-sky-500/20 in dark)
- [ ] Grid shows only Safety hooks (3 hooks: safe-rm, prompt-guard, branch-guard)
- [ ] Result count shows "Showing 3 hooks"
- [ ] "All" chip in category row is deselected

#### Event Filter

**Steps:**
1. Click "PostToolUse" in the event row

**Expected Results:**
- [ ] "PostToolUse" chip shows selected styling (indigo)
- [ ] Grid shows 7 hooks matching PostToolUse
- [ ] Result count: "Showing 7 hooks"

### Flow 2: AND-Intersection Filter

**Scenario:** Developer selects both dimensions

**Setup:**
- Render with 18 hooks

**Steps:**
1. Select "Safety" category
2. Select "PreToolUse" event

**Expected Results:**
- [ ] Both chips highlighted in their respective rows
- [ ] Grid shows 2 hooks (safe-rm, branch-guard) — matching BOTH Safety AND PreToolUse
- [ ] Result count: "Showing 2 hooks"

### Flow 3: Zero Results — Clear Filters

**Scenario:** AND-intersection produces zero results

**Steps:**
1. Select "Safety" category
2. Select "PostToolUse" event

**Expected Results:**
- [ ] Grid area shows empty state
- [ ] Heading "No hooks match these filters" is visible
- [ ] Message "Try changing one of the filters or clear both to see all hooks." is visible
- [ ] "Clear all filters" button is visible and clickable
- [ ] Clicking "Clear all filters" resets both dimensions to "All"
- [ ] Full catalog returns (18 hooks)
- [ ] Result count: "Showing 18 hooks"

### Flow 4: Reset Single Dimension

**Steps:**
1. Select "Safety" category (3 hooks)
2. Select "PreToolUse" event (now 2 hooks, AND)
3. Click "All" in category row

**Expected Results:**
- [ ] Category resets to "All"
- [ ] Event stays on "PreToolUse"
- [ ] Grid shows all PreToolUse hooks (4 hooks)
- [ ] Result count: "Showing 4 hooks"

---

## Keyboard Navigation Tests

### Roving Tabindex in Category Row

**Setup:**
- Focus on category chip row

**Steps:**
1. Tab into row → focuses selected chip (or first if "All")
2. Press Arrow Right → next chip gets focus AND is selected
3. Press Arrow Right again → next chip
4. Press Home → first chip ("All") gets focus and is selected
5. Press End → last chip ("Custom") gets focus and is selected
6. Press Tab → exits row, enters event row

**Expected Results:**
- [ ] Only one chip has tabIndex=0 at any time
- [ ] Arrow Right wraps from last to first
- [ ] Arrow Left wraps from first to last
- [ ] Space/Enter confirms selection
- [ ] Focus ring is visible on focused chip

---

## Empty State Tests

### Filter Empty State

**Scenario:** AND-intersection produces zero results

**Setup:**
- 18 hooks loaded, select Safety + PostToolUse

**Expected Results:**
- [ ] Search icon SVG displayed with aria-hidden="true"
- [ ] "No hooks match these filters" heading visible
- [ ] "Try changing one of the filters or clear both to see all hooks." message visible
- [ ] "Clear all filters" button with X icon visible
- [ ] Button is keyboard focusable with visible focus ring
- [ ] Clicking button resets both filters and shows all 18 hooks

### Catalog Empty State

**Scenario:** Manifest has zero hooks (empty array)

**Setup:**
- Render FilterSystem with `hooks: []`

**Expected Results:**
- [ ] Filter chips still render and are interactive
- [ ] Catalog shows "No hooks yet" empty state
- [ ] No crash or error

---

## Component Interaction Tests

### FilterChip

- [ ] Selected chip has `aria-checked="true"`
- [ ] Unselected chip has `aria-checked="false"`
- [ ] Has `role="radio"`
- [ ] Has `min-h-11` for 44px touch target
- [ ] `motion-safe:transition-all` for animation
- [ ] Focus ring: `focus-visible:ring-2 focus-visible:ring-sky-400/60`

### FilterChipRow

- [ ] Container has `role="radiogroup"` with descriptive `aria-label`
- [ ] Row label displayed before chips (e.g., "Category:")
- [ ] Chips scroll horizontally on mobile (`overflow-x-auto`)
- [ ] Chips wrap on tablet+ (`sm:flex-wrap`)

### FilterBar

- [ ] Result count has `role="status"` and `aria-live="polite"` and `aria-atomic="true"`
- [ ] Singular: "Showing 1 hook" (not "hooks")
- [ ] Plural: "Showing 3 hooks"

---

## Test Scenarios (from data.json)

Use these verified AND-intersection scenarios:

| Category | Event | Expected Count | Description |
|----------|-------|---------------|-------------|
| Safety | PreToolUse | 2 | safe-rm, branch-guard |
| Security | UserPromptSubmit | 1 | input-sanitizer |
| Formatting | PostToolUse | 2 | auto-prettier, eslint-autofix |
| Safety | PostToolUse | 0 | Empty state |
| Testing | Stop | 0 | Empty state |
| all | PostToolUse | 7 | Single dimension |

---

## Edge Cases

- [ ] Rapidly clicking multiple chips doesn't cause state corruption
- [ ] All 9 category options render (All + 8 categories)
- [ ] All 6 event options render (All + 5 events)
- [ ] Works in both light and dark mode
- [ ] Grid fade-in animation on filter change (motion-safe only)
- [ ] prefers-reduced-motion: no animations, state changes still instant

---

## Accessibility Checks

- [ ] Each chip row is a proper radiogroup
- [ ] Only one chip per row can be selected
- [ ] Result count is announced to screen readers on change
- [ ] "Clear all filters" button is keyboard accessible
- [ ] Tab order: category row → event row → grid content

---

## Sample Test Data

```typescript
const mockCategoryOptions = [
  { label: "All", value: "all", hookCount: 18 },
  { label: "Safety", value: "Safety", hookCount: 3 },
  { label: "Security", value: "Security", hookCount: 3 },
  // ... (see sample-data.json for full list)
]

const mockEventOptions = [
  { label: "All", value: "all", hookCount: 18 },
  { label: "PreToolUse", value: "PreToolUse", hookCount: 4 },
  { label: "PostToolUse", value: "PostToolUse", hookCount: 7 },
  // ... (see sample-data.json for full list)
]

const mockFilterEmptyState = {
  title: "No hooks match these filters",
  message: "Try changing one of the filters or clear both to see all hooks.",
  ctaLabel: "Clear all filters"
}
```
