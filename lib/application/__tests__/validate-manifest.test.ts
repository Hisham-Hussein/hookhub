import { describe, it, expect } from 'vitest'
import { validateManifestEntry, validateManifest } from '../validate-manifest'
import type { ManifestEntry } from '@/lib/domain/types'

const validEntry: ManifestEntry = {
  name: 'safe-rm',
  githubRepoUrl: 'https://github.com/owner/repo',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
}

describe('validateManifestEntry', () => {
  it('accepts a valid entry', () => {
    const result = validateManifestEntry(validEntry)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects invalid purposeCategory', () => {
    const entry = { ...validEntry, purposeCategory: 'InvalidCategory' }
    const result = validateManifestEntry(entry as unknown as ManifestEntry)
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('purposeCategory')]),
    )
  })

  it('rejects invalid lifecycleEvent', () => {
    const entry = { ...validEntry, lifecycleEvent: 'InvalidEvent' }
    const result = validateManifestEntry(entry as unknown as ManifestEntry)
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('lifecycleEvent')]),
    )
  })

  it('rejects missing required fields', () => {
    const result = validateManifestEntry({} as unknown as ManifestEntry)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(1)
  })

  it('rejects malformed githubRepoUrl', () => {
    const entry = { ...validEntry, githubRepoUrl: 'not-a-url' }
    const result = validateManifestEntry(entry)
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('githubRepoUrl')]),
    )
  })

  it('rejects non-GitHub URLs', () => {
    const entry = { ...validEntry, githubRepoUrl: 'https://gitlab.com/owner/repo' }
    const result = validateManifestEntry(entry)
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('githubRepoUrl')]),
    )
  })
})

describe('validateManifest', () => {
  it('validates an array of entries', () => {
    const entries = [validEntry, validEntry]
    const results = validateManifest(entries)
    expect(results).toHaveLength(2)
    expect(results.every((r) => r.valid)).toBe(true)
  })

  it('reports per-entry errors', () => {
    const entries = [
      validEntry,
      { ...validEntry, purposeCategory: 'Bad' } as unknown as ManifestEntry,
    ]
    const results = validateManifest(entries)
    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(false)
  })
})
