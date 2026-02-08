import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runEnrichment } from '../enrich'
import * as fs from 'fs/promises'
import * as manifestReader from '@/lib/adapters/manifest-reader'
import * as githubApi from '@/lib/adapters/github-api'

vi.mock('fs/promises')
vi.mock('@/lib/adapters/manifest-reader')
vi.mock('@/lib/adapters/github-api')

const mockedFs = vi.mocked(fs)
const mockedReader = vi.mocked(manifestReader)
const mockedGithub = vi.mocked(githubApi)

describe('runEnrichment wiring contract', () => {
  beforeEach(() => {
    mockedFs.writeFile.mockResolvedValue()
    mockedFs.mkdir.mockResolvedValue(undefined)
    mockedReader.readManifest.mockResolvedValue([
      {
        name: 'test-hook',
        githubRepoUrl: 'https://github.com/owner/repo',
        purposeCategory: 'Safety',
        lifecycleEvent: 'PreToolUse',
      },
    ])
    mockedReader.readRawManifest.mockResolvedValue([
      {
        name: 'test-hook',
        githubRepoUrl: 'https://github.com/owner/repo',
        purposeCategory: 'Safety',
        lifecycleEvent: 'PreToolUse',
      },
    ])
    mockedGithub.fetchRepoMetadata.mockResolvedValue({
      description: 'Mock desc',
      starsCount: 50,
      lastUpdated: '2026-01-01T00:00:00Z',
    })
  })

  it('calls readManifest with correct manifest path', async () => {
    await runEnrichment()

    expect(mockedReader.readManifest).toHaveBeenCalledWith(
      expect.stringContaining('data/hooks.json'),
    )
  })

  it('calls fetchRepoMetadata with URL from manifest entry', async () => {
    await runEnrichment()

    expect(mockedGithub.fetchRepoMetadata).toHaveBeenCalledWith(
      'https://github.com/owner/repo',
      undefined, // no GITHUB_TOKEN set
    )
  })

  it('writes output to enriched-hooks.json path', async () => {
    await runEnrichment()

    expect(mockedFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('data/enriched-hooks.json'),
      expect.any(String),
      'utf-8',
    )
  })

  it('output file contains valid JSON array of Hook objects', async () => {
    await runEnrichment()

    const writtenJson = mockedFs.writeFile.mock.calls[0][1] as string
    const parsed = JSON.parse(writtenJson)

    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toEqual({
      name: 'test-hook',
      githubRepoUrl: 'https://github.com/owner/repo',
      purposeCategory: 'Safety',
      lifecycleEvent: 'PreToolUse',
      description: 'Mock desc',
      starsCount: 50,
      lastUpdated: '2026-01-01T00:00:00Z',
    })
  })

  it('passes GITHUB_TOKEN from env to fetchRepoMetadata', async () => {
    const originalToken = process.env.GITHUB_TOKEN
    process.env.GITHUB_TOKEN = 'ghp_test_token_123'

    try {
      await runEnrichment()

      expect(mockedGithub.fetchRepoMetadata).toHaveBeenCalledWith(
        expect.any(String),
        'ghp_test_token_123',
      )
    } finally {
      if (originalToken === undefined) {
        delete process.env.GITHUB_TOKEN
      } else {
        process.env.GITHUB_TOKEN = originalToken
      }
    }
  })

  it('return value always includes summary and success fields', async () => {
    const result = await runEnrichment()

    expect(result).toHaveProperty('summary')
    expect(result).toHaveProperty('success')
    expect(typeof result.summary).toBe('string')
    expect(typeof result.success).toBe('boolean')
  })
})
