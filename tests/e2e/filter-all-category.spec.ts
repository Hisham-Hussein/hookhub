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
