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

      // Some cards may not have descriptions (empty description → no <p> rendered)
      const descriptions = new Set<string>()
      for (let i = 0; i < Math.min(count, 8); i++) {
        const p = cards.nth(i).locator('p')
        if ((await p.count()) > 0) {
          const text = await p.textContent()
          descriptions.add(text ?? '')
        }
      }
      // At least 2 unique descriptions among cards that have them
      expect(descriptions.size).toBeGreaterThanOrEqual(2)
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
      // Not all cards have descriptions, so find the first one that does.
      const description = page.locator('article p.line-clamp-2').first()
      await expect(description).toBeVisible()
      const height = await description.evaluate(
        (el) => el.getBoundingClientRect().height,
      )
      expect(height).toBeLessThanOrEqual(60)
      expect(height).toBeGreaterThan(0)
    })
  })

  test.describe('grid alignment', () => {
    test('grid items within the same row have consistent height', async ({ page }) => {
      // The CSS grid stretches `li` items to equal height per row.
      // The `article` inside may be shorter (content-dependent), so measure `li`.
      const gridItems = page.locator('section[aria-label="Hook catalog"] ul > li')
      const count = await gridItems.count()
      expect(count).toBeGreaterThanOrEqual(3)

      // Collect grid item positions and heights
      const itemData: { top: number; height: number }[] = []
      for (let i = 0; i < Math.min(count, 9); i++) {
        const box = await gridItems.nth(i).boundingBox()
        if (box) itemData.push({ top: Math.round(box.y), height: Math.round(box.height) })
      }

      // Group items by row (same top position, within 2px tolerance)
      const rows: number[][] = []
      for (let idx = 0; idx < itemData.length; idx++) {
        const item = itemData[idx]
        const existingRow = rows.find((row) =>
          Math.abs(itemData[row[0]].top - item.top) <= 2,
        )
        if (existingRow) {
          existingRow.push(idx)
        } else {
          rows.push([idx])
        }
      }

      // Within each row, all grid items should have the same height
      for (const row of rows) {
        if (row.length < 2) continue
        const heights = row.map((i) => itemData[i].height)
        const minH = Math.min(...heights)
        const maxH = Math.max(...heights)
        expect(maxH - minH).toBeLessThanOrEqual(5)
      }
    })
  })
})
