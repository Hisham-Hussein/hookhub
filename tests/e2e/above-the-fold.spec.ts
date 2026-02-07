import { test, expect, type Locator } from '@playwright/test'

/** Retry boundingBox() until layout settles (avoids transient null returns). */
async function stableBoundingBox(locator: Locator) {
  let box: { x: number; y: number; width: number; height: number } | null = null
  await expect
    .poll(async () => {
      box = await locator.boundingBox()
      return box
    }, { timeout: 5000 })
    .not.toBeNull()
  return box!
}

test.describe('US-003: Hook grid visible above the fold on desktop', () => {
  test.describe('1080p desktop viewport (1920x1080)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
    })

    test('first row of hook cards is visible without scrolling', async ({ page }) => {
      const firstCard = page.locator('article').first()
      await expect(firstCard).toBeVisible()

      const cardBox = await stableBoundingBox(firstCard)

      // The bottom of the first card must be within the viewport (1080px)
      const cardBottom = cardBox.y + cardBox.height
      expect(cardBottom).toBeLessThan(1080)
    })

    test('hero and first grid row both visible in initial viewport', async ({ page }) => {
      const hero = page.locator('section[aria-labelledby="hero-heading"]')
      const firstCard = page.locator('article').first()

      await expect(hero).toBeVisible()
      await expect(firstCard).toBeVisible()

      const heroBox = await stableBoundingBox(hero)
      const cardBox = await stableBoundingBox(firstCard)

      // Both should be within the 1080px viewport
      expect(heroBox.y + heroBox.height).toBeLessThan(1080)
      expect(cardBox.y + cardBox.height).toBeLessThan(1080)
    })

    test('no excessive whitespace gap between hero and filter/grid', async ({ page }) => {
      const hero = page.locator('section[aria-labelledby="hero-heading"]')
      const filterBar = page.locator('[role="search"][aria-label="Filter hooks"]')

      const heroBox = await stableBoundingBox(hero)
      const filterBox = await stableBoundingBox(filterBar)

      // Gap between bottom of hero and top of filter bar should be <= 32px
      const gap = filterBox.y - (heroBox.y + heroBox.height)
      expect(gap).toBeLessThanOrEqual(32)
    })
  })

  test.describe('smaller viewports', () => {
    test('grid appears with minimal scrolling on tablet (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')

      const firstCard = page.locator('article').first()
      await expect(firstCard).toBeVisible()

      const cardBox = await stableBoundingBox(firstCard)

      // First card should be visible within the 1024px tablet viewport
      expect(cardBox.y + cardBox.height).toBeLessThan(1024)
    })

    test('grid appears with minimal scrolling on mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const firstCard = page.locator('article').first()
      await expect(firstCard).toBeVisible()

      const cardBox = await stableBoundingBox(firstCard)

      // On mobile the first card should be reachable with minimal scroll
      // Allow it to extend slightly below fold (hero + filters take more space on mobile)
      // but the top of the first card should start within 1.5x viewport height
      expect(cardBox.y).toBeLessThan(667 * 1.5)
    })
  })
})
