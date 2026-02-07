import type { GitHubMetadata } from '@/lib/application/enrich-manifest'

export function parseOwnerRepo(githubRepoUrl: string): { owner: string; repo: string } {
  let url: URL
  try {
    url = new URL(githubRepoUrl)
  } catch {
    throw new Error(`Invalid URL: ${githubRepoUrl}`)
  }

  if (url.hostname !== 'github.com') {
    throw new Error(`Not a GitHub URL: ${githubRepoUrl}`)
  }

  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2) {
    throw new Error(`GitHub URL must include owner/repo: ${githubRepoUrl}`)
  }

  return { owner: parts[0], repo: parts[1] }
}

export async function fetchRepoMetadata(
  githubRepoUrl: string,
  token?: string,
): Promise<GitHubMetadata> {
  const { owner, repo } = parseOwnerRepo(githubRepoUrl)
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(apiUrl, { headers })

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        `GitHub API rate limit exceeded (403). Use a GITHUB_TOKEN for higher limits.`,
      )
    }
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} for ${owner}/${repo}`,
    )
  }

  const data = await response.json()

  return {
    description: data.description ?? '',
    starsCount: data.stargazers_count ?? 0,
    lastUpdated: data.updated_at ?? '',
  }
}
