import type { Hook, ManifestEntry } from '@/lib/domain/types'
import { validateManifestEntry } from './validate-manifest'
import { validateManifestSchema } from '@/lib/domain/manifest-schema'

export interface GitHubMetadata {
  description: string
  starsCount: number
  lastUpdated: string
}

export interface EnrichManifestDeps {
  readManifest: () => Promise<ManifestEntry[]>
  fetchMetadata: (githubRepoUrl: string) => Promise<GitHubMetadata>
  readRawManifest?: () => Promise<unknown>
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
  // Pre-enrichment guard: validate manifest schema if raw reader provided
  if (deps.readRawManifest) {
    const rawData = await deps.readRawManifest()
    const schemaResult = validateManifestSchema(rawData)
    if (!schemaResult.valid) {
      const schemaEntry: ManifestEntry = {
        name: '[manifest]',
        githubRepoUrl: '',
        purposeCategory: 'Custom',
        lifecycleEvent: 'Stop',
      }
      return {
        hooks: [],
        failures: [{
          entry: schemaEntry,
          error: `Manifest schema validation failed: ${schemaResult.errors.join('; ')}`,
        }],
        summary: 'Enriched 0/0 hooks; manifest schema validation failed',
      }
    }
  }

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
