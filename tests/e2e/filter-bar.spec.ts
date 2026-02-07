import { test, expect } from '@playwright/test'

test.describe('FilterBar — Category Filtering (US-013)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('chip rendering', () => {
    test('renders 9 category chips (All + 8 categories)', async ({ page }) => {
      const chips = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]')
      await expect(chips).toHaveCount(9)
    })

    test('first chip is "All" and is selected by default', async ({ page }) => {
      const allChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').first()
      await expect(allChip).toHaveText('All')
      await expect(allChip).toHaveAttribute('aria-checked', 'true')
    })

    test('displays all 8 category labels', async ({ page }) => {
      const categories = ['Safety', 'Automation', 'Notification', 'Formatting', 'Testing', 'Security', 'Logging', 'Custom']
      for (const cat of categories) {
        const chip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: cat })
        await expect(chip).toBeVisible()
      }
    })

    test('has "Category:" label before chip row', async ({ page }) => {
      await expect(page.getByText('Category:')).toBeVisible()
    })
  })

  test.describe('filtering behavior', () => {
    test('clicking Safety chip filters grid to show only Safety hooks', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      await safetyChip.click()

      // Safety hooks in sample data: safe-rm, prompt-guard, branch-guard
      const cards = page.locator('article')
      await expect(cards).toHaveCount(3)
      await expect(safetyChip).toHaveAttribute('aria-checked', 'true')
    })

    test('result count updates to reflect filtered results', async ({ page }) => {
      // Initially shows all 13 hooks
      const status = page.locator('[role="status"]')
      await expect(status).toContainText('Showing 13 hooks')

      // Filter to Safety
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      await safetyChip.click()
      await expect(status).toContainText('Showing 3 hooks')
    })

    test('clicking All chip resets to show all hooks', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })
      const allChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'All' })

      // Select Safety
      await safetyChip.click()
      await expect(page.locator('article')).toHaveCount(3)

      // Click All to deselect
      await allChip.click()
      await expect(page.locator('article')).toHaveCount(13)
      await expect(allChip).toHaveAttribute('aria-checked', 'true')
    })

    test('only one category chip can be active at a time', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')

      // Select Safety
      const safetyChip = radioGroup.locator('button[role="radio"]').filter({ hasText: 'Safety' })
      await safetyChip.click()
      await expect(safetyChip).toHaveAttribute('aria-checked', 'true')

      // Select Testing — Safety should deselect
      const testingChip = radioGroup.locator('button[role="radio"]').filter({ hasText: 'Testing' })
      await testingChip.click()
      await expect(testingChip).toHaveAttribute('aria-checked', 'true')
      await expect(safetyChip).toHaveAttribute('aria-checked', 'false')
    })

    test('filter updates grid immediately without page reload', async ({ page }) => {
      const safetyChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Safety' })

      // Wait for page to fully load
      await expect(page.locator('article')).toHaveCount(13)

      // Capture URL before filtering
      const urlBefore = page.url()

      await safetyChip.click()
      await expect(page.locator('article')).toHaveCount(3)

      // URL should remain the same — no full page navigation
      expect(page.url()).toBe(urlBefore)
    })
  })

  test.describe('accessibility', () => {
    test('category chip row has radiogroup role with descriptive label', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      await expect(radioGroup).toBeAttached()
    })

    test('result count has role="status" and aria-live="polite"', async ({ page }) => {
      const status = page.locator('[role="status"][aria-live="polite"]')
      await expect(status).toBeAttached()
      await expect(status).toHaveAttribute('aria-atomic', 'true')
    })

    test('singular form: "Showing 1 hook" for single result', async ({ page }) => {
      // Custom has only 1 hook (session-recap)
      const customChip = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"] button[role="radio"]').filter({ hasText: 'Custom' })
      await customChip.click()
      const status = page.locator('[role="status"]')
      await expect(status).toContainText('Showing 1 hook')
      // Must not say "hooks" (plural)
      await expect(status).not.toContainText('hooks')
    })
  })

  test.describe('keyboard navigation', () => {
    test('ArrowRight moves to next chip and selects it', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const chips = radioGroup.locator('button[role="radio"]')

      // Focus the All chip first
      await chips.first().focus()
      await expect(chips.first()).toHaveAttribute('aria-checked', 'true')

      // ArrowRight → Safety
      await page.keyboard.press('ArrowRight')
      const safetyChip = chips.filter({ hasText: 'Safety' })
      await expect(safetyChip).toHaveAttribute('aria-checked', 'true')
      await expect(safetyChip).toBeFocused()
    })

    test('ArrowLeft wraps from first to last chip', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const chips = radioGroup.locator('button[role="radio"]')

      // Focus the All chip (first)
      await chips.first().focus()

      // ArrowLeft wraps to Custom (last)
      await page.keyboard.press('ArrowLeft')
      const customChip = chips.filter({ hasText: 'Custom' })
      await expect(customChip).toHaveAttribute('aria-checked', 'true')
      await expect(customChip).toBeFocused()
    })

    test('Home key jumps to first chip (All)', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const chips = radioGroup.locator('button[role="radio"]')

      // Click Testing to move focus there
      const testingChip = chips.filter({ hasText: 'Testing' })
      await testingChip.click()
      await expect(testingChip).toHaveAttribute('aria-checked', 'true')

      // Home → All
      await page.keyboard.press('Home')
      const allChip = chips.first()
      await expect(allChip).toHaveAttribute('aria-checked', 'true')
      await expect(allChip).toBeFocused()
    })

    test('End key jumps to last chip (Custom)', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const chips = radioGroup.locator('button[role="radio"]')

      // Focus the All chip
      await chips.first().focus()

      // End → Custom
      await page.keyboard.press('End')
      const customChip = chips.filter({ hasText: 'Custom' })
      await expect(customChip).toHaveAttribute('aria-checked', 'true')
      await expect(customChip).toBeFocused()
    })

    test('keyboard selection filters the grid', async ({ page }) => {
      const radioGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
      const chips = radioGroup.locator('button[role="radio"]')

      // Focus All, then ArrowRight to Safety
      await chips.first().focus()
      await page.keyboard.press('ArrowRight')

      // Grid should now show only Safety hooks (3)
      await expect(page.locator('article')).toHaveCount(3)
      await expect(page.locator('[role="status"]')).toContainText('Showing 3 hooks')
    })
  })
})
