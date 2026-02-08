import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runEnrichment } from '../enrich'
import * as fs from 'fs/promises'

vi.mock('fs/promises')
const mockedFs = vi.mocked(fs)

vi.mock('@/lib/adapters/github-api', () => ({
  fetchRepoMetadata: vi.fn()
    .mockResolvedValueOnce({
      description: 'Good hook',
      starsCount: 100,
      lastUpdated: '2026-01-01T00:00:00Z',
    })
    .mockRejectedValueOnce(new Error('GitHub API error: 404 Not Found for owner/bad')),
}))

vi.mock('@/lib/adapters/manifest-reader', () => ({
  readManifest: vi.fn().mockResolvedValue([
    {
      name: 'good-hook',
      githubRepoUrl: 'https://github.com/owner/good',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
    },
    {
      name: 'bad-hook',
      githubRepoUrl: 'https://github.com/owner/bad',
      purposeCategory: 'Testing',
      lifecycleEvent: 'PostToolUse',
    },
  ]),
  readRawManifest: vi.fn().mockResolvedValue([
    {
      name: 'good-hook',
      githubRepoUrl: 'https://github.com/owner/good',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
    },
    {
      name: 'bad-hook',
      githubRepoUrl: 'https://github.com/owner/bad',
      purposeCategory: 'Testing',
      lifecycleEvent: 'PostToolUse',
    },
  ]),
}))

describe('runEnrichment — link validation logging', () => {
  beforeEach(() => {
    mockedFs.writeFile.mockResolvedValue()
    mockedFs.mkdir.mockResolvedValue(undefined)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('logs unreachable URLs as warnings', async () => {
    await runEnrichment()

    const warnCalls = (console.warn as ReturnType<typeof vi.fn>).mock.calls
      .map((c) => c[0])
      .join('\n')

    expect(warnCalls).toContain('Link validation warnings')
    expect(warnCalls).toContain('https://github.com/owner/bad')
  })

  it('exits successfully even with broken links', async () => {
    const result = await runEnrichment()
    expect(result.success).toBe(true)
  })

  it('logs the validation summary line', async () => {
    await runEnrichment()

    const logCalls = (console.log as ReturnType<typeof vi.fn>).mock.calls
      .map((c) => c[0])
      .join('\n')

    expect(logCalls).toContain('Validated')
    expect(logCalls).toContain('repo links')
  })
})
