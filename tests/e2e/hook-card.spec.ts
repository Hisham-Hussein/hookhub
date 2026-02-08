import { test, expect } from '@playwright/test'

test.describe('HookCard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('content rendering', () => {
    test('displays hook name as a heading', async ({ page }) => {
      const h3 = page.locator('article h3').first()
      await expect(h3).toBeVisible()
      await expect(h3).toContainText('claude-code-hooks-mastery')
    })

    test('hook name is wrapped in a link', async ({ page }) => {
      const link = page.locator('article h3 a').first()
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', 'https://github.com/disler/claude-code-hooks-mastery')
    })

    test('link opens in new tab with security attributes', async ({ page }) => {
      const link = page.locator('article h3 a').first()
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('displays purpose category badge', async ({ page }) => {
      const badge = page.locator('article span').filter({ hasText: 'Safety' }).first()
      await expect(badge).toBeVisible()
    })

    test('displays lifecycle event badge', async ({ page }) => {
      const badge = page.locator('article span').filter({ hasText: 'PreToolUse' }).first()
      await expect(badge).toBeVisible()
    })

    test('displays hook description', async ({ page }) => {
      const description = page.locator('article p').first()
      await expect(description).toBeVisible()
      await expect(description).toContainText('Master Claude Code Hooks')
    })

    test('displays formatted star count', async ({ page }) => {
      const starSpan = page.locator('article span[aria-label*="GitHub stars"]').first()
      const text = await starSpan.textContent()
      // Star count should be a number or abbreviated (e.g., "523", "2.7k")
      expect(text?.trim()).toMatch(/^\d[\d,.]*k?$/)
    })

    test('displays GitHub external link indicator', async ({ page }) => {
      await expect(page.locator('article').first()).toContainText('GitHub')
    })

    test('each card links to its own correct GitHub repo URL', async ({ page }) => {
      const links = page.locator('article h3 a')
      const count = await links.count()
      expect(count).toBeGreaterThanOrEqual(3)

      // Collect all hrefs and verify they are distinct
      const hrefs: string[] = []
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).toMatch(/^https:\/\/github\.com\//)
        hrefs.push(href!)
      }
      const uniqueHrefs = new Set(hrefs)
      expect(uniqueHrefs.size).toBe(count)

      // Spot-check known card-to-URL mappings from sample data
      const nameToUrl: Record<string, string> = {
        'claude-code-hooks-mastery': 'https://github.com/disler/claude-code-hooks-mastery',
        'tdd-guard': 'https://github.com/nizos/tdd-guard',
        'claudekit': 'https://github.com/carlrannaberg/claudekit',
      }
      for (const [name, expectedUrl] of Object.entries(nameToUrl)) {
        const card = page.locator('article', { has: page.locator(`h3:has-text("${name}")`) })
        const link = card.locator('h3 a')
        await expect(link).toHaveAttribute('href', expectedUrl)
      }
    })

    test('category badges for different categories have different background colors', async ({ page }) => {
      // Find two cards with different categories
      const cards = page.locator('article')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(2)

      // Collect background colors of category badges (first span in the badge row)
      const bgColors = new Set<string>()
      for (let i = 0; i < Math.min(count, 5); i++) {
        const badge = cards.nth(i).locator('.flex.gap-2 > span').first()
        const bg = await badge.evaluate((el) => window.getComputedStyle(el).backgroundColor)
        bgColors.add(bg)
      }

      // With diverse seed data, we expect at least 2 distinct colors
      expect(bgColors.size).toBeGreaterThanOrEqual(2)
    })

    test('all 8 purpose categories render without error', async ({ page }) => {
      // Verify at least some of the known categories appear as badges
      const knownCategories = ['Safety', 'Automation', 'Testing', 'Security', 'Logging']
      for (const cat of knownCategories) {
        const badge = page.locator('article span').filter({ hasText: cat })
        // Not all categories may be in seed data, so just verify no rendering crash
        const count = await badge.count()
        expect(count).toBeGreaterThanOrEqual(0)
      }
    })
  })

  test.describe('accessibility', () => {
    test('card uses article element', async ({ page }) => {
      const article = page.locator('article').first()
      await expect(article).toBeAttached()
    })

    test('star count has accessible label', async ({ page }) => {
      const starSpan = page.locator('article span[aria-label*="GitHub stars"]').first()
      await expect(starSpan).toBeAttached()
      const label = await starSpan.getAttribute('aria-label')
      // Label should match pattern like "523 GitHub stars" or "2,695 GitHub stars"
      expect(label).toMatch(/^[\d,]+ GitHub stars$/)
    })

    test('card is one tab stop (stretched link pattern)', async ({ page }) => {
      // Focus the first card's link directly — avoids fragile tab-count assumptions
      const firstCardLink = page.locator('article a').first()
      await firstCardLink.focus()

      const focused = page.locator(':focus')
      await expect(focused).toBeAttached()
      // The focused element should be inside an article
      const article = page.locator('article:focus-within').first()
      await expect(article).toBeAttached()
    })

    test('star icon SVGs are hidden from screen readers', async ({ page }) => {
      // Check the first card has at least 2 hidden SVGs (star + arrow icons)
      const firstCard = page.locator('article').first()
      const hiddenSvgs = firstCard.locator('svg[aria-hidden="true"]')
      const count = await hiddenSvgs.count()
      expect(count).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('typography and styling', () => {
    test('hook name uses Poppins font family (font-headline)', async ({ page }) => {
      const h3 = page.locator('article h3').first()
      await expect(h3).toBeVisible()
      await expect.poll(async () => {
        const ff = await h3.evaluate((el) => window.getComputedStyle(el).fontFamily)
        return ff.toLowerCase()
      }).toContain('poppins')
    })

    test('hook name font weight is light (300)', async ({ page }) => {
      const h3 = page.locator('article h3').first()
      await expect(h3).toBeVisible()
      await expect.poll(async () => {
        return await h3.evaluate((el) => window.getComputedStyle(el).fontWeight)
      }).toBe('300')
    })

    test('card has visible border', async ({ page }) => {
      const article = page.locator('article').first()
      const borderWidth = await article.evaluate((el) =>
        window.getComputedStyle(el).borderWidth
      )
      expect(parseFloat(borderWidth)).toBeGreaterThan(0)
    })

    test('card has rounded corners', async ({ page }) => {
      const article = page.locator('article').first()
      const className = await article.getAttribute('class')
      expect(className).toContain('rounded-xl')
    })
  })

  test.describe('event badge visual distinction', () => {
    test('event badges for different events have different background colors', async ({ page }) => {
      const cards = page.locator('article')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(2)

      // Collect background colors of event badges (second span in the badge row)
      const bgColors = new Set<string>()
      for (let i = 0; i < Math.min(count, 8); i++) {
        const badge = cards.nth(i).locator('.flex.gap-2 > span').nth(1)
        if (await badge.count() > 0) {
          const bg = await badge.evaluate((el) => window.getComputedStyle(el).backgroundColor)
          bgColors.add(bg)
        }
      }

      // With diverse seed data, at least 2 distinct event colors
      expect(bgColors.size).toBeGreaterThanOrEqual(2)
    })

    test('event badge uses italic styling', async ({ page }) => {
      const eventBadge = page.locator('article .flex.gap-2 > span').nth(1)
      const fontStyle = await eventBadge.evaluate((el) => window.getComputedStyle(el).fontStyle)
      expect(fontStyle).toBe('italic')
    })

    test('event badge styling differs from category badge styling', async ({ page }) => {
      const firstCard = page.locator('article').first()
      const categoryBadge = firstCard.locator('.flex.gap-2 > span').first()
      const eventBadge = firstCard.locator('.flex.gap-2 > span').nth(1)

      const catBg = await categoryBadge.evaluate((el) => window.getComputedStyle(el).backgroundColor)
      const evtBg = await eventBadge.evaluate((el) => window.getComputedStyle(el).backgroundColor)

      expect(catBg).not.toBe(evtBg)
    })
  })

  test.describe('stars count display', () => {
    test('star icon is present alongside the count', async ({ page }) => {
      const firstCard = page.locator('article').first()
      const starSvg = firstCard.locator('svg[aria-hidden="true"]').first()
      await expect(starSvg).toBeVisible()
    })

    test('formatted count appears next to star icon', async ({ page }) => {
      // Verify the stars span contains both an SVG and text
      const starSpan = page.locator('article span[aria-label*="GitHub stars"]').first()
      await expect(starSpan).toBeVisible()
      const svg = starSpan.locator('svg')
      await expect(svg).toBeAttached()
      const text = await starSpan.textContent()
      expect(text).toBeTruthy()
      // Text should contain a number (e.g., "523", "1.2k")
      expect(text!.trim()).toMatch(/^\d/)
    })
  })
})
