import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '../enrich-manifest'
import type { ManifestEntry } from '@/lib/domain/types'

const validEntry: ManifestEntry = {
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/owner/repo',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
}

describe('enrichManifest edge cases', () => {
  it('handles empty manifest (zero entries)', async () => {
    const readManifest = vi.fn().mockResolvedValue([])
    const fetchMetadata = vi.fn()

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(0)
    expect(result.failures).toHaveLength(0)
    expect(result.summary).toBe('Enriched 0/0 hooks; 0 failed')
    expect(fetchMetadata).not.toHaveBeenCalled()
  })

  it('handles non-Error throw from fetchMetadata', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockRejectedValue('string error')

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].error).toBe('string error')
  })

  it('handles undefined throw from fetchMetadata', async () => {
    const readManifest = vi.fn().mockResolvedValue([validEntry])
    const fetchMetadata = vi.fn().mockRejectedValue(undefined)

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].error).toBe('undefined')
  })

  it('does not mutate the input entries array', async () => {
    const entries = [{ ...validEntry }]
    const original = JSON.parse(JSON.stringify(entries))
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue({
      description: 'desc',
      starsCount: 1,
      lastUpdated: '2026-01-01',
    })

    await enrichManifest({ readManifest, fetchMetadata })

    expect(entries).toEqual(original)
  })

  it('processes entries sequentially (not in parallel)', async () => {
    const callOrder: number[] = []
    const entries = [
      { ...validEntry, name: 'hook-1' },
      { ...validEntry, name: 'hook-2', githubRepoUrl: 'https://github.com/owner/repo2' },
    ]
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockImplementation(async () => {
      callOrder.push(callOrder.length)
      return { description: 'desc', starsCount: 1, lastUpdated: '2026-01-01' }
    })

    await enrichManifest({ readManifest, fetchMetadata })

    expect(callOrder).toEqual([0, 1])
    expect(fetchMetadata).toHaveBeenCalledTimes(2)
  })

  it('correctly counts when mix of invalid and failed entries', async () => {
    const invalidEntry = { name: '', githubRepoUrl: 'bad', purposeCategory: 'X', lifecycleEvent: 'X' } as unknown as ManifestEntry
    const entries = [validEntry, invalidEntry, { ...validEntry, name: 'hook-3', githubRepoUrl: 'https://github.com/o/r3' }]
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn()
      .mockResolvedValueOnce({ description: 'd', starsCount: 1, lastUpdated: '2026-01-01' })
      .mockRejectedValueOnce(new Error('fetch failed'))

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(1)
    expect(result.failures).toHaveLength(2) // 1 validation + 1 fetch
    expect(result.summary).toBe('Enriched 1/3 hooks; 2 failed')
  })

  it('preserves all entry fields in the enriched hook', async () => {
    const entry: ManifestEntry = {
      name: 'my-hook',
      githubRepoUrl: 'https://github.com/owner/special-repo',
      purposeCategory: 'Logging',
      lifecycleEvent: 'PostToolUse',
    }
    const readManifest = vi.fn().mockResolvedValue([entry])
    const fetchMetadata = vi.fn().mockResolvedValue({
      description: 'A logging hook',
      starsCount: 999,
      lastUpdated: '2026-02-01T12:00:00Z',
    })

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks[0]).toEqual({
      name: 'my-hook',
      githubRepoUrl: 'https://github.com/owner/special-repo',
      purposeCategory: 'Logging',
      lifecycleEvent: 'PostToolUse',
      description: 'A logging hook',
      starsCount: 999,
      lastUpdated: '2026-02-01T12:00:00Z',
    })
  })

  it('readManifest failure propagates (not caught)', async () => {
    const readManifest = vi.fn().mockRejectedValue(new Error('File not found'))
    const fetchMetadata = vi.fn()

    await expect(
      enrichManifest({ readManifest, fetchMetadata }),
    ).rejects.toThrow('File not found')
  })

  it('handles large manifest (100 entries)', async () => {
    const entries = Array.from({ length: 100 }, (_, i) => ({
      ...validEntry,
      name: `hook-${i}`,
      githubRepoUrl: `https://github.com/owner/repo-${i}`,
    }))
    const readManifest = vi.fn().mockResolvedValue(entries)
    const fetchMetadata = vi.fn().mockResolvedValue({
      description: 'd',
      starsCount: 1,
      lastUpdated: '2026-01-01',
    })

    const result = await enrichManifest({ readManifest, fetchMetadata })

    expect(result.hooks).toHaveLength(100)
    expect(result.summary).toBe('Enriched 100/100 hooks; 0 failed')
  })
})
