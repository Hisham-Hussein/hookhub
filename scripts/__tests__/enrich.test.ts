import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runEnrichment } from '../enrich'
import * as fs from 'fs/promises'

vi.mock('fs/promises')
const mockedFs = vi.mocked(fs)

vi.mock('@/lib/adapters/github-api', () => ({
  fetchRepoMetadata: vi.fn().mockResolvedValue({
    description: 'Mock description',
    starsCount: 100,
    lastUpdated: '2026-01-01T00:00:00Z',
  }),
}))

vi.mock('@/lib/adapters/manifest-reader', () => ({
  readManifest: vi.fn().mockResolvedValue([
    {
      name: 'test-hook',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
    },
  ]),
}))

describe('runEnrichment', () => {
  beforeEach(() => {
    mockedFs.writeFile.mockResolvedValue()
    mockedFs.mkdir.mockResolvedValue(undefined)
  })

  it('writes enriched hooks JSON to output path', async () => {
    const result = await runEnrichment()

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('enriched-hooks.json'),
      expect.any(String),
      'utf-8',
    )

    const writtenData = JSON.parse(
      mockedFs.writeFile.mock.calls[0][1] as string,
    )
    expect(Array.isArray(writtenData)).toBe(true)
    expect(writtenData[0].name).toBe('test-hook')
    expect(writtenData[0].description).toBe('Mock description')
  })

  it('returns the enrichment summary', async () => {
    const result = await runEnrichment()
    expect(result.summary).toMatch(/Enriched \d+\/\d+ hooks/)
  })

  it('exits successfully (returns success flag)', async () => {
    const result = await runEnrichment()
    expect(result.success).toBe(true)
  })
})
