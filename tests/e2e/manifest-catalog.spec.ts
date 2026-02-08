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

  test('no hooks appear that are not in the manifest', async ({ page }) => {
    const manifestNames = new Set(manifestEntries.map((e) => e.name))
    const cards = page.locator('article')
    const count = await cards.count()

    const displayedNames: string[] = []
    for (let i = 0; i < count; i++) {
      const heading = cards.nth(i).locator('h3')
      const name = await heading.textContent()
      if (name) displayedNames.push(name.trim())
    }

    for (const name of displayedNames) {
      expect(manifestNames.has(name)).toBe(true)
    }

    expect(displayedNames.length).toBe(manifestEntries.length)
  })
})
