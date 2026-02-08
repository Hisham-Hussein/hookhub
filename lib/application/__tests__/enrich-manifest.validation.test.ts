import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'

const validEntry: ManifestEntry = {
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/owner/repo',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
}

const secondEntry: ManifestEntry = {
  name: 'hook-2',
  githubRepoUrl: 'https://github.com/owner/repo2',
  purposeCategory: 'Testing',
  lifecycleEvent: 'PostToolUse',
}

const mockGitHubData = {
  description: 'A great hook',
  starsCount: 42,
  lastUpdated: '2026-01-15T00:00:00Z',
}

describe('enrichManifest — link validation reporting', () => {
  it('produces validationResults with reachable: true for successful fetches', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry]),
      fetchMetadata: vi.fn().mockResolvedValue(mockGitHubData),
    })

    expect(result.validationResults).toBeDefined()
    expect(result.validationResults).toHaveLength(1)
    expect(result.validationResults[0]).toEqual({
      url: 'https://github.com/owner/repo',
      reachable: true,
    })
  })

  it('produces validationResults with reachable: false for failed fetches', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry]),
      fetchMetadata: vi.fn().mockRejectedValue(new Error('404 Not Found')),
    })

    expect(result.validationResults).toHaveLength(1)
    expect(result.validationResults[0]).toEqual({
      url: 'https://github.com/owner/repo',
      reachable: false,
      error: '404 Not Found',
    })
  })

  it('does not make additional HTTP requests beyond fetchMetadata', async () => {
    const fetchMetadata = vi.fn().mockResolvedValue(mockGitHubData)
    await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry, secondEntry]),
      fetchMetadata,
    })

    expect(fetchMetadata).toHaveBeenCalledTimes(2)
  })

  it('includes validation counts in summary', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry, secondEntry]),
      fetchMetadata: vi.fn()
        .mockResolvedValueOnce(mockGitHubData)
        .mockRejectedValueOnce(new Error('403 Forbidden')),
    })

    expect(result.summary).toContain('Validated 2 repo links')
    expect(result.summary).toContain('1 unreachable')
  })

  it('summary shows 0 unreachable when all succeed', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry]),
      fetchMetadata: vi.fn().mockResolvedValue(mockGitHubData),
    })

    expect(result.summary).toContain('Validated 1 repo links')
    expect(result.summary).toContain('0 unreachable')
  })

  it('skips validation for entries that fail manifest validation', async () => {
    const invalidEntry = {
      name: '',
      githubRepoUrl: 'bad',
      purposeCategory: 'Bad',
      lifecycleEvent: 'Bad',
    }
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([invalidEntry]),
      fetchMetadata: vi.fn(),
    })

    expect(result.validationResults).toHaveLength(0)
  })
})
