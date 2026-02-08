# Filter "All" Chip Tests Implementation Plan (US-014 + US-016)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Formalize the existing "All" chip reset behavior in FilterBar with dedicated unit tests (RTL) and E2E tests (Playwright) for both the category dimension (US-014) and lifecycle event dimension (US-016).

**Architecture:** These are test-only stories — the FilterBar component already implements "All" chips correctly (prepends `{ value: null, label: 'All' }` to both option arrays; `filterHooks()` treats `null` as "no constraint"). The work adds React Testing Library unit tests that render FilterBar in jsdom and Playwright E2E tests covering the full reset flow. No production code changes are expected.

**Tech Stack:** Vitest + React Testing Library (unit), Playwright (E2E), Next.js 16 / React 19 / TypeScript 5

---

## Pre-requisites

Before Task 1, install React Testing Library:

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

This is needed because the existing unit tests don't render JSX — they only check file contents and exports. The new unit tests render the FilterBar component in jsdom.

---

## Task 1: Install RTL and verify setup

**Files:**
- Modify: `package.json` (dependency addition only)

**Step 1: Install testing dependencies**

Run: `pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`

**Step 2: Verify installation succeeds**

Run: `pnpm test`
Expected: All existing tests still pass (no regressions from adding devDependencies)

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
chore(US-014): add React Testing Library dependencies

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Write failing unit tests for "All" category chip (US-014)

**Files:**
- Create: `app/components/__tests__/FilterBar.all-category.test.tsx`

**Step 1: Write the failing test suite**

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../FilterBar'
import type { Hook } from '@/lib/domain/types'

const makeHook = (overrides: Partial<Hook> = {}): Hook => ({
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/test/hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'A test hook.',
  starsCount: 100,
  lastUpdated: '2026-01-01',
  ...overrides,
})

const hooks: Hook[] = [
  makeHook({ name: 'safe-rm', purposeCategory: 'Safety', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'auto-format', purposeCategory: 'Formatting', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'secret-scan', purposeCategory: 'Security', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'test-runner', purposeCategory: 'Testing', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'prompt-guard', purposeCategory: 'Safety', lifecycleEvent: 'UserPromptSubmit' }),
]

describe('FilterBar — "All" category chip (US-014)', () => {
  const onFilterChange = vi.fn()

  it('renders "All" as the first chip in the category radiogroup', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const chips = within(categoryGroup).getAllByRole('radio')
    expect(chips[0]).toHaveTextContent('All')
  })

  it('"All" is selected by default (aria-checked="true")', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking a category then clicking "All" calls onFilterChange with all hooks', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })

    // Select Safety
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Click All to reset
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    await user.click(allChip)

    // Last call should contain all 5 hooks
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(5)
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('"All" chip uses selected styling when active (visually distinct)', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const allChip = within(categoryGroup).getAllByRole('radio')[0]
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })

    // All is selected — should have selected styles, not inactive
    expect(allChip.className).toContain('bg-sky-100')
    expect(safetyChip.className).not.toContain('bg-sky-100')
  })

  it('resetting category does not affect the active event filter', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select PreToolUse event
    const preToolChip = within(eventGroup).getByRole('radio', { name: 'PreToolUse' })
    await user.click(preToolChip)

    // Select Safety category
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Reset category to All
    const allCatChip = within(categoryGroup).getAllByRole('radio')[0]
    await user.click(allCatChip)

    // Event filter should still be PreToolUse — last call should have PreToolUse hooks only
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    const filteredHooks = lastCall[0] as Hook[]
    expect(filteredHooks.every((h: Hook) => h.lifecycleEvent === 'PreToolUse')).toBe(true)

    // Event chip should still be checked
    expect(preToolChip).toHaveAttribute('aria-checked', 'true')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm test app/components/__tests__/FilterBar.all-category.test.tsx`
Expected: FAIL — tests should fail because jsdom + RTL are being used for the first time in this file. Possible issues: missing `@testing-library/jest-dom` matchers. If `toHaveTextContent` or `toHaveAttribute` are not recognized, we handle that in Task 3.

---

## Task 3: Make "All" category chip unit tests pass (US-014)

**Files:**
- Possibly modify: `app/components/__tests__/FilterBar.all-category.test.tsx` (fix any setup issues)
- Possibly create: `vitest.setup.ts` (if jest-dom matchers need global registration)

**Step 1: Fix any test setup issues from Step 2**

If `toHaveTextContent` is undefined, add a vitest setup file:

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

And update `vitest.config.ts` to include it:

```ts
test: {
  // ...existing config
  setupFiles: ['./vitest.setup.ts'],
}
```

**Step 2: Run tests to verify they pass**

Run: `pnpm test app/components/__tests__/FilterBar.all-category.test.tsx`
Expected: PASS — all 5 tests green

**Step 3: Run full test suite to check for regressions**

Run: `pnpm test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add app/components/__tests__/FilterBar.all-category.test.tsx vitest.config.ts vitest.setup.ts
git commit -m "$(cat <<'EOF'
test(US-014): add unit tests for "All" category chip behavior

Covers all 5 acceptance criteria:
- "All" chip is first in category radiogroup
- "All" is selected by default (aria-checked)
- Clicking "All" resets category filter and shows all hooks
- "All" chip has visually distinct selected styling
- Resetting category preserves active event filter

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Write failing unit tests for "All" event chip (US-016)

**Files:**
- Create: `app/components/__tests__/FilterBar.all-event.test.tsx`

**Step 1: Write the failing test suite**

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../FilterBar'
import type { Hook } from '@/lib/domain/types'

const makeHook = (overrides: Partial<Hook> = {}): Hook => ({
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/test/hook',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
  description: 'A test hook.',
  starsCount: 100,
  lastUpdated: '2026-01-01',
  ...overrides,
})

const hooks: Hook[] = [
  makeHook({ name: 'safe-rm', purposeCategory: 'Safety', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'auto-format', purposeCategory: 'Formatting', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'secret-scan', purposeCategory: 'Security', lifecycleEvent: 'PreToolUse' }),
  makeHook({ name: 'test-runner', purposeCategory: 'Testing', lifecycleEvent: 'PostToolUse' }),
  makeHook({ name: 'prompt-guard', purposeCategory: 'Safety', lifecycleEvent: 'UserPromptSubmit' }),
]

describe('FilterBar — "All" event chip (US-016)', () => {
  const onFilterChange = vi.fn()

  it('renders "All" as the first chip in the event radiogroup', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })
    const chips = within(eventGroup).getAllByRole('radio')
    expect(chips[0]).toHaveTextContent('All')
  })

  it('"All" is selected by default (aria-checked="true")', () => {
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })
    const allChip = within(eventGroup).getAllByRole('radio')[0]
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking an event then clicking "All" calls onFilterChange with all hooks', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select PostToolUse
    const postChip = within(eventGroup).getByRole('radio', { name: 'PostToolUse' })
    await user.click(postChip)

    // Click All to reset
    const allChip = within(eventGroup).getAllByRole('radio')[0]
    await user.click(allChip)

    // Last call should contain all 5 hooks
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    expect(lastCall[0]).toHaveLength(5)
    expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  it('resetting event does not affect the active category filter', async () => {
    const user = userEvent.setup()
    render(<FilterBar hooks={hooks} onFilterChange={onFilterChange} />)
    const categoryGroup = screen.getByRole('radiogroup', { name: 'Filter by purpose category' })
    const eventGroup = screen.getByRole('radiogroup', { name: 'Filter by lifecycle event' })

    // Select Safety category
    const safetyChip = within(categoryGroup).getByRole('radio', { name: 'Safety' })
    await user.click(safetyChip)

    // Select PostToolUse event
    const postChip = within(eventGroup).getByRole('radio', { name: 'PostToolUse' })
    await user.click(postChip)

    // Reset event to All
    const allEventChip = within(eventGroup).getAllByRole('radio')[0]
    await user.click(allEventChip)

    // Category filter should still be Safety — last call should have Safety hooks only
    const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1]
    const filteredHooks = lastCall[0] as Hook[]
    expect(filteredHooks.every((h: Hook) => h.purposeCategory === 'Safety')).toBe(true)

    // Category chip should still be checked
    expect(safetyChip).toHaveAttribute('aria-checked', 'true')
  })
})
```

**Step 2: Run test to verify it fails (or passes if setup from Task 3 carries over)**

Run: `pnpm test app/components/__tests__/FilterBar.all-event.test.tsx`
Expected: PASS (jsdom setup already in place from Task 3)

**Step 3: Run full test suite**

Run: `pnpm test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add app/components/__tests__/FilterBar.all-event.test.tsx
git commit -m "$(cat <<'EOF'
test(US-016): add unit tests for "All" event chip behavior

Covers all 4 acceptance criteria:
- "All" chip is first in event radiogroup
- "All" is selected by default (aria-checked)
- Clicking "All" resets event filter and shows all hooks
- Resetting event preserves active category filter

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Write E2E test for "All" category reset flow (US-014)

**Files:**
- Create: `tests/e2e/filter-all-category.spec.ts`

**Step 1: Write the E2E test**

```ts
import { test, expect } from '@playwright/test'

test.describe('FilterBar — "All" Category Reset (US-014)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('default state shows "All" selected with full hook count', async ({ page }) => {
    const categoryGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
    const allChip = categoryGroup.locator('button[role="radio"]').first()

    await expect(allChip).toHaveText('All')
    await expect(allChip).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('[role="status"]')).toContainText('Showing 13 hooks')
  })

  test('selecting a category reduces visible hooks, clicking "All" restores full count', async ({ page }) => {
    const categoryGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
    const safetyChip = categoryGroup.locator('button[role="radio"]').filter({ hasText: 'Safety' })
    const allChip = categoryGroup.locator('button[role="radio"]').first()

    // Select Safety — reduces to 2
    await safetyChip.click()
    await expect(page.locator('article')).toHaveCount(2)
    await expect(page.locator('[role="status"]')).toContainText('Showing 2 hooks')

    // Click All — restores to 13
    await allChip.click()
    await expect(page.locator('article')).toHaveCount(13)
    await expect(page.locator('[role="status"]')).toContainText('Showing 13 hooks')
    await expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  test('event filter remains active when category is reset to "All"', async ({ page }) => {
    const categoryGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
    const eventGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')

    // Select Safety category + PreToolUse event
    await categoryGroup.locator('button[role="radio"]').filter({ hasText: 'Safety' }).click()
    await eventGroup.locator('button[role="radio"]').filter({ hasText: 'PreToolUse' }).click()
    await expect(page.locator('article')).toHaveCount(1)

    // Reset category to All — event filter should remain
    await categoryGroup.locator('button[role="radio"]').first().click()
    await expect(page.locator('article')).toHaveCount(3) // All PreToolUse hooks

    // Event chip should still be checked
    const preChip = eventGroup.locator('button[role="radio"]').filter({ hasText: 'PreToolUse' })
    await expect(preChip).toHaveAttribute('aria-checked', 'true')
  })
})
```

**Step 2: Run E2E test**

Run: `npx playwright test tests/e2e/filter-all-category.spec.ts`
Expected: PASS — behavior already works, tests formalize it

**Step 3: Commit**

```bash
git add tests/e2e/filter-all-category.spec.ts
git commit -m "$(cat <<'EOF'
test(US-014): add E2E tests for "All" category reset flow

Covers the full user journey:
- Default state shows "All" selected with all 13 hooks
- Selecting a category reduces visible hooks
- Clicking "All" restores full count
- Event filter remains active when category is reset

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Write E2E test for "All" event reset flow (US-016)

**Files:**
- Create: `tests/e2e/filter-all-event.spec.ts`

**Step 1: Write the E2E test**

```ts
import { test, expect } from '@playwright/test'

test.describe('FilterBar — "All" Event Reset (US-016)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('default state shows "All" selected in event row with full hook count', async ({ page }) => {
    const eventGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')
    const allChip = eventGroup.locator('button[role="radio"]').first()

    await expect(allChip).toHaveText('All')
    await expect(allChip).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('[role="status"]')).toContainText('Showing 13 hooks')
  })

  test('selecting an event reduces visible hooks, clicking "All" restores full count', async ({ page }) => {
    const eventGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')
    const postChip = eventGroup.locator('button[role="radio"]').filter({ hasText: 'PostToolUse' })
    const allChip = eventGroup.locator('button[role="radio"]').first()

    // Select PostToolUse — reduces to 6
    await postChip.click()
    await expect(page.locator('article')).toHaveCount(6)
    await expect(page.locator('[role="status"]')).toContainText('Showing 6 hooks')

    // Click All — restores to 13
    await allChip.click()
    await expect(page.locator('article')).toHaveCount(13)
    await expect(page.locator('[role="status"]')).toContainText('Showing 13 hooks')
    await expect(allChip).toHaveAttribute('aria-checked', 'true')
  })

  test('category filter remains active when event is reset to "All"', async ({ page }) => {
    const categoryGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
    const eventGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')

    // Select Safety category + PreToolUse event
    await categoryGroup.locator('button[role="radio"]').filter({ hasText: 'Safety' }).click()
    await eventGroup.locator('button[role="radio"]').filter({ hasText: 'PreToolUse' }).click()
    await expect(page.locator('article')).toHaveCount(1)

    // Reset event to All — category filter should remain
    await eventGroup.locator('button[role="radio"]').first().click()
    await expect(page.locator('article')).toHaveCount(2) // All Safety hooks

    // Category chip should still be checked
    const safetyChip = categoryGroup.locator('button[role="radio"]').filter({ hasText: 'Safety' })
    await expect(safetyChip).toHaveAttribute('aria-checked', 'true')
  })
})
```

**Step 2: Run E2E test**

Run: `npx playwright test tests/e2e/filter-all-event.spec.ts`
Expected: PASS — behavior already works, tests formalize it

**Step 3: Commit**

```bash
git add tests/e2e/filter-all-event.spec.ts
git commit -m "$(cat <<'EOF'
test(US-016): add E2E tests for "All" event reset flow

Covers the full user journey:
- Default state shows "All" selected with all 13 hooks
- Selecting an event reduces visible hooks
- Clicking "All" restores full count
- Category filter remains active when event is reset

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Run full test suite and verify everything green

**Files:**
- No new files

**Step 1: Run all unit tests**

Run: `pnpm test`
Expected: All tests pass (existing + 9 new unit tests)

**Step 2: Run all E2E tests**

Run: `npx playwright test`
Expected: All tests pass (existing + 6 new E2E tests)

**Step 3: Run linter**

Run: `pnpm lint`
Expected: No errors

**Step 4: No commit needed — this is a verification step**

---

## Acceptance Criteria Traceability

### US-014: "All" option resets category filter

| AC | Unit Test | E2E Test |
|----|-----------|----------|
| "All" chip appears first in category row | `renders "All" as the first chip` | `default state shows "All" selected` |
| "All" selected by default | `"All" is selected by default` | `default state shows "All" selected` |
| Clicking "All" deselects any active category | `clicking a category then clicking "All"` | `selecting a category...clicking "All" restores` |
| "All" chip visually distinct when active | `"All" chip uses selected styling` | — (visual, covered by unit) |
| Reset category does not affect event filter | `resetting category does not affect event` | `event filter remains active when category reset` |

### US-016: "All" option resets lifecycle event filter

| AC | Unit Test | E2E Test |
|----|-----------|----------|
| "All" chip appears first in event row | `renders "All" as the first chip` | `default state shows "All" selected` |
| "All" selected by default | `"All" is selected by default` | `default state shows "All" selected` |
| Clicking "All" deselects any active event | `clicking an event then clicking "All"` | `selecting an event...clicking "All" restores` |
| Reset event does not affect category filter | `resetting event does not affect category` | `category filter remains active when event reset` |

---

## Data Reference

Hook counts from `data/hooks.json` (13 total) used in E2E assertions:

| Filter | Count | Hooks |
|--------|-------|-------|
| All (unfiltered) | 13 | all |
| Safety | 2 | claude-code-hooks-mastery, claude-code-hook-templates |
| PreToolUse | 3 | claude-code-hooks-mastery, tdd-guard, claudekit |
| PostToolUse | 6 | britfix, claude-hooks, claude-code-typescript-hooks, claude-hook-comms, multi-agent-observability, claude-hooks-ts |
| Safety + PreToolUse | 1 | claude-code-hooks-mastery |
