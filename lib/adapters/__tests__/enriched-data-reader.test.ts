import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Hook } from '@/lib/domain/types'

// We'll mock fs/promises to avoid hitting the real filesystem
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

describe('EnrichedDataReader', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('getAll returns Hook[] from enriched-hooks.json', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(sampleHooks))

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual(sampleHooks)
    expect(hooks).toHaveLength(2)
  })

  it('getAll returns empty array when file contains []', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue('[]')

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()
    const hooks = await reader.getAll()

    expect(hooks).toEqual([])
  })

  it('getAll throws descriptive error when file not found', async () => {
    const fs = await import('fs/promises')
    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException
    error.code = 'ENOENT'
    vi.mocked(fs.readFile).mockRejectedValue(error)

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()

    await expect(reader.getAll()).rejects.toThrow(/enriched-hooks\.json/)
  })

  it('getAll throws on malformed JSON', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue('not valid json{{{')

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()

    await expect(reader.getAll()).rejects.toThrow()
  })

  it('implements HookDataSource interface (type check)', async () => {
    const fs = await import('fs/promises')
    vi.mocked(fs.readFile).mockResolvedValue('[]')

    const { EnrichedDataReader } = await import('../enriched-data-reader')
    const reader = new EnrichedDataReader()

    // Type-level check: getAll returns a Promise
    const result = reader.getAll()
    expect(result).toBeInstanceOf(Promise)
  })
})
