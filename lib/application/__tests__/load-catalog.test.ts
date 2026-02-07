import { describe, it, expect } from 'vitest'
import type { HookDataSource } from '@/lib/application/ports'
import type { Hook } from '@/lib/domain/types'
import { PURPOSE_CATEGORIES, LIFECYCLE_EVENTS } from '@/lib/domain/types'

const createMockDataSource = (hooks: Hook[]): HookDataSource => ({
  getAll: async () => hooks,
})

const threeHooks: Hook[] = [
  {
    name: 'safe-rm',
    githubRepoUrl: 'https://github.com/devtools-org/safe-rm-hook',
    purposeCategory: 'Safety',
    lifecycleEvent: 'PreToolUse',
    description: 'Prevents accidental deletion.',
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
  {
    name: 'slack-notify',
    githubRepoUrl: 'https://github.com/notify-hooks/slack-notify',
    purposeCategory: 'Notification',
    lifecycleEvent: 'Stop',
    description: 'Sends a Slack message on session end.',
    starsCount: 456,
    lastUpdated: '2026-01-20',
  },
]

describe('loadCatalog', () => {
  it('returns hooks from the data source', async () => {
    const { loadCatalog } = await import('../load-catalog')
    const ds = createMockDataSource(threeHooks)
    const result = await loadCatalog(ds)

    expect(result.hooks).toEqual(threeHooks)
    expect(result.hooks).toHaveLength(3)
  })

  it('returns all 8 purpose categories', async () => {
    const { loadCatalog } = await import('../load-catalog')
    const ds = createMockDataSource(threeHooks)
    const result = await loadCatalog(ds)

    expect(result.categories).toEqual([...PURPOSE_CATEGORIES])
    expect(result.categories).toHaveLength(8)
  })

  it('returns all 5 lifecycle events', async () => {
    const { loadCatalog } = await import('../load-catalog')
    const ds = createMockDataSource(threeHooks)
    const result = await loadCatalog(ds)

    expect(result.events).toEqual([...LIFECYCLE_EVENTS])
    expect(result.events).toHaveLength(5)
  })

  it('totalCount equals the number of hooks', async () => {
    const { loadCatalog } = await import('../load-catalog')
    const ds = createMockDataSource(threeHooks)
    const result = await loadCatalog(ds)

    expect(result.totalCount).toBe(3)
  })

  it('handles empty data source', async () => {
    const { loadCatalog } = await import('../load-catalog')
    const ds = createMockDataSource([])
    const result = await loadCatalog(ds)

    expect(result.hooks).toEqual([])
    expect(result.totalCount).toBe(0)
    // categories and events are always returned (all possible values)
    expect(result.categories).toHaveLength(8)
    expect(result.events).toHaveLength(5)
  })
})
