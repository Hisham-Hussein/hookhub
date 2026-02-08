import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'

// NOTE: We do NOT mock validate-manifest here — that's the point!
// enrichManifest internally imports and calls the real validateManifestEntry.
// We only mock the I/O layer (readManifest, fetchMetadata).

describe('enrichManifest integration with real validation', () => {
  const validEntry: ManifestEntry = {
    name: 'safe-rm',
    githubRepoUrl: 'https://github.com/owner/repo',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
  }

  const mockMetadata = {
    description: 'Prevents dangerous rm commands',
    starsCount: 1247,
    lastUpdated: '2026-01-28T12:00:00Z',
  }

  it('enriches valid entries using real validation logic', async () => {
    const result = await enrichManifest({
      readManifest: async () => [validEntry],
      fetchMetadata: async () => mockMetadata,
    })

    expect(result.hooks).toHaveLength(1)
    expect(result.hooks[0]).toEqual({
      name: 'safe-rm',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
      description: 'Prevents dangerous rm commands',
      starsCount: 1247,
      lastUpdated: '2026-01-28T12:00:00Z',
    })
    expect(result.failures).toHaveLength(0)
  })

  it('real validation catches invalid purposeCategory before fetch is called', async () => {
    const fetchMetadata = vi.fn()
    const badEntry = {
      name: 'bad-hook',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'NotACategory',
      lifecycleEvent: 'PreToolUse',
    }

    const result = await enrichManifest({
      readManifest: async () => [badEntry as unknown as ManifestEntry],
      fetchMetadata,
    })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].error).toContain('purposeCategory')
    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('real validation catches non-GitHub URL before fetch', async () => {
    const fetchMetadata = vi.fn()
    const badEntry = {
      name: 'bad-hook',
      githubRepoUrl: 'https://gitlab.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
    }

    const result = await enrichManifest({
      readManifest: async () => [badEntry as unknown as ManifestEntry],
      fetchMetadata,
    })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].error).toContain('githubRepoUrl')
    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('processes mix of valid and invalid entries with real validation', async () => {
    const entries = [
      validEntry,
      {
        name: 'invalid-category',
        githubRepoUrl: 'https://github.com/owner/repo2',
        purposeCategory: 'Bogus',
        lifecycleEvent: 'PreToolUse',
      } as unknown as ManifestEntry,
      {
        name: 'valid-hook-2',
        githubRepoUrl: 'https://github.com/owner/repo3',
        purposeCategory: 'Testing',
        lifecycleEvent: 'PostToolUse',
      },
    ]

    const result = await enrichManifest({
      readManifest: async () => entries,
      fetchMetadata: async () => mockMetadata,
    })

    expect(result.hooks).toHaveLength(2) // first and third
    expect(result.failures).toHaveLength(1) // second (invalid category)
    expect(result.summary).toBe('Enriched 2/3 hooks; 1 failed. Validated 2 repo links; 0 unreachable')
  })

  it('passes correct githubRepoUrl to fetchMetadata for each valid entry', async () => {
    const fetchMetadata = vi.fn().mockResolvedValue(mockMetadata)
    const entries: ManifestEntry[] = [
      { ...validEntry, name: 'hook-1', githubRepoUrl: 'https://github.com/org/repo-1' },
      { ...validEntry, name: 'hook-2', githubRepoUrl: 'https://github.com/org/repo-2' },
    ]

    await enrichManifest({
      readManifest: async () => entries,
      fetchMetadata,
    })

    expect(fetchMetadata).toHaveBeenCalledTimes(2)
    expect(fetchMetadata).toHaveBeenNthCalledWith(1, 'https://github.com/org/repo-1')
    expect(fetchMetadata).toHaveBeenNthCalledWith(2, 'https://github.com/org/repo-2')
  })
})
