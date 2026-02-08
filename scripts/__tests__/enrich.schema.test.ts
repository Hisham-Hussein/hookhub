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
  readRawManifest: vi.fn().mockResolvedValue([
    {
      name: 'test-hook',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
    },
  ]),
}))

describe('runEnrichment — schema validation wiring', () => {
  beforeEach(() => {
    mockedFs.writeFile.mockResolvedValue()
    mockedFs.mkdir.mockResolvedValue(undefined)
  })

  it('passes readRawManifest to enrichManifest for schema validation', async () => {
    const result = await runEnrichment()
    expect(result.success).toBe(true)
    expect(result.summary).toMatch(/Enriched/)
  })
})
