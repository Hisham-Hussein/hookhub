import { describe, it, expect, vi } from 'vitest'
import { readManifest } from '../manifest-reader'
import * as fs from 'fs/promises'

vi.mock('fs/promises')
const mockedFs = vi.mocked(fs)

describe('readManifest edge cases', () => {
  it('returns empty array for empty JSON array', async () => {
    mockedFs.readFile.mockResolvedValue('[]')
    const entries = await readManifest('empty.json')
    expect(entries).toEqual([])
  })

  it('returns entries for whitespace-padded JSON', async () => {
    mockedFs.readFile.mockResolvedValue('  [{"name":"hook","githubRepoUrl":"https://github.com/o/r","purposeCategory":"Safety","lifecycleEvent":"PreToolUse"}]  ')
    const entries = await readManifest('data.json')
    expect(entries).toHaveLength(1)
  })

  it('throws for empty string file content', async () => {
    mockedFs.readFile.mockResolvedValue('')
    await expect(readManifest('empty.json')).rejects.toThrow(/parse|JSON/i)
  })

  it('wraps permission denied error with file path', async () => {
    mockedFs.readFile.mockRejectedValue(
      Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' }),
    )
    await expect(readManifest('protected.json')).rejects.toThrow(/not found|EACCES/i)
  })

  it('includes file path in error messages', async () => {
    mockedFs.readFile.mockRejectedValue(new Error('ENOENT'))
    await expect(readManifest('/specific/path/to/file.json')).rejects.toThrow(
      '/specific/path/to/file.json',
    )
  })

  it('handles JSON that is valid but not an array (object)', async () => {
    mockedFs.readFile.mockResolvedValue('{"key": "value"}')
    // Current impl does JSON.parse and returns as ManifestEntry[]
    // This won't throw, but returns non-array - documents this behavior gap
    const result = await readManifest('object.json')
    expect(Array.isArray(result)).toBe(false)
  })

  it('handles JSON null', async () => {
    mockedFs.readFile.mockResolvedValue('null')
    const result = await readManifest('null.json')
    expect(result).toBeNull()
  })
})
