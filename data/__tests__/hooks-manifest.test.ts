import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { validateManifest } from '@/lib/application/validate-manifest'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'
import type { ManifestEntry } from '@/lib/domain/types'

const manifestPath = join(__dirname, '..', 'hooks.json')
let entries: ManifestEntry[]

describe('data/hooks.json seed manifest', () => {
  it('is valid JSON and parseable', () => {
    const raw = readFileSync(manifestPath, 'utf-8')
    entries = JSON.parse(raw)
    expect(Array.isArray(entries)).toBe(true)
  })

  it('has 10-15 entries', () => {
    expect(entries.length).toBeGreaterThanOrEqual(10)
    expect(entries.length).toBeLessThanOrEqual(15)
  })

  it('all entries pass validation', () => {
    const results = validateManifest(entries)
    const invalid = results.filter((r) => !r.valid)
    expect(invalid).toHaveLength(0)
  })

  it('covers all 8 purpose categories', () => {
    const categories = new Set(entries.map((e) => e.purposeCategory))
    for (const cat of PURPOSE_CATEGORIES) {
      expect(categories.has(cat)).toBe(true)
    }
  })

  it('covers all 5 lifecycle events', () => {
    const events = new Set(entries.map((e) => e.lifecycleEvent))
    for (const evt of LIFECYCLE_EVENTS) {
      expect(events.has(evt)).toBe(true)
    }
  })

  it('all githubRepoUrl values are GitHub URLs', () => {
    for (const entry of entries) {
      expect(entry.githubRepoUrl).toMatch(/^https:\/\/github\.com\//)
    }
  })
})
