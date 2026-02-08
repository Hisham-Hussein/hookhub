import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'

const validEntry: ManifestEntry = {
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/owner/repo',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
}

const mockGitHubData = {
  description: 'A great hook',
  starsCount: 42,
  lastUpdated: '2026-01-15T00:00:00Z',
}

describe('enrichManifest', () => {
  it('enriches all entries when GitHub fetch succeeds', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)

    const result = await enrichManifest({
      readManifest,
      fetchMetadata,
    })

    expect(result.hooks).toHaveLength(1)
    expect(result.hooks[0].name).toBe('test-hook')
    expect(result.hooks[0].description).toBe('A great hook')
    expect(result.hooks[0].starsCount).toBe(42)
    expect(result.failures).toHaveLength(0)
    expect(result.summary).toBe('Enriched 1/1 hooks; 0 failed. Validated 1 repo links; 0 unreachable')
  })

  it('handles partial GitHub failures', async () => {
    const entries: ManifestEntry[] = [
      validEntry,
      { ...validEntry, name: 'broken-hook', githubRepoUrl: 'https://github.com/owner/broken' },
    ]
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn()
      .mockResolvedValueOnce(mockGitHubData)
      .mockRejectedValueOnce(new Error('404 Not Found'))

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(1)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].entry.name).toBe('broken-hook')
    expect(result.failures[0].error).toContain('404')
    expect(result.summary).toBe('Enriched 1/2 hooks; 1 failed. Validated 2 repo links; 1 unreachable')
  })

  it('returns empty hooks when all fail', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockRejectedValue(new Error('Rate limited'))

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures).toHaveLength(1)
    expect(result.summary).toBe('Enriched 0/1 hooks; 1 failed. Validated 1 repo links; 1 unreachable')
  })

  it('skips invalid manifest entries with validation errors', async () => {
    const invalidEntry = { name: '', githubRepoUrl: 'bad', purposeCategory: 'Bad', lifecycleEvent: 'Bad' }
    const readManifest = vi.fn().mockResolvedValue([invalidEntry])
    const fetchMetadata = vi.fn()

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].error).toContain('validation')
    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('summary format matches expected pattern', async () => {
    const entries = [validEntry, { ...validEntry, name: 'hook-2' }]
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.summary).toMatch(/^Enriched \d+\/\d+ hooks; \d+ failed\. Validated \d+ repo links; \d+ unreachable$/)
  })
})
