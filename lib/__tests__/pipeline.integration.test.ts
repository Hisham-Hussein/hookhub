import { describe, it, expect, vi } from 'vitest'
import { enrichManifest } from '@/lib/application/enrich-manifest'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'
import type { ManifestEntry } from '@/lib/domain/types'

describe('full pipeline integration', () => {
  // Create a comprehensive manifest covering all categories and events
  const manifest: ManifestEntry[] = [
    { name: 'hook-safety-pre', githubRepoUrl: 'https://github.com/org/safety-pre', purposeCategory: 'Safety', lifecycleEvent: 'PreToolUse' },
    { name: 'hook-auto-post', githubRepoUrl: 'https://github.com/org/auto-post', purposeCategory: 'Automation', lifecycleEvent: 'PostToolUse' },
    { name: 'hook-notify-submit', githubRepoUrl: 'https://github.com/org/notify-submit', purposeCategory: 'Notification', lifecycleEvent: 'UserPromptSubmit' },
    { name: 'hook-format-notify', githubRepoUrl: 'https://github.com/org/format-notify', purposeCategory: 'Formatting', lifecycleEvent: 'Notification' },
    { name: 'hook-test-stop', githubRepoUrl: 'https://github.com/org/test-stop', purposeCategory: 'Testing', lifecycleEvent: 'Stop' },
    { name: 'hook-security', githubRepoUrl: 'https://github.com/org/security', purposeCategory: 'Security', lifecycleEvent: 'PreToolUse' },
    { name: 'hook-logging', githubRepoUrl: 'https://github.com/org/logging', purposeCategory: 'Logging', lifecycleEvent: 'PostToolUse' },
    { name: 'hook-custom', githubRepoUrl: 'https://github.com/org/custom', purposeCategory: 'Custom', lifecycleEvent: 'Stop' },
  ]

  const mockMetadataFactory = (url: string) => ({
    description: `Description for ${url.split('/').pop()}`,
    starsCount: Math.floor(Math.random() * 5000),
    lastUpdated: '2026-01-15T00:00:00Z',
  })

  it('processes all 8 categories and 5 events end-to-end', async () => {
    const result = await enrichManifest({
      readManifest: async () => manifest,
      fetchMetadata: async (url) => mockMetadataFactory(url),
    })

    expect(result.hooks).toHaveLength(8)
    expect(result.failures).toHaveLength(0)

    // Verify all categories present in output
    const outputCategories = new Set(result.hooks.map((h) => h.purposeCategory))
    for (const cat of PURPOSE_CATEGORIES) {
      expect(outputCategories.has(cat)).toBe(true)
    }

    // Verify all events present in output
    const outputEvents = new Set(result.hooks.map((h) => h.lifecycleEvent))
    for (const evt of LIFECYCLE_EVENTS) {
      expect(outputEvents.has(evt)).toBe(true)
    }
  })

  it('output hooks preserve manifest entry data exactly', async () => {
    const result = await enrichManifest({
      readManifest: async () => [manifest[0]],
      fetchMetadata: async () => ({
        description: 'Test desc',
        starsCount: 42,
        lastUpdated: '2026-01-01',
      }),
    })

    const hook = result.hooks[0]
    // ManifestEntry fields preserved
    expect(hook.name).toBe(manifest[0].name)
    expect(hook.githubRepoUrl).toBe(manifest[0].githubRepoUrl)
    expect(hook.purposeCategory).toBe(manifest[0].purposeCategory)
    expect(hook.lifecycleEvent).toBe(manifest[0].lifecycleEvent)
    // GitHub metadata added
    expect(hook.description).toBe('Test desc')
    expect(hook.starsCount).toBe(42)
    expect(hook.lastUpdated).toBe('2026-01-01')
  })

  it('validation errors prevent fetch but fetch errors do not prevent other entries', async () => {
    const mixedManifest = [
      manifest[0], // valid — will succeed
      { name: '', githubRepoUrl: 'bad', purposeCategory: 'X', lifecycleEvent: 'Y' } as unknown as ManifestEntry, // invalid — validation fail
      manifest[2], // valid — will fail at fetch
      manifest[3], // valid — will succeed
    ]

    const fetchMetadata = vi.fn()
      .mockResolvedValueOnce({ description: 'd1', starsCount: 1, lastUpdated: '2026-01-01' })
      // second valid entry (manifest[2]) fails
      .mockRejectedValueOnce(new Error('GitHub API 404'))
      .mockResolvedValueOnce({ description: 'd3', starsCount: 3, lastUpdated: '2026-01-03' })

    const result = await enrichManifest({
      readManifest: async () => mixedManifest,
      fetchMetadata,
    })

    expect(result.hooks).toHaveLength(2) // entries 0 and 3 succeeded
    expect(result.failures).toHaveLength(2) // entry 1 (validation) + entry 2 (fetch)
    expect(result.failures[0].error).toContain('validation') // first failure is validation
    expect(result.failures[1].error).toContain('404') // second failure is fetch
    expect(result.summary).toBe('Enriched 2/4 hooks; 2 failed')

    // fetchMetadata called only for valid entries (3 times, not 4)
    expect(fetchMetadata).toHaveBeenCalledTimes(3)
  })

  it('output Hook objects satisfy the Hook interface contract', async () => {
    const result = await enrichManifest({
      readManifest: async () => manifest,
      fetchMetadata: async (url) => mockMetadataFactory(url),
    })

    for (const hook of result.hooks) {
      // Structural validation — every field exists and is the right type
      expect(typeof hook.name).toBe('string')
      expect(typeof hook.githubRepoUrl).toBe('string')
      expect(typeof hook.purposeCategory).toBe('string')
      expect(typeof hook.lifecycleEvent).toBe('string')
      expect(typeof hook.description).toBe('string')
      expect(typeof hook.starsCount).toBe('number')
      expect(typeof hook.lastUpdated).toBe('string')

      // Values are within valid domains
      expect(PURPOSE_CATEGORIES).toContain(hook.purposeCategory)
      expect(LIFECYCLE_EVENTS).toContain(hook.lifecycleEvent)
      expect(hook.githubRepoUrl).toMatch(/^https:\/\/github\.com\//)
      expect(hook.starsCount).toBeGreaterThanOrEqual(0)
    }
  })
})
