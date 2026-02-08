import { describe, it, expect } from 'vitest'
import { validateManifestSchema } from '../manifest-schema'

const validEntry = {
  name: 'test-hook',
  githubRepoUrl: 'https://github.com/owner/repo',
  purposeCategory: 'Safety',
  lifecycleEvent: 'PreToolUse',
}

describe('validateManifestSchema', () => {
  it('accepts a valid manifest array', () => {
    const result = validateManifestSchema([validEntry])
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects non-array input', () => {
    const result = validateManifestSchema('not an array')
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('array')]),
    )
  })

  it('rejects null input', () => {
    const result = validateManifestSchema(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('array')]),
    )
  })

  it('rejects empty array', () => {
    const result = validateManifestSchema([])
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('empty')]),
    )
  })

  it('rejects duplicate githubRepoUrl entries', () => {
    const result = validateManifestSchema([validEntry, validEntry])
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('duplicate')]),
    )
  })

  it('rejects entries with missing required fields', () => {
    const result = validateManifestSchema([{ name: 'only-name' }])
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('githubRepoUrl')]),
    )
  })

  it('rejects entries with invalid purposeCategory', () => {
    const result = validateManifestSchema([
      { ...validEntry, purposeCategory: 'InvalidCat' },
    ])
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('purposeCategory')]),
    )
  })

  it('rejects entries with invalid lifecycleEvent', () => {
    const result = validateManifestSchema([
      { ...validEntry, lifecycleEvent: 'InvalidEvt' },
    ])
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('lifecycleEvent')]),
    )
  })

  it('accepts manifest with multiple unique entries', () => {
    const entries = [
      validEntry,
      { ...validEntry, name: 'hook-2', githubRepoUrl: 'https://github.com/owner/repo2' },
      { ...validEntry, name: 'hook-3', githubRepoUrl: 'https://github.com/owner/repo3' },
    ]
    const result = validateManifestSchema(entries)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('reports all errors at once (not short-circuiting)', () => {
    const result = validateManifestSchema([
      { name: '', githubRepoUrl: '', purposeCategory: 'Bad', lifecycleEvent: 'Bad' },
      { name: '', githubRepoUrl: '', purposeCategory: 'Bad', lifecycleEvent: 'Bad' },
    ])
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})
