import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoMetadata, parseOwnerRepo } from '../github-api'

describe('parseOwnerRepo', () => {
  it('extracts owner and repo from a GitHub URL', () => {
    const result = parseOwnerRepo('https://github.com/octocat/hello-world')
    expect(result).toEqual({ owner: 'octocat', repo: 'hello-world' })
  })

  it('handles URLs with trailing slash', () => {
    const result = parseOwnerRepo('https://github.com/octocat/hello-world/')
    expect(result).toEqual({ owner: 'octocat', repo: 'hello-world' })
  })

  it('throws on malformed URL', () => {
    expect(() => parseOwnerRepo('not-a-url')).toThrow()
  })

  it('throws on non-GitHub URL', () => {
    expect(() => parseOwnerRepo('https://gitlab.com/owner/repo')).toThrow('GitHub')
  })

  it('throws on GitHub URL without owner/repo path', () => {
    expect(() => parseOwnerRepo('https://github.com/')).toThrow()
  })
})

describe('fetchRepoMetadata', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })

  it('maps successful response fields correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        description: 'A hook for safety',
        stargazers_count: 1247,
        updated_at: '2026-01-28T12:00:00Z',
      }),
    })

    const result = await fetchRepoMetadata('https://github.com/owner/repo')

    expect(result.description).toBe('A hook for safety')
    expect(result.starsCount).toBe(1247)
    expect(result.lastUpdated).toBe('2026-01-28T12:00:00Z')
  })

  it('throws descriptive error on 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(
      fetchRepoMetadata('https://github.com/owner/repo'),
    ).rejects.toThrow('404')
  })

  it('throws with retry hint on 403 (rate limit)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    })

    await expect(
      fetchRepoMetadata('https://github.com/owner/repo'),
    ).rejects.toThrow(/rate limit|403/i)
  })

  it('throws on malformed URL before fetch', async () => {
    await expect(fetchRepoMetadata('not-a-url')).rejects.toThrow()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('passes token as Authorization header when provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        description: 'test',
        stargazers_count: 0,
        updated_at: '2026-01-01T00:00:00Z',
      }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo', 'ghp_test123')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer ghp_test123',
        }),
      }),
    )
  })

  it('does not send Authorization header when no token', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        description: 'test',
        stargazers_count: 0,
        updated_at: '2026-01-01T00:00:00Z',
      }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo')

    const callHeaders = mockFetch.mock.calls[0][1]?.headers ?? {}
    expect(callHeaders).not.toHaveProperty('Authorization')
  })
})
