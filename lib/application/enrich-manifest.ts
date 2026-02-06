import type { Hook, ManifestEntry } from '@/lib/domain/types'
import { validateManifestEntry } from './validate-manifest'

export interface GitHubMetadata {
  description: string
  starsCount: number
  lastUpdated: string
}

export interface EnrichManifestDeps {
  readManifest: () => Promise<ManifestEntry[]>
  fetchMetadata: (githubRepoUrl: string) => Promise<GitHubMetadata>
}

export interface EnrichmentFailure {
  entry: ManifestEntry
  error: string
}

export interface EnrichManifestOutput {
  hooks: Hook[]
  failures: EnrichmentFailure[]
  summary: string
}

export async function enrichManifest(
  deps: EnrichManifestDeps,
): Promise<EnrichManifestOutput> {
  const entries = await deps.readManifest()
  const hooks: Hook[] = []
  const failures: EnrichmentFailure[] = []

  for (const entry of entries) {
    const validation = validateManifestEntry(entry)
    if (!validation.valid) {
      failures.push({
        entry,
        error: `Manifest validation failed: ${validation.errors.join('; ')}`,
      })
      continue
    }

    try {
      const metadata = await deps.fetchMetadata(entry.githubRepoUrl)
      hooks.push({
        name: entry.name,
        githubRepoUrl: entry.githubRepoUrl,
        purposeCategory: entry.purposeCategory,
        lifecycleEvent: entry.lifecycleEvent,
        description: metadata.description,
        starsCount: metadata.starsCount,
        lastUpdated: metadata.lastUpdated,
      })
    } catch (err) {
      failures.push({
        entry,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const total = entries.length
  const enriched = hooks.length
  const failed = total - enriched
  const summary = `Enriched ${enriched}/${total} hooks; ${failed} failed`

  return { hooks, failures, summary }
}
