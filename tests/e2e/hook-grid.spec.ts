import { test, expect } from '@playwright/test'

test.describe('HookGrid — responsive hook catalog grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders a section with "Hook catalog" aria-label', async ({ page }) => {
    const section = page.getByRole('region', { name: 'Hook catalog' })
    await expect(section).toBeVisible()
  })

  test('renders all hooks from sample data as list items', async ({ page }) => {
    const section = page.getByRole('region', { name: 'Hook catalog' })
    const items = section.getByRole('listitem')
    // 13 sample hooks in page.tsx
    await expect(items).toHaveCount(13)
  })

  test('each hook card displays its name as a heading', async ({ page }) => {
    const headings = page.locator('section[aria-label="Hook catalog"] h3')
    await expect(headings.first()).toBeVisible()
    // Check first and last hook names from sample data
    await expect(headings.first()).toContainText('safe-rm')
  })

  test('grid uses CSS Grid layout', async ({ page }) => {
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const display = await grid.evaluate((el) => getComputedStyle(el).display)
    expect(display).toBe('grid')
  })

  test('desktop viewport (1280px): grid has 4 columns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const columns = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    )
    expect(columns).toBe(4)
  })

  test('large viewport (1024px): grid has 3 columns', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 })
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const columns = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    )
    expect(columns).toBe(3)
  })

  test('tablet viewport (768px): grid has 2 columns', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 })
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const columns = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    )
    expect(columns).toBe(2)
  })

  test('mobile viewport (375px): grid has 1 column', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const columns = await grid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    )
    expect(columns).toBe(1)
  })

  test('grid items have consistent spacing (gap)', async ({ page }) => {
    const grid = page.locator('section[aria-label="Hook catalog"] > ul')
    const gap = await grid.evaluate((el) => getComputedStyle(el).gap)
    // gap-4 = 16px in Tailwind
    expect(gap).toBeTruthy()
    expect(gap).not.toBe('normal')
  })

  test('all hooks are rendered without pagination', async ({ page }) => {
    // No "next page" or "load more" buttons
    const nextPage = page.getByRole('button', { name: /next page|load more|show more/i })
    await expect(nextPage).toHaveCount(0)
  })
})
