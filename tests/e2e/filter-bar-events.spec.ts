import { test, expect } from '@playwright/test'

test.describe('FilterBar — Lifecycle Event Filtering (US-015)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('chip rendering', () => {
    test('renders 6 event chips (All + 5 events)', async ({ page }) => {
      const chips = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]')
      await expect(chips).toHaveCount(6)
    })

    test('first event chip is "All" and is selected by default', async ({ page }) => {
      const allChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').first()
      await expect(allChip).toHaveText('All')
      await expect(allChip).toHaveAttribute('aria-checked', 'true')
    })

    test('displays all 5 event labels', async ({ page }) => {
      const events = ['PreToolUse', 'PostToolUse', 'UserPromptSubmit', 'Notification', 'Stop']
      for (const evt of events) {
        const chip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: evt })
        await expect(chip).toBeVisible()
      }
    })

    test('has "Event:" label before event chip row', async ({ page }) => {
      await expect(page.getByText('Event:')).toBeVisible()
    })

    test('event chip row appears below category chip row', async ({ page }) => {
      const categoryRow = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const eventRow = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')

      const categoryBox = await categoryRow.boundingBox()
      const eventBox = await eventRow.boundingBox()

      expect(categoryBox).not.toBeNull()
      expect(eventBox).not.toBeNull()
      expect(eventBox!.y).toBeGreaterThan(categoryBox!.y)
    })
  })

  test.describe('filtering behavior', () => {
    test('clicking PostToolUse chip filters grid to matching hooks', async ({ page }) => {
      const postChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PostToolUse' })
      await postChip.click()

      const cards = page.locator('article')
      await expect(cards).toHaveCount(6)
      await expect(postChip).toHaveAttribute('aria-checked', 'true')
    })

    test('result count updates for event filter', async ({ page }) => {
      const status = page.locator('[role="status"]')
      await expect(status).toContainText('Showing 13 hooks')

      const preChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PreToolUse' })
      await preChip.click()
      await expect(status).toContainText('Showing 3 hooks')
    })

    test('clicking All event chip resets event filter', async ({ page }) => {
      const postChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PostToolUse' })
      const allChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'All' })

      await postChip.click()
      await expect(page.locator('article')).toHaveCount(6)

      await allChip.click()
      await expect(page.locator('article')).toHaveCount(13)
      await expect(allChip).toHaveAttribute('aria-checked', 'true')
    })
  })

  test.describe('AND-intersection with category filter', () => {
    test('Safety + PreToolUse shows intersection only (2 hooks)', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      const preToolChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PreToolUse' })

      await safetyChip.click()
      await preToolChip.click()

      await expect(page.locator('article')).toHaveCount(2)
      await expect(page.locator('[role="status"]')).toContainText('Showing 2 hooks')
    })

    test('Formatting + PostToolUse shows intersection (2 hooks)', async ({ page }) => {
      const fmtChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Formatting' })
      const postChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PostToolUse' })

      await fmtChip.click()
      await postChip.click()

      await expect(page.locator('article')).toHaveCount(2)
    })

    test('deselecting event restores category-only filter', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      const preToolChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PreToolUse' })
      const allEventChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'All' })

      await safetyChip.click()
      await preToolChip.click()
      await expect(page.locator('article')).toHaveCount(2)

      await allEventChip.click()
      await expect(page.locator('article')).toHaveCount(3)
    })

    test('deselecting category restores event-only filter', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      const preToolChip = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]').filter({ hasText: 'PreToolUse' })
      const allCatChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'All' })

      await safetyChip.click()
      await preToolChip.click()
      await expect(page.locator('article')).toHaveCount(2)

      await allCatChip.click()
      await expect(page.locator('article')).toHaveCount(3)
    })
  })

  test.describe('keyboard navigation', () => {
    test('ArrowRight navigates event chips', async ({ page }) => {
      const eventChips = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]')

      await eventChips.first().focus()
      await page.keyboard.press('ArrowRight')

      const preChip = eventChips.filter({ hasText: 'PreToolUse' })
      await expect(preChip).toHaveAttribute('aria-checked', 'true')
      await expect(preChip).toBeFocused()
    })

    test('keyboard event selection filters the grid', async ({ page }) => {
      const eventChips = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"] button[role="radio"]')

      await eventChips.first().focus()
      await page.keyboard.press('ArrowRight')

      await expect(page.locator('article')).toHaveCount(3)
      await expect(page.locator('[role="status"]')).toContainText('Showing 3 hooks')
    })
  })

  test.describe('accessibility', () => {
    test('event chip row has radiogroup role with descriptive label', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')
      await expect(radioGroup).toBeAttached()
    })

    test('only one event chip can be active at a time', async ({ page }) => {
      const eventGroup = page.locator('[role="radiogroup"][aria-label="Filter by lifecycle event"]')

      const preChip = eventGroup.locator('button[role="radio"]').filter({ hasText: 'PreToolUse' })
      await preChip.click()
      await expect(preChip).toHaveAttribute('aria-checked', 'true')

      const postChip = eventGroup.locator('button[role="radio"]').filter({ hasText: 'PostToolUse' })
      await postChip.click()
      await expect(postChip).toHaveAttribute('aria-checked', 'true')
      await expect(preChip).toHaveAttribute('aria-checked', 'false')
    })
  })
})
