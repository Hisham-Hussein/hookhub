import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRepoMetadata } from '../github-api'

describe('fetchRepoMetadata integration with parseOwnerRepo', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })

  it('constructs correct API URL from full GitHub URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: 'test', stargazers_count: 0, updated_at: '' }),
    })

    await fetchRepoMetadata('https://github.com/anthropics/claude-code-hooks-safe-rm')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/anthropics/claude-code-hooks-safe-rm',
      expect.any(Object),
    )
  })

  it('rejects non-GitHub URL at parseOwnerRepo level before any fetch', async () => {
    await expect(
      fetchRepoMetadata('https://bitbucket.org/owner/repo'),
    ).rejects.toThrow('GitHub')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('handles URL with trailing slash correctly in API call', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: 'test', stargazers_count: 10, updated_at: '2026-01-01' }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo/')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/owner/repo',
      expect.any(Object),
    )
  })

  it('strips subpath from URL when constructing API endpoint', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ description: 'test', stargazers_count: 0, updated_at: '' }),
    })

    await fetchRepoMetadata('https://github.com/owner/repo/tree/main/src')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/owner/repo',
      expect.any(Object),
    )
  })
})
