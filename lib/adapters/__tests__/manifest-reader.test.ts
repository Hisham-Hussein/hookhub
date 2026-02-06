import { describe, it, expect, vi } from 'vitest'
import { readManifest } from '../manifest-reader'
import * as fs from 'fs/promises'

vi.mock('fs/promises')
const mockedFs = vi.mocked(fs)

const validManifestJson = JSON.stringify([
  {
    name: 'test-hook',
    githubRepoUrl: 'https://github.com/owner/repo',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
  },
])

describe('readManifest', () => {
  it('returns parsed entries from valid JSON file', async () => {
    mockedFs.readFile.mockResolvedValue(validManifestJson)

    const entries = await readManifest('data/hooks.json')

    expect(entries).toHaveLength(1)
    expect(entries[0].name).toBe('test-hook')
  })

  it('throws descriptive error when file not found', async () => {
    mockedFs.readFile.mockRejectedValue(
      Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    )

    await expect(readManifest('missing.json')).rejects.toThrow(
      /not found|ENOENT/i,
    )
  })

  it('throws on malformed JSON', async () => {
    mockedFs.readFile.mockResolvedValue('{ broken json')

    await expect(readManifest('bad.json')).rejects.toThrow(/parse|JSON/i)
  })
})
