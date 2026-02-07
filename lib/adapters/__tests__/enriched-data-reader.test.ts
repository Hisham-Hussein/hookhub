import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Hook } from '@/lib/domain/types'

vi.mock('fs/promises')

const sampleHooks: Hook[] = [
  {
    name: 'safe-rm',
    githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'Prevents accidental deletion of critical system files.',
    starsCount: 1247,
    lastUpdated: '2026-01-28',
  },
  {
    name: 'auto-prettier',
    githubRepoUrl: 'https://github.com/fmt-hooks/auto-prettier',
    purposeCategory: 'Formatting',
    lifecycleEvent: 'PostToolUse',
    description: 'Runs Prettier on modified files.',
    starsCount: 892,
    lastUpdated: '2026-01-15',
  },
]

const seedHooks: Hook[] = [
  {
    name: 'seed-hook',
    githubRepoUrl: 'https://github.com/seed/hook',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'A seed hook for development.',
    starsCount: 0,
    lastUpdated: '2026-01-01',
  },
]

describe('EnrichedDataReader', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('getAll returns Hook[] from enriched-hooks.json when it has data', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(sampleHooks))

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual(sampleHooks)
    expect(hooks).toHaveLength(2)
  })

  it('getAll falls back to seed-hooks.json when enriched file is empty', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockImplementation(async (path) => {
      if (String(path).includes('enriched-hooks.json')) return '[]'
      if (String(path).includes('seed-hooks.json')) return JSON.stringify(seedHooks)
      throw new Error(`Unexpected path: ${path}`)
    })

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual(seedHooks)
  })

  it('getAll falls back to seed-hooks.json when enriched file is missing', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockImplementation(async (path) => {
      if (String(path).includes('enriched-hooks.json')) {
        const error = new Error('ENOENT') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }
      if (String(path).includes('seed-hooks.json')) return JSON.stringify(seedHooks)
      throw new Error(`Unexpected path: ${path}`)
    })

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual(seedHooks)
  })

  it('getAll returns empty array when both files are missing', async () => {
    const fs = await import('fs/promises')
    const error = new Error('ENOENT') as NodeJS.ErrnoException
    error.code = 'ENOENT'
    vi.mocked(fs.readFile).mockRejectedValue(error)

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual([])
  })

  it('implements HookDataSource interface (type check)', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue('[]')

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()

    const result = reader.getAll()
    expect(result).toBeInstanceOf(Promise)
  })
})
