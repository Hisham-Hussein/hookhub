import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('runEnrichment edge cases', () => {
  beforeEach(() => {
    mockedFs.writeFile.mockResolvedValue()
    mockedFs.mkdir.mockResolvedValue(undefined)
  })

  it('creates output directory with recursive option', async () => {
    const { runEnrichment } = await import('../enrich')
    await runEnrichment()

    expect(mockedFs.mkdir).toHaveBeenCalledWith(
      expect.any(String),
      { recursive: true },
    )
  })

  it('writes pretty-printed JSON (indented with 2 spaces)', async () => {
    const { runEnrichment } = await import('../enrich')
    await runEnrichment()

    const writtenContent = mockedFs.writeFile.mock.calls[0][1] as string
    expect(writtenContent).toContain('\n') // has newlines (pretty-printed)
    expect(writtenContent.startsWith('[')).toBe(true)
  })

  it('calls mkdir before writeFile', async () => {
    const callOrder: string[] = []
    mockedFs.mkdir.mockImplementation(async () => {
      callOrder.push('mkdir')
      return undefined
    })
    mockedFs.writeFile.mockImplementation(async () => {
      callOrder.push('writeFile')
    })

    const { runEnrichment } = await import('../enrich')
    await runEnrichment()

    expect(callOrder).toEqual(['mkdir', 'writeFile'])
  })

  it('logs summary to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const { runEnrichment } = await import('../enrich')
    await runEnrichment()

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Enriched'))
    consoleSpy.mockRestore()
  })
})
