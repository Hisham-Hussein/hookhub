import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { validateManifest } from '@/lib/application/validate-manifest'
import { enrichManifest } from '@/lib/application/enrich-manifest'
import { parseOwnerRepo } from '@/lib/adapters/github-api'
import type { ManifestEntry } from '@/lib/domain/types'

const manifestPath = join(__dirname, '..', 'hooks.json')
const entries: ManifestEntry[] = JSON.parse(readFileSync(manifestPath, 'utf-8'))

describe('seed manifest integration with pipeline', () => {
  it('all seed entries pass real validation (end-to-end)', () => {
    const results = validateManifest(entries)
    const failures = results.filter((r) => !r.valid)

    if (failures.length > 0) {
      // Provide detailed failure info for debugging
      const details = failures.map((f, i) => `Entry ${i}: ${f.errors.join(', ')}`).join('\n')
      throw new Error(`Validation failures:\n${details}`)
    }

    expect(failures).toHaveLength(0)
  })

  it('seed entries can be processed by enrichManifest with mock fetch', async () => {
    const mockMetadata = {
      description: 'Mock description',
      starsCount: 100,
      lastUpdated: '2026-01-01T00:00:00Z',
    }

    const result = await enrichManifest({
      readManifest: async () => entries,
      fetchMetadata: async () => mockMetadata,
    })

    // All 13 entries should be enriched (none should fail validation)
    expect(result.hooks).toHaveLength(entries.length)
    expect(result.failures).toHaveLength(0)
    expect(result.summary).toBe(`Enriched ${entries.length}/${entries.length} hooks; 0 failed`)
  })

  it('enriched hooks from seed data have correct structure', async () => {
    const result = await enrichManifest({
      readManifest: async () => entries,
      fetchMetadata: async (url) => ({
        description: `Description for ${url}`,
        starsCount: 42,
        lastUpdated: '2026-01-15T00:00:00Z',
      }),
    })

    for (const hook of result.hooks) {
      // Every enriched hook must have all 7 fields
      expect(hook).toHaveProperty('name')
      expect(hook).toHaveProperty('githubRepoUrl')
      expect(hook).toHaveProperty('purposeCategory')
      expect(hook).toHaveProperty('lifecycleEvent')
      expect(hook).toHaveProperty('description')
      expect(hook).toHaveProperty('starsCount')
      expect(hook).toHaveProperty('lastUpdated')

      // Types
      expect(typeof hook.name).toBe('string')
      expect(typeof hook.githubRepoUrl).toBe('string')
      expect(typeof hook.description).toBe('string')
      expect(typeof hook.starsCount).toBe('number')
      expect(typeof hook.lastUpdated).toBe('string')
    }
  })

  it('each seed entry URL would produce valid GitHub API endpoint', () => {
    for (const entry of entries) {
      const { owner, repo } = parseOwnerRepo(entry.githubRepoUrl)
      expect(owner.length).toBeGreaterThan(0)
      expect(repo.length).toBeGreaterThan(0)
    }
  })
})
