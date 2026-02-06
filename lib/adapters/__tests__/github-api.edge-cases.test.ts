import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoMetadata, parseOwnerRepo } from '../github-api'

describe('parseOwnerRepo edge cases', () => {
  it('extracts owner/repo from URL with deep subpath', () => {
    const result = parseOwnerRepo('https://github.com/owner/repo/tree/main/src')
    expect(result).toEqual({ owner: 'owner', repo: 'repo' })
  })

  it('handles URL with query parameters', () => {
    const result = parseOwnerRepo('https://github.com/owner/repo?tab=readme')
    expect(result).toEqual({ owner: 'owner', repo: 'repo' })
  })

  it('handles URL with hash fragment', () => {
    const result = parseOwnerRepo('https://github.com/owner/repo#readme')
    expect(result).toEqual({ owner: 'owner', repo: 'repo' })
  })

  it('handles URL with .git suffix', () => {
    const result = parseOwnerRepo('https://github.com/owner/repo.git')
    expect(result).toEqual({ owner: 'owner', repo: 'repo.git' })
  })

  it('throws on github.com with only one path segment', () => {
    expect(() => parseOwnerRepo('https://github.com/owner')).toThrow()
  })

  it('throws on empty string', () => {
    expect(() => parseOwnerRepo('')).toThrow()
  })

  it('throws on www.github.com (non-matching hostname)', () => {
    expect(() => parseOwnerRepo('https://www.github.com/owner/repo')).toThrow('GitHub')
  })
})

describe('fetchRepoMetadata edge cases', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })

  it('handles null description from GitHub API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        description: null,
        stargazers_count: 42,
        updated_at: '2026-01-01T00:00:00Z',
      }),
    })

    const result = await fetchRepoMetadata('https://github.com/owner/repo')
    expect(result.description).toBe('')
  })

  it('handles null stargazers_count from GitHub API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        description: 'test',
        stargazers_count: null,
        updated_at: '2026-01-01T00:00:00Z',
      }),
    })

    const result = await fetchRepoMetadata('https://github.com/owner/repo')
    expect(result.starsCount).toBe(0)
  })

  it('handles missing fields entirely from GitHub API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    const result = await fetchRepoMetadata('https://github.com/owner/repo')
    expect(result.description).toBe('')
    expect(result.starsCount).toBe(0)
    expect(result.lastUpdated).toBe('')
  })

  it('handles network error (fetch throws)', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(
      fetchRepoMetadata('https://github.com/owner/repo'),
    ).rejects.toThrow('Failed to fetch')
  })

  it('handles 500 Internal Server Error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    await expect(
      fetchRepoMetadata('https://github.com/owner/repo'),
    ).rejects.toThrow('500')
  })

  it('handles 301 redirect (ok: false)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 301,
      statusText: 'Moved Permanently',
    })

    await expect(
      fetchRepoMetadata('https://github.com/owner/repo'),
    ).rejects.toThrow('301')
  })

  it('constructs correct API URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: '', stargazers_count: 0, updated_at: '' }),
    })

    await fetchRepoMetadata('https://github.com/my-org/my-repo')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/my-org/my-repo',
      expect.any(Object),
    )
  })

  it('always sends Accept header', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: '', stargazers_count: 0, updated_at: '' }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
        }),
      }),
    )
  })

  it('handles empty string token (should not add Authorization)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: '', stargazers_count: 0, updated_at: '' }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo', '')

    const callHeaders = mockFetch.mock.calls[0][1]?.headers ?? {}
    expect(callHeaders).not.toHaveProperty('Authorization')
  })
})
