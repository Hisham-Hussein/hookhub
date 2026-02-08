import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'
import type { GitHubMetadata } from '../enrich-manifest'

describe('EnrichManifestDeps contract', () => {
  const validEntry: ManifestEntry = {
    name: 'test-hook',
    githubRepoUrl: 'https://github.com/owner/repo',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
  }

  const validMetadata: GitHubMetadata = {
    description: 'A hook',
    starsCount: 10,
    lastUpdated: '2026-01-01',
  }

  it('readManifest is called exactly once', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockResolvedValue(validMetadata)

    await enrichManifest({ readManifest, fetchMetadata })

    expect(readManifest).toHaveBeenCalledTimes(1)
  })

  it('readManifest is called with no arguments', async () => {
    const readManifest = vi.fn().mockResolvedValue([])
    const fetchMetadata = vi.fn()

    await enrichManifest({ readManifest, fetchMetadata })

    expect(readManifest).toHaveBeenCalledWith()
  })

  it('fetchMetadata is called with githubRepoUrl string', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockResolvedValue(validMetadata)

    await enrichManifest({ readManifest, fetchMetadata })

    expect(fetchMetadata).toHaveBeenCalledWith('https://github.com/owner/repo')
  })

  it('fetchMetadata is not called for invalid entries', async () => {
    const invalidEntry = {
      name: '',
      githubRepoUrl: 'not-valid',
      purposeCategory: 'Bad',
      lifecycleEvent: 'Bad',
    } as unknown as ManifestEntry
    const readManifest = vi.fn().mockResolvedValue([invalidEntry])
    const fetchMetadata = vi.fn()

    await enrichManifest({ readManifest, fetchMetadata })

    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('fetchMetadata must return object with description, starsCount, lastUpdated', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockResolvedValue(validMetadata)

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks[0].description).toBe(validMetadata.description)
    expect(result.hooks[0].starsCount).toBe(validMetadata.starsCount)
    expect(result.hooks[0].lastUpdated).toBe(validMetadata.lastUpdated)
  })

  it('EnrichManifestOutput always has hooks array, failures array, and summary string', async () => {
    const readManifest = vi.fn().mockResolvedValue([])
    const fetchMetadata = vi.fn()

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(Array.isArray(result.hooks)).toBe(true)
    expect(Array.isArray(result.failures)).toBe(true)
    expect(typeof result.summary).toBe('string')
  })

  it('EnrichManifestOutput summary always matches pattern', async () => {
    // Test with various inputs to confirm consistent format
    const scenarios = [
      { entries: [], desc: 'empty' },
      { entries: [validEntry], desc: 'one valid' },
      { entries: [validEntry, { ...validEntry, name: 'h2', githubRepoUrl: 'https://github.com/o/r2' }], desc: 'two valid' },
    ]

    for (const scenario of scenarios) {
      const result = await enrichManifest({
        readManifest: async () => scenario.entries,
        fetchMetadata: async () => validMetadata,
      })
      expect(result.summary).toMatch(/^Enriched \d+\/\d+ hooks; \d+ failed\. Validated \d+ repo links; \d+ unreachable$/)
    }
  })
})
