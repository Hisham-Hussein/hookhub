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

  it('completes within 5 seconds for 25 entries', async () => {
    const entries = generateManifestEntries(25)
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)
    const readRawManifest = vi.fn().mockResolvedValue(entries)

    const start = Date.now()
    await enrichManifest({
      readManifest,
      fetchMetadata,
      readRawManifest,
    })
    const elapsed = Date.now() - start

    expect(elapsed).toBeLessThan(5000)
  })

  it('each of the 25 hooks has correct enriched data', async () => {
    const entries = generateManifestEntries(25)
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)
    const readRawManifest = vi.fn().mockResolvedValue(entries)

    const result = await enrichManifest({
      readManifest,
      fetchMetadata,
      readRawManifest,
    })

    for (let i = 0; i < 25; i++) {
      expect(result.hooks[i].name).toBe(`hook-${i + 1}`)
      expect(result.hooks[i].description).toBe('A test hook')
      expect(result.hooks[i].starsCount).toBe(10)
    }
  })
})
