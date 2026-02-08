import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'

function generateManifestEntries(count: number): ManifestEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `hook-${i + 1}`,
    githubRepoUrl: `https://github.com/owner/repo-${i + 1}`,
    purposeCategory: PURPOSE_CATEGORIES[i % PURPOSE_CATEGORIES.length],
    lifecycleEvent: LIFECYCLE_EVENTS[i % LIFECYCLE_EVENTS.length],
  }))
}

const mockGitHubData = {
  description: 'A test hook',
  starsCount: 10,
  lastUpdated: '2026-01-01T00:00:00Z',
}

describe('enrichManifest — scale', () => {
  it('enriches 25 entries successfully', async () => {
    const entries = generateManifestEntries(25)
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)
    const readRawManifest = vi.fn().mockResolvedValue(entries)

    const result = await enrichManifest({
      readManifest,
      fetchMetadata,
      readRawManifest,
    })

    expect(result.hooks).toHaveLength(25)
    expect(result.failures).toHaveLength(0)
    expect(result.summary).toContain('Enriched 25/25')
  })

  it('handles mixed success and failure (20 succeed, 5 fail)', async () => {
    const entries = generateManifestEntries(25)
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockImplementation((url: string) => {
      const index = parseInt(url.split('repo-')[1]) - 1
      if (index >= 20) {
        return Promise.reject(new Error('API rate limit'))
      }
      return Promise.resolve(mockGitHubData)
    })
    const readRawManifest = vi.fn().mockResolvedValue(entries)

    const result = await enrichManifest({
      readManifest,
      fetchMetadata,
      readRawManifest,
    })

    expect(result.hooks).toHaveLength(20)
    expect(result.failures).toHaveLength(5)
    expect(result.summary).toContain('Enriched 20/25')
  })

  it('25-entry set covers all purpose categories and lifecycle events', () => {
    const entries = generateManifestEntries(25)

    const categories = new Set(entries.map((e) => e.purposeCategory))
    const events = new Set(entries.map((e) => e.lifecycleEvent))

    for (const cat of PURPOSE_CATEGORIES) {
      expect(categories.has(cat)).toBe(true)
    }
    for (const evt of LIFECYCLE_EVENTS) {
      expect(events.has(evt)).toBe(true)
    }
  })
})
