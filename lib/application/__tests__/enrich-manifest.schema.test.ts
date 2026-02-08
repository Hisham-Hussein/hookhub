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

describe('enrichManifest — schema validation', () => {
  it('returns early with error when manifest is not an array', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([]),
      fetchMetadata: vi.fn(),
      readRawManifest: vi.fn().mockResolvedValue('not an array'),
    })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures.length).toBeGreaterThan(0)
    expect(result.failures[0].error).toContain('array')
    expect(result.summary).toContain('failed')
  })

  it('returns early with error when manifest is empty', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([]),
      fetchMetadata: vi.fn(),
      readRawManifest: vi.fn().mockResolvedValue([]),
    })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures.length).toBeGreaterThan(0)
    expect(result.failures[0].error).toContain('empty')
  })

  it('returns early with error when manifest has duplicates', async () => {
    const dupes = [validEntry, validEntry]
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue(dupes),
      fetchMetadata: vi.fn(),
      readRawManifest: vi.fn().mockResolvedValue(dupes),
    })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures.length).toBeGreaterThan(0)
    expect(result.failures[0].error).toContain('duplicate')
  })

  it('proceeds normally when schema validation passes', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry]),
      fetchMetadata: vi.fn().mockResolvedValue(mockGitHubData),
      readRawManifest: vi.fn().mockResolvedValue([validEntry]),
    })

    expect(result.hooks).toHaveLength(1)
    expect(result.hooks[0].name).toBe('test-hook')
    expect(result.failures).toHaveLength(0)
  })

  it('does not call fetchMetadata when schema validation fails', async () => {
    const fetchMetadata = vi.fn()
    await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([]),
      fetchMetadata,
      readRawManifest: vi.fn().mockResolvedValue('bad'),
    })

    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('skips schema validation when readRawManifest is not provided (backward compat)', async () => {
    const result = await enrichManifest({
      readManifest: vi.fn().mockResolvedValue([validEntry]),
      fetchMetadata: vi.fn().mockResolvedValue(mockGitHubData),
    })

    expect(result.hooks).toHaveLength(1)
    expect(result.failures).toHaveLength(0)
  })
})
