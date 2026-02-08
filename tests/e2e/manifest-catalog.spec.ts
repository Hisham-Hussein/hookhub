import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

interface ManifestEntry {
  name: string
  githubRepoUrl: string
  purposeCategory: string
  lifecycleEvent: string
}

test.describe('Manifest-Driven Catalog (US-020)', () => {
  let manifestEntries: ManifestEntry[]

  test.beforeAll(() => {
    const manifestPath = join(process.cwd(), 'data', 'hooks.json')
    manifestEntries = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hook count matches manifest entry count', async ({ page }) => {
    const cards = page.locator('article')
    await expect(cards).toHaveCount(manifestEntries.length)
  })

  test('each displayed hook name corresponds to a manifest entry', async ({ page }) => {
    const manifestNames = manifestEntries.map((e) => e.name)
    const cards = page.locator('article')
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const heading = cards.nth(i).locator('h3')
      const name = await heading.textContent()
      expect(manifestNames).toContain(name?.trim())
    }
  })

  test('filter categories show expected options from manifest', async ({ page }) => {
    const categoryGroup = page.locator('[role="radiogroup"][aria-label="Filter by purpose category"]')
    const chips = categoryGroup.locator('button[role="radio"]')

    // Extract unique categories from manifest
    const expectedCategories = [...new Set(manifestEntries.map((e) => e.purposeCategory))]

    // First chip is "All", remaining should cover manifest categories
    const chipCount = await chips.count()
    const chipLabels: string[] = []
    for (let i = 0; i < chipCount; i++) {
      const text = await chips.nth(i).textContent()
      if (text) chipLabels.push(text.trim())
    }

    // "All" should be the first option
    expect(chipLabels[0]).toBe('All')

    // Every category from the manifest should appear as a filter option
    for (const category of expectedCategories) {
      expect(chipLabels).toContain(category)
    }
  })
})
