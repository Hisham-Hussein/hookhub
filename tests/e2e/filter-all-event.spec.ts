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
