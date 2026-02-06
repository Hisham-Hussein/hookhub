import { test, expect } from '@playwright/test'

test.describe('HookCard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('content rendering', () => {
    test('displays hook name as a heading', async ({ page }) => {
      const h3 = page.locator('article h3')
      await expect(h3).toBeVisible()
      await expect(h3).toContainText('safe-rm')
    })

    test('hook name is wrapped in a link', async ({ page }) => {
      const link = page.locator('article h3 a')
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', 'https://github.com/devtools-org/safe-rm-hook')
    })

    test('link opens in new tab with security attributes', async ({ page }) => {
      const link = page.locator('article h3 a')
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
      const description = page.locator('article p')
      await expect(description).toBeVisible()
      await expect(description).toContainText('Prevents accidental deletion')
    })

    test('displays formatted star count', async ({ page }) => {
      await expect(page.locator('article')).toContainText('1.2k')
    })

    test('displays GitHub external link indicator', async ({ page }) => {
      await expect(page.locator('article')).toContainText('GitHub')
    })
  })

  test.describe('accessibility', () => {
    test('card uses article element', async ({ page }) => {
      const article = page.locator('article')
      await expect(article).toBeAttached()
    })

    test('star count has accessible label', async ({ page }) => {
      const starSpan = page.locator('article span[aria-label*="GitHub stars"]')
      await expect(starSpan).toBeAttached()
      await expect(starSpan).toHaveAttribute('aria-label', '1,247 GitHub stars')
    })

    test('card is one tab stop (stretched link pattern)', async ({ page }) => {
      // Tab past the skip link, then to the card
      await page.keyboard.press('Tab') // skip link
      await page.keyboard.press('Tab') // card link

      const focused = page.locator(':focus')
      await expect(focused).toBeAttached()
      // The focused element should be inside an article
      const article = page.locator('article:focus-within')
      await expect(article).toBeAttached()
    })

    test('star icon SVGs are hidden from screen readers', async ({ page }) => {
      const hiddenSvgs = page.locator('article svg[aria-hidden="true"]')
      const count = await hiddenSvgs.count()
      expect(count).toBeGreaterThanOrEqual(2) // star icon + arrow icon
    })
  })

  test.describe('typography and styling', () => {
    test('hook name uses Poppins font family (font-headline)', async ({ page }) => {
      const h3 = page.locator('article h3')
      const fontFamily = await h3.evaluate((el) =>
        window.getComputedStyle(el).fontFamily
      )
      expect(fontFamily.toLowerCase()).toContain('poppins')
    })

    test('hook name font weight is light (300)', async ({ page }) => {
      const h3 = page.locator('article h3')
      const fontWeight = await h3.evaluate((el) =>
        window.getComputedStyle(el).fontWeight
      )
      expect(fontWeight).toBe('300')
    })

    test('card has visible border', async ({ page }) => {
      const article = page.locator('article')
      const borderWidth = await article.evaluate((el) =>
        window.getComputedStyle(el).borderWidth
      )
      expect(parseFloat(borderWidth)).toBeGreaterThan(0)
    })

    test('card has rounded corners', async ({ page }) => {
      const article = page.locator('article')
      const borderRadius = await article.evaluate((el) =>
        window.getComputedStyle(el).borderRadius
      )
      expect(parseFloat(borderRadius)).toBeGreaterThan(0)
    })
  })
})
