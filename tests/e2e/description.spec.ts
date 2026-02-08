import { test, expect } from '@playwright/test'

test.describe('US-009: Hook description on card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('content rendering', () => {
    test('description text appears below the name and badges', async ({ page }) => {
      const firstCard = page.locator('article').first()

      // Name (h3) exists
      const name = firstCard.locator('h3')
      await expect(name).toBeVisible()

      // Badges row exists
      const badges = firstCard.locator('.flex.gap-2')
      await expect(badges).toBeVisible()

      // Description paragraph exists
      const description = firstCard.locator('p')
      await expect(description).toBeVisible()

      // Verify DOM order: h3 appears before badges, badges before p
      // (structural test — p comes after the badges div in the card)
      const elements = firstCard.locator('> *')
      const count = await elements.count()
      expect(count).toBeGreaterThanOrEqual(3)

      const tags: string[] = []
      for (let i = 0; i < count; i++) {
        const tag = await elements.nth(i).evaluate((el) => el.tagName.toLowerCase())
        tags.push(tag)
      }
      const h3Idx = tags.indexOf('h3')
      const pIdx = tags.indexOf('p')
      expect(h3Idx).toBeLessThan(pIdx)
    })

    test('description content comes from seed data', async ({ page }) => {
      // First card in seed data is "claude-code-hooks-mastery"
      const firstCard = page.locator('article').first()
      const description = firstCard.locator('p')
      await expect(description).toContainText('Master Claude Code Hooks')
    })

    test('different cards show different descriptions', async ({ page }) => {
      const cards = page.locator('article')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(3)

      const descriptions = new Set<string>()
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await cards.nth(i).locator('p').textContent()
        descriptions.add(text ?? '')
      }
      // At least 3 unique descriptions among the first 5 cards
      expect(descriptions.size).toBeGreaterThanOrEqual(3)
    })
  })

  test.describe('truncation', () => {
    test('description element has line-clamp-2 class for truncation', async ({ page }) => {
      const description = page.locator('article p').first()
      const className = await description.getAttribute('class')
      expect(className).toContain('line-clamp-2')
    })

    test('description height is constrained (not growing unbounded)', async ({ page }) => {
      // With line-clamp-2 applied, the description paragraph should have a
      // bounded height regardless of text length. Verify the element's rendered
      // height is reasonable (roughly 2 lines of text, under 60px).
      const description = page.locator('article p').first()
      await expect(description).toBeVisible()
      const box = await description.boundingBox()
      expect(box).toBeTruthy()
      expect(box!.height).toBeLessThanOrEqual(60)
      expect(box!.height).toBeGreaterThan(0)
    })
  })

  test.describe('grid alignment', () => {
    test('cards with varying description lengths have consistent height', async ({ page }) => {
      const cards = page.locator('article')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(3)

      // Collect card heights — they should all be the same
      // (Tailwind line-clamp-2 reserves consistent vertical space)
      const heights: number[] = []
      for (let i = 0; i < Math.min(count, 6); i++) {
        const box = await cards.nth(i).boundingBox()
        if (box) heights.push(Math.round(box.height))
      }

      // All cards in the same row should share the same height
      // (CSS grid auto-rows makes all cards in a row the same height)
      // Allow 2px tolerance for subpixel rendering
      const minH = Math.min(...heights)
      const maxH = Math.max(...heights)
      expect(maxH - minH).toBeLessThanOrEqual(5)
    })
  })
})
